import * as Discord from 'discord.js';
import { Redis } from '../redis';

const SHH_STARTED_THRESHOLD = 0.6;
const SHH_ENDED_THRESHOLD = 0.4;

type LobbyOpt = 'started-at' | 'users' | 'alive' | 'imposters';

export class Lobby {
  lobbyCh: Discord.VoiceChannel;
  impostersCh: Discord.VoiceChannel;
  shhChs: Discord.VoiceChannel[];

  members: Discord.GuildMember[] = [];
  imposterUserIds: string[] = [];
  aliveUserIds: string[] = [];
  gameInProgress: boolean = false;
  shhInProgress: boolean = false;
  waitingForImposters: boolean = false;

  constructor(readonly category: Discord.CategoryChannel) {}

  async loadState() {
    this.gameInProgress = (await this.getFromRedis('started-at')) !== null;
    if (!this.gameInProgress) {
      return;
    }

    this.members = (
      await this.category.guild.members.fetch({
        user: (await this.getFromRedis('users'))?.split(',') || [],
      })
    ).array();
    this.imposterUserIds =
      (await this.getFromRedis('imposters'))?.split(',') || [];
    this.aliveUserIds = (await this.getFromRedis('alive'))?.split(',') || [];
    this.waitingForImposters = this.imposterUserIds.length < 3;
    this.shhInProgress =
      this.members.filter(
        (member) =>
          member.voice.channel?.name.toLowerCase().includes('shh') ||
          member.voice.channel?.name.toLowerCase().includes('imposter'),
      ).length >= 2;
  }

  async setup() {
    this.lobbyCh = this.category.children.find(
      (ch) => ch.type === 'voice' && ch.name.toLowerCase().includes('lobby'),
    ) as Discord.VoiceChannel;

    this.impostersCh = this.category.children.find(
      (ch) =>
        ch.type === 'voice' &&
        ch.name.toLowerCase().includes('imposter') &&
        ch !== this.lobbyCh,
    ) as Discord.VoiceChannel;

    this.shhChs = this.category.children
      .array()
      .filter(
        (ch) =>
          ch.type === 'voice' &&
          ch.name.toLowerCase().includes('shh') &&
          ch !== this.lobbyCh &&
          ch !== this.impostersCh,
      ) as Discord.VoiceChannel[];

    const panel = this.category.children.find(
      (ch) =>
        ch.type === 'text' &&
        ch.name.toLowerCase().includes('panel') &&
        ch !== this.lobbyCh,
    ) as Discord.TextChannel;

    if (!this.lobbyCh) {
      return 'Cannot find lobby channel! Make sure it has "lobby" somewhere in the name.';
    } else if (!this.impostersCh) {
      return 'Cannot find imposters channel! Make sure it has "imposter" somewhere in the name.';
    } else if (this.shhChs.length < 10) {
      return (
        'Only ' +
        this.shhChs.length +
        ' channels found! Make sure there\'s at least 10, each with "shh" somewhere in he name'
      );
    } else if (!panel) {
      return 'Cannot find panel channel! Make sure it\'s setup by the bot and has "panel" somewhere in the name.';
    }

    // Cache panel messages so we get reaction events for them
    await panel.messages.fetch({ limit: 10 });

    await this.loadState().catch((err) => {
      console.error('Failed to load state!', err);
      this.members = [];
      this.aliveUserIds = [];
      this.imposterUserIds = [];
      this.gameInProgress = false;
      this.shhInProgress = false;
      this.waitingForImposters = false;
    });

    if (this.gameInProgress) {
      console.log('Loaded game in progress for ' + this.category.guild.name);
    }
  }

  async muteCountChanged() {
    if (!this.gameInProgress) {
      const totalInVoice = this.lobbyCh.members.size;
      const mutedInVoice = this.lobbyCh.members.filter(
        (member) => member.voice.selfMute || false,
      ).size;

      if (
        totalInVoice >= 2 &&
        mutedInVoice / totalInVoice >= SHH_STARTED_THRESHOLD
      ) {
        this.shhInProgress = true;
        await this.start();
      }

      return;
    }

    if (
      !this.shhInProgress &&
      this.countMutedAlive(false) / this.countTotalInVoiceAlive(false) >=
        SHH_STARTED_THRESHOLD
    ) {
      this.shhInProgress = true;
      await this.updateAllVoiceStates();
    } else if (
      this.shhInProgress &&
      this.countMutedAlive(true) / this.countTotalInVoiceAlive(true) <=
        SHH_ENDED_THRESHOLD
    ) {
      this.shhInProgress = false;
      if (this.waitingForImposters) {
        this.waitingForImposters = false;
      }
      await this.updateAllVoiceStates();
    }
  }

  hasMember(member: Discord.GuildMember) {
    return this.members.some((m) => m.id === member.id);
  }

  async usersInVoiceChanged() {
    if (this.gameInProgress && this.countTotalInVoiceAlive() <= 1) {
      await this.finishGame();
    }
  }

  async updateAllVoiceStates() {
    for (const member of this.members) {
      await this.updateMemberToExpectedVoiceState(member);
    }
  }

  async updateMemberToExpectedVoiceState(member: Discord.GuildMember) {
    if (!this.hasMember(member)) {
      if (this.members.length < 10) {
        this.members.push(member);
      } else {
        await member.voice
          .kick()
          .catch((err) => console.log('Error kicking member', err));
        return;
      }
    }
    const expectedChannel = this.getExpectedChannelForMember(member);
    const expectedServerMute = this.getExpectedServerMuteForMemember(member);
    if (member.voice.channelID) {
      if (member.voice.channelID !== expectedChannel.id) {
        await member.voice
          .setChannel(expectedChannel)
          .catch((err) => console.log('Error moving member', err));
      }
      if (member.voice.serverMute !== expectedServerMute) {
        await member.voice
          .setMute(expectedServerMute)
          .catch((err) =>
            console.log(
              'Could not set mute for ' +
                member.displayName +
                ' to ' +
                expectedServerMute,
              err,
            ),
          );
      }
    }
  }

  getExpectedChannelForMember(member: Discord.GuildMember) {
    return this.shhInProgress === false
      ? this.lobbyCh
      : !this.aliveUserIds.includes(member.user.id)
      ? this.lobbyCh
      : this.imposterUserIds.includes(member.user.id)
      ? this.impostersCh
      : this.shhChs[this.members.indexOf(member) || 0];
  }

  getExpectedServerMuteForMemember(member: Discord.GuildMember) {
    // Mute ghosts if not shh in progress
    return (
      this.gameInProgress &&
      !this.aliveUserIds.includes(member.user.id) &&
      !this.shhInProgress
    );
  }

  async start() {
    this.members = this.lobbyCh.members.array();
    this.imposterUserIds = [];
    this.aliveUserIds = this.members.map((member) => member.user.id);
    this.gameInProgress = true;
    this.waitingForImposters = true;

    console.log(
      'Starting lobby in ' +
        this.category.guild.name +
        ' (' +
        this.members.length +
        ')',
    );

    await this.saveToRedis('started-at', Date.now());
    await this.saveToRedis(
      'users',
      this.members.map((member) => member.user.id).join(','),
    );
    await this.saveToRedis('alive', this.aliveUserIds.join(','));

    await this.updateAllVoiceStates();
  }

  async saveToRedis(opt: LobbyOpt, value: string | number) {
    await Redis.setex(
      'lobby:' + this.category.guild.id + ':' + opt,
      30 * 60,
      value,
    ).catch((err) => console.error('Error saving option', opt, value, err));
  }

  async getFromRedis(opt: LobbyOpt): Promise<string | null> {
    return Redis.get('lobby:' + this.category.guild.id + ':' + opt);
  }

  async deleteAllInRedis() {
    await Redis.del(
      ['started-at', 'users', 'alive', 'imposters'].map(
        (opt) => 'lobby:' + this.category.guild.id + ':' + opt,
      ),
    );
  }

  async makeImposter(member: Discord.GuildMember) {
    if (!this.waitingForImposters) {
      return 'No game has started yet.';
    } else if (!this.members.includes(member)) {
      return 'You are not currently participating in this game!';
    } else if (this.imposterUserIds.includes(member.user.id)) {
      return;
    } else if (this.imposterUserIds.length >= 3) {
      return "There's already 3 imposters!";
    }

    this.imposterUserIds.push(member.user.id);
    await this.saveToRedis('imposters', this.imposterUserIds.join(','));
    await this.updateMemberToExpectedVoiceState(member);
  }

  async toggleDead(member: Discord.GuildMember) {
    const isAlive = this.aliveUserIds.includes(member.user.id);
    if (isAlive) {
      this.aliveUserIds = this.aliveUserIds.filter(
        (userId) => userId !== member.user.id,
      );
    } else {
      this.aliveUserIds.push(member.user.id);
    }
    await this.saveToRedis('alive', this.aliveUserIds.join(','));
    await this.updateMemberToExpectedVoiceState(member);
  }

  countMutedAlive(innocentOnly = false) {
    return this.members.filter(
      (member) =>
        this.aliveUserIds.includes(member.user.id) &&
        member.voice.channelID &&
        member.voice.mute &&
        (!innocentOnly || !this.imposterUserIds.includes(member.user.id)),
    ).length;
  }

  countTotalInVoiceAlive(innocentOnly = false) {
    return this.members.filter(
      (member) =>
        member.voice.channelID &&
        this.aliveUserIds.includes(member.user.id) &&
        (!innocentOnly || !this.imposterUserIds.includes(member.user.id)),
    ).length;
  }

  async finishGame() {
    if (!this.gameInProgress) {
      return;
    }
    this.aliveUserIds = [];
    this.imposterUserIds = [];
    this.gameInProgress = false;
    this.shhInProgress = false;
    this.waitingForImposters = false;

    await this.updateAllVoiceStates();
    this.members = [];
    await this.deleteAllInRedis();
  }
}

import * as Discord from 'discord.js';

import { joinedVoiceEventHandler } from './events/joined-voice.event';
import { leftVoiceEventHandler } from './events/left-voice.event';
import { selfMuteChangedEventHandler } from './events/mute-changed.event';
import { handleMessage } from './message-handler';
import state from './state';
import { handleReaction } from './reaction-handler';

// tslint:disable-next-line
require('dotenv').config();

const client = new Discord.Client();

client.on('ready', async () => {
  console.log(`Logged in as ${client.user?.tag}`);

  client.user?.setActivity('!amoveus');

  for (const guild of client.guilds.cache.array()) {
    console.log(
      'In "' + guild.name + '" (Owner: ' + guild.owner?.user.tag + ')',
    );
    for (const channel of guild.channels.cache.array()) {
      if (
        channel.type === 'category' &&
        channel.name.toLowerCase() === 'amove us'
      ) {
        await state.getLobbyForGuild(guild, channel as Discord.CategoryChannel);
        break;
      }
    }
  }
});

client.on('guildCreate', (guild) => {
  console.log(
    'Joing "' + guild.name + '" (Owner: ' + guild.owner?.user.tag + ')',
  );
});

client.on('message', (msg) => {
  // console.log(msg.author.username + ': ' + msg.content);
  if (msg.author.id === client.user?.id) return;

  handleMessage(msg).catch((err) => console.error(err));
});

client.on('messageReactionAdd', (msgReaction, user) => {
  if (user.id === client.user?.id) {
    return;
  } else if (msgReaction.message.author.id !== client.user?.id) {
    return;
  }

  handleReaction(msgReaction, user).catch((err) => console.error(err));
});

client.on('voiceStateUpdate', (oldVoice, newVoice) => {
  const oldChannelInAmoveUs =
    oldVoice.channel?.parent?.name.toLowerCase() === 'amove us';
  const newChannelInAmoveUs =
    newVoice.channel?.parent?.name.toLowerCase() === 'amove us';

  // Make sure old or new voice is in "amove us" category
  if (!oldChannelInAmoveUs && !newChannelInAmoveUs) {
    return;
  }

  if (oldVoice.channelID !== newVoice.channelID) {
    if (oldVoice.channelID !== newVoice.channelID) {
      if (newVoice.channelID) {
        if (newChannelInAmoveUs) {
          joinedVoiceEventHandler(newVoice).catch((err) =>
            console.error('joined voice error', err),
          );
        }
      } else {
        if (oldChannelInAmoveUs) {
          leftVoiceEventHandler(newVoice).catch((err) =>
            console.error('left voice error', err),
          );
        }
      }
    }
  } else if (oldVoice.selfMute !== newVoice.selfMute) {
    if (newChannelInAmoveUs) {
      selfMuteChangedEventHandler(newVoice).catch((err) =>
        console.error('mute changed error', err),
      );
    }
  }
});

// client.on('rateLimit', (limitedData) => {
//   console.log('Rate limit!', limitedData);
// });

async function start() {
  await client.login(process.env.DISCORD_TOKEN);
}

start().catch((err) => console.error(err));

import * as Discord from 'discord.js';
import { MessageHandler } from '.';
import { DEAD_EMOJI, sendDeadPanelEmbed } from '../embeds/dead-panel.embed';
import { sendFailEmbed } from '../embeds/fail.embed';
import {
  GAME_OVER_EMOJI,
  sendGameOverPanelEmbed,
} from '../embeds/game-over.embed';
import { sendHowToPlayEmbed } from '../embeds/how-to-play.embed';
import {
  IMPOSTER_EMOJI,
  sendImposterPanelEmbed,
} from '../embeds/imposter-panel.embed';
import { sendSuccessEmbed } from '../embeds/success.embed';
import { respondInvalidFormat } from '../util/command.util';

const FAIL_TITLE = 'Could not generate';

export const GenerateChannels: MessageHandler = async (msg) => {
  if (!msg.content.startsWith('!amoveus generate')) {
    return false;
  }

  if (!msg.guild || !msg.member) {
    return;
  }

  if (msg.guild.owner?.id !== msg.member.id) {
    await sendFailEmbed(msg.author, {
      title: FAIL_TITLE,
      description: 'Only the server owner can do this!',
    });
  }

  const match = msg.content.match(/^!amoveus generate ?(delete)?$/);
  if (!match) {
    await respondInvalidFormat(msg, '!amoveus generate');
    return;
  }

  let category = msg.guild.channels.cache.find(
    (ch) => ch.type === 'category' && ch.name.toLowerCase() === 'amove us',
  ) as Discord.CategoryChannel;

  if (!category) {
    category = await msg.guild.channels.create('Amove Us', {
      type: 'category',
    });
  }

  if (category.children.size > 0 && !match[1]) {
    await sendFailEmbed(msg, {
      title: FAIL_TITLE,
      description:
        'There are already other channels in this category!\nDelete exising channels before generating with `!amoveus generate delete`',
    });
    return;
  }

  for (const channel of category.children.array()) {
    await channel.delete('Used !amoveus generate.delete command');
  }

  await generateChannels(msg.client, category);

  await sendSuccessEmbed(msg, {
    title: 'Generate 12 Channels',
  });

  console.log('Generated channels in ' + msg.guild.name);

  return true;
};

async function generateChannels(
  client: Discord.Client,
  category: Discord.CategoryChannel,
) {
  const guild = category.guild;
  const panel = await guild.channels.create('panel', {
    type: 'text',
    parent: category,
    permissionOverwrites: [
      {
        id: client.user!,
        allow: ['SEND_MESSAGES'],
      },
      {
        id: guild.roles.everyone,
        deny: ['SEND_MESSAGES'],
      },
    ],
  });
  await sendGameOverPanelEmbed(panel);
  await sendImposterPanelEmbed(panel);
  await sendDeadPanelEmbed(panel);

  const howToPlay = await guild.channels.create('how-to-play', {
    type: 'text',
    parent: category,
    permissionOverwrites: [
      {
        id: client.user!,
        allow: ['SEND_MESSAGES'],
      },
      {
        id: guild.roles.everyone,
        deny: ['SEND_MESSAGES'],
      },
    ],
  });
  await sendHowToPlayEmbed(
    howToPlay,
    'Setup',
    `
    - Everybody joins "Amove Us Lobby"
    - Assign a keybind to muting/unmuting
    - Open ${panel} and have it ready`.trim(),
  );
  await sendHowToPlayEmbed(
    howToPlay,
    'The Game',
    `
    1. **MUTE when a round starts** - Everybody will be moved to separate, hidden channels.
    2. During the first round of the game, **if you're imposter, click ${IMPOSTER_EMOJI} in ${panel} ** - You can now unmute and talk to your partner!
    3. **If you die, click the ${DEAD_EMOJI} in the panel (and unmute yourself)** - You'll be moved to the lobby to chat with other ghosts
    4. **UNMUTE when a discussion time starts** - Everybody will be moved back to the lobby and ghosts will be server muted
    5. **Click ${GAME_OVER_EMOJI} when the game is over** - Ghosts will be unmuted and imposters will be reset`.trim(),
  );
  await sendHowToPlayEmbed(
    howToPlay,
    'Bot',
    'Found a bug? Want to add it to your own server? Join below!\nhttps://discord.gg/WsR8T7v',
  );

  await guild.channels.create('Amove Us Lobby', {
    type: 'voice',
    parent: category,
    userLimit: 10,
  });

  for (let i = 0; i < 10; i++) {
    await guild.channels.create('SHHHHHHH!', {
      type: 'voice',
      parent: category,
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          deny: ['VIEW_CHANNEL'],
        },
      ],
      userLimit: 1,
    });
  }

  await guild.channels.create('Imposters', {
    type: 'voice',
    parent: category,
    permissionOverwrites: [
      {
        id: guild.roles.everyone,
        deny: ['VIEW_CHANNEL'],
      },
    ],
    userLimit: 3,
  });
}

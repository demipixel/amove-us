import * as Discord from 'discord.js';

import { MessageHandler } from '.';
import { sendHowToPlayEmbed } from '../embeds/how-to-play.embed';
import { sendSuccessEmbed } from '../embeds/success.embed';

export const HelpMessageHandler: MessageHandler = async (msg) => {
  if (msg.content.trim() !== '!amoveus') {
    return false;
  }

  if (!msg.guild || !msg.member) {
    return;
  }

  await sendHowToPlayEmbed(
    msg.channel as Discord.TextChannel,
    'Amove Us',
    `Automagically move users between channels, let imposters talk to each other, and let ghosts talk to each other!
    Use \`!amoveus generate\` to get started.

    Need help? Found a bug? Join our server! https://discord.gg/WsR8T7v
    Created by DemiPixel#0001`,
  );

  return true;
};

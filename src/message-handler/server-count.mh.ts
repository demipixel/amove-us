import * as Discord from 'discord.js';

import { MessageHandler } from '.';
import { sendHowToPlayEmbed } from '../embeds/how-to-play.embed';

export const ServerCountHandler: MessageHandler = async (msg) => {
  if (msg.content.trim() !== '!amoveus servers') {
    return false;
  }

  if (!msg.guild || !msg.member) {
    return;
  }

  await sendHowToPlayEmbed(
    msg.channel as Discord.TextChannel,
    'Amove Us',
    `Currently in **${msg.client.guilds.cache.size}** servers`,
  );

  return true;
};

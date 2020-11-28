import * as Discord from 'discord.js';
import { MessageHandler } from '.';
import { sendFailEmbed } from '../embeds/fail.embed';

const FAIL_TITLE = 'Could not delete';

export const DeleteChannels: MessageHandler = async (msg) => {
  if (!msg.content.startsWith('!amoveus delete')) {
    return false;
  }

  if (!msg.guild || !msg.member) {
    return;
  }

  if (!msg.member.hasPermission('MANAGE_CHANNELS')) {
    await sendFailEmbed(msg.author, {
      title: FAIL_TITLE,
      description: 'Only users with "manage channels" can do this!',
    });
    return;
  }

  const category = msg.guild.channels.cache.find(
    (ch) => ch.type === 'category' && ch.name.toLowerCase() === 'amove us',
  ) as Discord.CategoryChannel;

  if (!category) {
    await sendFailEmbed(msg, {
      title: FAIL_TITLE,
      description: 'Cannot find "amove us" category',
    });
    return;
  }

  for (const channel of category.children.array()) {
    try {
      await channel.delete('Used !amoveus delete command');
    } catch (e) {
      console.error(e);
      await sendFailEmbed(msg, {
        title: FAIL_TITLE,
        description:
          'There was an issue trying to delete the channels. Make sure I have permissions to delete channels!',
      });
      return;
    }
  }

  await category.delete('Used !amoveus delete command');

  return true;
};

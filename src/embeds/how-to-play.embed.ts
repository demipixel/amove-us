import * as Discord from 'discord.js';

export const DEAD_EMOJI = '💀';

export const sendHowToPlayEmbed = async (
  sendTo: Discord.TextChannel,
  title: string,
  description: string,
) => {
  const embed = new Discord.MessageEmbed();
  embed.setTitle(title).setDescription(description).setColor(0x3793f0);

  await sendTo.send(embed);
};

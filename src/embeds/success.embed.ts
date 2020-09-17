import * as Discord from 'discord.js';

interface SuccessEmbedOpt {
  title?: string;
  description?: string;
}

export const sendSuccessEmbed = async (
  sendTo: Discord.Message | Discord.User,
  { title = '', description = '' }: SuccessEmbedOpt,
) => {
  const embed = new Discord.MessageEmbed();
  embed.setTitle(title).setDescription(description).setColor(0x03fc0b);

  if (sendTo instanceof Discord.Message) {
    await sendTo.channel.send(embed);
  } else {
    await sendTo.send(embed);
  }
};

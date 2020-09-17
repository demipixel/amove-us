import * as Discord from 'discord.js';

interface FailEmbedOpt {
  title?: string;
  description?: string;
}

export const sendFailEmbed = async (
  sendTo: Discord.Message | Discord.User | Discord.PartialUser,
  { title = '', description = '' }: FailEmbedOpt,
) => {
  const embed = new Discord.MessageEmbed();
  embed.setTitle(title).setDescription(description).setColor(0xeb4034);

  if (sendTo instanceof Discord.Message) {
    await sendTo.channel.send(embed);
  } else {
    await sendTo.send(embed);
  }
};

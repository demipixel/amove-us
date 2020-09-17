import * as Discord from 'discord.js';

export const DEAD_EMOJI = '💀';

export const sendDeadPanelEmbed = async (sendTo: Discord.TextChannel) => {
  const embed = new Discord.MessageEmbed();
  embed
    .setTitle('I Died')
    .setDescription(
      'Click the 💀 below to confirm you are dead this round (and to chat with other ghosts!) - Messed up? Click it again to come back to life.',
    )
    .setColor(0x000000);

  const msg = await sendTo.send(embed);

  Promise.all([
    msg.react(DEAD_EMOJI),
    // msg.react(CONFIRMATION_EMOJI),
  ]).catch((err) => console.error('Error dead panel reacting', err));
};

import * as Discord from 'discord.js';
import { CONFIRMATION_EMOJI } from '../reaction-handler';

export const IMPOSTER_EMOJI = '😈';

export const sendImposterPanelEmbed = async (sendTo: Discord.TextChannel) => {
  const embed = new Discord.MessageEmbed();
  embed
    .setTitle("I'm An Imposter")
    .setDescription(
      'Click the 😈 below to become the imposter for this round (and to chat with other imposters!)',
    )
    .setColor(0xeb4034);

  const msg = await sendTo.send(embed);
  Promise.all([
    msg.react(IMPOSTER_EMOJI),
    // msg.react(CONFIRMATION_EMOJI),
  ]).catch((err) => console.error('Error imposter panel reacting', err));
};

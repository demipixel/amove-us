import * as Discord from 'discord.js';
import { CONFIRMATION_EMOJI } from '../reaction-handler';

export const GAME_OVER_EMOJI = '🏁';

export const sendGameOverPanelEmbed = async (sendTo: Discord.TextChannel) => {
  const embed = new Discord.MessageEmbed();
  embed
    .setTitle('Game Over')
    .setDescription(
      'Click the 🏁 below to confirm that the game is over and everything should reset!',
    )
    .setColor(0x00ff59);

  const msg = await sendTo.send(embed);
  Promise.all([
    msg.react(GAME_OVER_EMOJI),
    // msg.react(CONFIRMATION_EMOJI),
  ]).catch((err) => console.error('Error game over panel reacting', err));
};

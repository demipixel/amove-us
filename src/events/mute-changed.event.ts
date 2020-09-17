import * as Discord from 'discord.js';
import state from '../state';

export async function selfMuteChangedEventHandler(
  voiceState: Discord.VoiceState,
) {
  const member = voiceState.member;
  if (!member) {
    return;
  }
  const lobby = await state.getLobbyForGuild(member.guild);
  if (typeof lobby === 'object') {
    await lobby
      .muteCountChanged()
      .catch((err) => console.error('Mute count changed error', err));
  }
}

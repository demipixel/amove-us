import * as Discord from 'discord.js';
import state from '../state';

export async function leftVoiceEventHandler(voiceState: Discord.VoiceState) {
  const member = voiceState.member;
  if (!member) {
    return;
  }

  const lobby = await state.getLobbyForGuild(
    member.guild,
    voiceState.channel?.parent,
  );
  if (typeof lobby === 'object') {
    await lobby.usersInVoiceChanged();
  }
}

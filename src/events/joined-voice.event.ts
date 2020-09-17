import * as Discord from 'discord.js';
import { sendFailEmbed } from '../embeds/fail.embed';
import state from '../state';

export async function joinedVoiceEventHandler(voiceState: Discord.VoiceState) {
  const member = voiceState.member;
  const channel = voiceState.channel;
  if (!member || !channel) {
    return;
  }

  const lobbyOrError = await state.getLobbyForGuild(
    member.guild,
    channel.parent,
  );
  if (typeof lobbyOrError === 'string') {
    sendFailEmbed(member.user, {
      title: 'Error generating lobby',
      description: lobbyOrError,
    }).catch((err) =>
      console.log('Error sending "error generating lobby" fail embed', err),
    );
    return;
  }

  await lobbyOrError.updateMemberToExpectedVoiceState(member);
}

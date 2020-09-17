import { ReactionHandler } from '.';
import { sendFailEmbed } from '../embeds/fail.embed';
import { GAME_OVER_EMOJI } from '../embeds/game-over.embed';
import { IMPOSTER_EMOJI } from '../embeds/imposter-panel.embed';

export const BecomeImposterReactionHandler: ReactionHandler = async (
  reaction,
  lobby,
  user,
) => {
  if (reaction.emoji.name !== IMPOSTER_EMOJI) {
    return false;
  }

  await reaction.users.remove(user.id);

  const member = reaction.message.guild?.members.cache.find(
    (m) => m.user.id === user.id,
  );
  if (!member) {
    return;
  }

  const err = await lobby.makeImposter(member);
  if (err) {
    await sendFailEmbed(user, {
      title: 'Cannot make you imposter',
      description: err,
    });
  }
};

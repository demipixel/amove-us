import { ReactionHandler } from '.';
import { DEAD_EMOJI } from '../embeds/dead-panel.embed';
import { GAME_OVER_EMOJI } from '../embeds/game-over.embed';

export const BecomeDeadReactionHandler: ReactionHandler = async (
  reaction,
  lobby,
  user,
) => {
  if (reaction.emoji.name !== DEAD_EMOJI) {
    return false;
  }

  await reaction.users.remove(user.id);

  const member = reaction.message.guild?.members.cache.find(
    (m) => m.user.id === user.id,
  );
  if (!member) {
    return;
  }

  await lobby.toggleDead(member);
};

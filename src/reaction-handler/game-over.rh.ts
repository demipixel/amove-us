import { ReactionHandler } from '.';
import { GAME_OVER_EMOJI } from '../embeds/game-over.embed';

export const GameOverReactionHandler: ReactionHandler = async (
  reaction,
  lobby,
  user,
) => {
  if (reaction.emoji.name !== GAME_OVER_EMOJI) {
    return false;
  }

  await reaction.users.remove(user.id);
  await lobby.finishGame();
};

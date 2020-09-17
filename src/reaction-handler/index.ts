import * as Discord from 'discord.js';
import { Lobby } from '../lobby/lobby';
import state from '../state';
import { BecomeDeadReactionHandler } from './become-dead.rh';
import { BecomeImposterReactionHandler } from './become-imposter.rh';
// import { ConfirmationHandler } from './confirmation.rh';
import { GameOverReactionHandler } from './game-over.rh';
// import { RemoveAfterTimeHandler } from './remove-after-time.rh';

export const CONFIRMATION_EMOJI = '✅';

export type ReactionHandler = (
  reaction: Discord.MessageReaction,
  lobby: Lobby,
  user: Discord.User | Discord.PartialUser,
) => Promise<boolean | void>;

const reactionHandlers: ReactionHandler[] = [
  // RemoveAfterTimeHandler,
  // ConfirmationHandler,
  GameOverReactionHandler,
  BecomeDeadReactionHandler,
  BecomeImposterReactionHandler,
];

export const handleReaction = async (
  reaction: Discord.MessageReaction,
  user: Discord.User | Discord.PartialUser,
) => {
  if (!reaction.message.guild) {
    return;
  }
  const lobby = await state.getLobbyForGuild(reaction.message.guild);
  if (typeof lobby === 'string') {
    return;
  }

  for (const handler of reactionHandlers) {
    const end = await handler(reaction, lobby, user);
    if (end !== false) {
      break;
    }
  }
};

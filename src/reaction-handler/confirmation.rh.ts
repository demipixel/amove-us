// import { CONFIRMATION_EMOJI, ReactionHandler } from '.';
// import { DEAD_EMOJI } from '../embeds/dead-panel.embed';
// import { sendFailEmbed } from '../embeds/fail.embed';
// import { GAME_OVER_EMOJI } from '../embeds/game-over.embed';
// import { IMPOSTER_EMOJI } from '../embeds/imposter-panel.embed';

// export const ConfirmationHandler: ReactionHandler = async (
//   reaction,
//   lobby,
//   user,
// ) => {
//   if (reaction.emoji.name !== CONFIRMATION_EMOJI) {
//     return false;
//   }
//   // The "original reaction" is the first reaction that
//   // we're trying to confirm
//   const originalReaction = reaction.message.reactions.cache.find(
//     (r) => r.emoji.name !== CONFIRMATION_EMOJI,
//   );

//   if (!originalReaction.users.cache.some((u) => u.id === user.id)) {
//     await reaction.users.remove(user.id);
//     return;
//   }

//   const originalName = originalReaction.emoji.name;
//   const member = reaction.message.guild.members.cache.find(
//     (m) => m.user.id === user.id,
//   );

//   if (originalName === GAME_OVER_EMOJI) {
//     await lobby.finishGame();
//   }

//   for (const react of reaction.message.reactions.cache.array()) {
//     await react.users.remove(user.id);
//   }
// };

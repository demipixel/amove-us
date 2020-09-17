// import { ReactionHandler } from '.';
// import { GAME_OVER_EMOJI } from '../embeds/game-over.embed';

// export const RemoveAfterTimeHandler: ReactionHandler = async (
//   reaction,
//   lobby,
//   user,
// ) => {
//   if ([GAME_OVER_EMOJI].includes(reaction.emoji.name)) {
//     setTimeout(() => {
//       reaction.users
//         .remove(user.id)
//         .catch((err) => console.log('Error removing emoji after timeout', err));
//     }, 5000);
//   } else {
//     return false;
//   }
// };

// import { MessageHandler } from '.';
// import { sendFailEmbed } from '../embeds/fail.embed';
// import { sendSuccessEmbed } from '../embeds/success.embed';
// import state from '../state';
// import { respondInvalidFormat } from '../util/command.util';

// const FAIL_TITLE = 'Could not leave lobby';

// export const LeaveLobby: MessageHandler = async (msg) => {
//   if (!msg.content.startsWith('!leave')) {
//     return false;
//   }

//   const match = msg.content.match(/^!leave$/);
//   if (!match) {
//     await respondInvalidFormat(
//       msg,
//       '!leave',
//       "Leave the lobby you're currently in",
//     );
//     return;
//   }

//   const member = await msg.guild.members.fetch(msg.author);
//   if (!member) {
//     await sendFailEmbed(msg, {
//       title: FAIL_TITLE,
//       description: 'Cannot find you in the Discord server!',
//     });
//     return;
//   }

//   const lobby = state.getLobbyForMember(member);
//   if (!lobby) {
//     await sendFailEmbed(msg, {
//       title: FAIL_TITLE,
//       description: 'Cannot find lobby with code "' + match[1] + '"',
//     });
//     return;
//   }

//   await lobby.leaveMember(member);

//   await sendSuccessEmbed(msg, {
//     title: 'Left Lobby',
//   });

//   return true;
// };

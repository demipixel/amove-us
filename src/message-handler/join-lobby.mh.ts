// import { MessageHandler } from '.';
// import { sendFailEmbed } from '../embeds/fail.embed';
// import { sendSuccessEmbed } from '../embeds/success.embed';
// import state from '../state';
// import { respondInvalidFormat } from '../util/command.util';

// const FAIL_TITLE = 'Could not join lobby';

// export const JoinLobby: MessageHandler = async (msg) => {
//   if (!msg.content.startsWith('!join')) {
//     return false;
//   }

//   const match = msg.content.match(/^!join ([a-zA-Z]{4,8})$/);
//   if (!match) {
//     await respondInvalidFormat(
//       msg,
//       '!join <code>',
//       'Join a lobby with the code given. Example: `!join ABCD`',
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

//   const lobby = state.getLobbyFromCode(match[1].toUpperCase());
//   if (!lobby) {
//     await sendFailEmbed(msg, {
//       title: FAIL_TITLE,
//       description:
//         'Cannot find lobby with code "' + match[1].toUpperCase() + '"',
//     });
//     return;
//   }

//   const previousLobby = state.getLobbyForMember(member);
//   const err = await lobby.addMember(member);
//   if (err) {
//     await sendFailEmbed(msg, {
//       title: FAIL_TITLE,
//       description: err,
//     });
//     return;
//   }

//   if (previousLobby) {
//     previousLobby.leaveMember(member);
//   }

//   await sendSuccessEmbed(msg, {
//     title: 'Joined Lobby',
//   });

//   return true;
// };

// import { ALL } from 'dns';
// import { MessageHandler } from '.';
// import { sendFailEmbed } from '../embeds/fail.embed';
// import { sendSuccessEmbed } from '../embeds/success.embed';
// import { Privacy } from '../lobby/privacy';
// import { ALL_REGIONS, Region } from '../region';
// import state from '../state';
// import { respondInvalidFormat } from '../util/command.util';

// const FAIL_TITLE = 'Could not create lobby';

// export const NewLobby: MessageHandler = async (msg) => {
//   if (!msg.content.startsWith('!new')) {
//     return false;
//   }

//   const match = msg.content.match(
//     /^!new (public|private) ([a-zA-Z]{4,8}) (NA|EU|OCE)$/i,
//   );
//   if (!match) {
//     await respondInvalidFormat(
//       msg,
//       '!new <public or private> <code> <region>',
//       'Create a new lobby with yourself as the host. Example: `!new public ABCD EU`',
//     );
//     return;
//   } else if (!ALL_REGIONS.includes(match[3].toUpperCase())) {
//     await sendFailEmbed(msg, {
//       title: FAIL_TITLE,
//       description: 'Invalid region! Options: ' + ALL_REGIONS.join(', '),
//     });
//   }

//   const member = await msg.guild.members.fetch(msg.author);
//   if (!member) {
//     await sendFailEmbed(msg, {
//       title: FAIL_TITLE,
//       description: 'Cannot find you in the Discord server!',
//     });
//     return;
//   }

//   const existingLobby = state.getLobbyForMember(member);
//   if (existingLobby) {
//     await sendFailEmbed(msg, {
//       title: FAIL_TITLE,
//       description:
//         'You are already in a lobby! Use `!leave` first to leave your current lobby.',
//     });
//     return;
//   }

//   const err = await state.createLobby(
//     member,
//     match[1] === 'public' ? Privacy.PUBLIC : Privacy.CODE_ONLY,
//     match[2].toUpperCase(),
//     match[3].toUpperCase() as Region,
//   );
//   if (err) {
//     await sendFailEmbed(msg, {
//       title: FAIL_TITLE,
//       description: err,
//     });
//     return;
//   }

//   await sendSuccessEmbed(msg, {
//     title: 'Lobby Created',
//     description: `\`!code\` to change the region
//       \`!privacy\` to change how users join the lobby
//       \`!kick\` to kick a user from the lobby
//       \`!ban\` to ban a user from the lobby`,
//   });

//   return true;
// };

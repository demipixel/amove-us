import { ReactionHandler } from '.';
import { DEAD_EMOJI } from '../embeds/dead-panel.embed';
import { sendFailEmbed } from '../embeds/fail.embed';

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

  const err = await lobby.toggleDead(member);
  if (err) {
    await sendFailEmbed(user, {
      title: 'Cannot toggle dead',
      description: err,
    });
  }
};

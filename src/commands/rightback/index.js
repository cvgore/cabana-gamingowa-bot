import discordJs, {
  SlashCommandSubcommandBuilder, time, userMention
} from "discord.js";
import { respondWithResult, userInputError, userSuccess } from "../../core/response.js";
import { getBrbStatus, removeBrbStatus } from "../../db/brb.js";
import { fromUnixTime, isPast } from "date-fns";
import { removeBrbFromUser } from "../../core/brb.js";

export const definition = new SlashCommandSubcommandBuilder()
  .setName("jj")
  .setDescription("usuń zaraz wracam");

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<void>}
 */
export const handler = async (interaction) => {
  const brbEndsAt = await getBrbStatus(
    interaction.guildId,
    interaction.user.id
  );

  if (brbEndsAt === null || isPast(fromUnixTime(brbEndsAt))) {
    return respondWithResult({
      interaction,
      result: false,
      msgFail: userInputError(`nie jesteś przecież zw`)
    });
  }

  const user = await interaction.guild.members.fetch(interaction.user.id);

  await removeBrbStatus(interaction.guildId, interaction.user.id);
  await removeBrbFromUser(user);

  return respondWithResult({
    interaction,
    msgOk: userSuccess(
      `${userMention(interaction.user.id)} już nie jest zw`
    ),
    hidden: false,
  });
};
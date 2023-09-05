import discordJs, {
  SlashCommandSubcommandBuilder,
  AutocompleteInteraction,
  userMention
} from "discord.js";
import { getBadRankingById, getBadRankings, putBadRankingById } from "../../db/bad-rankings.js";
import { respondWithResult, userError, userInputError, userSuccess } from "../../core/response.js";
import { emojifyNumber, getNumericIncrementalValue } from "../../core/helpers.js";

export const definition = new SlashCommandSubcommandBuilder()
  .setName("ustaw")
  .setDescription("we podmień dane na rankingu")
  .addStringOption((opt) => opt
    .setName("id")
    .setDescription("nazwa rankingu")
    .setAutocomplete(true)
    .setRequired(true)
  )
  .addUserOption((opt) => opt
    .setName("user")
    .setDescription("user któremu zmienić dane")
    .setRequired(true)
  )
  .addStringOption((opt) => opt
    .setName("value")
    .setDescription("`N+` dodaj N do obecnej wartości | `N-` odejmij | `N` ustaw wartość")
    .setRequired(true)
  );

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<void>}
 */
export const handler = async (interaction) => {
  const rankingId = interaction.options.getString("id", true);
  const user = interaction.options.getUser("user", true);
  const value = interaction.options.getString("value", true);

  const rankingData = await getBadRankingById(interaction.guildId, rankingId);

  if (!rankingData) {
    return respondWithResult({
      interaction,
      result: false,
      msgFail: userInputError("nie ma takiego rankingu")
    });
  }

  if (!(user.id in rankingData.points)) {
    rankingData.points[user.id] = 0;
  }

  const parsedValue = getNumericIncrementalValue(rankingData.points[user.id], value);

  if (parsedValue === null) {
    return respondWithResult({
      interaction,
      result: false,
      msgFail: userInputError("niepoprawna wartość numeryczna")
    });
  }

  rankingData.points[user.id] = parsedValue;
  rankingData.updatedBy = interaction.user.id;
  rankingData.updatedAt = new Date().valueOf();

  await putBadRankingById(interaction.guildId, rankingId, rankingData);

  return respondWithResult({
    interaction,
    result: true,
    msgOk: userSuccess(`nowa wartość dla ${userMention(user.id)} w rankingu "${rankingData.name}" ► ${emojifyNumber(parsedValue)}`),
    hidden: false,
  });
};

/**
 * @param {AutocompleteInteraction} interaction
 * @return {Promise<void>}
 */
export const autocompleteHandler = async (interaction) => {
  const rankings = await getBadRankings(interaction.guildId);

  if (!rankings) {
    return;
  }

  const entries = Object.entries(rankings);
  const focusedValue = interaction.options.getFocused();
  const filtered = entries.filter(([id, name]) => name.startsWith(focusedValue) || id.startsWith(focusedValue));

  return interaction.respond(
    filtered.map(([value, name]) => ({ name, value }))
  );
};
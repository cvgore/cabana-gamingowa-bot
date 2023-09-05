import discordJs, {
  SlashCommandSubcommandBuilder,
  AutocompleteInteraction,
  EmbedBuilder,
  userMention, time
} from "discord.js";
import { getBadRankingById, getBadRankings } from "../../db/bad-rankings.js";
import { LOADING_RESPONSE_CHAR, respondWithResult, userError } from "../../core/response.js";
import debugCtor from "debug";
import { emojifyNumberWithPadding } from "../../core/helpers.js";

const debug = debugCtor("badrankings:view");

export const definition = new SlashCommandSubcommandBuilder()
  .setName("zobacz")
  .setDescription("zajrzyj se na badranking")
  .addStringOption((opt) => opt
    .setName("id")
    .setDescription("nazwa rankingu")
    .setAutocomplete(true)
    .setRequired(true)
  );

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<void>}
 */
export const handler = async (interaction) => {
  const id = interaction.options.getString("id", true);

  const rankingData = await getBadRankingById(interaction.guildId, id);

  if (!rankingData) {
    return respondWithResult({
      interaction,
      result: false,
      msgFail: userError("nie ma takiego rankingu")
    });
  }

  const rankingEntries = Object.entries(rankingData.points);
  rankingEntries
    .sort(([, a], [, b]) => b - a);

  // measure mathematically longest "string" number (including negative numbers)
  const maxValueNumLength = Math.max(
    rankingEntries[0][1],
    Math.sign(rankingEntries[rankingEntries.length - 1][1]) === 1
      // if non-negative - no need to deal with it
      ? 0
      // if negative - multiply "10" so it indicates space for "-" symbol in front of the number
      : Math.abs(rankingEntries[rankingEntries.length - 1][1]) * 10
  );
  const maxValueLength = maxValueNumLength.toString().length;

  debug("maxValueLength=%o", maxValueLength);

  const boardRows = rankingEntries.length === 0 ? "- pusto -" :
    rankingEntries
      .map(([userSid, value]) => {
        return [userMention(userSid), emojifyNumberWithPadding(value, maxValueLength)];
      });

  const embed = new EmbedBuilder()
    .setTitle(`Bad-Ranking "${rankingData.name}"`)
    .setTimestamp(rankingData.updatedAt)
    .setDescription(LOADING_RESPONSE_CHAR)
    .setFooter({
      text: `id: ${id}`
    });

  await interaction.reply({
    embeds: [
      embed
    ]
  });

  const descriptionPart = [
    `zaktualizowany przez: ${userMention(rankingData.updatedBy)}`,
    time(Math.round(rankingData.updatedAt / 1000))
  ].join("\n");

  embed.setDescription(
    descriptionPart
  );
  embed.addFields({
    name: "Użytkownik",
    value: boardRows.map(([user]) => user).join("\n"),
    inline: true
  });
  embed.addFields({
    name: "Wynik",
    value: boardRows.map(([, value]) => value).join("\n"),
    inline: true
  });

  return interaction.editReply({
    embeds: [
      embed
    ]
  });
};

/**
 * @param {AutocompleteInteraction} interaction
 * @return {Promise<void>}
 */
export const autocompleteHandler = async (interaction) => {
  const rankings = await getBadRankings(interaction.guildId);

  if (!rankings) {
    debug("no rankings for %o guild found", interaction.guildId);

    await interaction.respond([]);

    return;
  }

  const entries = Object.entries(rankings);
  const focusedValue = interaction.options.getFocused();
  const filtered = entries.filter(([id, name]) => name.startsWith(focusedValue) || id.startsWith(focusedValue));

  debug("rankings for %o guild found (filter text: %o) (%o)", interaction.guildId, focusedValue, filtered);

  await interaction.respond(
    filtered.map(([value, name]) => ({ name, value }))
  );
};
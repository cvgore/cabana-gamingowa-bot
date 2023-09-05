import discordJs, {
  SlashCommandSubcommandBuilder
} from "discord.js";
import { getBadRankings, putBadRankingById, putBadRankingConfigById } from "../../db/bad-rankings.js";
import { userError, userSuccess } from "../../core/response.js";

export const definition = new SlashCommandSubcommandBuilder()
  .setName("śledź-punkty")
  .setDescription("śledź zmiany w punktach")
  .addBooleanOption((opt) => opt
    .setName("stan")
    .setDescription("włącz/wyłącz")
    .setRequired(true)
  );

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<void>}
 */
export const handler = async (interaction) => {
  const name = interaction.options.getString("name", true);

  const rankings = await getBadRankings(interaction.guildId) ?? {};

  if (!(rankings && name in rankings)) {
    await interaction.reply({
      content: userError(`ranking o nazwie ${name} nie istnieje`),
      ephemeral: true
    });
    return;
  }

  await putBadRankingConfigById(interaction.guildId, name, {});

  await putBadRankingById(interaction.guildId, uuid, {
    name,
    points: {},
    updatedAt: new Date().valueOf(),
    updatedBy: interaction.user.id
  });

  await interaction.reply({
    content: userSuccess(`ranking "${name}" dodany`),
    ephemeral: true
  });
};
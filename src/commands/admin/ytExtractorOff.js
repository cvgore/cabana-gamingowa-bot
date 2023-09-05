import {
  SlashCommandSubcommandBuilder
} from "discord.js";
import discordJs from "discord.js";
import { respondWithResult } from "../../core/response.js";
import { delYtExtractorChannel, putYtExtractorChannels } from "../../db/guild-settings.js";

export const definition = new SlashCommandSubcommandBuilder()
  .setName("yt-extractor-off")
  .setDescription("yt-extractor-off")
;

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<void>}
 */
export const handler = async (interaction) => {
  putYtExtractorChannels(interaction.guildId, []);

  return respondWithResult({
    interaction,
    result: true,
    msgOk: `wszystkie kanały zostały usunięte, ytExtractor off`,
  });
};
import {
  SlashCommandSubcommandBuilder, userMention
} from "discord.js";
import discordJs from "discord.js";
import { respondWithResult, userInputError } from "../../core/response.js";
import { addYtExtractorChannel } from "../../db/guild-settings.js";

export const definition = new SlashCommandSubcommandBuilder()
  .setName("yt-extractor-dodaj")
  .setDescription("yt-extractor-dodaj")
  .addChannelOption((opt) => opt
    .setName('channel')
    .setDescription('kanał który śledzić')
    .setRequired(true)
  )
;

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<void>}
 */
export const handler = async (interaction) => {
  const channel = interaction.options.getChannel('channel', true);

  return respondWithResult({
    interaction,
    result: addYtExtractorChannel(interaction.guildId, channel.id),
    msgFail: userInputError(`ten kanał już jest dodany`),
  });
};
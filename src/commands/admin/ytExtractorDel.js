import {
  SlashCommandSubcommandBuilder
} from "discord.js";
import discordJs from "discord.js";
import { respondWithResult, userInputError } from "../../core/response.js";
import { delYtExtractorChannel } from "../../db/guild-settings.js";

export const definition = new SlashCommandSubcommandBuilder()
  .setName("yt-extractor-usun")
  .setDescription("yt-extractor-usun")
  .addChannelOption((opt) => opt
    .setName('channel')
    .setDescription('kanał który nie śledzić')
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
    result: delYtExtractorChannel(interaction.guildId, channel.id),
    msgFail: userInputError(`ten kanał nie został jeszcze dodany`),
  });
};
import {
  channelMention,
  EmbedBuilder,
  SlashCommandSubcommandBuilder, userMention
} from "discord.js";
import discordJs from "discord.js";
import { respondWithResult, userAttention, userSuccess } from "../../core/response.js";
import { getYtExtractorChannels } from "../../db/guild-settings.js";

export const definition = new SlashCommandSubcommandBuilder()
  .setName("yt-extractor-zobacz")
  .setDescription("yt-extractor-zobacz")
;
/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<void>}
 */
export const handler = async (interaction) => {
  const channels = getYtExtractorChannels(interaction.guildId);

  if (!channels) {
    return respondWithResult({
      interaction,
      result: false,
      msgFail: userAttention(`brak kanałów na liście ytExtractora`)
    });
  }

  const embed = new EmbedBuilder()
    .addFields({
      name: 'ytExtractor Channels',
      value: channels.map((chan) => channelMention(chan)).join('\n'),
      inline: true
    });

  return interaction.reply({
    embeds: [embed],
    ephemeral: true
  });
};
import discordJs, {
  ChannelType,
  SlashCommandSubcommandBuilder
} from "discord.js";
import { respondWithResult, userInputError } from "../../core/response.js";
import debugCtor from "debug";
import { putRandomEventsEnabled, putRandomEventsGuildChannel } from "../../db/guild-settings.js";

export const definition = new SlashCommandSubcommandBuilder()
  .setName("zarzadzaj")
  .setDescription("chcesz czy nie?")
  .addBooleanOption((opt) => opt
    .setName("active")
    .setDescription("włącz albo wyłącz")
    .setRequired(true)
  )
  .addChannelOption((opt) => opt
    .setName("channel")
    .setDescription("jaki kanał wariacie")
    .setRequired(false)
    .addChannelTypes(
      ChannelType.GuildText
    )
  );

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<void>}
 */
export const handler = async (interaction) => {
  const active = interaction.options.getBoolean("active", true);
  const channel = interaction.options.getChannel("channel");

  if (active && !channel) {
    return respondWithResult({
      interaction,
      result: false,
      msgFail: userInputError(`łe no, aktywny na tak, ale nie podałeś kanału xd`)
    });
  }

  putRandomEventsEnabled(interaction.guildId, active);
  putRandomEventsGuildChannel(
    interaction.guildId,
    active ? channel.id : ''
  );

  return respondWithResult({
    interaction,
    result: true
  });
};
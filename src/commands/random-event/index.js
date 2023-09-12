import discordJs, {
  ChannelType,
  SlashCommandBuilder
} from "discord.js";
import { respondWithResult, userInputError } from "../../core/response.js";
import debugCtor from "debug";
import { runRemindScheduler } from "../../scheduler/remind.js";
import { putRandomEventsEnabled, putRandomEventsGuildChannel } from "../../db/guild-settings.js";
import { runRandomEventsForAllEnabledGuilds } from "../../scheduler/random-events/index.js";

const debug = debugCtor("cmd:random-event");

export const definition = new SlashCommandBuilder()
  .setName("losowe-eventy")
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
    active ? channel.id : null
  );

  return respondWithResult({
    interaction,
    result: true
  });
};

runRandomEventsForAllEnabledGuilds();
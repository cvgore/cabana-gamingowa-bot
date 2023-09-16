import {
  SlashCommandSubcommandBuilder, userMention
} from "discord.js";
import discordJs from 'discord.js';
import { notAnOwner, respondWithResult } from "../../core/response.js";
import { putRandomEventsDebugModeEnabled } from "../../db/guild-settings.js";
import { isUserOwner } from "../../core/user.js";

export const definition = new SlashCommandSubcommandBuilder()
  .setName('debug-random-events')
  .setDescription('debug-random-events')
  .addBooleanOption((opt) => opt
    .setName('enabled')
    .setDescription('enabled')
    .setRequired(true)
  )

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<void>}
 */
export const handler = async (interaction) => {
  if (!isUserOwner(interaction.user.id)) {
    return respondWithResult({
      interaction,
      result: false,
      msgFail: notAnOwner()
    })
  }

  const enabled = interaction.options.getBoolean('enabled', true);

  putRandomEventsDebugModeEnabled(enabled);

  return respondWithResult({
    interaction,
  })
}
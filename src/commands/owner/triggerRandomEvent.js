import {
  SlashCommandSubcommandBuilder, userMention
} from "discord.js";
import discordJs from 'discord.js';
import { notAnOwner, respondWithResult } from "../../core/response.js";
import { isUserOwner } from "../../core/user.js";
import { RANDOM_EVENTS } from "../../scheduler/random-events/events/index.js";
import { logger } from "../../logger.js";

export const definition = new SlashCommandSubcommandBuilder()
  .setName('trigger-random-event')
  .setDescription('trigger-random-event')
  .addStringOption((opt) => opt
    .setName('name')
    .setDescription('name')
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

  const eventName = interaction.options.getString('name', true);

  await interaction.deferReply({
    ephemeral: true
  });

  const randomEvent = RANDOM_EVENTS.find((x) => x.name === eventName);

  try {
    if (typeof randomEvent !== 'undefined') {
      await randomEvent.run(true);
    }
  } catch (ex) {
    logger.warn('trigger random event fail, %o', ex);

    return respondWithResult({
      interaction,
      result: false,
      followup: true
    });
  }

  return respondWithResult({
    interaction,
    followup: true
  });
}
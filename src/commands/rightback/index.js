import {
  SlashCommandSubcommandBuilder, time, userMention
} from "discord.js";
import discordJs from 'discord.js';
import { userInputError, userSuccess } from "../../core/response.js";
import { getBrbStatus, putBrbStatus, removeBrbStatus } from "../../db/brb.js";
import { addToScheduleBrb } from "../../scheduler/brb.js";
import { addMinutes, differenceInSeconds, fromUnixTime, getSeconds, getUnixTime, isAfter, isPast } from "date-fns";
import { unzzzifyNickname, zzzifyNickname } from "../../core/helpers.js";
import { logger } from "../../logger.js";
import { removeBrbFromUser } from "../../core/brb.js";

export const definition = new SlashCommandSubcommandBuilder()
  .setName('jj')
  .setDescription('usuń zaraz wracam')

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<void>}
 */
export const handler = async (interaction) => {
  const brbEndsAt = await getBrbStatus(
    interaction.guildId,
    interaction.user.id
  )

  if (brbEndsAt === null || isPast(fromUnixTime(brbEndsAt))) {
    await interaction.reply({
      content: userInputError(
        `nie jesteś przecież zw`
      ),
      ephemeral: true,
    })
  }

  const user = await interaction.guild.members.fetch(interaction.user.id)

  await removeBrbStatus(interaction.guildId, interaction.user.id)
  await removeBrbFromUser(user)

  await interaction.reply({
    content: userSuccess(
      `"${userMention(interaction.user.id)} już nie jest zw`
    ),
  })
}
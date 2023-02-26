import {
  SlashCommandSubcommandBuilder, time, userMention
} from "discord.js";
import discordJs from 'discord.js';
import {userSuccess} from "../../core/response.js"
import { getBrbStatus } from "../../db/brb.js";

export const definition = new SlashCommandSubcommandBuilder()
  .setName('ile-lurkuje')
  .setDescription('daj info ile czasu już ta osoba lurkuje')
  .addUserOption((opt) => opt
    .setName('user')
    .setDescription('kogo zeskanować')
    .setRequired(true)
  )

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<void>}
 */
export const handler = async (interaction) => {
  const user = interaction.options.getUser('user', true);

  const replySuccess = async (mins, expectedTime) => {
    await interaction.reply({
      content: userSuccess(
        `ustawiono zw "${userMention(interaction.user.id)} na "${mins}" minut - kończy się o "${time(expectedTime)}"`
      ),
    })
  }

  const brbEndsAt = await getBrbStatus(
    interaction.guildId,
    interaction.user.id
  )

  if (brbEndsAt === null) {
    await replySuccess(mins, expectedTime)
  }
}

/**
 * @param {discordJs.VoiceState} newState
 * @param {discordJs.VoiceState} oldState
 * @return {Promise<void>}
 */
export const voiceStateUpdateHandler = async ([oldState, newState]) => {
  const previous = newState.selfMute || newState.selfDeaf
  const current = oldState.selfMute || oldState.selfDeaf

  if (previous !== current) {

  }
}
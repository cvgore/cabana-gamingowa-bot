import {
  SlashCommandBuilder, time, userMention
} from "discord.js";
import discordJs from 'discord.js';
import { userInputError } from "../../core/response.js";
import { getLastMutedAt, putLastMutedAt, removeLastMutedAt } from "../../db/muted.js";
import { getUnixTime } from "date-fns";
import debugCtor from "debug";

const debug = debugCtor('cmd:muted')

export const definition = new SlashCommandBuilder()
  .setName('ile-lurkuje')
  .setDescription('daj info ile czasu już ta osoba lurkuje')
  .addUserOption((opt) => opt
    .setName('user')
    .setDescription('kogo zeskanować laserem piu piu piu')
    .setRequired(true)
  )

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<void>}
 */
export const handler = async (interaction) => {
  const user = interaction.options.getUser('user', true);

  const lastMutedAt = await getLastMutedAt(
    interaction.guildId,
    user.id
  )

  if (lastMutedAt === null) {
    return interaction.reply({
      content: userInputError(
        `${userMention(user.id)} nie jest wyciszony`
      ),
      ephemeral: true,
    })
  }

  return interaction.reply({
    content: userInputError(
      `${userMention(user.id)} jest wyciszony od ${time(lastMutedAt, 'R')} (${time(lastMutedAt)})`
    ),
    ephemeral: true
  })
}

/**
 * @param {discordJs.VoiceState} newState
 * @param {discordJs.VoiceState} oldState
 * @return {Promise<void>}
 */
export const voiceStateUpdateHandler = async ([oldState, newState]) => {
  const user = newState.member.user

  if (user.bot || user.system) {
    debug('skipped voiceStateUpdateHandler due to bot or system user')
    return
  }

  const currentlyMuted = oldState.selfMute || oldState.selfDeaf

  if (currentlyMuted) {
    debug(`user ${user.id} is muted, updating`)

    const now = new Date()
    putLastMutedAt(newState.guild.id, user.id, getUnixTime(now))
  } else {
    debug(`user ${user.id} is unmuted, removing`)
    removeLastMutedAt(newState.guild.id, user.id,)
  }
}
import {
  SlashCommandSubcommandBuilder, userMention
} from "discord.js";
import discordJs from 'discord.js';
import { respondWithResult, userSuccess } from "../../core/response.js";
import { removeBrbFromUser } from "../../core/brb.js";
import { removeBrbStatus } from "../../db/brb.js";

export const definition = new SlashCommandSubcommandBuilder()
  .setName('wyczysc-status-brb')
  .setDescription('usuń BRB')
  .addUserOption((opt) => opt
    .setName('user')
    .setDescription('z kogo usunąć BRB')
    .setRequired(true)
  )

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<void>}
 */
export const handler = async (interaction) => {
  const user = interaction.options.getUser('user', true);
  const member = interaction.options.getMember('user');

  await removeBrbFromUser(member)
  await removeBrbStatus(interaction.guildId, user.id)

  return respondWithResult({
    interaction,
    msgOk: userSuccess(`usunięto status z BRB status z ${userMention(user.id)}`)
  })
}
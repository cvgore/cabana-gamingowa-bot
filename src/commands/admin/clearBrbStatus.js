import {
  SlashCommandSubcommandBuilder, userMention
} from "discord.js";
import discordJs from 'discord.js';
import { userSuccess } from "../../core/response.js"
import { removeBrbFromUser } from "../../core/brb.js";
import { removeBrbStatus } from "../../db/brb.js";

export const definition = new SlashCommandSubcommandBuilder()
  .setName('clear-brb-status')
  .setDescription('remove BRB status from user')
  .addUserOption((opt) => opt
    .setName('user')
    .setRequired(true)
  )

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<void>}
 */
export const handler = async (interaction) => {
  const user = interaction.options.getUser('name', true);
  const member = interaction.options.getMember('name');

  await removeBrbFromUser(member)
  await removeBrbStatus(interaction.guildId, user.id)

  await interaction.reply({
    content: userSuccess(`removed BRB status from ${userMention(user.id)}`),
    ephemeral: true
  })
}
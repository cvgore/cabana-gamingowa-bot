import {
  SlashCommandSubcommandBuilder
} from "discord.js";
import discordJs from 'discord.js';
import { respondWithResult } from "../../core/response.js";
import { putRandomEventsBlacklist } from "../../db/guild-settings.js";

export const definition = new SlashCommandSubcommandBuilder()
  .setName('czarna-lista')
  .setDescription('zarządzaj czarną listą eventów dla tego serwera')
  .addStringOption((opt) => opt
    .setName('value')
    .setDescription('wylistuj pozycję do wyjebania (wszystkie); lista oddzielana przecinkami')
    .setRequired(true)
  )

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<void>}
 */
export const handler = async (interaction) => {
  const csvList = interaction.options.getString('value', true);
  const blacklist = csvList.split(',');

  putRandomEventsBlacklist(interaction.guildId, blacklist);

  return respondWithResult({
    interaction,
  });
}
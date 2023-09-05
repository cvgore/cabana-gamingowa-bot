import discordJs, { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import packageJSON from "./../../../package.json" assert { type: "json" };
import { COMMIT_HASH, STARTUP_DATE } from "../../env.js";
import { formatRFC3339 } from "date-fns";
import { LOADING_RESPONSE_CHAR } from "../../core/response.js";
import debugCtor from "debug";

const debug = debugCtor("info-command");

export const definition = new SlashCommandBuilder()
  .setName("informacje")
  .setDescription("jaka wersja bota wariacie?");

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<void>}
 */
export const handler = async (interaction) => {
  const fields = [
    {
      name: "version",
      value: packageJSON.version
    },
    {
      name: "commit",
      value: COMMIT_HASH
    },
    {
      name: "uptime",
      value: formatRFC3339(STARTUP_DATE)
    },
    {
      name: "ws_ping",
      value: `${interaction.client.ws.ping}ms`
    },
    {
      name: "roundtrip_ping",
      value: LOADING_RESPONSE_CHAR
    }
  ];

  const embed = new EmbedBuilder()
    .setTitle(packageJSON.name)
    .setDescription(packageJSON.description)
    .setAuthor({
      name: packageJSON.author
    })
    .setFields(fields);

  const lastReply = await interaction.reply({
    embeds: [
      embed
    ],
    ephemeral: true,
    fetchReply: true
  });

  fields.find((x) => x.name === "roundtrip_ping").value =
    `${lastReply.createdTimestamp - interaction.createdTimestamp}ms`;

  embed.setFields(fields);

  return interaction.editReply({
    embeds: [
      embed
    ],
    ephemeral: true
  });
};
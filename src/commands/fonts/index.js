import {
  SlashCommandBuilder
} from "discord.js";

import * as fire from "fire.js";

export const definition = new SlashCommandBuilder()
  .setName("fonty")
  .setDescription("jakieś fajne fonty, 100% zajebane z neta")
;

export const subcommands = [
  fire,
];

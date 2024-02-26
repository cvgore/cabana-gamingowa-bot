import {
  SlashCommandBuilder
} from "discord.js";

import * as make from "./make.js";

export const definition = new SlashCommandBuilder()
  .setName("recepta")
  .setDescription("każdy czasem potrzebuje skonsultować")
;

export const subcommands = [
  make,
];

import {SlashCommandBuilder} from "discord.js"
import * as randomEventsDebugMode from "./randomEventsDebugMode.js"

export const definition = new SlashCommandBuilder()
  .setName('owner')
  .setDescription('komendy właściciela bota xd')

export const subcommands = [
  randomEventsDebugMode,
]
import {SlashCommandBuilder} from "discord.js"
import * as clearBrbStatus from "./randomEventsDebugMode.js"

export const definition = new SlashCommandBuilder()
  .setName('komendy-wlasciciela')
  .setDescription('komendy właściciela bota xd')

export const subcommands = [
  clearBrbStatus,
]
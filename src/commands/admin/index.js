import {SlashCommandBuilder} from "discord.js"
import * as clearBrbStatus from "./clearBrbStatus.js"

export const definition = new SlashCommandBuilder()
  .setName('admin')
  .setDescription('kałcion')
  .setDefaultMemberPermissions('0')

export const subcommands = [
  clearBrbStatus
]
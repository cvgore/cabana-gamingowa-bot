import {SlashCommandBuilder} from "discord.js"
import * as clearBrbStatus from "./clearBrbStatus.js"
import * as ytExtractorAdd from "./ytExtractorAdd.js"
import * as ytExtractorDel from "./ytExtractorDel.js"
import * as ytExtractorGet from "./ytExtractorGet.js"
import * as ytExtractorOff from "./ytExtractorOff.js"

export const definition = new SlashCommandBuilder()
  .setName('admin')
  .setDescription('kałcion')
  .setDefaultMemberPermissions('0')

export const subcommands = [
  clearBrbStatus,
  ytExtractorAdd,
  ytExtractorDel,
  ytExtractorGet,
  ytExtractorOff
]
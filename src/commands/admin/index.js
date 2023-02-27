import {SlashCommandBuilder} from "discord.js"
import * as view from "./view.js"
import * as add from "./add.js"
import * as put from "./put.js"

export const definition = new SlashCommandBuilder()
  .setName('admin')
  .setDescription('kałcion')
  .setDefaultMemberPermissions(0)

export const subcommands = [
  view,
  add,
  put
]
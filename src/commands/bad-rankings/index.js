import {SlashCommandBuilder} from "discord.js"
import * as view from "./view.js"
import * as add from "./add.js"
import * as put from "./put.js"

export const definition = new SlashCommandBuilder()
    .setName('rankingi')
    .setDescription('jaki ranking wariacie')

export const subcommands = [
    view,
    add,
    put
]
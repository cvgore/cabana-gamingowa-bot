import {CLIENT_ID, TOKEN, GUILD_ID} from "./env.js";
import {REST, Routes} from "discord.js";
import {BOT_COMMANDS_REGISTRABLE} from "./commands/index.js";
import { logger } from "./logger.js";
import debugCtor from 'debug';

const debug = debugCtor('rest')

const rest = new REST({
    version: '10'
}).setToken(TOKEN);

export async function init() {
    try {
        logger.info('Started refreshing slash commands.');
        debug('list of commands %o', BOT_COMMANDS_REGISTRABLE);

        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
            body: BOT_COMMANDS_REGISTRABLE
        });

        logger.info('Successfully reloaded slash commands.');
    } catch (error) {
        logger.error(`There was a problem while reloading slash commands: ${error}`);
    }
}

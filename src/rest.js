import {CLIENT_ID, TOKEN} from "./env.js";
import {REST, Routes} from "discord.js";
import {BOT_COMMANDS_REGISTRABLE} from "./commands/index.js";
import { logger } from "./logger.js";
import debugCtor from 'debug';
import { GUILD_IDS } from "./guild.js";

const debug = debugCtor('rest')

const rest = new REST({
    version: '10'
}).setToken(TOKEN);

export async function init() {
    try {
        logger.info('started refreshing slash commands');
        debug('list of commands %o', BOT_COMMANDS_REGISTRABLE);

        GUILD_IDS.forEach((guildId) => {
            debug('registering cmds for guildId=%o', guildId);
            rest.put(Routes.applicationGuildCommands(CLIENT_ID, guildId), {
                body: BOT_COMMANDS_REGISTRABLE
            }).then(() => debug('registered cmds for guildId=%o', guildId));
        })

        logger.info('successfully reloaded slash commands');
    } catch (error) {
        logger.error(`there was a problem while reloading slash commands: ${error}`);
    }
}

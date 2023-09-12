import {Client, GatewayIntentBits} from "discord.js";

import {TOKEN} from "./env.js";
import {BOT_COMMANDS} from "./commands/index.js";
import {fatalError, invalidCommand} from "./core/response.js";
import {logger} from "./logger.js";
import debugCtor from "debug";
import { parseCustomIdShortInvocation } from "./core/helpers.js";

const debug = debugCtor('client')

export const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences]
});

client.on('ready', () => {
    logger.info(`logged in as ${client.user.tag}`);

    debug('registering gateway handlers')
    BOT_COMMANDS.forEach((cmd) => {
        if ('voiceStateUpdateHandler' in cmd) {
            debug('registering voiceStateUpdateHandler for %j', cmd.definition.name)

            client.on(
              'voiceStateUpdate',
              (...args) => cmd.voiceStateUpdateHandler(...args)
            )
        }

        if ('presenceUpdateHandler' in cmd) {
            debug('registering presenceUpdateHandler for %j', cmd.definition.name)

            client.on(
              'presenceUpdate',
              (...args) => cmd.presenceUpdateHandler(...args)
            )
        }

        if ('messageCreateHandler' in cmd) {
            debug('registering messageCreateHandler for %j', cmd.definition.name)

            client.on(
              'messageCreate',
              (...args) => cmd.messageCreateHandler(...args)
            )
        }
    })
});

async function handleChatInputCommand(interaction) {
    if (!BOT_COMMANDS.has(interaction.commandName)) {
        await interaction.reply({ content: invalidCommand(), ephemeral: true })
        return
    }

    const command = BOT_COMMANDS.get(interaction.commandName)
    const subcommandName = interaction.options.getSubcommand(false)

    debug('lookup %o cmd / %o subCmd', interaction.commandName, subcommandName)

    if (command.subcommands.size === 0 || !subcommandName) {
        try {
            return command.handler(interaction)
        } catch (ex) {
            logger.error(`error during command invocation ${ex}`)
            debug(ex)
            return interaction.reply({ content: fatalError('nieznany błąd'), ephemeral: true })
        }
    }

    if (! command.subcommands.has(subcommandName)) {
        return interaction.reply({ content: invalidCommand(), ephemeral: true })
    }

    const subcommand = command.subcommands.get(subcommandName)

    try {
        return subcommand.handler(interaction)
    } catch (ex) {
        logger.error(`error during command invocation ${ex}`)
        debug(ex)
        return interaction.reply({ content: fatalError('nieznany błąd'), ephemeral: true })
    }
}

async function handleAutocomplete(interaction) {
    if (!BOT_COMMANDS.has(interaction.commandName)) {
        return interaction.reply({ content: invalidCommand(), ephemeral: true })
    }

    const command = BOT_COMMANDS.get(interaction.commandName)
    const subcommandName = interaction.options.getSubcommand(false)

    debug('lookup %o cmd / %o subCmd', interaction.commandName, subcommandName)

    if (command.subcommands.size === 0 || !subcommandName) {
        try {
            return command.autocompleteHandler(interaction)
        } catch (ex) {
            logger.error(`error during command invocation ${ex}`)
            debug(ex)
            return interaction.reply({ content: fatalError('nieznany błąd'), ephemeral: true })
        }
    }

    if (! command.subcommands.has(subcommandName)) {
        return interaction.reply({ content: invalidCommand(), ephemeral: true })
    }

    const subcommand = command.subcommands.get(subcommandName)

    try {
        return subcommand.autocompleteHandler(interaction)
    } catch (ex) {
        logger.error(`error during command invocation ${ex}`)
        debug(ex)
        return interaction.reply({ content: fatalError('nieznany błąd'), ephemeral: true })
    }
}

async function handleButtonInteraction(interaction) {
    const invocation = parseCustomIdShortInvocation(interaction.customId);

    if (!invocation) {
        return;
    }

    debug('lookup %o invocation', interaction.customId);

    const {commandName} = invocation;

    if (!BOT_COMMANDS.has(commandName)) {
        return interaction.reply({ content: invalidCommand(), ephemeral: true })
    }

    const command = BOT_COMMANDS.get(commandName)

    try {
        return command.buttonInteractionHandler(interaction)
    } catch (ex) {
        logger.error(`error during command invocation ${ex}`)
        debug(ex)
        return interaction.reply({ content: fatalError('nieznany błąd'), ephemeral: true })
    }
}

client.on('interactionCreate', async (interaction) => {
    if (
        !interaction.isChatInputCommand()
        && !interaction.isAutocomplete()
        && !interaction.isButton()
    ) return

    if (interaction.isButton()) {
        return handleButtonInteraction(interaction);
    }

    if (interaction.isChatInputCommand()) {
        return handleChatInputCommand(interaction);
    }

    if (interaction.isAutocomplete()) {
        return handleAutocomplete(interaction);
    }
});

export async function init() {
    return client.login(TOKEN);
}
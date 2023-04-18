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
    logger.info(`Logged in as ${client.user.tag}!`);

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
            await command.handler(interaction)
        } catch (ex) {
            logger.error(`error during command invocation ${ex}`)
            debug(ex)
            await interaction.reply({ content: fatalError('nieznany błąd'), ephemeral: true })
            return
        }

        return
    }

    if (! command.subcommands.has(subcommandName)) {
        await interaction.reply({ content: invalidCommand(), ephemeral: true })
        return
    }

    const subcommand = command.subcommands.get(subcommandName)

    try {
        await subcommand.handler(interaction)
    } catch (ex) {
        logger.error(`error during command invocation ${ex}`)
        debug(ex)
        await interaction.reply({ content: fatalError('nieznany błąd'), ephemeral: true })
        return
    }
}

async function handleAutocomplete(interaction) {
    if (!BOT_COMMANDS.has(interaction.commandName)) {
        await interaction.reply({ content: invalidCommand(), ephemeral: true })
        return
    }

    const command = BOT_COMMANDS.get(interaction.commandName)
    const subcommandName = interaction.options.getSubcommand(false)

    debug('lookup %o cmd / %o subCmd', interaction.commandName, subcommandName)

    if (command.subcommands.size === 0 || !subcommandName) {
        try {
            await command.autocompleteHandler(interaction)
        } catch (ex) {
            logger.error(`error during command invocation ${ex}`)
            debug(ex)
            await interaction.reply({ content: fatalError('nieznany błąd'), ephemeral: true })
            return
        }

        return
    }

    if (! command.subcommands.has(subcommandName)) {
        await interaction.reply({ content: invalidCommand(), ephemeral: true })
        return
    }

    const subcommand = command.subcommands.get(subcommandName)

    try {
        await subcommand.autocompleteHandler(interaction)
    } catch (ex) {
        logger.error(`error during command invocation ${ex}`)
        debug(ex)
        await interaction.reply({ content: fatalError('nieznany błąd'), ephemeral: true })
        return
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
        await interaction.reply({ content: invalidCommand(), ephemeral: true })
        return
    }

    const command = BOT_COMMANDS.get(commandName)

    try {
        await command.buttonInteractionHandler(interaction)
    } catch (ex) {
        logger.error(`error during command invocation ${ex}`)
        debug(ex)
        await interaction.reply({ content: fatalError('nieznany błąd'), ephemeral: true })
        return
    }
}

client.on('interactionCreate', async (interaction) => {
    if (
        !interaction.isChatInputCommand()
        && !interaction.isAutocomplete()
        && !interaction.isButton()
    ) return

    if (interaction.isButton()) {
        await handleButtonInteraction(interaction);
        return
    }

    if (interaction.isChatInputCommand()) {
        await handleChatInputCommand(interaction);
        return
    }

    if (interaction.isAutocomplete()) {
        await handleAutocomplete(interaction);
        return
    }
});

export async function init() {
    await client.login(TOKEN);
}
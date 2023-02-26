import {inlineCode, SlashCommandBuilder} from "discord.js"
import {userInputError, userSuccess} from "../../core/response.js"
import {randomInt as nativeRandomInt} from 'crypto'
import {promisify} from 'util'
import discordJs from "discord.js";

const randomInt = promisify(nativeRandomInt)

export const definition = new SlashCommandBuilder()
    .setName('kostka')
    .setDescription('ciulnij kostką (niesymetryczną) - min <= N <= max')
    .addNumberOption((opt) => opt
      .setName('min')
      .setDescription('minimalna wartość')
    )
    .addNumberOption((opt) => opt
      .setName('max')
      .setDescription('maksymalna wartość')
    )

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<void>}
 */
export const handler = async (interaction) => {
    const min = interaction.options.getNumber('min') ?? 1;
    const max = interaction.options.getNumber('max') ?? 6;

    if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max + 1)) {
        await interaction.reply({
            content: userInputError(`min lub max jest kurwa zbyt gigantyczne`),
            ephemeral: true,
        })
        return
    }

    if (min >= max) {
        await interaction.reply({
            content: userInputError(`min jest większe od max`),
            ephemeral: true,
        })
        return
    }

    const value = await randomInt(min, max + 1)

    await interaction.reply({
        content: userSuccess(`🎲 twój szczęśliwy numerek to ${inlineCode(value)} 🎲`),
    })
}
import {ChannelType, SlashCommandBuilder, userMention} from "discord.js"
import {userInputError, userSuccess} from "../../core/response.js"
import {randomInt as nativeRandomInt} from 'crypto'
import {promisify} from 'util'
import discordJs from "discord.js";

const randomInt = promisify(nativeRandomInt)

export const definition = new SlashCommandBuilder()
    .setName('losuj-gracza')
    .setDescription('wybierz losowo gracza z kanału')
    .addChannelOption((opt) => opt
        .setName('channel')
         .setDescription('kanał z jakiego pobrać członków')
        .setRequired(true)
        .addChannelTypes(
            ChannelType.GuildText
                | ChannelType.GuildVoice
        )
    )

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<void>}
 */
export const handler = async (interaction) => {
    const channel = interaction.options.getChannel('channel', true);
    const members = channel.members

    if (members.size < 2) {
        await interaction.reply({
            content: userInputError(`nie ma z kogo wybierać :<`),
            ephemeral: true,
        })
    }

    let value = await randomInt(0, members.size)
    const keys = members.keys()
    while (--value > 0) {
        keys.next()
    }

    const selected = keys.next().value

    await interaction.reply({
        content: userSuccess(`🎲 wylosowano ${userMention(selected)} 🎲`),
    })
}
import {
    SlashCommandSubcommandBuilder,
} from "discord.js"
import discordJs from 'discord.js';
import {getBadRankings, putBadRankingById, putBadRankings} from "../../db/bad-rankings.js"
import {userError, userSuccess} from "../../core/response.js"
import {randomUUID} from 'crypto'

export const definition = new SlashCommandSubcommandBuilder()
    .setName('dodaj')
    .setDescription('nowiuśki bad ranking')
    .addStringOption((opt) => opt
        .setName('name')
      .setDescription('nazwa rankingu')
        .setRequired(true)
    )

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<void>}
 */
export const handler = async (interaction) => {
    const name = interaction.options.getString('name', true);

    const rankings = await getBadRankings(interaction.guildId) ?? {}

    if (rankings && name in rankings) {
        await interaction.reply({
            content: userError(`ranking o nazwie ${name} już istnieje`),
            ephemeral: true,
        })
        return
    }

    const uuid = randomUUID();

    await putBadRankings(interaction.guildId, {
        ...rankings,
        [uuid]: name,
    })

    await putBadRankingById(interaction.guildId, uuid, {
        name,
        points: {},
        updatedAt: new Date().valueOf(),
        updatedBy: interaction.user.id,
    })

    await interaction.reply({
        content: userSuccess(`ranking "${name}" dodany`),
        ephemeral: true,
    })
}
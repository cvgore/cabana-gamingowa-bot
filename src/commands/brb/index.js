import {
  SlashCommandSubcommandBuilder, time, userMention
} from "discord.js";
import discordJs from 'discord.js';
import { userInputError, userSuccess } from "../../core/response.js";
import { getBrbStatus, putBrbStatus } from "../../db/brb.js";
import { addToScheduleBrb } from "../../scheduler/brb.js";
import { addMinutes, fromUnixTime, getUnixTime, isAfter } from "date-fns";
import { setBrbToUser } from "../../core/brb.js";
import debugCtor from "debug";

const debug = debugCtor("cmd:brb");


export const definition = new SlashCommandSubcommandBuilder()
  .setName('zw')
  .setDescription('ustaw zaraz wracam')
  .addNumberOption((opt) => opt
    .setName('mins')
    .setDescription('ile minut zw')
    .setMinValue(1)
    .setMaxValue(999)
    .setRequired(true)
  )

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<void>}
 */
export const handler = async (interaction) => {
  const mins = interaction.options.getNumber('mins', true);

  if (!Number.isSafeInteger(mins)) {
    return interaction.reply({
      content: userInputError('mins musi być liczbą całkowitą'),
    });
  }

  const replySuccess = async (expectedTime) => {
    await interaction.reply({
      content: userSuccess(
        `ustawiono zw "${userMention(interaction.user.id)} na "${mins}" minut - kończy się o "${time(expectedTime)}"`
      ),
    })
  }

  const brbEndsAt = await getBrbStatus(
    interaction.guildId,
    interaction.user.id
  )

  const now = new Date()
  const expectedTime = addMinutes(now, mins)
  const guildMember = await interaction.guild.members.fetch(interaction.user.id)


  if (brbEndsAt === null || isAfter(now, fromUnixTime(brbEndsAt))) {
    debug("set brb - missing entry or outdated");

    await putBrbStatus(interaction.guildId, interaction.user.id, getUnixTime(expectedTime))
    addToScheduleBrb(interaction.guildId, interaction.user.id, expectedTime)
    await setBrbToUser(guildMember, mins)

    return replySuccess(getUnixTime(expectedTime))
  }

  if (mins < 1) {
    return interaction.reply({
      content: userInputError('aktualizacja zw musi być większa od 1'),
    });
  }

  await putBrbStatus(interaction.guildId, interaction.user.id, getUnixTime(expectedTime))
  await setBrbToUser(guildMember, mins)
}
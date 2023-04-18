import {
  ActionRowBuilder,
  ButtonBuilder, ButtonStyle, quote,
  SlashCommandBuilder, time
} from "discord.js";
import discordJs from 'discord.js';
import { userCancelled, userInputError, userSuccess } from "../../core/response.js";
import { addMinutes, format, getUnixTime, set } from "date-fns";
import debugCtor from "debug";
import { createCustomIdShortInvocation, emojifyNumber, parseCustomIdShortInvocation } from "../../core/helpers.js";
import { getRemindList, popRemindList, pushRemindList } from "../../db/remind.js";
import { logger } from "../../logger.js";

const REMIND_TIME_OFFSETS = [
  2, 3, 4,
  5, 10, 15, 20,
  30,
  45, 60,
  90, 120,
  180,
]

const debug = debugCtor("cmd:remind");

export const definition = new SlashCommandBuilder()
  .setName('przypomnij')
  .setDescription('we mi kurde panie ferdku przypomnij za chwile')
  .addNumberOption((opt) => opt
    .setName('mins')
    .setDescription('za ile minut cie pingnąć?')
    .setMinValue(2)
    .setMaxValue(999)
    .setAutocomplete(true)
    .setRequired(true)
  )
  .addStringOption((opt) => opt
    .setName('what')
    .setDescription('czego chcesz?')
    .setMaxLength(128)
    .setRequired(false)
  )

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<void>}
 */
export const handler = async (interaction) => {
  const mins = interaction.options.getNumber('mins', true);
  const what = interaction.options.getString('what');

  if (!Number.isSafeInteger(mins)) {
    return interaction.reply({
      content: userInputError('liczba minut musi być liczbą całkowitą'),
      ephemeral: true,
    });
  }

  if (mins <= 1) {
    return interaction.reply({
      content: userInputError('liczba minut musi być większa od 1'),
      ephemeral: true,
    });
  }

  const replySuccess = async (expectedTime, what, remindId) => {
    const ephemeral = true;
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId(
          createCustomIdShortInvocation('cancel', { id: remindId })
        )
        .setLabel('Anuluj')
        .setStyle(ButtonStyle.Danger)
      );
    const components = [row];

    if (what) {
      return interaction.reply({
        content: userSuccess(
          `ustawiono przypominajke - za ${emojifyNumber(mins)} minut czyli o godzinie ${time(expectedTime, 'T')} przypomne ci o:\n` +
          `${quote(what)}`
        ),
        ephemeral,
        components,
      })
    }

    return interaction.reply({
      content: userSuccess(
        `ustawiono przypominajke - za ${emojifyNumber(mins)} minut czyli o godzinie ${time(expectedTime, 'T')} ` +
        `przypomne ci o.. czymś ale nie wiem o czym bo chuju nie zdradziłeś żadnych szczegółów`
      ),
      ephemeral,
      components,
    })
  }

  const remindAtDate = set(addMinutes(new Date(), mins), {
    seconds: 0,
    milliseconds: 0,
  });
  const remindAtDateMs = getUnixTime(remindAtDate)

  pushRemindList(
    interaction.guildId,
    interaction.user.id,
    {
      what,
      time: remindAtDate
    }
  );

  return replySuccess(remindAtDateMs);
}

/**
* @param {discordJs.AutocompleteInteraction} interaction
* @return {Promise<void>}
*/
export const autocompleteHandler =  async (interaction) => {
  const now = new Date()
  const rawValue = interaction.options.getFocused() || '0'
  const value = parseInt(rawValue, 10)
  const allOffsets = value && !isNaN(value) && isFinite(value) && value > 0
    ? [value,...REMIND_TIME_OFFSETS]
    : REMIND_TIME_OFFSETS

  await interaction.respond(
    allOffsets
      .map((minsAdd) => {
        const offsetDate = addMinutes(now, minsAdd)
        const timeString = format(offsetDate, 'kk:mm')
        return {
          value: minsAdd,
          name: `${timeString} (${minsAdd} minut)`
        }
      })
  )
}

/**
 * @param {discordJs.ButtonInteraction} interaction
 * @return {Promise<void>}
 */
export const buttonInteractionHandler = async (interaction) => {
  const invocation = parseCustomIdShortInvocation(interaction.customId);

  if (!invocation || !['cancel'].includes(invocation.action)) {
    logger.warn('invalid button interaction invocation received', { invocation });
    return;
  }

  if (!invocation.params.id) {
    logger.warn('invalid cancel invocation received, missing id', { invocation });
    return;
  }

  const list = getRemindList(interaction.guildId, interaction.user.id);

  if (!list.find(x => x.id === invocation.params.id)) {
    return interaction.followUp({
      content: userInputError('ta przypominajka już wygasła lub nie istnieje'),
      ephemeral: true,
    });
  }

  popRemindList(interaction.guildId, interaction.user.id, invocation.params.id);

  return interaction.followUp({
    content: userCancelled('anulowano tą przypominajkę!'),
    ephemeral: true,
  });
}
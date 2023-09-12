import discordJs, {
  EmbedBuilder,
  SlashCommandBuilder, time, userMention
} from "discord.js";
import { respondWithResult, userAttention, userInputError, userSuccess } from "../../core/response.js";
import { getBrbStatus, putBrbStatus } from "../../db/brb.js";
import { addToScheduleBrb } from "../../scheduler/brb.js";
import { addMinutes, format, fromUnixTime, getUnixTime, isAfter, set } from "date-fns";
import { setBrbToUser } from "../../core/brb.js";
import debugCtor from "debug";
import { emojifyNumber } from "../../core/helpers.js";

const BRB_TIME_OFFSETS = [
  5, 10, 15, 20,
  30,
  45, 60,
  90
];

const debug = debugCtor("cmd:brb");

export const definition = new SlashCommandBuilder()
  .setName("zw")
  .setDescription("ustaw zaraz wracam")
  .addNumberOption((opt) => opt
    .setName("mins")
    .setDescription("ile minut zw")
    .setMinValue(2)
    .setMaxValue(999)
    .setAutocomplete(true)
    .setRequired(true)
  );

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<void>}
 */
export const handler = async (interaction) => {
  const mins = interaction.options.getNumber("mins", true);

  if (!Number.isSafeInteger(mins)) {
    return respondWithResult({
      interaction,
      result: false,
      msgFail: userInputError("mins musi być liczbą całkowitą")
    });
  }

  if (mins <= 1) {
    return respondWithResult({
      interaction,
      result: false,
      msgFail: userInputError("zw musi być większa od 1")
    });
  }

  const replySuccess = async (expectedTime) => {
    return respondWithResult({
      interaction,
      result: true,
      msgOk: userSuccess(
        `ustawiono zw ${userMention(interaction.user.id)} na ${emojifyNumber(mins)} minut - kończy się o ${time(expectedTime)}`
      ),
      hidden: false
    });
  };

  const brbEndsAt = await getBrbStatus(
    interaction.guildId,
    interaction.user.id
  );
  const brbEndsAtDate = fromUnixTime(brbEndsAt);

  const now = new Date();
  const expectedTime = set(addMinutes(now, mins), {
    seconds: 0,
    milliseconds: 0
  });
  const expectedTimeTs = getUnixTime(expectedTime);
  const guildMember = await interaction.guild.members.fetch(interaction.user.id);

  if (brbEndsAt === null || isAfter(now, brbEndsAtDate)) {
    debug("set brb - missing entry or outdated");

    await putBrbStatus(interaction.guildId, interaction.user.id, expectedTimeTs);
    addToScheduleBrb(interaction.guildId, interaction.user.id, expectedTime);
    await setBrbToUser(guildMember, mins);

    return replySuccess(expectedTimeTs);
  }

  await putBrbStatus(interaction.guildId, interaction.user.id, expectedTimeTs);
  await setBrbToUser(guildMember, mins);

  return replySuccess(expectedTimeTs);
};

/**
 * @param {discordJs.AutocompleteInteraction} interaction
 * @return {Promise<void>}
 */
export const autocompleteHandler = async (interaction) => {
  const now = new Date();
  const rawValue = interaction.options.getFocused() || "0";
  const value = parseInt(rawValue, 10);
  const allOffsets = value && !isNaN(value) && isFinite(value) && value > 0
    ? [value, ...BRB_TIME_OFFSETS]
    : BRB_TIME_OFFSETS;

  return interaction.respond(
    allOffsets
      .map((minsAdd) => {
        const offsetDate = addMinutes(now, minsAdd);
        const timeString = format(offsetDate, "kk:mm");
        return {
          value: minsAdd,
          name: `${timeString} (${minsAdd} minut)`
        };
      })
  );
};

/**
 * @param {discordJs.Message} message
 * @return {Promise<void>}
 */
export const messageCreateHandler = async (message) => {
  const brbStatus = message.mentions.members
    .filter((member) => member.user.id !== message.author.id)
    .map(
      (member) => getBrbStatus(message.guildId, member.user.id)
    ).filter((x) => x);

  if (brbStatus.length > 0) {
    const list = brbStatus.map((x) => `- ${userMention(x)}\n`);

    return message.reply({
      content: userAttention(`niektórzy nie chcą szprechać tera i są zw:\n${list}`)
    });
  }
};
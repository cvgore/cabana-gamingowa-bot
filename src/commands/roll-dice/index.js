import discordJs, { inlineCode, SlashCommandBuilder } from "discord.js";
import { respondWithResult, userInputError, userSuccess } from "../../core/response.js";
import { randomInt as nativeRandomInt } from "crypto";
import { promisify } from "util";
import { emojifyNumber } from "../../core/helpers.js";

const randomInt = promisify(nativeRandomInt);

export const definition = new SlashCommandBuilder()
  .setName("kostka")
  .setDescription("ciulnij kostką (niesymetryczną) - min <= N <= max")
  .addNumberOption((opt) => opt
    .setName("min")
    .setDescription("minimalna wartość")
  )
  .addNumberOption((opt) => opt
    .setName("max")
    .setDescription("maksymalna wartość")
  );

/**
 * @param {discordJs.Interaction} interaction
 * @return {Promise<void>}
 */
export const handler = async (interaction) => {
  const min = interaction.options.getNumber("min") ?? 1;
  const max = interaction.options.getNumber("max") ?? 6;

  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max + 1)) {
    return respondWithResult({
      interaction,
      result: false,
      msgFail: userInputError(`min lub max jest kurwa zbyt gigantyczne`)
    });
  }

  if (min >= max) {
    return respondWithResult({
      interaction,
      result: false,
      msgFail: userInputError(`min jest większe od max`)
    });
  }

  const value = await randomInt(min, max + 1);

  return respondWithResult({
    interaction,
    msgOk: userSuccess(`🎲 twój szczęśliwy numerek to ${emojifyNumber(value)} 🎲`),
    hidden: false
  });
};
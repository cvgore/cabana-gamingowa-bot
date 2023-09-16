import discordJs from "discord.js";

/**
 * @param {string} msg
 */
export const userError = (msg) => {
  return `👺 ło panie! ${msg}`;
};

/**
 * @param {string} msg
 */
export const userSuccess = (msg) => {
  return `🏆 sztos! ${msg}`;
};

/**
 * @param {string} msg
 */
export const userAttention = (msg) => {
  return `❣️ ${msg}`;
};

/**
 * @param {string} msg
 */
export const userCancelled = (msg) => {
  return `😿 yhyhyhy! ${msg}`;
};

/**
 * @param {string} msg
 */
export const userInputError = (msg) => {
  return `💢 ty głupku jebany ty! ${msg}`;
};

export const invalidCommand = () => {
  return `🤷‍♂️ kurde panie ferdku no ja nie wiem co ty chcesz!`;
};

export const fatalError = (msg) => {
  return `️👾 ała kurwa rzeczywiście! ${msg}`;
};

export const notAnOwner = () => {
  return `💢 za bramę już, masz za mało punktów siły aby używać tego spela!`;
};

export const LOADING_RESPONSE_CHAR = "🔄";

/**
 * @param {boolean} result
 * @param {discordJs.Interaction} interaction
 * @param {string|null} msgFail
 * @param {string|null} msgOk
 * @param {boolean|null} hidden
 */
export const respondWithResult = async ({
  interaction,
  result = true,
  msgFail = null,
  msgOk = null,
  hidden = true,
}) => {
  if (result) {
    return interaction.reply({
      content: msgOk ?? userSuccess(`operacja wykonana pomyślnie`),
      ephemeral: hidden,
    });
  }

  return interaction.reply({
    content: msgFail ?? userError(`operacja zakończona niepowodzeniem`),
    ephemeral: hidden,
  });
};

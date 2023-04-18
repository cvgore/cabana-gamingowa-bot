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

export const LOADING_RESPONSE_CHAR = "🔄";

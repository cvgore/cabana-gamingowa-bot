const database = {};
function makeKey(guildId, userId) {
  return `${guildId}::${userId}`;
}

/**
 * @param {string} guildId
 * @param {string} userId
 * @return {number|null}
 */
export function getLastMutedAt(guildId, userId) {
  const value = database[makeKey(guildId, userId)] ?? null;

  return Number.isSafeInteger(value) ? value : null;
}

/**
 * @param {string} guildId
 * @param {string} userId
 * @param {number} value
 */
export function putLastMutedAt(guildId, userId, value) {
  database[makeKey(guildId, userId)] = value;
}

/**
 * @param {string} guildId
 * @param {string} userId
 */
export function removeLastMutedAt(guildId, userId) {
  delete database[makeKey(guildId, userId)];
}

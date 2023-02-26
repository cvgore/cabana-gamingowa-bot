import { mutedDatabase, dbEnv } from "./index.js";

function makeKey(guildId, userId) {
  return `${guildId}::${userId}`;
}

/**
 * @param {string} guildId
 * @param {string} userId
 * @return {number|null}
 */
export function getLastMutedAt(guildId, userId) {
  const tx = dbEnv.beginTxn();

  const value = tx.getNumber(mutedDatabase, makeKey(guildId, userId), {
    keyIsString: true,
  });

  tx.commit();

  return Number.isSafeInteger(value) ? value : null;
}

/**
 * @param {string} guildId
 * @param {string} userId
 * @param {number} value
 */
export function putLastMutedAt(guildId, userId, value) {
  const tx = dbEnv.beginTxn();

  tx.putNumber(mutedDatabase, makeKey(guildId, userId), value, {
    keyIsString: true,
  });

  tx.commit();
}

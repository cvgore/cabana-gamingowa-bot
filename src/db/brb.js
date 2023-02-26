import { brbDatabase, dbEnv } from "./index.js";

function makeKey(guildId, userId) {
  return `${guildId}::${userId}`;
}

/**
 * @param {string} guildId
 * @param {string} userId
 * @return {number|null}
 */
export function getBrbStatus(guildId, userId) {
  const tx = dbEnv.beginTxn();

  const value = tx.getNumber(brbDatabase, makeKey(guildId, userId), {
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
export function putBrbStatus(guildId, userId, value) {
  const tx = dbEnv.beginTxn();

  tx.putNumber(brbDatabase, makeKey(guildId, userId), value, {
    keyIsString: true,
  });

  tx.commit();
}

/**
 * @param {string} guildId
 * @param {string} userId
 */
export function removeBrbStatus(guildId, userId) {
  const tx = dbEnv.beginTxn();

  tx.del(brbDatabase, makeKey(guildId, userId), {
    keyIsString: true,
  });

  tx.commit();
}

import { randomUUID } from "crypto";

/**
 * @typedef {Object} RemindListEntry
 * @property {string} id
 * @property {Date} time
 * @property {string|null} what
 */

/**
 * @type {{[key: string]: RemindListEntry[]}}
 */
const database = {};
/**
 * @type {{[key: string]: true}}
 */
const keys = {};
function makeKey(guildId, userId) {
  return `${guildId}::${userId}`;
}

/**
 * @return {{[p: string]: RemindListEntry[]}}
 */
export function getAllRemindEntries() {
  return database;
}

/**
 * @param {string} guildId
 * @param {string} userId
 * @return {RemindListEntry[]}
 */
export function getRemindList(guildId, userId) {
  const value = database[makeKey(guildId, userId)] ?? [];

  return Array.isArray(value) ? value : [];
}

/**
 * @param {string} guildId
 * @param {string} userId
 * @param {Omit<RemindListEntry, 'id'>} value
 * @return {string} id
 */
export function pushRemindList(guildId, userId, value) {
  const key = makeKey(guildId, userId);
  const id = randomUUID();
  if (!Array.isArray(database[key])) {
    database[key] = [];
    keys[key] = true;
  }
  database[key].push({
    ...value,
    id,
  });

  return id;
}

/**
 * @param {string} guildId
 * @param {string} userId
 * @param {string} remindId
 */
export function popRemindList(guildId, userId, remindId) {
  const key = makeKey(guildId, userId);

  if (!database[key]) {
    return;
  }

  database[key] = database[key].filter((x) => x.id !== remindId);
}

/**
 * @param {string} guildId
 * @param {string} userId
 */
export function removeRemindList(guildId, userId) {
  const key = makeKey(guildId, userId);
  delete database[key];
  delete keys[key];
}
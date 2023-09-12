import lmdb from "node-lmdb";
import * as path from "path";
import { fileURLToPath } from "url";
import { logger } from "../logger.js";
import { promisify } from "util";

export const directory = path.join(
  fileURLToPath(new URL(".", import.meta.url)),
  "..",
  "..",
  "storage",
  "db"
);

logger.info(`DB location path: ${directory}`);

export const dbEnv = new lmdb.Env();

dbEnv.open({
  path: directory,
  mapSize: 10 * 1024 * 1024,
  maxDbs: 128,
});

export const badRankingCreditsDatabase = dbEnv.openDbi({
  name: "badRankings",
  create: true,
});

export const brbDatabase = dbEnv.openDbi({
  name: "brb",
  create: true,
});

export const mutedDatabase = dbEnv.openDbi({
  name: "muted",
  create: true,
});

export const guildSettingsDatabase = dbEnv.openDbi({
  name: "guildSettings",
  create: true,
});

export const ytExtractorDatabase = dbEnv.openDbi({
  name: "ytExtractor",
  create: true,
});

/**
 *
 * @param {lmdb.Dbi} dbInstance
 * @param {string} key
 * @param {string|null} nil
 * @returns {string|null}
 */
export function getStringFromDb(dbInstance, key, nil = null) {
  const tx = dbEnv.beginTxn({ readonly: true });

  const value = tx.getString(dbInstance, key, {
    keyIsString: true,
  });

  tx.commit();

  return value ?? nil;
}

/**
 * @param {lmdb.Dbi} dbInstance
 * @param {string} key
 * @param {number|null} nil
 * @returns {number|null}
 */
export function getNumberFromDb(dbInstance, key, nil = null) {
  const tx = dbEnv.beginTxn({ readonly: true });

  const value = tx.getNumber(dbInstance, key, {
    keyIsString: true,
  });

  tx.commit();

  return value ?? nil;
}

/**
 * @param {lmdb.Dbi} dbInstance
 * @param {string} key
 * @param {number} value
 * @returns {void}
 */
export function putNumberInDb(dbInstance, key, value) {
  const tx = dbEnv.beginTxn();

  tx.putNumber(dbInstance, key, value, {
    keyIsString: true,
  });

  tx.commit();
}

/**
 * @param {lmdb.Dbi} dbInstance
 * @param {string} key
 * @param {string} value
 * @returns {void}
 */
export function putStringInDb(dbInstance, key, value) {
  const tx = dbEnv.beginTxn();

  tx.putString(dbInstance, key, value, {
    keyIsString: true,
  });

  tx.commit();
}

/**
 * @param {lmdb.Dbi} dbInstance
 * @param {string} key
 * @returns {void}
 */
export function deleteKeyFromDb(dbInstance, key) {
  const tx = dbEnv.beginTxn();

  tx.del(dbInstance, key, {
    keyIsString: true,
  });

  tx.commit();
}

export function makeGuildedKey(guildId, entityId) {
  return `${guildId}::${entityId}`;
}

export async function* scanKeys(dbInstance, key) {
  const txn = dbEnv.beginTxn({ readonly: true });
  const cursor = new lmdb.Cursor(txn, dbInstance, { keyIsString: true });

  for (
    let found = cursor.goToRange(key);
    found !== null;
    found = cursor.goToNext()
  ) {
    if (found !== key) break;

    const [key, value] = await promisify(cursor.getCurrentString)();

    yield { key, value };
  }

  cursor.close();
  txn.commit();
}

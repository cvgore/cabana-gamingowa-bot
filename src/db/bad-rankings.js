import { badRankingCreditsDatabase, dbEnv } from "./index.js";

/**
 * @typedef {Object} RankingData
 * @property {string} name
 * @property {number} updatedAt
 * @property {string} updatedBy
 * @property {{[key: string]: number}} points
 */

function makeKey(guildId, rankingId) {
  return `${guildId}::${rankingId}`;
}

function makeConfigKey(guildId, rankingId) {
  return `${guildId}::${rankingId}.config`;
}

/**
 * @param {string} guildId
 * @return {{[key: string]: string} | null}
 */
export function getBadRankings(guildId) {
  const tx = dbEnv.beginTxn();

  const value = tx.getString(
    badRankingCreditsDatabase,
    makeKey(guildId, "all"),
    {
      keyIsString: true,
    }
  );

  tx.commit();

  return value ? JSON.parse(value) : null;
}

/**
 * @param {string} guildId
 * @param {RankingData} data
 */
export function putBadRankings(guildId, data) {
  const tx = dbEnv.beginTxn();

  tx.putString(
    badRankingCreditsDatabase,
    makeKey(guildId, "all"),
    JSON.stringify(data),
    {
      keyIsString: true,
    }
  );

  tx.commit();
}

/**
 *
 * @param {string} guildId
 * @param {string} rankingId
 * @return {RankingData|null}
 */
export function getBadRankingById(guildId, rankingId) {
  const tx = dbEnv.beginTxn();

  const value = tx.getString(
    badRankingCreditsDatabase,
    makeKey(guildId, rankingId),
    {
      keyIsString: true,
    }
  );

  tx.commit();

  return value ? JSON.parse(value) : null;
}

export function getBadRankingConfigById(guildId, rankingId) {
  const tx = dbEnv.beginTxn();

  const value = tx.getString(
    badRankingCreditsDatabase,
    makeConfigKey(guildId, rankingId),
    {
      keyIsString: true,
    }
  );

  tx.commit();

  return value ? JSON.parse(value) : null;
}

/**
 * @param {string} guildId
 * @param {string} rankingId
 * @param {RankingData} data
 */
export function putBadRankingById(guildId, rankingId, data) {
  const tx = dbEnv.beginTxn();

  tx.putString(
    badRankingCreditsDatabase,
    makeKey(guildId, rankingId),
    JSON.stringify(data),
    {
      keyIsString: true,
    }
  );

  tx.commit();
}

export function putBadRankingConfigById(guildId, rankingId, data) {
  const tx = dbEnv.beginTxn();

  tx.putString(
    badRankingCreditsDatabase,
    makeConfigKey(guildId, rankingId),
    JSON.stringify(data),
    {
      keyIsString: true,
    }
  );

  tx.commit();
}

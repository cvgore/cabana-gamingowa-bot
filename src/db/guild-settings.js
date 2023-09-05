import {
  getNumberFromDb,
  putNumberInDb,
  guildSettingsDatabase,
  makeGuildedKey,
  getStringFromDb,
  putStringInDb,
} from "./index.js";

/**
 * @param {string} guildId
 * @return {string[]}
 */
export const getYtExtractorChannels = (guildId) => {
  const rawJson = getStringFromDb(
    guildSettingsDatabase,
    makeGuildedKey(guildId, "yt-extractor-channels"),
    "[]"
  );
  const data = JSON.parse(rawJson);

  return Array.isArray(data) ? data : [];
};

/**
 * @param {string} guildId
 * @param {string[]} channels
 * @return {void}
 */
export const putYtExtractorChannels = (guildId, channels) => {
  putStringInDb(
    guildSettingsDatabase,
    makeGuildedKey(guildId, "yt-extractor-channels"),
    JSON.stringify(channels)
  );
};

/**
 * @param {string} guildId
 * @param {string} channel
 * @return {boolean}
 */
export const addYtExtractorChannel = (guildId, channel) => {
  const channels = getYtExtractorChannels(guildId);

  if (channels.includes(channel)) {
    return false;
  }

  putYtExtractorChannels(guildId, [...channels, channel]);

  return true;
};

/**
 * @param {string} guildId
 * @param {string} channel
 * @return {boolean}
 */
export const delYtExtractorChannel = (guildId, channel) => {
  const channels = getYtExtractorChannels(guildId);

  if (!channels.includes(channel)) {
    return false;
  }

  putYtExtractorChannels(
    guildId,
    channels.filter((chan) => chan !== channel)
  );

  return true;
};

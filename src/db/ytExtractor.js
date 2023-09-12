import {
  getNumberFromDb,
  putNumberInDb,
  ytExtractorDatabase,
  makeGuildedKey,
  getStringFromDb,
  putStringInDb,
} from "./index.js";

/**
 * @param {string} guildId
 * @param {string} ytId
 * @return {string[]}
 */
export const putYtExtractorVideo = (guildId, ytId) => {
  const rawJson = getStringFromDb(
    ytExtractorDatabase,
    makeGuildedKey(guildId, `video:${ytId}`),
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

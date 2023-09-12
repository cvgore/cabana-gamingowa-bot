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
    makeGuildedKey(guildId, "yt-extractor:channels"),
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
    makeGuildedKey(guildId, "yt-extractor:channels"),
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

/**
 * @param {string} guildId
 * @return {'none'|'download'|'playlist'|'both'}
 */
export const getYtExtractorMethod = (guildId) => {
  return getStringFromDb(
    guildSettingsDatabase,
    makeGuildedKey(guildId, "yt-extractor:method"),
    "none"
  );
};

/**
 * @param {string} guildId
 * @param {'none'|'download'|'playlist'|'both'} method
 * @return {void}
 */
export const putYtExtractorMethod = (guildId, method) => {
  putStringInDb(
    guildSettingsDatabase,
    makeGuildedKey(guildId, "yt-extractor:method"),
    method
  );
  putGuildEnabledStatusFeature(guildId, "random-events", method !== "none");
};

/**
 * @param {string} guildId
 * @return {string|null}
 */
export const getYtExtractorPlaylistCoopUrl = (guildId) => {
  return getStringFromDb(
    guildSettingsDatabase,
    makeGuildedKey(guildId, "yt-extractor:playlist-coop-url"),
    "none"
  );
};

/**
 * @param {string} guildId
 * @param {string|null} url
 * @return {void}
 */
export const putYtExtractorPlaylistCoopUrl = (guildId, url) => {
  putStringInDb(
    guildSettingsDatabase,
    makeGuildedKey(guildId, "yt-extractor:playlist-coop-url"),
    url
  );
};

/**
 * @param {string} guildId
 * @return {boolean}
 */
export const getRandomEventsEnabled = (guildId) => {
  return (
    getNumberFromDb(
      guildSettingsDatabase,
      makeGuildedKey(guildId, "random-events:enabled"),
      0
    ) === 1
  );
};

/**
 * @param {string} guildId
 * @param {boolean} value
 * @return {void}
 */
export const putRandomEventsEnabled = (guildId, value) => {
  putNumberInDb(
    guildSettingsDatabase,
    makeGuildedKey(guildId, "random-events:enabled"),
    value ? 1 : 0
  );
  putGuildEnabledStatusFeature(guildId, "random-events", value);
};

const getGuildEnabledStatusFeatures = () => {
  const rawJson = getStringFromDb(
    guildSettingsDatabase,
    "guild-enabled-features",
    "{}"
  );

  return JSON.parse(rawJson);
};

export const getFeatureEnabledGuilds = (featureName) => {
  const features = getGuildEnabledStatusFeatures();

  return Object.keys(features[featureName]);
};

export const getFeatureEnabledGuildsWithChannels = (featureName) => {
  const features = getGuildEnabledStatusFeatures();

  return Object.keys(features[featureName]);
};

/**
 * @param {string} guildId
 * @return {string|null}
 */
export const getRandomEventsGuildChannel = (guildId) => {
  return getStringFromDb(
    guildSettingsDatabase,
    makeGuildedKey(guildId, "random-events:channel"),
    null
  );
};

/**
 * @param {string} guildId
 * @param {string|null} channelId
 * @return {void}
 */
export const putRandomEventsGuildChannel = (guildId, channelId) => {
  putStringInDb(
    guildSettingsDatabase,
    makeGuildedKey(guildId, "random-events:channel"),
    channelId
  );
};

/**
 * @param {string} guildId
 * @param {string} featureName
 * @param {boolean} active
 * @param {Object} extra
 */
const putGuildEnabledStatusFeature = (
  guildId,
  featureName,
  active,
  extra = {}
) => {
  const features = getGuildEnabledStatusFeatures();

  if (!(featureName in features)) {
    features[featureName] = {};
  }

  const feature = features[featureName];

  feature[guildId] = {
    active,
    extra: { ...feature[guildId].extra, ...extra },
  };
};

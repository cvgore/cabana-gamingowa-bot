import { guildSettingsDatabase, scanKeys } from "../../../db/index.js";
import { getFeatureEnabledGuilds, getRandomEventsGuildChannel } from "../../../db/guild-settings.js";

export default class RandomEvent {

  /**
   * @return {Promise<void>}
   */
  async handler() {
    throw new Error(`${this.name} does not implement required handler method`);
  }

  /**
   * @return {string}
   */
  get cron() {
    throw new Error(`${this.name} does not implement required cron method`);
  }

  /**
   * @return {string}
   */
  get name() {
    return this.constructor.name;
  }

  /**
   * @return {string[]}
   */
  get enabledGuildIds() {
    return getFeatureEnabledGuilds("random-events");
  }

  /**
   * @return {Generator<string>}
   */
  get* enabledChannelsIds() {
    for (const guildId of this.enabledGuildIds) {
      yield getRandomEventsGuildChannel(guildId);
    }
  }
}
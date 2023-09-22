import {
  getFeatureEnabledGuilds,
  getRandomEventsBlacklist,
  getRandomEventsGuildChannel
} from "../../../db/guild-settings.js";
import { logger } from "../../../logger.js";

export default class RandomEvent {

  /**
   * @return {Promise<void>}
   */
  async handler() {
    throw new Error(`${this.name} does not implement required handler method`);
  }

  /**
   * @return {string|null}
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
    const guilds = getFeatureEnabledGuilds("random-events");

    return guilds.filter((guild) => {
      const blacklist = getRandomEventsBlacklist(guild);

      return !blacklist.includes(this.name);
    });
  }

  /**
   * @return {Generator<string>}
   */
  *enabledChannelsIds() {
    for (const guildId of this.enabledGuildIds) {
      yield getRandomEventsGuildChannel(guildId);
    }
  }

  async shouldRun() {
    const anyActive = this.enabledGuildIds.length !== 0;

    if (!anyActive) {
      logger.info('skipped running %s due to no enabled guilds', this.name);

      return false;
    }

    return true;
  }

  async run(force = false){
    if (force || await this.shouldRun()) {
      return this.handler();
    }

    return Promise.resolve();
  }
}
import { scheduleJob } from "node-schedule";
import debugCtor from "debug";
import { RANDOM_EVENTS } from "./events/index.js";

const debug = debugCtor("scheduler:random-events");

export function runRandomEventsForAllEnabledGuilds() {
  for (const randomEvent of RANDOM_EVENTS) {
    if (randomEvent.cron === null) {
      debug('skipped registration of %o - no cron given', randomEvent.name);
      continue;
    }

    scheduleJob({ rule: randomEvent.cron }, () => randomEvent.run());
  }
}

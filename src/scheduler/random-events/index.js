import { scheduleJob } from "node-schedule";
import { getBrbStatus } from "../../db/brb.js";
import { client } from "../../client.js";
import { logger } from "../../logger.js";
import { unzzzifyNickname, zzzifyNickname } from "../../core/helpers.js";
import {
  differenceInMinutes,
  fromUnixTime,
  isAfter,
  isEqual,
  set,
} from "date-fns";
import { removeBrbFromUser } from "../../core/brb.js";
import debugCtor from "debug";
import { scheduleJobWithContext } from "../index.js";
import { RANDOM_EVENTS } from "./events/index.js";

const debug = debugCtor("scheduler:ytExtractor");

export function runRandomEventsForAllEnabledGuilds() {
  for (const randomEvent of RANDOM_EVENTS) {
    scheduleJob({ rule: randomEvent.cron }, () => randomEvent.handler());
  }
}

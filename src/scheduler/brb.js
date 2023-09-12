import { scheduleJob } from "node-schedule";
import { getBrbStatus } from "../db/brb.js";
import { client } from "../client.js";
import { logger } from "../logger.js";
import { unzzzifyNickname, zzzifyNickname } from "../core/helpers.js";
import {
  differenceInMinutes,
  fromUnixTime,
  isAfter,
  isEqual,
  set,
} from "date-fns";
import { removeBrbFromUser } from "../core/brb.js";
import debugCtor from "debug";

const debug = debugCtor("scheduler:brb");

async function brbHandler(guildId, userId, job) {
  const expectedAtTs = await getBrbStatus(guildId, userId);
  const expectedAtDate = fromUnixTime(expectedAtTs);
  const now = new Date();
  const guild = await client.guilds.fetch(guildId);
  const user = await guild.members.fetch(userId);
  const mins = differenceInMinutes(
    expectedAtDate,
    set(now, { seconds: 0, milliseconds: 0 })
  );

  if (
    expectedAtTs === null ||
    isAfter(now, expectedAtDate) ||
    isEqual(now, expectedAtDate) ||
    mins === 0
  ) {
    debug("force-remove brb - missing entry or outdated");

    job.cancel();
    return removeBrbFromUser(user);
  }

  try {
    await user.setNickname(
      zzzifyNickname(unzzzifyNickname(user.nickname), mins),
      `brb:update(mins=${mins})`
    );
  } catch (ex) {
    logger.warn(`failed to update brb status for ${userId}: %j`, ex);
  }
}


export function addToScheduleBrb(guildId, userId, endDate) {
  const schedule = {
    end: endDate,
    rule: "* * * * *", // run every minute
  };

  const job = scheduleJob(schedule, () => brbHandler(guildId, userId, job));
}
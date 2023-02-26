import { scheduleJob } from "node-schedule";
import { getBrbStatus, putBrbStatus } from "../db/brb.js";
import { client } from "../client.js";
import { logger } from "../logger.js";
import { unzzzifyNickname, zzzifyNickname } from "../core/helpers.js";
import {
  differenceInMinutes,
  fromUnixTime,
  isAfter,
  subMinutes,
} from "date-fns";
import { removeBrbFromUser } from "../core/brb.js";
import debugCtor from "debug";

const debug = debugCtor("scheduler:brb");

async function brbHandler(guildId, userId) {
  const expectedAt = await getBrbStatus(guildId, userId);
  const now = new Date();
  const guild = await client.guilds.fetch(guildId);
  const user = await guild.members.fetch(userId);

  if (expectedAt === null || isAfter(now, fromUnixTime(expectedAt))) {
    debug("force-remove brb - missing entry or outdated");

    return removeBrbFromUser(user);
  }

  const mins = differenceInMinutes(fromUnixTime(expectedAt), now);

  await putBrbStatus(guildId, userId, subMinutes(fromUnixTime(expectedAt), 1).valueOf());

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

  scheduleJob(schedule, () => brbHandler(guildId, userId));
}

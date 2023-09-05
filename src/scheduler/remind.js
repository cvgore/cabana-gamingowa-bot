import { scheduleJob } from "node-schedule";
import { client } from "../client.js";
import { logger } from "../logger.js";
import { isAfter, isEqual, set } from "date-fns";
import debugCtor from "debug";
import { getAllRemindEntries, popRemindList } from "../db/remind.js";
import { userAttention } from "../core/response.js";
import { getRandomAbusiveWordDirectToUser } from "../core/random-swear.js";
import { quote } from "discord.js";

const debug = debugCtor("scheduler:remind");

async function remindHandler() {
  const entries = getAllRemindEntries();

  const invokeReminderList = [];

  const now = set(new Date(), {
    seconds: 59,
    milliseconds: 0,
  });

  for (const [key, remindListEntries] of Object.entries(entries)) {
    if (!remindListEntries) {
      debug("empty list for %j", { key });
      continue;
    }

    const [guildId, userId] = key.split("::");

    for (const entry of remindListEntries) {
      if (isAfter(now, entry.time) || isEqual(now, entry.time)) {
        debug("will invoke reminder for %j", { entry });

        invokeReminderList.push({
          ...entry,
          guildId,
          userId,
        });

        popRemindList(guildId, userId, entry.id);
      }
    }
  }

  const promiseList = invokeReminderList.map((data) => {
    return async () => {
      debug("invoking reminder for %j", { data });
      return client.users.send(data.userId, {
        content: userAttention(
          `ty ${getRandomAbusiveWordDirectToUser()}! pamiętaj o\n\n` +
            `${quote(
              data.what ||
                "..czymś ale nie wiem o czym bo chuju nie zdradziłeś żadnych szczegółów"
            )}`
        ),
      });
    };
  });

  return Promise.allSettled(promiseList.map((x) => x())).catch((err) => {
    logger.error(`failed to send reminder %j`, err);
  });
}

export function runRemindScheduler() {
  const schedule = {
    rule: "* * * * *", // run every minute
  };

  debug("starting scheduler");

  scheduleJob(schedule, () => remindHandler());
}

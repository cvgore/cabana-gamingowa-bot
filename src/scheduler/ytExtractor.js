import { scheduleJob } from "node-schedule";
import debugCtor from "debug";

const debug = debugCtor("scheduler:ytExtractor");

async function ytExtractorWorker(guildId, userId, job) {}

export function runYtExtractorScheduler(guildId) {
  const schedule = {
    rule: "* * * * *", // run every minute
  };

  const job = scheduleJob(schedule, () => ytExtractorWorker(guildId, job));
}

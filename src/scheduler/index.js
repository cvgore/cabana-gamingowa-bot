import { scheduleJob } from "node-schedule";

export function scheduleJobWithContext(schedule, callback, ...args) {
  const job = scheduleJob(schedule, () => callback(job, ...args));

  return job;
}

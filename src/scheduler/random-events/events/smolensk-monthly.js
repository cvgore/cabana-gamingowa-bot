import RandomEvent from "./random-event.js";

export default class SmolenskMonthly extends RandomEvent {

  get saluteCategory() {
    return 'smolensk-monthly';
  }

  get cron() {
    return '10 10 10 * *';
  }
}
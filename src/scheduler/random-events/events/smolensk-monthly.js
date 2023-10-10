import SaluteEvent from "./salute-event.js";

export default class SmolenskMonthly extends SaluteEvent {

  get saluteCategory() {
    return 'smolensk-monthly';
  }

  get cron() {
    return '10 10 10 * *';
  }
}
import SaluteEvent from "./salute-event.js";

export default class Test extends SaluteEvent {

  get saluteCategory() {
    return 'smolensk-monthly';
  }

  get cron() {
    return '*/5 * * * *';
  }
}
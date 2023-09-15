import SaluteEvent from "./salute-event.js";

export default class Wtc extends SaluteEvent {

  get saluteCategory() {
    return 'wtc';
  }

  get cron() {
    return '30 11 11 9 *';
  }
}
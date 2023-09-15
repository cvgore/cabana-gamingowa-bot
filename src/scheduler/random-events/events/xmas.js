import SaluteEvent from "./salute-event.js";

export default class Xmas extends SaluteEvent {

  get saluteCategory() {
    return 'xmas';
  }

  get cron() {
    return '30 10 24 12 *';
  }
}
import SaluteEvent from "./salute-event.js";

export default class Nnn extends SaluteEvent {

  get saluteCategory() {
    return 'nnn';
  }

  get cron() {
    return '30 09 01 11 *';
  }
}
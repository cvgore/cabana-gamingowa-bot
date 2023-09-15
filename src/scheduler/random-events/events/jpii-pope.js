import SaluteEvent from "./salute-event.js";

export default class JpiiPope extends SaluteEvent {

  get saluteCategory() {
    return 'jp2';
  }

  get cron() {
    return '37 21 * * *';
  }
}
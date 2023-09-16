import SaluteEvent from "./salute-event.js";
import { getRandomEventsDebugModeEnabled } from "../../../db/guild-settings.js";

export default class Test extends SaluteEvent {
  async handler() {
    if (getRandomEventsDebugModeEnabled()) {
      return super.handler();
    }
  }

  get saluteCategory() {
    return 'test';
  }

  get cron() {
    return '* * * * *';
  }
}
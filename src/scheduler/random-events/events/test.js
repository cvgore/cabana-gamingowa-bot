import SaluteEvent from "./salute-event.js";
import { getRandomEventsDebugModeEnabled } from "../../../db/guild-settings.js";

export default class Test extends SaluteEvent {
  async shouldRun() {
    if (!await super.shouldRun()) {
      return false;
    }

    return getRandomEventsDebugModeEnabled();
  }

  get saluteCategory() {
    return 'test';
  }

  get cron() {
    return null;
  }
}
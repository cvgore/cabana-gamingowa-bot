import { fetchNextEaster } from "../../../core/random-words.js";
import { isSameDay } from "date-fns";
import SaluteEvent from "./salute-event.js";
import debugCtor from "debug";

const debug = debugCtor('random-event:easter');

export default class Easter extends SaluteEvent {

  get saluteCategory() {
    return 'easter';
  }

  async handler() {
    const { nextEasterAt } = await fetchNextEaster();

    if (!isSameDay(new Date(), nextEasterAt)) {
      debug('skipping running easter event - expected %o vs now %o', nextEasterAt, new Date());

      return Promise.resolve();
    }

    return super.handler();
  }

  get cron() {
    return '00 11 * * *';
  }
}
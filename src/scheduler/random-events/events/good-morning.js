import { fetchMorningSalute } from "../../../core/random-things.js";
import SaluteEvent from "./salute-event.js";

export default class GoodMorning extends SaluteEvent {

  get saluteCategory() {
    return 'morning'; // fake non-existing category
  }

  saluteCall() {
    return fetchMorningSalute();
  }

  get cron() {
    return '00 10 * * *';
  }
}
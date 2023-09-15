import JpiiPope from "./jpii-pope.js";
import Nnn from "./nnn.js";
import SmolenskMonthly from "./smolensk-monthly.js";
import Wtc from "./wtc.js";
import Xmas from "./xmas.js";
import Easter from "./easter.js";
import Test from "./test.js";
import GoodMorning from "./good-morning.js";
import RandomEvent from "./random-event.js";

/**
 * @type {RandomEvent[]}
 */
export const RANDOM_EVENTS = [
  new Test(),
  new JpiiPope(),
  new Nnn(),
  new SmolenskMonthly(),
  new Wtc(),
  new Xmas(),
  new Easter(),
  new GoodMorning(),
]
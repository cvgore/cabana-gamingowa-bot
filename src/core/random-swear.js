import { randomInt } from "crypto";

/**
 * You <insert word here>!
 * @type {string[]}
 */
const ABUSIVE_WORDS_DIRECT_TO_USER = [
  "ciulu",
  "pieronie",
  "deklu",
  "debilu",
  "fujaro",
  "siusiaku",
  "pajacu",
  "miglancu",
  "pindo",
  "huncwocie",
  "ziemniaku",
  "buraku",
  "cwelu",
  "baranie",
  "przychlaście",
  "szmulo",
  "idioto",
];

export const getRandomAbusiveWordDirectToUser = () => {
  const index = randomInt(ABUSIVE_WORDS_DIRECT_TO_USER.length);

  return ABUSIVE_WORDS_DIRECT_TO_USER[index];
};

const ABUSIVE_WORDS_NAMED_USER = [
  "minion",
  "pajac",
  "cymbał",
  "siusiak",
  "kurvinox",
  "przychlast",
  "wariacik",
  "huncwot",
];

export const getRandomAbusiveWordNamedUser = () => {
  const index = randomInt(ABUSIVE_WORDS_NAMED_USER.length);

  return ABUSIVE_WORDS_NAMED_USER[index];
};

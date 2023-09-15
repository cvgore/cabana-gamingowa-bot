import fetch from "node-fetch";
import { RANDOM_THINGS_APIKEY, RANDOM_THINGS_URL } from "../env.js";
import { logger } from "../logger.js";
import debugCtor from "debug";

const debug = debugCtor('random-words');

/**
 * @param {"jp2"|"wtc"|"easter"|"xmas"|"smolensk-monthly"|"nnn"|"test"} category
 * @return {Promise<{salute: string, gifUrl: string}>}
 */
export const fetchRandomSalute = async (category) => {
  const url = new URL(RANDOM_THINGS_URL);
  url.pathname = '/v1/salute/random';
  url.searchParams.set("category", category);

  debug('request random salute %o', url);

  try {
    const response = await fetch({
      url: url.toString(),
      headers: {
        'Authorization': `Bearer ${RANDOM_THINGS_APIKEY}`,
      },
    });

    const body = await response.json();

    debug('respond from random salute %o %o', url, body);

    return body;
  } catch (ex) {
    debug('failed to fetch random salute', ex);
    logger.error("failed to fetch random salute", { url, ex });
  }
};

/**
 * @return {Promise<{nextEasterAt: Date}>}
 */
export const fetchNextEaster = async () => {
  const url = new URL(RANDOM_THINGS_URL);
  url.pathname = '/v1/easter';

  debug('request next easter %o', url);

  try {
    const response = await fetch({
      url: url.toString(),
      headers: {
        Authorization: `Bearer ${RANDOM_THINGS_APIKEY}`,
      },
    });

    const body = await response.json();

    debug('respond from next easter %o: %o', url, body);

    return {
      nextEasterAt: new Date(body.nextEasterAt),
    };
  } catch (ex) {
    debug('failed to fetch next easter %o', ex);
    logger.error("failed to fetch random thing", { url, ex });
  }
};

/**
 * @return {Promise<{salute: string, gifUrl: string}>}
 */
export const fetchMorningSalute = async () => {
  const url = new URL(RANDOM_THINGS_URL);
  url.pathname = '/v1/salute/morning';

  debug('request morning salute %o', url);

  try {
    const response = await fetch({
      url: url.toString(),
      headers: {
        'Authorization': `Bearer ${RANDOM_THINGS_APIKEY}`,
      },
    });

    const body = await response.json();

    debug('respond from morning salute %o %o', url, body);

    return body;
  } catch (ex) {
    debug('failed to fetch morning salute %o', ex);
    logger.error("failed to fetch morning salute", { url, ex });
  }
};
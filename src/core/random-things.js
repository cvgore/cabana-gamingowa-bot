import fetch from "node-fetch";
import { RANDOM_THINGS_APIKEY, RANDOM_THINGS_URL } from "../env.js";
import { logger } from "../logger.js";
import debugCtor from "debug";
import { Err, Ok, ResultEquipped as Result } from "rustic";

const debug = debugCtor("random-words");

/**
 * @param {"jp2"|"wtc"|"easter"|"xmas"|"smolensk-monthly"|"nnn"|"test"} category
 * @return {Promise<{salute: string, gifUrl: string}>}
 */
export const fetchRandomSalute = async (category) => {
  const url = new URL(RANDOM_THINGS_URL);
  url.pathname = "/v1/salute/random";
  url.searchParams.set("category", category);

  debug("request random salute %o", url);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${RANDOM_THINGS_APIKEY}`,
      },
    });

    const body = await response.json();

    debug("respond from random salute %o %o", url, body);

    return body;
  } catch (ex) {
    logger.error("failed to fetch random salute %o %o", url, ex);
  }
};

/**
 * @return {Promise<{nextEasterAt: Date}>}
 */
export const fetchNextEaster = async () => {
  const url = new URL(RANDOM_THINGS_URL);
  url.pathname = "/v1/easter";

  debug("request next easter %o", url);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${RANDOM_THINGS_APIKEY}`,
      },
    });

    const body = await response.json();

    debug("respond from next easter %o: %o", url, body);

    return {
      nextEasterAt: new Date(body.nextEasterAt),
    };
  } catch (ex) {
    logger.error("failed to fetch next easter %o %o", url, ex);
  }
};

/**
 * @return {Promise<{salute: string, gifUrl: string | null}>}
 */
export const fetchMorningSalute = async () => {
  const url = new URL(RANDOM_THINGS_URL);
  url.pathname = "/v1/salute/morning";

  debug("request morning salute %o", url);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${RANDOM_THINGS_APIKEY}`,
      },
    });

    const body = await response.json();

    debug("respond from morning salute %o %o", url, body);

    return body;
  } catch (ex) {
    logger.error("failed to fetch morning salute %o %o", url, ex);
  }
};

/**
 * @param {'fire'} family
 * @return {Promise<Result<string, string>>}
 */
export const getFancyFontGif = async (family) => {
  const url = new URL(RANDOM_THINGS_URL);
  url.pathname = `/v1/text/fancy/${family}`;

  debug("request text fancy %o", url);

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${RANDOM_THINGS_APIKEY}`,
    },
  });

  if (response.status !== 200) {
    logger.warn(
      "invalid response from random things %o %o",
      response.status,
      response
    );

    return new Result(Err(await response.text()));
  }

  const image = Buffer.from(await response.arrayBuffer()).toString("base64");

  debug("respond from text fancy %o %o", url, image);

  return new Result(Ok(image));
};

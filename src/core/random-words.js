import fetch from "node-fetch";
import { RANDOM_THINGS_APIKEY, RANDOM_THINGS_URL } from "../env.js";
import { logger } from "../logger.js";

/**
 * @param {"jp2"|"wtc"|"easter"|"xmas"|"smolensk-monthly"|"nnn"} category
 * @return {Promise<{salute: string, id: string, gifUrl: string}>}
 */
export const fetchRandomSalute = async (category) => {
  const url = new URL(RANDOM_THINGS_URL);
  url.pathname = `/v1/random/salute`;
  url.searchParams.set("category", category);

  try {
    const response = await fetch({
      url: url.toString(),
      headers: {
        Authorization: `Bearer ${RANDOM_THINGS_APIKEY}`,
      },
    });

    return await response.json();
  } catch (ex) {
    logger.error("failed to fetch random thing", { url, ex });
  }
};

/**
 * @return {Promise<{nextEasterAt: Date}>}
 */
export const fetchNextEaster = async () => {
  const url = new URL(RANDOM_THINGS_URL);
  url.pathname = `/v1/easter`;

  try {
    const response = await fetch({
      url: url.toString(),
      headers: {
        Authorization: `Bearer ${RANDOM_THINGS_APIKEY}`,
      },
    });

    const body = await response.json();

    return {
      nextEasterAt: new Date(body.nextEasterAt),
    };
  } catch (ex) {
    logger.error("failed to fetch random thing", { url, ex });
  }
};

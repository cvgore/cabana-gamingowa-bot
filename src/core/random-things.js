import fetch from "node-fetch";
import { RANDOM_THINGS_APIKEY, RANDOM_THINGS_URL } from "../env.js";
import { logger } from "../logger.js";
import debugCtor from "debug";
import rustic from "rustic";
const { Err, Ok, ResultEquipped, equip } = rustic;

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
 * @return {Promise<ResultEquipped<{text: string}, undefined>>}
 */
export const fetchToiletMode = async () => {
  const url = new URL(RANDOM_THINGS_URL);
  url.pathname = "/v1/toilet";

  debug("request toilet mode %o", url);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${RANDOM_THINGS_APIKEY}`,
      },
    });

    const body = await response.json();

    debug("respond from toilet mode %o %o", url, body);

    return equip(Ok(body));
  } catch (ex) {
    logger.error("failed to fetch toilet mode %o %o", url, ex);

    return equip(Err(undefined));
  }
};

/**
 * @param {'fire'} family
 * @param {string} text
 * @return {Promise<ResultEquipped<Buffer, string>>}
 */
export const getFancyFontGif = async (family, text) => {
  const url = new URL(RANDOM_THINGS_URL);
  url.pathname = `/v1/text/fancy/${family}`;
  url.searchParams.set("text", text);

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

    const body = await response.json();

    return equip(Err(body.message));
  }

  const image = Buffer.from(await response.arrayBuffer());

  debug("respond from text fancy %o - ok", url);

  return equip(Ok(image));
};

/**
 * @param {string} patientName
 * @param {string} itemName
 * @param {string|null} issuerName
 * @param {string|null} doseText
 * @param {string|null} code
 * @return {Promise<ResultEquipped<Buffer, string>>}
 */
export const getEPrescriptionImage = async (patientName, itemName, issuerName = null, doseText = null, code = null) => {
  const url = new URL(RANDOM_THINGS_URL);
  url.pathname = `/v1/eprescription`;
  url.searchParams.set("patientName", patientName);
  url.searchParams.set("itemName", itemName);
  if (issuerName) {
    url.searchParams.set("issuerName", issuerName);
  }
  if (doseText) {
    url.searchParams.set("doseText", doseText);
  }
  if (code) {
    url.searchParams.set("code", code);
  }

  debug("request eprescription %o", url);

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

    const body = await response.json();

    return equip(Err(body.message));
  }

  const image = Buffer.from(await response.arrayBuffer());

  debug("respond from eprescription %o - ok", url);

  return equip(Ok(image));
};

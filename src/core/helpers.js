export const getNumericIncrementalValue = (baseValue, numStr) => {
  const hasSign = numStr.endsWith("+") || numStr.endsWith("-");
  const value = parseInt(hasSign ? numStr.slice(0, -1) : numStr);

  if (isNaN(value) || !isFinite(value)) {
    return null;
  }

  if (!hasSign) {
    return value;
  }

  const sign = hasSign ? numStr.slice(-1) : null;

  return sign === "+" ? baseValue + value : baseValue - value;
};

export const emojifyNumber = (num) => {
  return num
    .toString()
    .split("")
    .map((c) => EMOJIS_DICTIONARY[c])
    .join("");
};

export const emojifyNumberWithPadding = (num, targetLen) => {
  const paddedNumStr = num.toString().padStart(targetLen, "?");

  return paddedNumStr
    .replaceAll("?", `🟦`)
    .replace(`${num}`, emojifyNumber(num));
};

export const EMOJIS_DICTIONARY = {
  a: "🇦",
  b: "🇧",
  c: "🇨",
  d: "🇩",
  e: "🇪",
  f: "🇫",
  g: "🇬",
  h: "🇭",
  i: "🇮",
  j: "🇯",
  k: "🇰",
  l: "🇱",
  m: "🇲",
  n: "🇳",
  o: "🇴",
  p: "🇵",
  q: "🇶",
  r: "🇷",
  s: "🇸",
  t: "🇹",
  u: "🇺",
  v: "🇻",
  w: "🇼",
  x: "🇽",
  y: "🇾",
  z: "🇿",
  "-": "➖",
  0: "0️⃣",
  1: "1️⃣",
  2: "2️⃣",
  3: "3️⃣",
  4: "4️⃣",
  5: "5️⃣",
  6: "6️⃣",
  7: "7️⃣",
  8: "8️⃣",
  9: "9️⃣",
  "#": "#️⃣",
  "*": "*️⃣",
  "!": "❗",
  "?": "❓",
};

export const ZZZ_EMOJI = "💤";

export const ZZZIFY_PATTERN = /^💤\d{1,3}m (.*)$/;

export const zzzifyNickname = (nick, mins) => {
  if (ZZZIFY_PATTERN.test(nick)) {
    return nick;
  }

  if (nick.length <= 26) {
    return `${ZZZ_EMOJI}${mins}m ${nick}`;
  }

  return nick;
};

export const unzzzifyNickname = (nick) => {
  if (ZZZIFY_PATTERN.test(nick)) {
    return ZZZIFY_PATTERN.exec(nick)[1].trim();
  }

  if (nick.startsWith(ZZZ_EMOJI)) {
    return nick.slice(ZZZ_EMOJI.length).trim();
  }

  return nick;
};

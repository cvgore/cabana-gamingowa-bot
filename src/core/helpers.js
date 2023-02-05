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
    .replaceAll("?", `⏹️`)
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

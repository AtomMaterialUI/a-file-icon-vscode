const editDistance = (s1: string, s2: string) => {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  const costs = new Array<number>();
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) {
      costs[s2.length] = lastValue;
    }
  }
  return costs[s2.length];
};

/** TitleCase all words in a string */
export const toTitleCase = (string_: string): string => {
  return string_.replaceAll(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
};

/**
 * Find the enum by value
 */
export const findEnumKey = <T extends Record<string, string>>(myEnum: T, enumValue: string): keyof T | null => {
  const keys = Object.keys(myEnum).filter((x) => myEnum[x] === enumValue);
  return keys.length > 0 ? keys[0] : null;
};

/**
 * Return the levenshtein distance between two strings
 * @param {string} s1
 * @param {string} s2
 * @returns {number}
 */
export const similarity = (s1: string, s2: string) => {
  let longer = s1;
  let shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  const longerLength = longer.length;
  if (longerLength === 0) {
    return 1;
  }
  return (longerLength - editDistance(longer, shorter)) / longerLength;
};

export const getHash = (value: string) => {
  let hash = 0;
  let chr = 0;

  if (value.length === 0) {
    return hash;
  }
  for (let index = 0; index < value.length; index++) {
    chr = value.charCodeAt(index);
    hash = (hash << 5) - hash + chr;
    hash = Math.trunc(hash); // Convert to 32bit integer
  }
  return hash;
};

export const getSVGRootElement = (svg: string) => {
  const result = new RegExp(/<svg[^>]*>/).exec(svg);
  return result?.[0];
};

export const isValidHexColorCode = (color: string) => {
  const hexPattern = new RegExp(/^#([\dA-Fa-f]{6}|[\dA-Fa-f]{3})$/);
  return color.length > 0 && hexPattern.test(color);
};
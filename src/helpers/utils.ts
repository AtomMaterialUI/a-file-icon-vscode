/** TitleCase all words in a string */
export const toTitleCase = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
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
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / longerLength;
};

const editDistance = (s1: string, s2: string) => {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  const costs = new Array<number>();
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      }
      else {
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

export const getHash = (value: string) => {
  let hash = 0;
  let chr = 0;

  if (value.length === 0) {
    return hash;
  }
  for (let i = 0; i < value.length; i++) {
    chr = value.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

export const getSVGRootElement = (svg: string) => {
  const result = new RegExp(/<svg[^>]*>/).exec(svg);
  return result?.[0];
};

export const validateHEXColorCode = (color = '') => {
  const hexPattern = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
  return color.length > 0 && hexPattern.test(color);
};

/**
 * Validate the opacity value.
 * @param opacity Opacity value
 */
export const validateOpacityValue = (opacity: number | undefined) => {
  return opacity !== undefined && opacity <= 1 && opacity >= 0;
};

/**
 * Validate the saturation value.
 * @param saturation Saturation value
 */
export const validateSaturationValue = (saturation: number | undefined) => {
  return saturation !== undefined && saturation <= 1 && saturation >= 0;
};
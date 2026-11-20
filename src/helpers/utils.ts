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

/**
 * Structural equality for JSON-like values (settings). Object key order is ignored.
 */
export const isDeepEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) =>
    Object.hasOwn(b, key) && isDeepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]));
};

export const getSVGRootElement = (svg: string) => {
  const result = new RegExp(/<svg[^>]*>/).exec(svg);
  return result?.[0];
};

export const isValidHexColorCode = (color: string) => {
  const hexPattern = new RegExp(/^#([\dA-Fa-f]{6}|[\dA-Fa-f]{3})$/);
  return color.length > 0 && hexPattern.test(color);
};
/**
 * A file, extension or folder name the way VS Code matches it in an icon theme: lower case, in Unicode NFC, so that a
 * Korean name typed or pasted in its decomposed form (NFD, the form of macOS file names) matches the explorer's name.
 */
export const normalizeName = (name: string): string => name.normalize('NFC').toLowerCase();

/**
 * Whether an error is VS Code cancelling an operation: a message still waiting for the user when the window closes is
 * rejected this way. It is not a failure of the extension and is not logged as one.
 */
export const isCancellation = (error: unknown): boolean =>
  typeof error === 'object' && error !== null && (error as { name?: unknown }).name === 'Canceled';

import { env, Uri } from 'vscode';

/**
 * Open a browser to the given url
 * @param {string} url
 */
export const openBrowser = (url: string) => {
  env.openExternal(Uri.parse(url));
};

/** TitleCase all words in a string */
export const toTitleCase = (str: string): string => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );
};

export const findEnumKey = <T extends Record<string, string>>(myEnum: T, enumValue: string): keyof T | null => {
  const keys = Object.keys(myEnum).filter(x => myEnum[x] === enumValue);
  return keys.length > 0 ? keys[0] : null;
};

import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

/** The color themes of this extension: `contributes.themes` of package.json points to `dist/<file>` */
export const COLOR_THEMES = [
  {
    base: 'cool-islands-dark.base.json',
    file: 'cool-islands-dark-color-theme.json',
    jetbrains: 'Islands Dark',
    label: 'Cool Islands Dark',
    uiTheme: 'vs-dark',
  },
  {
    base: 'cool-islands-light.base.json',
    file: 'cool-islands-light-color-theme.json',
    jetbrains: 'Islands Light',
    label: 'Cool Islands Light',
    uiTheme: 'vs',
  },
] as const;

export type ColorThemeInfo = (typeof COLOR_THEMES)[number];

/** Folder of the generated base themes (`bun run sync:colors`), shipped with the extension */
export const THEMES_FOLDER = 'themes';

/** The extension root: the first folder up from here with a package.json (dist/, src/themes/, out/unit/…) */
export const extensionRoot = (from: string = __dirname): string => {
  for (let folder = from; ; folder = dirname(folder)) {
    if (existsSync(join(folder, 'package.json'))) return folder;
    if (dirname(folder) === folder) throw new Error(`No package.json above ${from}`);
  }
};

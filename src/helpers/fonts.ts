/**
 * Fonts of the JetBrains IDEs, written to the user settings only when the user asks for them (the "Use the JetBrains
 * Fonts" command, the walkthrough, or the offer made once with a Cool Islands color theme): installing the extension
 * changes no font (fonts.test.ts). VS Code draws each character with the first font of the list that has it, so the
 * Korean fonts after the Latin ones draw the Hangul that JetBrains Mono and Inter do not have.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const FONT_FILE = /\.(otf|ttc|ttf|woff2?)$/i;

/** Where the distributions install fontconfig's `fc-list` */
const FC_LIST_PATHS = ['/usr/bin/fc-list', '/usr/local/bin/fc-list', '/bin/fc-list'];

/**
 * File names of the fonts: JetBrainsMono-Regular.ttf, JetBrainsMono[wght].ttf, D2Coding-Ver1.3.3-20180524-all.ttc…
 * Not JetBrainsMonoNL or the Nerd Font builds: their family names ("JetBrains Mono NL", "JetBrainsMono Nerd Font") are
 * not the one of the font list.
 */
const FONT_FILE_NAMES: Record<FontFamily, RegExp> = {
  D2Coding: /^d2coding/i,
  'JetBrains Mono': /^jetbrains[\s_-]?mono(?![\s_-]?nl)(?!.*nerd)/i,
};

const findFiles = (folder: string, depth: number, matches: (name: string) => boolean): boolean => {
  let entries;
  try {
    entries = readdirSync(folder, { withFileTypes: true });
  } catch {
    return false;
  }
  for (const entry of entries) {
    if (entry.isFile() && FONT_FILE.test(entry.name) && matches(entry.name)) return true;
    if (entry.isDirectory() && depth > 0 && findFiles(join(folder, entry.name), depth - 1, matches)) return true;
  }
  return false;
};

export type FontFamily = 'D2Coding' | 'JetBrains Mono';

/** Editor font of the JetBrains IDEs, then D2Coding and the Korean system fonts for Hangul, then the VS Code defaults */
export const EDITOR_FONT_FAMILY =
  "'JetBrains Mono', 'D2Coding', Consolas, Menlo, 'Droid Sans Mono', 'Malgun Gothic', 'Apple SD Gothic Neo', 'Noto Sans Mono CJK KR', 'Courier New', monospace";

/** Interface font of the JetBrains IDEs (Inter), then the VS Code defaults with the Korean system fonts */
export const UI_FONT_FAMILY =
  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe WPC', 'Segoe UI', system-ui, 'Malgun Gothic', 'Apple SD Gothic Neo', 'Noto Sans KR', Ubuntu, 'Droid Sans', sans-serif";

export const FONT_DOWNLOADS: Record<FontFamily, string> = {
  D2Coding: 'https://github.com/naver/d2codingfont/releases',
  'JetBrains Mono': 'https://www.jetbrains.com/lp/mono/',
};

/** Folders of the installed fonts: the system ones and the ones of the user */
export const fontFolders = (
  platform: NodeJS.Platform = process.platform,
  environment: NodeJS.ProcessEnv = process.env,
  home: string = homedir(),
): string[] => {
  if (platform === 'win32') {
    const folders = [join(environment.WINDIR ?? String.raw`C:\Windows`, 'Fonts')];
    if (environment.LOCALAPPDATA) folders.push(join(environment.LOCALAPPDATA, 'Microsoft', 'Windows', 'Fonts'));
    return folders;
  }
  if (platform === 'darwin') return [join(home, 'Library', 'Fonts'), '/Library/Fonts', '/System/Library/Fonts'];
  const dataHome = environment.XDG_DATA_HOME ?? join(home, '.local', 'share');
  return [join(dataHome, 'fonts'), join(home, '.fonts'), '/usr/share/fonts', '/usr/local/share/fonts'];
};

/** The font families fontconfig knows (Linux, fonts installed anywhere), lower case; empty elsewhere or without fc-list */
export const fontconfigFamilies = (platform: NodeJS.Platform = process.platform): string => {
  if (platform !== 'linux') return '';
  // a fixed path, not a lookup in PATH (a writable folder there could put another `fc-list` first)
  const fcList = FC_LIST_PATHS.find((path) => existsSync(path));
  if (!fcList) return '';
  try {
    return execFileSync(fcList, [':', 'family'], { encoding: 'utf8', timeout: 3000 }).toLowerCase();
  } catch {
    return '';
  }
};

/** Whether a font file of the family is in one of the folders (Linux puts them in sub folders), or fontconfig knows it */
export const isFontInstalled = (
  family: FontFamily,
  folders: string[] = fontFolders(),
  knownFamilies: () => string = fontconfigFamilies,
): boolean => {
  const matches = (name: string) => FONT_FILE_NAMES[family].test(name);
  if (folders.some((folder) => existsSync(folder) && findFiles(folder, 3, matches))) return true;
  return knownFamilies().includes(family.toLowerCase());
};

/** The font settings this extension writes, and the value of each */
export const JETBRAINS_FONT_SETTINGS = [
  { key: 'fontFamily', section: 'editor', value: EDITOR_FONT_FAMILY },
  { key: 'fontFamily', section: 'markdown.preview', value: UI_FONT_FAMILY },
] as const;

/** Whether a font setting is the given JetBrains font list of this extension (a copy with other spaces counts) */
export const isJetBrainsFont = (value: unknown, font: string = EDITOR_FONT_FAMILY): boolean =>
  typeof value === 'string' && value.replaceAll(/\s+/g, ' ').trim() === font;

/**
 * Whether to offer the JetBrains fonts, once: with a Cool Islands color theme selected and no editor font of the user's
 * own. A user of the file icons alone keeps the font of VS Code.
 */
export const shouldOfferFonts = (options: {
  asked: boolean;
  colorTheme: unknown;
  enabled: boolean;
  islandsThemes: readonly string[];
  userFont: boolean;
}): boolean =>
  options.enabled &&
  !options.asked &&
  !options.userFont &&
  typeof options.colorTheme === 'string' &&
  options.islandsThemes.includes(options.colorTheme);

/**
 * The fonts of the JetBrains editor font to suggest: JetBrains Mono, and D2Coding for a Korean interface (the system
 * Korean fonts are not monospaced). None when the editor does not use the JetBrains font list.
 */
export const missingFonts = (options: {
  installed: (family: FontFamily) => boolean;
  language: string;
  usesJetBrainsFont: boolean;
}): FontFamily[] => {
  if (!options.usesJetBrainsFont) return [];
  const wanted: FontFamily[] = ['JetBrains Mono'];
  if (options.language.toLowerCase().startsWith('ko')) wanted.push('D2Coding');
  return wanted.filter((family) => !options.installed(family));
};

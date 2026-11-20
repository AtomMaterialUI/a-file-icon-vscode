/**
 * Fonts of the JetBrains IDEs for the places where the user has not chosen a font.
 * `contributes.configurationDefaults` of package.json gives them as defaults (see fonts.test.ts): a font the user sets
 * always wins. VS Code draws each character with the first font of the list that has it, so the Korean fonts after the
 * Latin ones draw the Hangul that JetBrains Mono and Inter do not have.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const FONT_FILE = /\.(otf|ttc|ttf|woff2?)$/i;

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
  try {
    return execFileSync('fc-list', [':', 'family'], { encoding: 'utf8', timeout: 3000 }).toLowerCase();
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

/**
 * The fonts of the default editor font to suggest: JetBrains Mono, and D2Coding for a Korean interface (the system
 * Korean fonts are not monospaced). None when the user chose the editor font.
 */
export const missingFonts = (options: {
  installed: (family: FontFamily) => boolean;
  language: string;
  userFont: boolean;
}): FontFamily[] => {
  if (options.userFont) return [];
  const wanted: FontFamily[] = ['JetBrains Mono'];
  if (options.language.toLowerCase().startsWith('ko')) wanted.push('D2Coding');
  return wanted.filter((family) => !options.installed(family));
};

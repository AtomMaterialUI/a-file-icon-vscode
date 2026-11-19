import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { writeFileAtomic } from 'src/helpers/fsUtils';

import type { ArrowTheme, AtomConfig } from 'src/@types/config';

/**
 * What the generated theme files were generated with, kept in a small file beside them. At every start the extension
 * compares the settings with the ones of the generated themes; reading them from the theme files means parsing about
 * 900 KB of json (and throwing it away) in the extension host shared by all the extensions, for every window.
 *
 * A theme file is only trusted through this state when it is still the file the state was written for (same size and
 * modification time); in any other case the theme file itself is read, as before. Nothing in this file is needed to
 * generate a theme: deleting it only makes the next start read the theme files once.
 */
const THEME_STATE_FILE = '.state.json';

/** The file the state was written for */
type FileStamp = { mtimeMs: number; size: number };

type IconThemeState = FileStamp & { atomConfig?: Partial<AtomConfig>; layerThemes?: string };
type ProductThemeState = FileStamp & { atomConfig?: { arrowTheme?: ArrowTheme } };

type ThemeState = { icon?: IconThemeState; product?: ProductThemeState };

/** Size and modification time of a file, `undefined` when it cannot be read */
const stampOf = (path: string): FileStamp | undefined => {
  try {
    const { mtimeMs, size } = statSync(path);
    // whole milliseconds: what a Date (and so `utimes`) holds, and the same after a trip through json
    return { mtimeMs: Math.trunc(mtimeMs), size };
  } catch {
    return undefined;
  }
};

const readThemeState = (distribution: string): ThemeState => {
  try {
    const parsed: unknown = JSON.parse(readFileSync(join(distribution, THEME_STATE_FILE), 'utf8'));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as ThemeState) : {};
  } catch {
    return {};
  }
};

/** Merge `patch` into the state; a failure (read-only folder) is left to the theme files, which report it */
const writeThemeState = (distribution: string, patch: ThemeState): void => {
  try {
    writeFileAtomic(join(distribution, THEME_STATE_FILE), JSON.stringify({ ...readThemeState(distribution), ...patch }));
  } catch {
    // the next start reads the theme files
  }
};

/** The state of a theme file, when it was written for the file that is there now */
const currentState = <T extends FileStamp>(state: T | undefined, path: string): T | undefined => {
  if (!state || typeof state.mtimeMs !== 'number' || typeof state.size !== 'number') return undefined;
  const stamp = stampOf(path);
  return stamp && stamp.mtimeMs === state.mtimeMs && stamp.size === state.size ? state : undefined;
};

export { currentState, readThemeState, stampOf, THEME_STATE_FILE, writeThemeState };
export type { FileStamp, IconThemeState, ProductThemeState, ThemeState };

import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, isAbsolute, join } from 'node:path';
import { getHash } from 'src/helpers/utils';

/**
 * Custom SVG icons: an association whose value is the path of an SVG file
 * (`"*.foo": "C:/icons/foo.svg"` or `"~/icons/foo.svg"`) instead of a bundled icon name.
 * The file is copied next to the bundled icons when the theme is generated, because an icon theme
 * can only reference files inside the extension.
 */

/** Whether an association value points to an SVG file rather than naming a bundled icon */
export const isCustomIconPath = (value: string) => /\.svg$/i.test(value.trim());

/** Absolute path of a custom icon, or undefined when the path is relative (there is no sensible base) */
export const resolveCustomIconPath = (value: string): string | undefined => {
  const path = value.trim();
  if (path === '~' || path.startsWith('~/') || path.startsWith('~\\')) return join(homedir(), path.slice(1));
  return isAbsolute(path) ? path : undefined;
};

/** Name of the copied icon: readable, and unique per source path */
export const getCustomIconName = (value: string): string => {
  const path = resolveCustomIconPath(value) ?? value;
  const readable = basename(path).replace(/\.svg$/i, '').toLowerCase().replaceAll(/[^\da-z]+/g, '-');
  return `custom-${readable}-${Math.abs(getHash(path)).toString(36)}`;
};

/** The source of a custom icon if it exists, otherwise undefined */
export const findCustomIcon = (value: string): string | undefined => {
  const path = resolveCustomIconPath(value);
  return path && existsSync(path) ? path : undefined;
};

/** Expanded folder variant of a custom folder icon: `<name>-open.svg` or `<name>_open.svg` next to it, if any */
export const findCustomOpenFolderIcon = (path: string): string => {
  const base = join(dirname(path), basename(path).replace(/\.svg$/i, ''));
  return [`${base}-open.svg`, `${base}_open.svg`].find((candidate) => existsSync(candidate)) ?? path;
};

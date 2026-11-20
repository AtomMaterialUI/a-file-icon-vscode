/**
 * Paths written in the theme files of other extensions (icons, fonts, `include`, `tokenColors`).
 * VS Code loads the resources of a theme only from the folder of the extension contributing it: a path that leaves it
 * (`../../`, an absolute path, another drive) is not used here either, the same as a missing file.
 */
import { posix, win32 } from 'node:path';
import { normalizeName } from 'src/helpers/utils';

import type { PlatformPath } from 'node:path';

/** `node:path` of this platform */
const platformPath: PlatformPath = process.platform === 'win32' ? win32 : posix;

/**
 * Whether `path` is the folder `root` or inside it. Windows paths are compared without case (and in Unicode NFC), as
 * the file system does; an empty root contains nothing.
 * @param pathApi `node:path` of another platform, for the tests
 */
export const isInsideFolder = (root: string, path: string, pathApi: PlatformPath = platformPath): boolean => {
  if (!root || !path) return false;
  const windows = pathApi.sep === '\\';
  const from = pathApi.resolve(root);
  const to = pathApi.resolve(path);
  const relative = windows ? pathApi.relative(normalizeName(from), normalizeName(to)) : pathApi.relative(from, to);
  // another drive of Windows gives an absolute path
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${pathApi.sep}`) && !pathApi.isAbsolute(relative));
};

/**
 * A path of a theme file resolved against the folder of that file, when it stays inside the folder of the extension
 * contributing the theme
 * @param root the folder of the extension (`extensionPath`)
 * @param themeFile the theme file the path is written in
 * @returns the absolute path, or undefined when it leaves `root`
 */
export const resolveThemePath = (root: string, themeFile: string, path: string, pathApi: PlatformPath = platformPath): string | undefined => {
  if (!path) return undefined;
  const resolved = pathApi.resolve(pathApi.dirname(themeFile), path);
  return isInsideFolder(root, resolved, pathApi) ? resolved : undefined;
};

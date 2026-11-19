import { mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

let counter = 0;

/** Whether the file already holds exactly this content */
const hasContent = (path: string, content: Uint8Array | string): boolean => {
  try {
    const current = readFileSync(path);
    return typeof content === 'string' ? current.toString('utf8') === content : current.equals(content);
  } catch {
    return false;
  }
};

/**
 * Write a file through a temporary sibling and a rename, so a reader never sees a half-written file.
 * Several editor windows regenerate the theme at the same time, and the editor reads the theme json while it is
 * being written: a plain write can expose a truncated or interleaved file ("End of file expected", #67).
 *
 * A file that already holds the content is left alone: the theme has thousands of icons, and writing them all again
 * blocks the extension host for seconds on Windows, where reading them back is about ten times faster (fork #28).
 * @returns whether the file was written
 */
export const writeFileAtomic = (path: string, content: Uint8Array | string): boolean => {
  if (hasContent(path, content)) return false;

  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.${counter++}.tmp`;

  try {
    writeFileSync(temporary, content, 'utf8');
    renameSync(temporary, path);
  } catch (error) {
    rmSync(temporary, { force: true });
    throw error;
  }
  return true;
};

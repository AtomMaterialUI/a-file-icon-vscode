import { mkdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

let counter = 0;

/**
 * Write a file through a temporary sibling and a rename, so a reader never sees a half-written file.
 * Several editor windows regenerate the theme at the same time, and the editor reads the theme json while it is
 * being written: a plain write can expose a truncated or interleaved file ("End of file expected", #67).
 */
export const writeFileAtomic = (path: string, content: Uint8Array | string) => {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.${counter++}.tmp`;

  try {
    writeFileSync(temporary, content, 'utf8');
    renameSync(temporary, path);
  } catch (error) {
    rmSync(temporary, { force: true });
    throw error;
  }
};

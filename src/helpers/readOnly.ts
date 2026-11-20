import { rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The extension can be installed where it cannot write: a system-wide install, a read-only mount, a locked-down
 * profile. Its prebuilt themes (`dist/`) still work there; only what it generates from the settings cannot be written.
 */
const READ_ONLY_CODES = new Set(['EACCES', 'EPERM', 'EROFS']);

/** The error code of an error or of one of its causes (the generators wrap the file system error) */
const errorCodes = (error: unknown): string[] => {
  const codes: string[] = [];
  const seen = new Set<unknown>();
  let current = error;
  while (current && typeof current === 'object' && !seen.has(current)) {
    seen.add(current);
    const { cause, code } = current as { cause?: unknown; code?: unknown };
    if (typeof code === 'string') codes.push(code);
    current = cause;
  }
  return codes;
};

/** Whether the error is a refused write: no permission, or a read-only file system */
const isPermissionError = (error: unknown): boolean => errorCodes(error).some((code) => READ_ONLY_CODES.has(code));

/**
 * Whether a new file can be written in the folder. EPERM also comes on Windows from a rename over a file another
 * window has open, which is not a read-only install: the folder itself is tried.
 */
const canWriteIn = (folder: string): boolean => {
  const probe = join(folder, `.write-test.${process.pid}.tmp`);
  try {
    writeFileSync(probe, '');
  } catch (error) {
    return !isPermissionError(error);
  } finally {
    rmSync(probe, { force: true });
  }
  return true;
};

/** Whether the error comes from a folder the extension cannot write in */
const isReadOnlyFailure = (error: unknown, folder: string): boolean => isPermissionError(error) && !canWriteIn(folder);

export { canWriteIn, isPermissionError, isReadOnlyFailure };

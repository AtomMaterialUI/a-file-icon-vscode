import i18next from 'i18next';
import { join } from 'node:path';
import { isReadOnlyFailure } from 'src/helpers/readOnly';
import { getExtensionPath } from 'src/helpers/vscodeUtils';
import { logger } from 'src/services/LoggingService';
import { window } from 'vscode';

import type { Memento } from 'vscode';

/** The version the read-only notice was shown for: once per version, not at every change of a setting */
const SHOWN_KEY = 'readOnlyMessageShown';

let state: Memento | undefined;
let version = '';
/** Shown in this session already (the stored key is only read at the next start) */
let shown = false;

/** Where the notice remembers it was shown */
const initThemeFailure = (globalState: Memento, extensionVersion: string | undefined): void => {
  state = globalState;
  version = extensionVersion ?? '';
  shown = false;
};

/**
 * A failure to generate the theme. When the extension cannot write in its own folder, it says so once: the prebuilt
 * themes keep working, and the settings that need a generated theme (icon settings, accent color, mixed themes) do not
 * apply. Any other failure is shown, otherwise the commands look like they do nothing (#73).
 */
const reportThemeFailure = (error: unknown): void => {
  const message = error instanceof Error ? error.message : String(error);
  logger.error(message);

  const distribution = join(getExtensionPath(), 'dist');
  if (!isReadOnlyFailure(error, distribution)) {
    window.showErrorMessage(`Cool Theme Kit: ${message}`);
    return;
  }

  if (shown || state?.get<string>(SHOWN_KEY) === version) return;
  shown = true;
  state?.update(SHOWN_KEY, version);
  window.showWarningMessage(i18next.t('readOnly.message', { folder: distribution }));
};

export { initThemeFailure, reportThemeFailure };

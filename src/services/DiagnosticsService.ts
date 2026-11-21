import i18next from 'i18next';
import { arch, homedir, platform, release } from 'node:os';
import { EXTENSION_ID, EXTENSION_KEY } from 'src/helpers/constants';
import { formatDiagnostics } from 'src/helpers/diagnostics';
import { isCancellation } from 'src/helpers/utils';
import { openBrowser } from 'src/helpers/vscodeUtils';
import { logger } from 'src/services/LoggingService';
import { env, extensions, UIKind, version, window, workspace } from 'vscode';

import type { DiagnosticsInput } from 'src/helpers/diagnostics';
import type { MessageItem } from 'vscode';

/** Where a new bug report starts: the bug report form of the repository */
const NEW_ISSUE_URL = 'https://github.com/WoogaJJangka/a-file-icon-vscode/issues/new?template=bug_report.yml';

type Contributes = { configuration?: unknown; iconThemes?: unknown[]; productIconThemes?: unknown[]; themes?: unknown[] };
type PackageJson = { contributes?: Contributes; version?: string };

/** The narrowest scope wins in VS Code: it is the one that sets the value in use */
const SCOPES = [
  ['workspaceFolderValue', 'folder'],
  ['workspaceValue', 'workspace'],
  ['globalValue', 'user'],
] as const;

const ownPackage = (): PackageJson => (extensions.getExtension(EXTENSION_ID)?.packageJSON ?? {}) as PackageJson;

/** The settings of this extension set in a scope, with the value of the narrowest one */
const changedSettings = (packageJson: PackageJson): DiagnosticsInput['settings'] => {
  const configuration = packageJson.contributes?.configuration;
  const groups = (Array.isArray(configuration) ? configuration : [configuration]) as Array<{ properties?: Record<string, unknown> }>;
  const keys = groups.flatMap((group) => Object.keys(group?.properties ?? {}));
  const settings: DiagnosticsInput['settings'] = [];
  for (const key of keys) {
    const inspected = workspace.getConfiguration(EXTENSION_KEY).inspect(key.slice(EXTENSION_KEY.length + 1)) as Record<string, unknown> | undefined;
    const scope = SCOPES.find(([field]) => inspected?.[field] !== undefined);
    if (scope && inspected) settings.push({ key, scope: scope[1], value: inspected[scope[0]] });
  }
  return settings;
};

/** The other installed extensions with themes of any kind: they are what the themes are mixed with */
const themeExtensions = (): string[] =>
  extensions.all
    .filter((extension) => !extension.id.toLowerCase().startsWith('vscode.') && extension.id.toLowerCase() !== EXTENSION_ID)
    .filter((extension) => {
      const contributes = (extension.packageJSON as PackageJson | undefined)?.contributes;
      return [contributes?.themes, contributes?.iconThemes, contributes?.productIconThemes].some((themes) => Array.isArray(themes) && themes.length > 0);
    })
    .map((extension) => `${extension.id}@${(extension.packageJSON as PackageJson).version ?? '?'}`);

/** The diagnostics of this window, as Markdown */
export const collectDiagnostics = (): string => {
  const packageJson = ownPackage();
  const workbench = workspace.getConfiguration('workbench');
  return formatDiagnostics({
    app: { language: env.language, name: env.appName, remote: env.remoteName, version, web: env.uiKind === UIKind.Web },
    editorFont: workspace.getConfiguration('editor').get('fontFamily'),
    extensionVersion: packageJson.version,
    home: homedir(),
    os: { arch: arch(), platform: platform(), release: release() },
    settings: changedSettings(packageJson),
    themeExtensions: themeExtensions(),
    themes: { color: workbench.get('colorTheme'), icon: workbench.get('iconTheme'), product: workbench.get('productIconTheme') },
  });
};

/**
 * The "Copy Diagnostics" command: the diagnostics go to the clipboard, and a notice offers to open the bug report form
 * (the command is done when they are copied: the notice waits for the user)
 */
export const copyDiagnostics = async (): Promise<void> => {
  await env.clipboard.writeText(collectDiagnostics());
  logger.info('Diagnostics copied to the clipboard');
  const open: MessageItem = { title: i18next.t('diagnostics.openIssue') };
  window.showInformationMessage(i18next.t('diagnostics.copied'), open).then(
    (action) => {
      if (action === open) openBrowser(NEW_ISSUE_URL);
    },
    (error: unknown) => {
      if (!isCancellation(error)) logger.error(String(error));
    },
  );
};

export { NEW_ISSUE_URL };

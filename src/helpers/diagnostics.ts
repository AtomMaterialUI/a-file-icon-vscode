/**
 * The diagnostics of the "Copy Diagnostics" command: what a bug report needs to be reproduced (versions, the selected
 * themes, the theme extensions installed next to this one, the settings of this extension that are not the defaults),
 * as Markdown for an issue. Nothing is sent anywhere: the user reads it and pastes it.
 */

type DiagnosticsInput = {
  /** `vscode.env.appName`, `vscode.version`, desktop or web, `vscode.env.remoteName`, `vscode.env.language` */
  app: { language: string; name: string; remote?: string; version: string; web: boolean };
  editorFont: unknown;
  extensionVersion: string | undefined;
  /** the home folder of the user: written `~` so that the user name does not end up in a public issue */
  home: string;
  os: { arch: string; platform: string; release: string };
  /** the settings of this extension changed from their defaults, with the scope that sets each one */
  settings: Array<{ key: string; scope: string; value: unknown }>;
  /** the installed extensions (not the built-in ones) that contribute themes of any kind: `publisher.name@version` */
  themeExtensions: string[];
  themes: { color: unknown; icon: unknown; product: unknown };
};

/** Write the home folder `~`, with either kind of slash */
const redact = (text: string, home: string): string => {
  if (home.length < 2) return text;
  const variants = new Set([home, home.replaceAll('\\', '/'), home.replaceAll('\\', '\\\\')]);
  let result = text;
  for (const variant of variants) result = result.split(variant).join('~');
  return result;
};

/** A value in a cell of a Markdown table: one line, with its pipes escaped */
const cell = (value: unknown): string => {
  if (value === undefined || value === null || value === '') return '(none)';
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  return text.replaceAll(/\s+/g, ' ').replaceAll('|', String.raw`\|`);
};

export const formatDiagnostics = (input: DiagnosticsInput): string => {
  const { app, os } = input;
  const where = [app.web ? 'web' : 'desktop', app.remote ? `remote: ${app.remote}` : undefined].filter(Boolean).join(', ');
  const rows: Array<[string, unknown]> = [
    ['Cool Theme Kit', input.extensionVersion],
    ['Editor', `${app.name} ${app.version} (${where})`],
    ['OS', `${os.platform} ${os.arch} ${os.release}`],
    ['Display language', app.language],
    ['Color theme', input.themes.color],
    ['File icon theme', input.themes.icon],
    ['Product icon theme', input.themes.product],
    ['Editor font', input.editorFont],
    ['Theme extensions', input.themeExtensions.length > 0 ? [...input.themeExtensions].sort((a, b) => a.localeCompare(b)).join(', ') : undefined],
  ];

  const lines = [
    '<!-- Cool Theme Kit: Copy Diagnostics. Check it before you post it: settings can contain file and folder names. -->',
    '',
    '| | |',
    '|---|---|',
    ...rows.map(([name, value]) => `| ${name} | ${cell(value)} |`),
    '',
  ];
  if (input.settings.length === 0) {
    lines.push('Settings of Cool Theme Kit: all defaults.');
  } else {
    const settings = Object.fromEntries(input.settings.map(({ key, scope, value }) => [`${key} (${scope})`, value]));
    lines.push('Settings of Cool Theme Kit changed from the defaults:', '', '```json', JSON.stringify(settings, null, 2), '```');
  }
  return redact(lines.join('\n'), input.home) + '\n';
};

export type { DiagnosticsInput };

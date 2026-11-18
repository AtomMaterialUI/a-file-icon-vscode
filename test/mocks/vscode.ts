/**
 * Minimal stand-in for the `vscode` module so the theme generation logic can be
 * exercised from plain Node (mocha) without launching VS Code.
 * Only the APIs touched by the services under test are implemented.
 */

export const testState: { config: Record<string, unknown>; extensionPath: string } = {
  config: {},
  extensionPath: '',
};

export enum ConfigurationTarget {
  Global = 1,
  Workspace = 2,
  WorkspaceFolder = 3,
}

export enum LogLevel {
  Off = 0,
  Trace = 1,
  Debug = 2,
  Info = 3,
  Warning = 4,
  Error = 5,
}

export enum QuickPickItemKind {
  Separator = -1,
  Default = 0,
}

const disposable = { dispose: () => undefined };

export const workspace = {
  getConfiguration: (section?: string) => ({
    get: <T>(key: string): T | undefined => (section ? testState.config[key] : undefined) as T | undefined,
    inspect: () => undefined,
    update: async (key: string, value: unknown) => {
      testState.config[key] = value;
    },
  }),
  onDidChangeConfiguration: () => disposable,
};

export const extensions = {
  getExtension: () => ({ extensionPath: testState.extensionPath }),
};

const noop = () => undefined;
const outputChannel = {
  appendLine: noop,
  debug: noop,
  error: noop,
  info: noop,
  trace: noop,
  warn: noop,
};

export const window = {
  createOutputChannel: () => outputChannel,
  onDidChangeWindowState: () => disposable,
  showInformationMessage: async () => undefined,
  showInputBox: async () => undefined,
  showQuickPick: async () => undefined,
};

export const commands = {
  registerCommand: () => disposable,
};

export const env = {
  language: 'en',
  openExternal: async () => true,
};

export const Uri = {
  parse: (value: string) => value,
};

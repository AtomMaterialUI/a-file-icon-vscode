/**
 * Minimal stand-in for the `vscode` module so the theme generation logic can be
 * exercised from plain Node (mocha) without launching VS Code.
 * Only the APIs touched by the services under test are implemented.
 */

/** An installed extension, as `vscode.extensions.all` lists it */
export type TestExtension = { extensionPath: string; id: string; packageJSON: Record<string, unknown> };

export const testState: {
  /**
   * The settings, by bare key (`opacity`, any section answers it), except for the sections listed in `sections`, whose
   * keys carry their section (`editor.fontFamily`): two of them can then hold the same key.
   */
  config: Record<string, unknown>;
  /** sections whose settings are kept apart and reported by `inspect` as user settings (the other sections inspect nothing) */
  sections: Set<string>;
  extensionPath: string;
  /** the other installed extensions */
  extensions: TestExtension[];
  lastTarget?: number;
  /** the notices shown, oldest first */
  messages: { kind: 'error' | 'information' | 'warning'; text: string }[];
  /** the titles of the buttons the user clicks, one per notice in order; a notice with none left is dismissed */
  answers: string[];
} = {
  answers: [],
  config: {},
  extensionPath: '',
  extensions: [],
  messages: [],
  sections: new Set(),
};

const show =
  (kind: 'error' | 'information' | 'warning') =>
  async (text: string, ...items: unknown[]) => {
    testState.messages.push({ kind, text });
    const title = testState.answers.shift();
    // the options object of a modal notice has no title
    return items.find((item) => typeof item === 'object' && item !== null && (item as { title?: unknown }).title === title);
  };

const isKeptApart = (section: string | undefined): section is string => section !== undefined && testState.sections.has(section);

const settingKey = (section: string | undefined, key: string) => (isKeptApart(section) ? `${section}.${key}` : key);

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

export enum ColorThemeKind {
  Light = 1,
  Dark = 2,
  HighContrast = 3,
  HighContrastLight = 4,
}

export enum FileType {
  Unknown = 0,
  File = 1,
  Directory = 2,
  SymbolicLink = 64,
}

export enum ViewColumn {
  Active = -1,
  Beside = -2,
  One = 1,
}

export enum QuickPickItemKind {
  Separator = -1,
  Default = 0,
}

const disposable = { dispose: () => undefined };

export const workspace = {
  getConfiguration: (section?: string) => ({
    get: <T>(key: string): T | undefined => (section ? testState.config[settingKey(section, key)] : undefined) as T | undefined,
    inspect: <T>(key: string) => {
      if (!isKeptApart(section)) return undefined;
      const value = testState.config[settingKey(section, key)] as T | undefined;
      return value === undefined ? undefined : { globalValue: value, key: settingKey(section, key) };
    },
    update: async (key: string, value: unknown, target?: number) => {
      testState.config[settingKey(section, key)] = value;
      testState.lastTarget = target;
    },
  }),
  onDidChangeConfiguration: () => disposable,
  workspaceFolders: undefined as unknown[] | undefined,
};

export const extensions = {
  get all(): TestExtension[] {
    return testState.extensions;
  },
  getExtension: () => ({ extensionPath: testState.extensionPath }),
  onDidChange: () => disposable,
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
  showErrorMessage: show('error'),
  showInformationMessage: show('information'),
  showInputBox: async () => undefined,
  showQuickPick: async () => undefined,
  showWarningMessage: show('warning'),
};

/** The commands registered so far, by id: a test runs one with `registeredCommands.get(id)?.(...arguments)` */
export const registeredCommands = new Map<string, (...parameters: unknown[]) => unknown>();

export const commands = {
  registerCommand: (id: string, callback: (...parameters: unknown[]) => unknown) => {
    registeredCommands.set(id, callback);
    return disposable;
  },
};

export const env = {
  language: 'en',
  openExternal: async () => true,
};

export const Uri = {
  parse: (value: string) => value,
};

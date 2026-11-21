/**
 * Captures the screenshots of the README in a real VS Code: `bun run build`, then
 * `bun run screenshots [version] [--vsix <file>]` (default `stable`). The images go to `docs/screenshots/`.
 * With `--vsix` (from `vsce package`), the extension is installed as users get it; without it, it runs in development
 * mode and the title bar says so.
 *
 * - VS Code runs with an empty profile in a temporary folder: `--user-data-dir`, `--extensions-dir` and
 *   `--shared-data-dir` all point there, never to the user's own VS Code (fork #40). The extension runs from this
 *   folder (`--extensionDevelopmentPath`), so the images show the code as it is.
 * - A small sample project with Korean names and comments is written next to the profile.
 * - The window is driven through the Chrome DevTools Protocol (`--remote-debugging-port`): key presses for the commands,
 *   `Page.captureScreenshot` for the images. The window is not brought to the front, so it does not get in the way.
 */
const { downloadAndUnzipVSCode, resolveCliArgsFromVSCodeExecutablePath } = require('@vscode/test-electron');
const { spawn, spawnSync } = require('node:child_process');
const { mkdirSync, mkdtempSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { dirname, join, resolve } = require('node:path');

const root = join(__dirname, '..', '..');
const output = join(root, 'docs', 'screenshots');
const args = process.argv.slice(2);
const vsixIndex = args.indexOf('--vsix');
const vsix = vsixIndex === -1 ? undefined : resolve(args[vsixIndex + 1]);
const version = args.find((argument, index) => !argument.startsWith('--') && index !== vsixIndex + 1) ?? 'stable';
const PORT = 9339;
const WIDTH = 1440;
const HEIGHT = 900;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const EDITOR_FONT =
  "'JetBrains Mono', 'D2Coding', Consolas, Menlo, 'Droid Sans Mono', 'Malgun Gothic', 'Apple SD Gothic Neo', 'Noto Sans Mono CJK KR', 'Courier New', monospace";

/** The settings of the profile: the kit selected, nothing else on the screen (no chat, no notices, no tips) */
const settings = (colorTheme) => ({
  'a-file-icon-vscode.showUpdateMessage': false,
  'a-file-icon-vscode.showWelcomeMessage': false,
  'chat.disableAIFeatures': true,
  'editor.fontFamily': EDITOR_FONT,
  'editor.fontSize': 14,
  'editor.minimap.enabled': false,
  'explorer.compactFolders': false,
  'extensions.autoCheckUpdates': false,
  'extensions.ignoreRecommendations': true,
  'security.workspace.trust.enabled': false,
  'telemetry.telemetryLevel': 'off',
  'update.mode': 'none',
  'window.commandCenter': true,
  'workbench.colorTheme': colorTheme,
  'workbench.iconTheme': 'a-file-icon-vscode',
  'workbench.layoutControl.enabled': false,
  'workbench.productIconTheme': 'cool-islands-product-icons',
  'workbench.secondarySideBar.defaultVisibility': 'hidden',
  'workbench.startupEditor': 'none',
  'workbench.tips.enabled': false,
});

const MAIN_PY = `"""주문 처리 서비스: Cool Islands 미리보기용 예제."""
import re
from dataclasses import dataclass, field
from typing import Iterable

PRICE_PATTERN = re.compile(r"^(\\d+)원$")


@dataclass
class Order:
    """주문 한 건."""

    customer: str
    items: list[str] = field(default_factory=list)
    total: int = 0

    def add(self, name: str, price: int) -> None:
        # 상품을 담고 합계를 늘린다
        self.items.append(name)
        self.total += price

    def __repr__(self) -> str:
        return f"Order({self.customer!r}, {len(self.items)}개, {self.total:,}원)"


def parse_price(text: str) -> int | None:
    match = PRICE_PATTERN.match(text.strip())
    return int(match.group(1)) if match else None


def summarize(orders: Iterable[Order]) -> dict[str, int]:
    summary: dict[str, int] = {}
    for order in orders:
        summary[order.customer] = summary.get(order.customer, 0) + order.total
    return summary


if __name__ == "__main__":
    order = Order(customer="김코딩")
    order.add("키보드", parse_price("89000원") or 0)
    print(order, summarize([order]), sep="\\n")
`;

/** A project with the files of a usual Python and web repository */
const SAMPLE = {
  '.env.example': 'DATABASE_URL=postgres://localhost/orders\n',
  '.github/workflows/ci.yml': 'name: CI\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n',
  '.gitignore': '__pycache__/\nnode_modules/\n.env\n',
  'Dockerfile': 'FROM python:3.13-slim\nCOPY . /app\nCMD ["python", "-m", "app.main"]\n',
  'LICENSE': 'MIT License\n',
  'README.md': '# 주문 서비스\n\nCool Theme Kit 미리보기용 예제입니다.\n',
  'docker-compose.yml': 'services:\n  app:\n    build: .\n',
  'docs/설계.md': '# 설계\n',
  'package.json': '{\n  "name": "orders-web",\n  "private": true\n}\n',
  'pyproject.toml': '[project]\nname = "orders"\nversion = "0.1.0"\n',
  'requirements.txt': 'fastapi\n',
  'src/app/__init__.py': '',
  'src/app/main.py': MAIN_PY,
  'src/app/models.py': '"""모델."""\n',
  'src/app/주문.json': '{ "customer": "김코딩" }\n',
  'tests/test_main.py': 'from app.main import parse_price\n\n\ndef test_parse_price():\n    assert parse_price("1000원") == 1000\n',
  'tsconfig.json': '{ "compilerOptions": { "strict": true } }\n',
  'web/app.ts': 'export const hello = (name: string) => `안녕, ${name}`;\n',
  'web/index.html': '<!doctype html>\n<title>주문</title>\n',
  'web/style.css': 'body { margin: 0; }\n',
};

const writeFiles = (folder, files) => {
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(folder, path)), { recursive: true });
    writeFileSync(join(folder, path), content);
  }
};

/** The page of the workbench, through CDP */
const connect = async () => {
  let pages = [];
  for (let attempt = 0; attempt < 120; attempt++) {
    try {
      pages = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
      if (pages.some((page) => page.type === 'page' && page.url.includes('workbench'))) break;
    } catch {
      // not listening yet
    }
    await sleep(500);
  }
  const page = pages.find((item) => item.type === 'page' && item.url.includes('workbench'));
  if (!page) throw new Error('VS Code did not open its window');

  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve);
    socket.addEventListener('error', reject);
  });
  let id = 0;
  const pending = new Map();
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    // only the answer to a request of this script: events have no id, and an id is a number this script gave
    if (!Number.isInteger(message.id)) return;
    const resolve = pending.get(message.id);
    if (typeof resolve !== 'function') return;
    pending.delete(message.id);
    resolve(message);
  });
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      pending.set(++id, resolve);
      socket.send(JSON.stringify({ id, method, params }));
    });
  return { close: () => socket.close(), send };
};

const EXTENSION_ID = 'woogajjangka.cool-theme-kit';

/**
 * The commands of the captures, each on a key of the profile: the command palette could pick another command with a
 * similar title, and a key also passes arguments
 */
const COMMANDS = {
  clearNotifications: { command: 'notifications.clearAll' },
  closeEditors: { command: 'workbench.action.closeAllEditors' },
  mixColors: { args: 'colors', command: 'a-file-icon-vscode.openThemeMixer' },
  mixIcons: { args: 'icons', command: 'a-file-icon-vscode.openThemeMixer' },
  mixProduct: { args: 'product', command: 'a-file-icon-vscode.openThemeMixer' },
  walkthrough: { args: `${EXTENSION_ID}#coolThemeKit`, command: 'workbench.action.openWalkthrough' },
};
/** F13 to F24: keys no other binding uses */
const commandKey = (index) => ({ code: `F${13 + index}`, key: `F${13 + index}`, windowsVirtualKeyCode: 124 + index });
const keybindings = () => Object.values(COMMANDS).map((binding, index) => ({ ...binding, key: `f${13 + index}` }));

const capture = async () => {
  const executable = await downloadAndUnzipVSCode(version);
  const temporary = mkdtempSync(join(tmpdir(), 'cool-screenshots-'));
  const folders = Object.fromEntries(['user', 'extensions', 'shared', 'sample'].map((name) => [name, join(temporary, name)]));
  const settingsFile = join(folders.user, 'User', 'settings.json');
  writeFiles(folders.sample, SAMPLE);
  writeFiles(folders.user, {
    'User/keybindings.json': JSON.stringify(keybindings(), null, 2),
    'User/settings.json': JSON.stringify(settings('Cool Islands Dark'), null, 2),
  });
  mkdirSync(output, { recursive: true });

  const profile = [
    `--user-data-dir=${folders.user}`,
    `--extensions-dir=${folders.extensions}`,
    // the shared storage of the user's own VS Code is never opened (fork #40)
    `--shared-data-dir=${folders.shared}`,
  ];
  // the theme of the default layer of `iconThemeLayers`, so the Mix Themes page shows it mixed in; and an installed
  // VSIX, as users get the extension (without one, it runs from this folder in development mode, and the title bar
  // says "[Extension Development Host]")
  const [cli] = resolveCliArgsFromVSCodeExecutablePath(executable);
  for (const extension of ['PKief.material-icon-theme', ...(vsix ? [vsix] : [])]) {
    const installed = spawnSync(cli, [...profile, '--install-extension', extension], {
      encoding: 'utf8',
      shell: process.platform === 'win32',
      stdio: 'inherit',
    });
    if (installed.status !== 0) throw new Error(`Could not install ${extension}`);
  }

  const code = spawn(
    executable,
    [
      ...profile,
      ...(vsix ? [] : [`--extensionDevelopmentPath=${root}`]),
      `--remote-debugging-port=${PORT}`,
      '--disable-workspace-trust',
      '--skip-release-notes',
      '--skip-welcome',
      '--new-window',
      folders.sample,
      join(folders.sample, 'src', 'app', 'main.py'),
    ],
    { stdio: 'ignore' },
  );

  const page = await connect();
  const run = async (expression) => (await page.send('Runtime.evaluate', { awaitPromise: true, expression, returnByValue: true })).result?.result?.value;
  /** Run a command of COMMANDS by its key, with the focus moved from a webview (it would get the key) to the explorer */
  const command = async (name, wait = 2500) => {
    await run("document.querySelector('.explorer-folders-view .monaco-list')?.focus()");
    await sleep(300);
    const key = commandKey(Object.keys(COMMANDS).indexOf(name));
    for (const type of ['rawKeyDown', 'keyUp']) await page.send('Input.dispatchKeyEvent', { type, ...key });
    await sleep(wait);
  };
  const shot = async (name) => {
    await run('document.activeElement?.blur()');
    await sleep(400);
    const image = await page.send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(output, name), Buffer.from(image.result.data, 'base64'));
    console.log(`  docs/screenshots/${name}`);
  };
  const useSettings = async (colorTheme) => {
    writeFileSync(settingsFile, JSON.stringify(settings(colorTheme), null, 2));
    await sleep(3000);
  };

  try {
    await page.send('Emulation.setDeviceMetricsOverride', { deviceScaleFactor: 1, height: HEIGHT, mobile: false, width: WIDTH });
    // the first start of a profile shows a welcome dialog over the window
    await sleep(6000);
    await run("document.querySelector('.onboarding-a-close-btn')?.click()");
    // the extension generates its theme files on the first start
    await sleep(6000);
    await command('clearNotifications', 800);

    await shot('cool-islands-dark.png');
    await useSettings('Cool Islands Light');
    await shot('cool-islands-light.png');
    await useSettings('Cool Islands Dark');

    await command('mixIcons', 4000);
    await shot('mix-icon-themes.png');
    await command('mixColors', 3000);
    await shot('mix-color-themes.png');
    await command('mixProduct', 3000);
    await shot('mix-product-icon-themes.png');
    await command('closeEditors', 800);

    await command('walkthrough', 3000);
    await command('clearNotifications', 800);
    await shot('walkthrough.png');
  } finally {
    page.close();
    // VS Code starts more processes than the one spawned: end the whole tree
    if (process.platform === 'win32') spawn('taskkill', ['/pid', String(code.pid), '/t', '/f'], { stdio: 'ignore' });
    else code.kill();
    await sleep(2000);
    rmSync(temporary, { force: true, maxRetries: 5, recursive: true });
  }
};

capture().catch((error) => {
  console.error(error);
  process.exit(1);
});

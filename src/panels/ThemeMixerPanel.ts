import { randomBytes } from 'node:crypto';
import { join } from 'node:path';
import i18next from 'i18next';
import { EXTENSION_KEY, JSON_FILE_NAME } from 'src/helpers/constants';
import { normalizeByName, normalizeLayers, parseNameKey, serializeLayers } from 'src/helpers/themeLayers';
import { ThemePreview } from 'src/helpers/themePreview';
import { getExtensionPath, getLanguageLookup, listIconThemes } from 'src/helpers/vscodeUtils';
import { colorMixerState } from 'src/panels/colorMixerState';
import { productMixerState } from 'src/panels/productMixerState';
import { ISLANDS_PRODUCT_THEME_ID } from 'src/productIcons/islandsProductTheme';
import { ProductIconGenerator } from 'src/productIcons/ProductIconGenerator';
import { normalizeProductByName, normalizeProductLayers, serializeProductLayers } from 'src/productIcons/productIconLayers';
import { colorThemeService, listColorThemes } from 'src/services/ColorThemeService';
import { configService } from 'src/services/ConfigService';
import { listProductThemes, productIconService } from 'src/services/ProductIconService';
import { logger } from 'src/services/LoggingService';
import { isDefaultAccent, normalizeAccent } from 'src/themes/accent';
import { normalizeColorLayers, parseColorKey, serializeColorLayers } from 'src/themes/colorLayers';
import { ColorThemeGenerator, kindOf } from 'src/themes/ColorThemeGenerator';
import { COLOR_THEMES, THEMES_FOLDER } from 'src/themes/colorThemes';
import { ColorThemeKind, ConfigurationTarget, FileType, Uri, ViewColumn, window, workspace } from 'vscode';

import type { LayerMode } from 'src/@types/config';
import type { PreviewFont, PreviewIcon } from 'src/helpers/themePreview';
import type { InstalledIconTheme } from 'src/helpers/vscodeUtils';
import type { Disposable, ExtensionContext, Webview, WebviewPanel } from 'vscode';

const VIEW_TYPE = `${EXTENSION_KEY}.themeMixer`;
const SAMPLES_KEY = 'themeMixer.samples';
const MAX_SAMPLES = 80;
const MODES = new Set<unknown>(['fill', 'off', 'override']);

/** The names shown when the user has not chosen any: common files of several languages, and folders */
const DEFAULT_SAMPLES = [
  'package.json',
  'README.md',
  'index.html',
  'styles.scss',
  'App.vue',
  'Button.tsx',
  'utils.spec.ts',
  'tsconfig.json',
  'main.go',
  'app.py',
  'Cargo.toml',
  'build.gradle',
  'Dockerfile',
  '.gitignore',
  '.env',
  'data.csv',
  'src/',
  'test/',
  'docs/',
  '.github/',
  'node_modules/',
];

type MixerTab = 'colors' | 'icons' | 'product';

/** An icon as the webview draws it */
type ViewIcon =
  | { character: string; color?: string; font: string; kind: 'glyph'; size: string }
  | { currentColor?: boolean; kind: 'image'; src: string };

/** Messages of the webview */
type ViewMessage =
  | { accent: unknown; type: 'accentColor' }
  | { byKey: unknown; type: 'colorByKey' }
  | { byName: unknown; type: 'byName' }
  | { byName: unknown; type: 'productByName' }
  | { layers: unknown; type: 'colorLayers' | 'layers' | 'productLayers' }
  | { samples: unknown; type: 'samples' }
  | { type: 'defaultSamples' | 'ready' | 'workspaceSamples' };

const TRANSLATED = [
  'accent',
  'accentHint',
  'accentReset',
  'add',
  'addLayer',
  'applyAuto',
  'applyBoth',
  'applyDark',
  'applyLight',
  'applyTo',
  'applying',
  'base',
  'byName',
  'byNameHint',
  'colorByKey',
  'colorByKeyHint',
  'colorInactive',
  'colorLayers',
  'colorLayersHint',
  'colorPreview',
  'colorPreviewHint',
  'dark',
  'defaultSamples',
  'keyPlaceholder',
  'light',
  'noColorByKey',
  'noColorLayers',
  'noColorThemes',
  'noProductByName',
  'noProductLayers',
  'noProductThemes',
  'productByName',
  'productByNameHint',
  'productInactive',
  'productKeyPlaceholder',
  'productLayers',
  'productLayersHint',
  'productPreview',
  'productPreviewHint',
  'vscodeIcon',
  'syntax',
  'tabColors',
  'tabIcons',
  'tabProduct',
  'ui',
  'files',
  'folders',
  'inactive',
  'layers',
  'layersHint',
  'modeFill',
  'modeOff',
  'modeOverride',
  'moveDown',
  'moveUp',
  'name',
  'namePlaceholder',
  'noByName',
  'noLayers',
  'noThemes',
  'notInstalled',
  'pin',
  'preview',
  'previewHint',
  'remove',
  'result',
  'samples',
  'samplesHint',
  'title',
  'unpin',
  'updateSamples',
  'workspaceSamples',
] as const;

/** Names given by the webview or stored: trimmed, non-empty, each once, at most MAX_SAMPLES */
export const cleanSamples = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  const names = value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean);
  return [...new Set(names)].slice(0, MAX_SAMPLES);
};

/**
 * The theme mixer: a page to choose the other icon themes mixed with this theme (`iconThemeLayers`) and the theme of
 * single names (`iconThemeByName`), with a preview of the icons each theme and the result give to sample names.
 * The settings are written like any other setting: the theme is regenerated, then the preview is refreshed.
 */
export class ThemeMixerPanel {
  private static current: ThemeMixerPanel | undefined;

  private readonly disposables: Disposable[] = [];
  private refreshTimer: NodeJS.Timeout | undefined;
  private roots = '';
  /** The tab the page opens on, sent once the page is ready */
  private tab: MixerTab = 'icons';

  private constructor(
    private readonly panel: WebviewPanel,
    private readonly context: ExtensionContext,
  ) {
    this.panel.webview.html = this.html(this.panel.webview);
    this.disposables.push(
      this.panel.onDidDispose(() => this.dispose()),
      this.panel.webview.onDidReceiveMessage((message: ViewMessage) => this.receive(message)),
      window.onDidChangeActiveColorTheme(() => ThemeMixerPanel.refresh()),
    );
  }

  /** Open the page on a tab, or show it on that tab when it is already open */
  static show(context: ExtensionContext, tab: MixerTab) {
    if (ThemeMixerPanel.current) {
      ThemeMixerPanel.current.tab = tab;
      ThemeMixerPanel.current.panel.reveal();
      ThemeMixerPanel.current.postTab();
      return;
    }
    const panel = window.createWebviewPanel(VIEW_TYPE, i18next.t('themeMixer.title'), ViewColumn.Active, {
      enableScripts: true,
      localResourceRoots: ThemeMixerPanel.resourceRoots(),
      retainContextWhenHidden: true,
    });
    ThemeMixerPanel.current = new ThemeMixerPanel(panel, context);
    ThemeMixerPanel.current.tab = tab;
  }

  /** Redraw the open page, after the theme was regenerated or the installed themes changed */
  static refresh() {
    const current = ThemeMixerPanel.current;
    if (!current) return;

    clearTimeout(current.refreshTimer);
    current.refreshTimer = setTimeout(() => current.post(), 150);
  }

  /** The folders the page may load icons and fonts from: this extension and the extensions of the other themes */
  private static resourceRoots(): Uri[] {
    const paths = new Set([
      getExtensionPath(),
      ...listIconThemes().map((theme) => theme.extensionPath),
      ...listProductThemes().map((theme) => theme.extensionPath),
    ]);
    return [...paths].filter(Boolean).map((path) => Uri.file(path));
  }

  private dispose() {
    ThemeMixerPanel.current = undefined;
    clearTimeout(this.refreshTimer);
    for (const disposable of this.disposables) disposable.dispose();
  }

  /** The names of the preview: the user's, or the default ones */
  private samples(): string[] {
    const stored = cleanSamples(this.context.globalState.get<unknown>(SAMPLES_KEY));
    return stored.length > 0 ? stored : DEFAULT_SAMPLES;
  }

  private async setSamples(samples: string[] | undefined) {
    await this.context.globalState.update(SAMPLES_KEY, samples);
    this.post();
  }

  private async receive(message: ViewMessage) {
    try {
      switch (message?.type) {
        case 'ready': {
          this.postTab();
          this.post();
          break;
        }
        case 'layers': {
          this.writeLayers(message.layers);
          break;
        }
        case 'byName': {
          this.writeByName(message.byName);
          break;
        }
        case 'colorLayers': {
          const layers = normalizeColorLayers(Array.isArray(message.layers) ? message.layers : []);
          configService.setConfigValueWhereDefined('colorThemeLayers', serializeColorLayers(layers), ConfigurationTarget.Global);
          break;
        }
        case 'productLayers': {
          const layers = normalizeProductLayers(Array.isArray(message.layers) ? message.layers : []);
          configService.setConfigValueWhereDefined('productIconThemeLayers', serializeProductLayers(layers), ConfigurationTarget.Global);
          break;
        }
        case 'productByName': {
          const byName: Record<string, string> = {};
          for (const entry of (Array.isArray(message.byName) ? message.byName : []) as Array<Record<string, unknown> | undefined>) {
            const key = typeof entry?.key === 'string' ? entry.key.trim() : '';
            const theme = typeof entry?.theme === 'string' ? entry.theme.trim() : '';
            if (key && theme) byName[key] = theme;
          }
          const valid = normalizeProductByName(byName).map((entry) => [entry.key, entry.theme]);
          configService.setConfigValueWhereDefined('productIconByName', valid.length > 0 ? Object.fromEntries(valid) : undefined, ConfigurationTarget.Global);
          break;
        }
        case 'accentColor': {
          // a color picker only gives #rrggbb; anything else (or the Islands blue) clears the setting
          const accent = normalizeAccent(message.accent);
          configService.setConfigValueWhereDefined('accentColor', isDefaultAccent(accent) ? undefined : accent, ConfigurationTarget.Global);
          break;
        }
        case 'colorByKey': {
          const byKey: Record<string, string> = {};
          for (const entry of (Array.isArray(message.byKey) ? message.byKey : []) as Array<Record<string, unknown> | undefined>) {
            const key = typeof entry?.key === 'string' ? entry.key.trim() : '';
            const theme = typeof entry?.theme === 'string' ? entry.theme.trim() : '';
            if (key && theme && parseColorKey(key)) byKey[key] = theme;
          }
          const empty = Object.keys(byKey).length === 0;
          configService.setConfigValueWhereDefined('colorThemeByKey', empty ? undefined : byKey, ConfigurationTarget.Global);
          break;
        }
        case 'samples': {
          await this.setSamples(cleanSamples(message.samples));
          break;
        }
        case 'defaultSamples': {
          await this.setSamples(undefined);
          break;
        }
        case 'workspaceSamples': {
          await this.setSamples(await this.workspaceSamples());
          break;
        }
        default: {
          break;
        }
      }
    } catch (error) {
      logger.error(`Theme mixer: ${String(error)}`);
    }
  }

  /** The layers as the page lists them, in their order, written to the setting */
  private writeLayers(value: unknown) {
    const layers = Array.isArray(value)
      ? normalizeLayers(value.map((item: Record<string, unknown> | undefined) => ({
        files: MODES.has(item?.files) ? (item?.files as LayerMode) : 'fill',
        folders: MODES.has(item?.folders) ? (item?.folders as LayerMode) : 'fill',
        theme: item?.theme,
      })))
      : [];
    configService.setConfigValueWhereDefined('iconThemeLayers', serializeLayers(layers), ConfigurationTarget.Global);
  }

  /** The names of the page and their theme written to the setting; no name removes it */
  private writeByName(value: unknown) {
    const entries = Array.isArray(value) ? value : [];
    const byName: Record<string, string> = {};
    for (const entry of entries as Array<Record<string, unknown> | undefined>) {
      const key = typeof entry?.key === 'string' ? entry.key.trim() : '';
      const theme = typeof entry?.theme === 'string' ? entry.theme.trim() : '';
      if (key && theme && parseNameKey(key)) byName[key] = theme;
    }
    const empty = Object.keys(byName).length === 0;
    configService.setConfigValueWhereDefined('iconThemeByName', empty ? undefined : byName, ConfigurationTarget.Workspace);
  }

  /** The files and folders at the top of the first workspace folder, folders first */
  private async workspaceSamples(): Promise<string[] | undefined> {
    const folder = workspace.workspaceFolders?.[0];
    if (!folder) return undefined;

    const entries = await workspace.fs.readDirectory(folder.uri);
    const folders = entries.filter(([, type]) => type & FileType.Directory).map(([name]) => `${name}/`);
    const files = entries.filter(([, type]) => !(type & FileType.Directory)).map(([name]) => name);
    const compare = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: 'base' });
    return cleanSamples([...folders.sort(compare), ...files.sort(compare)]);
  }

  private postTab() {
    this.panel.webview.postMessage({ tab: this.tab, type: 'tab' }).then(undefined, (error: unknown) => logger.error(String(error)));
  }

  /** Send the whole state of the page */
  private post() {
    const webview = this.panel.webview;
    const themes = listIconThemes();

    const roots = ThemeMixerPanel.resourceRoots();
    const rootsKey = roots.map((root) => root.fsPath).join('\n');
    if (this.roots && rootsKey !== this.roots) {
      // a theme was installed: the page may load its icons only after the roots are updated (this reloads the page)
      webview.options = { ...webview.options, localResourceRoots: roots };
    }
    this.roots = rootsKey;

    const state = this.state(webview, themes);
    webview.postMessage({ state, type: 'state' }).then(undefined, (error: unknown) => logger.error(String(error)));
  }

  private state(webview: Webview, themes: InstalledIconTheme[]) {
    const label = (id: string) => themes.find((theme) => theme.id === id)?.label ?? id;
    const installed = (id: string) => themes.some((theme) => theme.id === id);

    const layers = normalizeLayers(configService.iconThemeLayers);
    const byNameSetting = configService.iconThemeByName ?? {};
    const byName = Object.entries(byNameSetting)
      .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
      .map(([key, theme]) => ({ key, theme }));
    const usedByName = normalizeByName(byNameSetting).map((entry) => entry.theme);

    // the themes in use first, then the other installed ones
    const columnIds = [...new Set([...layers.map((layer) => layer.theme), ...usedByName, ...themes.map((theme) => theme.id)])];
    const columns = columnIds.map((id) => ({ id, installed: installed(id), label: label(id) }));

    const languages = getLanguageLookup();
    const light = [ColorThemeKind.Light, ColorThemeKind.HighContrastLight].includes(window.activeColorTheme.kind);
    const result = new ThemePreview(EXTENSION_KEY, join(getExtensionPath(), 'dist', JSON_FILE_NAME), languages);
    const previews = new Map(
      themes.filter((theme) => columnIds.includes(theme.id)).map((theme) => [theme.id, new ThemePreview(theme.id, theme.path, languages)]),
    );

    const fonts = new Map<string, PreviewFont>();
    const view = (icon: PreviewIcon | undefined): ViewIcon | null => {
      if (!icon) return null;
      if (icon.kind === 'image') {
        const source = webview.asWebviewUri(Uri.file(icon.path)).toString();
        return icon.currentColor ? { currentColor: true, kind: 'image', src: source } : { kind: 'image', src: source };
      }

      fonts.set(icon.font.key, icon.font);
      return { character: icon.character, ...(icon.color ? { color: icon.color } : {}), font: icon.font.key, kind: 'glyph', size: icon.size };
    };

    const rows = this.samples().map((name) => ({
      icons: Object.fromEntries(columnIds.map((id) => [id, view(previews.get(id)?.icon(name, light))])),
      name,
      pinned: byName.find((entry) => entry.key.trim().toLowerCase() === name.toLowerCase())?.theme,
      result: view(result.icon(name, light)),
    }));

    const selectedColorTheme = workspace.getConfiguration('workbench').get<string>('colorTheme') ?? '';
    // the selected Cool Islands theme, else the one of the kind of the selected color theme
    const islands = COLOR_THEMES.find((info) => info.label === selectedColorTheme);
    const colorKind = islands ? kindOf(islands) : (light ? 'light' : 'dark');
    const extensionPath = getExtensionPath();
    const colors = colorMixerState({
      accent: normalizeAccent(configService.accentColor),
      byKey: configService.colorThemeByKey,
      generator: new ColorThemeGenerator({ dist: join(extensionPath, 'dist'), themes: join(extensionPath, THEMES_FOLDER) }),
      installed: listColorThemes(),
      kind: colorKind,
      labels: { base: i18next.t('themeMixer.base'), result: i18next.t('themeMixer.result') },
      layers: configService.colorThemeLayers,
      mix: colorThemeService.mix(),
    });

    const product = productMixerState({
      byName: configService.productIconByName,
      distPath: join(extensionPath, 'dist'),
      generator: new ProductIconGenerator({ dist: join(extensionPath, 'dist'), productIcons: join(extensionPath, 'productIcons') }),
      installed: listProductThemes(),
      labels: { base: 'Cool Islands Icons', result: i18next.t('themeMixer.result') },
      layers: configService.productIconThemeLayers,
      mix: productIconService.mix(),
    });
    for (const font of product.fonts) fonts.set(font.key, font);

    return {
      active: configService.iconTheme === EXTENSION_KEY,
      byName,
      colorActive: COLOR_THEMES.some((info) => info.label === selectedColorTheme),
      colors,
      columns,
      fonts: [...fonts.values()].map((font) => ({
        family: `afi-${font.key}`,
        src: font.sources.map((source) => `url("${webview.asWebviewUri(Uri.file(source.path)).toString()}") format("${source.format}")`).join(', '),
        style: font.style,
        weight: font.weight,
      })),
      layers: layers.map((layer) => ({ ...layer, installed: installed(layer.theme), label: label(layer.theme) })),
      product: { ...product, fonts: undefined },
      productActive: workspace.getConfiguration('workbench').get<string>('productIconTheme') === ISLANDS_PRODUCT_THEME_ID,
      rows,
      samples: this.samples(),
      strings: Object.fromEntries(TRANSLATED.map((key) => [key, i18next.t(`themeMixer.${key}`)])),
      themes: themes.map((theme) => ({ id: theme.id, label: theme.label })),
    };
  }

  private html(webview: Webview): string {
    const nonce = randomBytes(16).toString('base64');
    const media = (file: string) => webview.asWebviewUri(Uri.file(join(getExtensionPath(), 'media', file))).toString();
    const source = webview.cspSource;
    return `<!DOCTYPE html>
<html lang="${i18next.language || 'en'}">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${source} data:; font-src ${source}; style-src ${source} 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="${media('themeMixer.css')}">
  <title>${i18next.t('themeMixer.title')}</title>
</head>
<body>
  <main id="app"></main>
  <script nonce="${nonce}" src="${media('themeMixer.js')}"></script>
</body>
</html>`;
  }
}

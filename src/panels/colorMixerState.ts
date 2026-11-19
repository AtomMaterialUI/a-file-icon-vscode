/**
 * The Colors tab of the theme mixer: the color layers and keys of the settings, and a preview of a few workbench colors
 * and of a line of code in the result, in Cool Islands alone and in each theme mixed in.
 */
import { normalizeColorByKey, normalizeColorLayers, tokenStyleFor } from 'src/themes/colorLayers';
import { kindOf } from 'src/themes/ColorThemeGenerator';
import { COLOR_THEMES } from 'src/themes/colorThemes';
import { readColorTheme } from 'src/themes/readColorTheme';

import type { ColorThemeData, ThemeKind } from 'src/themes/colorLayers';
import type { ColorMix, ColorThemeGenerator } from 'src/themes/ColorThemeGenerator';
import type { TokenColor } from 'src/themes/convertJetbrainsTheme';
import type { InstalledColorTheme } from 'src/services/ColorThemeService';

/** Workbench colors shown in the preview */
const PREVIEW_COLORS = [
  'editor.background',
  'editor.foreground',
  'sideBar.background',
  'activityBar.background',
  'titleBar.activeBackground',
  'statusBar.background',
  'tab.activeBackground',
  'list.activeSelectionBackground',
  'button.background',
  'focusBorder',
  'terminal.ansiRed',
  'terminal.ansiGreen',
  'terminal.ansiBlue',
];

/** A line of Python with Korean text, as TextMate scopes */
const PREVIEW_CODE: Array<Array<{ scope?: string; text: string }>> = [
  [
    { scope: 'meta.function.decorator.python entity.name.function.decorator.python', text: '@cache' },
  ],
  [
    { scope: 'storage.type.function.python', text: 'def' },
    { text: ' ' },
    { scope: 'entity.name.function.python', text: 'total' },
    { text: '(' },
    { scope: 'variable.parameter.function.language.special.self.python', text: 'self' },
    { text: ', ' },
    { scope: 'variable.parameter.function.language.python', text: 'count' },
    { text: ': ' },
    { scope: 'support.type.python', text: 'int' },
    { text: '):  ' },
    { scope: 'comment.line.number-sign.python', text: '# 합계 계산' },
  ],
  [
    { text: '    ' },
    { scope: 'keyword.control.flow.python', text: 'return' },
    { text: ' ' },
    { scope: 'support.function.builtin.python', text: 'round' },
    { text: '(' },
    { scope: 'string.quoted.single.python', text: "'한글'" },
    { text: ', ' },
    { scope: 'constant.numeric.dec.python', text: '42' },
    { text: ', ' },
    { scope: 'variable.parameter.function-call.python', text: 'tax' },
    { text: '=' },
    { scope: 'constant.language.python', text: 'True' },
    { text: ')' },
  ],
];

type Column = { colors: Record<string, string>; id: string; label: string; tokenColors: TokenColor[] };

type ColorPreviewColumn = {
  code: Array<Array<{ fontStyle?: string; foreground?: string; text: string }>>;
  colors: Record<string, string | null>;
  id: string;
  label: string;
};

const previewColumn = ({ colors, id, label, tokenColors }: Column): ColorPreviewColumn => ({
  code: PREVIEW_CODE.map((line) =>
    line.map((part) => {
      const style = part.scope ? tokenStyleFor(tokenColors, part.scope) : undefined;
      return {
        text: part.text,
        ...(style?.foreground ? { foreground: style.foreground } : {}),
        ...(style?.fontStyle ? { fontStyle: style.fontStyle } : {}),
      };
    }),
  ),
  colors: Object.fromEntries(PREVIEW_COLORS.map((key) => [key, colors[key] ?? null])),
  id,
  label,
});

/**
 * @param kind the Cool Islands theme to preview: the selected one, else the dark one
 */
export const colorMixerState = (options: {
  byKey: unknown;
  generator: ColorThemeGenerator;
  installed: InstalledColorTheme[];
  kind: ThemeKind;
  labels: { base: string; result: string };
  layers: unknown;
  mix: ColorMix;
}) => {
  const { installed, kind } = options;
  const info = COLOR_THEMES.find((item) => kindOf(item) === kind) ?? COLOR_THEMES[0];
  const label = (id: string) => installed.find((theme) => theme.id === id)?.label ?? id;
  const find = (id: string) => installed.find((theme) => theme.id === id);

  const layers = normalizeColorLayers(options.layers);
  const byKey = normalizeColorByKey(options.byKey).map(({ key, theme }) => ({ key, theme }));
  const usedIds = [...new Set([...layers.map((layer) => layer.theme), ...byKey.map((entry) => entry.theme)])];

  const result = options.generator.createTheme(info, options.mix);
  const base = options.generator.createTheme(info);
  const columns: Column[] = [
    { colors: result.colors, id: 'result', label: options.labels.result, tokenColors: result.tokenColors },
    { colors: base.colors, id: 'base', label: options.labels.base, tokenColors: base.tokenColors },
  ];
  for (const id of usedIds) {
    const theme = find(id);
    if (!theme) continue;
    let data: ColorThemeData | undefined;
    try {
      data = readColorTheme(theme.path, theme.uiTheme);
    } catch {
      continue;
    }
    columns.push({ colors: data.colors, id, label: theme.label, tokenColors: data.tokenColors });
  }

  return {
    byKey,
    kind,
    layers: layers.map((layer) => ({ ...layer, installed: Boolean(find(layer.theme)), kind: find(layer.theme)?.kind, label: label(layer.theme) })),
    preview: columns.map((column) => previewColumn(column)),
    previewColors: PREVIEW_COLORS,
    theme: info.label,
    themes: installed.map((theme) => ({ id: theme.id, kind: theme.kind, label: theme.label })),
  };
};

export { PREVIEW_CODE, PREVIEW_COLORS };
export type { ColorPreviewColumn };

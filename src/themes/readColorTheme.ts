/**
 * Read a VS Code color theme file the way VS Code does: JSON with comments and trailing commas, `include` of another
 * theme file (the including file wins), and `tokenColors` given as the path of another file. TextMate `.tmTheme`
 * files are not read: their token colors are left out. An `include` or `tokenColors` file outside the folder of the
 * extension contributing the theme is not read either (VS Code does not load it): the theme is read without it.
 */
import { readFileSync } from 'node:fs';
import { resolveThemePath } from 'src/helpers/themePaths';

import { kindOfUiTheme } from './colorLayers';

import type { ColorThemeData, ThemeKind } from './colorLayers';
import type { SemanticStyle, TokenColor } from './convertJetbrainsTheme';

type ThemeFile = {
  colors?: Record<string, unknown>;
  include?: unknown;
  semanticHighlighting?: unknown;
  semanticTokenColors?: Record<string, unknown>;
  tokenColors?: unknown;
  type?: unknown;
};

const MAX_INCLUDES = 8;

/** JSON with comments (`//`, `/* *\/`) and trailing commas, as VS Code reads theme files, to plain JSON */
const stripJsonComments = (text: string): string => {
  let result = '';
  let index = 0;
  while (index < text.length) {
    const character = text[index];
    if (character === '"') {
      // a string, with its escapes
      let end = index + 1;
      while (end < text.length && text[end] !== '"') end += text[end] === '\\' ? 2 : 1;
      result += text.slice(index, end + 1);
      index = end + 1;
    } else if (character === '/' && text[index + 1] === '/') {
      while (index < text.length && text[index] !== '\n') index += 1;
    } else if (character === '/' && text[index + 1] === '*') {
      const end = text.indexOf('*/', index + 2);
      index = end === -1 ? text.length : end + 2;
    } else {
      result += character;
      index += 1;
    }
  }
  // trailing commas, now that no comment or string can hide one
  return result.replaceAll(/,(\s*[\]}])/g, '$1');
};

const readJson = (path: string): ThemeFile => {
  const value = JSON.parse(stripJsonComments(readFileSync(path, 'utf8').replace(/^﻿/, ''))) as unknown;
  return value && typeof value === 'object' ? (value as ThemeFile) : {};
};

/** A color theme file, and the folder of the extension contributing it: its other files are read only from inside it */
type ThemeSource = { extensionPath: string; path: string };

/** @param from the file `value` is written in */
const tokenRules = (value: unknown, from: ThemeSource, depth: number): TokenColor[] => {
  if (typeof value === 'string') {
    if (!value.toLowerCase().endsWith('.json') || depth > MAX_INCLUDES) return [];
    const path = resolveThemePath(from.extensionPath, from.path, value);
    if (!path) return [];
    return tokenRules(readJson(path).tokenColors, { extensionPath: from.extensionPath, path }, depth + 1);
  }
  if (!Array.isArray(value)) return [];
  return value.filter(
    (rule): rule is TokenColor => Boolean(rule) && typeof rule === 'object' && typeof (rule as TokenColor).settings === 'object',
  );
};

const colorsOf = (value: Record<string, unknown> | undefined): Record<string, string> =>
  Object.fromEntries(Object.entries(value ?? {}).filter((entry): entry is [string, string] => typeof entry[1] === 'string'));

const readThemeFile = (source: ThemeSource, uiTheme: string | undefined, depth: number): ColorThemeData => {
  const file = readJson(source.path);
  const includePath = typeof file.include === 'string' && depth < MAX_INCLUDES ? resolveThemePath(source.extensionPath, source.path, file.include) : undefined;
  const included: ColorThemeData | undefined = includePath
    ? readThemeFile({ extensionPath: source.extensionPath, path: includePath }, uiTheme, depth + 1)
    : undefined;

  const typed: Record<string, ThemeKind> = { dark: 'dark', hc: 'dark', hcDark: 'dark', hcLight: 'light', light: 'light' };
  const kind = typeof file.type === 'string' && typed[file.type] ? typed[file.type] : (included?.kind ?? kindOfUiTheme(uiTheme));

  return {
    colors: { ...included?.colors, ...colorsOf(file.colors) },
    kind,
    semanticHighlighting: typeof file.semanticHighlighting === 'boolean' ? file.semanticHighlighting : included?.semanticHighlighting,
    semanticTokenColors: { ...included?.semanticTokenColors, ...(file.semanticTokenColors as Record<string, SemanticStyle | string>) },
    tokenColors: [...(included?.tokenColors ?? []), ...tokenRules(file.tokenColors, source, depth)],
  };
};

/**
 * @param theme the theme file and the folder of the extension contributing it, with its `uiTheme` in that extension's
 *   package.json (`vs`, `vs-dark`, `hc-black`, `hc-light`): its kind, unless the file says `type`
 */
export const readColorTheme = (theme: ThemeSource & { uiTheme?: string }): ColorThemeData => readThemeFile(theme, theme.uiTheme, 0);

export { stripJsonComments };

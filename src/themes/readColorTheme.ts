/**
 * Read a VS Code color theme file the way VS Code does: JSON with comments and trailing commas, `include` of another
 * theme file (the including file wins), and `tokenColors` given as the path of another file. TextMate `.tmTheme`
 * files are not read: their token colors are left out.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

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

const tokenRules = (value: unknown, folder: string, depth: number): TokenColor[] => {
  if (typeof value === 'string') {
    if (!value.toLowerCase().endsWith('.json') || depth > MAX_INCLUDES) return [];
    const file = readJson(join(folder, value));
    return tokenRules(file.tokenColors, dirname(join(folder, value)), depth + 1);
  }
  if (!Array.isArray(value)) return [];
  return value.filter(
    (rule): rule is TokenColor => Boolean(rule) && typeof rule === 'object' && typeof (rule as TokenColor).settings === 'object',
  );
};

const colorsOf = (value: Record<string, unknown> | undefined): Record<string, string> =>
  Object.fromEntries(Object.entries(value ?? {}).filter((entry): entry is [string, string] => typeof entry[1] === 'string'));

/**
 * @param uiTheme `uiTheme` of the theme in its package.json (`vs`, `vs-dark`, `hc-black`, `hc-light`): its kind, unless
 *   the file says `type`
 */
export const readColorTheme = (path: string, uiTheme?: string, depth = 0): ColorThemeData => {
  const file = readJson(path);
  const folder = dirname(path);
  const included: ColorThemeData | undefined =
    typeof file.include === 'string' && depth < MAX_INCLUDES ? readColorTheme(join(folder, file.include), uiTheme, depth + 1) : undefined;

  const typed: Record<string, ThemeKind> = { dark: 'dark', hc: 'dark', hcDark: 'dark', hcLight: 'light', light: 'light' };
  const kind = typeof file.type === 'string' && typed[file.type] ? typed[file.type] : (included?.kind ?? kindOfUiTheme(uiTheme));

  return {
    colors: { ...included?.colors, ...colorsOf(file.colors) },
    kind,
    semanticHighlighting: typeof file.semanticHighlighting === 'boolean' ? file.semanticHighlighting : included?.semanticHighlighting,
    semanticTokenColors: { ...included?.semanticTokenColors, ...(file.semanticTokenColors as Record<string, SemanticStyle | string>) },
    tokenColors: [...(included?.tokenColors ?? []), ...tokenRules(file.tokenColors, folder, depth)],
  };
};

export { stripJsonComments };

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { writeFileAtomic } from 'src/helpers/fsUtils';

import { mixColorTheme } from './colorLayers';
import { COLOR_THEMES, extensionRoot, THEMES_FOLDER } from './colorThemes';

import type { MixedKey, MixedTheme, ThemeKind } from './colorLayers';
import type { ColorThemeInfo } from './colorThemes';
import type { VsCodeColorTheme } from './convertJetbrainsTheme';

export type ColorThemePaths = { dist: string; themes: string };

/** The other color themes mixed in (`colorThemeLayers`, `colorThemeByKey`), already read */
export type ColorMix = { byKey: MixedKey[]; layers: MixedTheme[] };

export const kindOf = (info: ColorThemeInfo): ThemeKind => (info.uiTheme === 'vs' ? 'light' : 'dark');

/**
 * Write the color themes of `contributes.themes` to `dist/`: the generated base themes, with the other color themes
 * the user mixes in on top.
 */
export class ColorThemeGenerator {
  private readonly paths: ColorThemePaths;

  constructor(paths?: Partial<ColorThemePaths>) {
    const root = paths?.dist && paths.themes ? '' : extensionRoot();
    this.paths = {
      dist: paths?.dist ?? join(root, 'dist'),
      themes: paths?.themes ?? join(root, THEMES_FOLDER),
    };
  }

  /** The theme of `contributes.themes` as it would be written */
  createTheme(info: ColorThemeInfo, mix?: ColorMix): VsCodeColorTheme {
    const base = JSON.parse(readFileSync(join(this.paths.themes, info.base), 'utf8')) as VsCodeColorTheme;
    return mixColorTheme({ ...base, name: info.label }, kindOf(info), mix?.layers ?? [], mix?.byKey ?? []);
  }

  /**
   * Write the themes whose content changed (VS Code reads a color theme again only on a reload)
   * @returns the labels of the themes written
   */
  createJsonThemes(mix?: ColorMix): string[] {
    const written: string[] = [];
    for (const info of COLOR_THEMES) {
      const path = join(this.paths.dist, info.file);
      const content = JSON.stringify(this.createTheme(info, mix), undefined, 2);
      if (existsSync(path) && readFileSync(path, 'utf8') === content) continue;
      writeFileAtomic(path, content);
      written.push(info.label);
    }
    return written;
  }
}

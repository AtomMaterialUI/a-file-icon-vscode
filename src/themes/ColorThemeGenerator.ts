import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { writeFileAtomic } from 'src/helpers/fsUtils';

import { COLOR_THEMES, extensionRoot, THEMES_FOLDER } from './colorThemes';

import type { VsCodeColorTheme } from './convertJetbrainsTheme';

export type ColorThemePaths = { dist: string; themes: string };

/**
 * Write the color themes of `contributes.themes` to `dist/` from the generated base themes. The other color themes
 * mixed in by the user come on top of the base here (roadmap #22).
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

  createJsonThemes(): void {
    for (const info of COLOR_THEMES) {
      const base = JSON.parse(readFileSync(join(this.paths.themes, info.base), 'utf8')) as VsCodeColorTheme;
      const theme: VsCodeColorTheme = { ...base, name: info.label };
      writeFileAtomic(join(this.paths.dist, info.file), JSON.stringify(theme, undefined, 2));
    }
  }
}

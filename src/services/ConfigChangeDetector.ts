import { join } from 'node:path';
import { JSON_FILE_NAME, JSON_PRODUCT_FILE_NAME } from 'src/helpers/constants';
import { layerStamp } from 'src/helpers/themeLayers';
import { currentState, readThemeState, stampOf, writeThemeState } from 'src/helpers/themeState';
import { findLayerThemes, getExtensionPath, getGeneratorPaths, getIconThemeFile, getLanguageLookup, getProductThemeFile } from 'src/helpers/vscodeUtils';
import { IconThemeGenerator } from 'src/icons/generators';
import { ProductThemeGenerator } from 'src/icons/generators/ProductThemeGenerator';
import { configService } from 'src/services/ConfigService';

import type { AtomConfig } from 'src/@types/config';
import type { ThemeState } from 'src/helpers/themeState';

/** What is compared with the settings: the ones the theme file was generated with, and the fingerprint of the mixed themes */
type GeneratedIcons = { atomConfig?: Partial<AtomConfig>; layerThemes?: string };
type GeneratedProduct = { atomConfig?: Partial<AtomConfig> };

/**
 * This class is responsible for detecting changes in the config file and
 * updating the icon theme accordingly.
 */
class ConfigChangeDetector {
  listenForChanges() {
    const distribution = join(getExtensionPath(), 'dist');
    const state = readThemeState(distribution);
    const remember: ThemeState = {};

    this.updateIcons(distribution, state, remember);
    this.updateProductIcons(distribution, state, remember);

    if (remember.icon || remember.product) writeThemeState(distribution, remember);
  }

  private updateIcons(distribution: string, state: ThemeState, remember: ThemeState) {
    const path = join(distribution, JSON_FILE_NAME);
    const known = currentState(state.icon, path);
    // the theme file (some 700 KB of json) is read only when the state does not know it
    const oldConfig: GeneratedIcons = known ?? getIconThemeFile();
    const iconDelta = configService.getIconConfigChanges(oldConfig);

    // the other themes change on their own: installed, updated, removed, or regenerated after a change of their settings
    const settings = iconDelta ?? configService.getIconSettings();
    const themes = findLayerThemes(settings);
    const layersChanged = (oldConfig.layerThemes ?? '') !== layerStamp(themes);

    if (iconDelta || layersChanged) {
      const layers = themes.length > 0 ? { languages: getLanguageLookup(), themes } : undefined;
      const iconThemeGenerator = new IconThemeGenerator(settings, getGeneratorPaths(), layers);
      iconThemeGenerator.createJsonTheme();
      const stamp = stampOf(path);
      if (stamp) remember.icon = { ...stamp, atomConfig: iconThemeGenerator.iconConfig.atomConfig, layerThemes: iconThemeGenerator.iconConfig.layerThemes };
    } else if (!known) {
      const stamp = stampOf(path);
      if (stamp) remember.icon = { ...stamp, atomConfig: oldConfig.atomConfig, layerThemes: oldConfig.layerThemes };
    }
  }

  private updateProductIcons(distribution: string, state: ThemeState, remember: ThemeState) {
    const path = join(distribution, JSON_PRODUCT_FILE_NAME);
    const known = currentState(state.product, path);
    const oldConfig: GeneratedProduct = known ?? getProductThemeFile();
    const productDelta = configService.getProductConfigChanges(oldConfig);

    if (Object.keys(productDelta).length > 0) {
      const productThemeGenerator = new ProductThemeGenerator(productDelta);
      productThemeGenerator.createJsonTheme();
      const stamp = stampOf(path);
      if (stamp) remember.product = { ...stamp, atomConfig: { arrowTheme: productThemeGenerator.atomConfig.arrowTheme } };
    } else if (!known) {
      const stamp = stampOf(path);
      if (stamp) remember.product = { ...stamp, atomConfig: { arrowTheme: oldConfig.atomConfig?.arrowTheme } };
    }
  }
}

export const configChangeDetector = new ConfigChangeDetector();

import { layerStamp } from 'src/helpers/themeLayers';
import { findLayerThemes, getGeneratorPaths, getIconThemeFile, getLanguageLookup, getProductThemeFile } from 'src/helpers/vscodeUtils';
import { IconThemeGenerator } from 'src/icons/generators';
import { ProductThemeGenerator } from 'src/icons/generators/ProductThemeGenerator';
import { configService } from 'src/services/ConfigService';

import type { AtomConfig, IconSettings } from 'src/@types/config';
import type { IconConfiguration } from 'src/models/IconConfiguration';
import type { ProductConfiguration } from 'src/models/ProductConfiguration';

/**
 * This class is responsible for detecting changes in the config file and
 * updating the icon theme accordingly.
 */
class ConfigChangeDetector {
  listenForChanges() {
    const oldConfig = getIconThemeFile();
    const iconDelta = this.compareIconConfigs(oldConfig);
    const productDelta = this.getProductDelta();

    // the other themes change on their own: installed, updated, removed, or regenerated after a change of their settings
    const settings = iconDelta ?? configService.getIconSettings();
    const themes = findLayerThemes(settings);
    const layersChanged = (oldConfig.layerThemes ?? '') !== layerStamp(themes);

    if (iconDelta || layersChanged) {
      const layers = themes.length > 0 ? { languages: getLanguageLookup(), themes } : undefined;
      const iconThemeGenerator = new IconThemeGenerator(settings, getGeneratorPaths(), layers);
      iconThemeGenerator.createJsonTheme();
    }

    if (Object.keys(productDelta).length > 0) {
      const productThemeGenerator = new ProductThemeGenerator(productDelta);
      productThemeGenerator.createJsonTheme();
    }
  }

  private getProductDelta() {
    const oldConfig = getProductThemeFile();
    return this.compareProductConfigs(oldConfig);
  }

  private compareIconConfigs(oldConfig: IconConfiguration): IconSettings | undefined {
    return configService.getIconConfigChanges(oldConfig);
  }

  private compareProductConfigs(oldConfig: ProductConfiguration): Partial<AtomConfig> {
    return configService.getProductConfigChanges(oldConfig);
  }
}

export const configChangeDetector = new ConfigChangeDetector();

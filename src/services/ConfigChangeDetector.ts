import { getGeneratorPaths, getIconThemeFile, getProductThemeFile } from 'src/helpers/vscodeUtils';
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
    const iconDelta = this.getIconDelta();
    const productDelta = this.getProductDelta();

    if (iconDelta) {
      const iconThemeGenerator = new IconThemeGenerator(iconDelta, getGeneratorPaths());
      iconThemeGenerator.createJsonTheme();
    }

    if (Object.keys(productDelta).length > 0) {
      const productThemeGenerator = new ProductThemeGenerator(productDelta);
      productThemeGenerator.createJsonTheme();
    }
  }

  private getIconDelta() {
    const oldConfig = getIconThemeFile();
    return this.compareIconConfigs(oldConfig);
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

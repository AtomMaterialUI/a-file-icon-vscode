import type { AtomConfig } from 'src/@types/config';
import { configService } from 'src/helpers/ConfigService';
import { getIconThemeFile } from 'src/helpers/vscodeUtils';
import { IconThemeGenerator } from 'src/icons/generators';
import type { IconConfiguration } from 'src/models';

/**
 * This class is responsible for detecting changes in the config file and
 * updating the icon theme accordingly.
 */
class ConfigChangeDetector {
  listenForChanges() {
    const changes = this.getDelta();

    if (Object.keys(changes).length > 0) {
      const generator = new IconThemeGenerator(changes);
      generator.createJsonTheme();
    }
  }

  private getDelta() {
    const oldConfig = getIconThemeFile() as IconConfiguration;
    return this.compareConfigs(oldConfig);
  }

  private compareConfigs(oldConfig: IconConfiguration): Partial<AtomConfig> {
    const changes: Partial<AtomConfig> = {};

    if (configService.opacity !== oldConfig.atomConfig?.opacity) {
      changes.opacity = configService.opacity;
    }
    if (configService.saturation !== oldConfig.atomConfig?.saturation) {
      changes.saturation = configService.saturation;
    }
    if (configService.folderColor !== oldConfig.atomConfig?.folderColor) {
      changes.folderColor = configService.folderColor;
    }

    return changes;
  }
}

export const configChangeDetector = new ConfigChangeDetector();

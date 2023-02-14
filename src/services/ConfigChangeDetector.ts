import type { AtomConfig } from 'src/@types/config';
import { getIconThemeFile } from 'src/helpers/vscodeUtils';
import { IconThemeGenerator } from 'src/icons/generators';
import type { IconConfiguration } from 'src/models';
import { configService } from 'src/services/ConfigService';

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
    return configService.getChanges(oldConfig);
  }
}

export const configChangeDetector = new ConfigChangeDetector();

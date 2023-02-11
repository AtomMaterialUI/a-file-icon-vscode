/**
 * This class is responsible for detecting changes in the config file and
 * updating the icon theme accordingly.
 */
class ConfigChangeDetector {
  listenForChanges() {
    const changes = this.getDelta();
  }

  private getDelta() {
    // const oldConfig = this.getOldConfig();
    // const newConfig = this.getNewConfig();
    // const changes = this.compareConfigs(oldConfig, newConfig);
    // return changes;
  }
}

export const configChangeDetector = new ConfigChangeDetector();

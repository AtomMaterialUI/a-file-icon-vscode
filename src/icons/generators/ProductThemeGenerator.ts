/* eslint-disable unicorn/prefer-module */
import { readJSONSync, writeJSONSync } from 'fs-extra';
import merge from 'lodash.merge';
import { basename, join } from 'node:path';
import { ArrowTheme } from 'src/@types/config';
import { JSON_PRODUCT_FILE_NAME } from 'src/helpers/constants';
import { getDefaultConfig } from 'src/icons/configUtils';
import { ProductConfiguration } from 'src/models/ProductConfiguration';

import type { AtomConfig } from 'src/@types/config';

export class ProductThemeGenerator {
  atomConfig: AtomConfig;
  productConfig: ProductConfiguration;
  private originalConfig: ProductConfiguration;

  constructor() {
    // Read the originally generated product icons config
    this.originalConfig = readJSONSync(join(this.jsonPath(), JSON_PRODUCT_FILE_NAME));

    const atomConfig = merge({}, getDefaultConfig());
    const productConfig = new ProductConfiguration(atomConfig);

    this.atomConfig = atomConfig;
    this.productConfig = productConfig;
  }

  /**
   * Create the atom config to be serialized to json
   */
  createJsonTheme() {
    // Update this.iconConfig
    this.generateJsonConfig();

    try {
      const json = merge({}, this.originalConfig, this.productConfig);
      writeJSONSync(join(this.distPath(), JSON_PRODUCT_FILE_NAME), json, { spaces: 2 });
    }
    catch (error) {
      throw new Error('Failed to create icon file: ' + error);
    }
  }

  /**
   * Generate the theme json from the files
   * @private
   */
  private generateJsonConfig() {
    this.applyArrowIcons();
  }

  private distPath() {
    let iconJsonPath = __dirname;
    // if executed via script
    if (basename(__dirname) !== 'dist') {
      iconJsonPath = join(__dirname, '..', '..', '..', 'dist');
    }
    return iconJsonPath;
  }

  private jsonPath() {
    let iconJsonPath = __dirname;
    // if executed via script
    if (basename(__dirname) !== 'dist') {
      iconJsonPath = join(__dirname, '..', '..', '..', 'dist');
    }
    return join(iconJsonPath, '..', 'productIcons');
  }

  /**
   * Apply arrow theme
   * @private
   */
  private applyArrowIcons() {
    const fontDefinitions = this.originalConfig.iconDefinitions;
    const arrowTheme = this.atomConfig.arrowTheme;

    let iconDefinition;
    switch (arrowTheme) {
      case ArrowTheme.Material: {
        iconDefinition = fontDefinitions['arrow-material-right'];
        break;
      }
      case ArrowTheme.Triangle: {
        iconDefinition = fontDefinitions['arrow-triangle-right'];
        break;
      }
      case ArrowTheme.PlusMinus: {
        iconDefinition = fontDefinitions['arrow-plusminus-right'];
        break;
      }
      case ArrowTheme.Arrow: {
        iconDefinition = fontDefinitions['arrow-arrow-right'];
        break;
      }
      case ArrowTheme.None: {
        iconDefinition = fontDefinitions['zz_empty'];
        break;
      }
    }

    this.productConfig.iconDefinitions['chevron-right'] = iconDefinition;
  }
}

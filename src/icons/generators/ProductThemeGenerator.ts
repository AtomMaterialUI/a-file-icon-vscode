/* eslint-disable unicorn/prefer-module */
import {readJSONSync, writeJSONSync} from 'fs-extra';
import merge from 'lodash.merge';
import {basename, join} from 'node:path';
import {ArrowTheme} from 'src/@types/config';
import {JSON_PRODUCT_FILE_NAME} from 'src/helpers/constants';
import {getDefaultConfig} from 'src/icons/configUtils';
import {ProductConfiguration} from 'src/models/ProductConfiguration';

import type {AtomConfig} from 'src/@types/config';

export class ProductThemeGenerator {
  atomConfig: AtomConfig;
  productConfig: ProductConfiguration;
  private readonly originalConfig: ProductConfiguration;

  constructor(updatedJSONConfig: Partial<AtomConfig> = {}) {
    // Read the originally generated product icons config
    this.originalConfig = readJSONSync(join(this.jsonPath(), JSON_PRODUCT_FILE_NAME));

    const atomConfig = merge({}, getDefaultConfig(), updatedJSONConfig);
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
      writeJSONSync(join(this.distPath(), JSON_PRODUCT_FILE_NAME), json, {spaces: 2});
    } catch (error) {
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

    let rightIcon, upIcon, downIcon;
    switch (arrowTheme) {
      case ArrowTheme.Material: {
        rightIcon = fontDefinitions['arrow-material-right'];
        upIcon = fontDefinitions['arrow-material-up'];
        downIcon = fontDefinitions['arrow-material-down'];
        this.productConfig.iconDefinitions['tree-item-expanded'] = downIcon;

        break;
      }
      case ArrowTheme.Triangle: {
        rightIcon = fontDefinitions['arrow-triangle-right'];
        upIcon = fontDefinitions['arrow-triangle-up'];
        downIcon = fontDefinitions['arrow-triangle-down'];
        this.productConfig.iconDefinitions['tree-item-expanded'] = downIcon;

        break;
      }
      case ArrowTheme.PlusMinus: {
        rightIcon = fontDefinitions['arrow-plusminus-right'];
        upIcon = fontDefinitions['arrow-plusminus-up'];
        downIcon = fontDefinitions['arrow-plusminus-down'];
        this.productConfig.iconDefinitions['tree-item-expanded'] = downIcon;

        break;
      }
      case ArrowTheme.Arrow: {
        rightIcon = fontDefinitions['arrow-arrow-right'];
        upIcon = fontDefinitions['arrow-arrow-up'];
        downIcon = fontDefinitions['arrow-arrow-down'];
        this.productConfig.iconDefinitions['tree-item-expanded'] = fontDefinitions['arrow-down'];

        break;
      }
      case ArrowTheme.None: {
        rightIcon = fontDefinitions['zz_empty'];
        upIcon = fontDefinitions['zz_empty'];
        downIcon = fontDefinitions['zz_empty'];
        this.productConfig.iconDefinitions['tree-item-expanded'] = downIcon;

        break;
      }
    }

    this.productConfig.iconDefinitions['chevron-right'] = rightIcon;
    this.productConfig.iconDefinitions['chevron-up'] = upIcon;
    this.productConfig.iconDefinitions['chevron-down'] = downIcon;
  }
}

import * as fs from 'fs';
import merge from 'lodash.merge';
import * as path from 'path';
import { JSON_FILE_NAME } from 'src/helpers/constants';
import type { IconJsonOptions } from '../../models/index';
import { IconConfiguration } from '../../models/index';
import {
  generateFolderIcons,
  loadFileIconDefinitions,
  loadFolderIconDefinitions,
  loadLanguageIconDefinitions,
  setIconOpacity,
  setIconSaturation,
  validateHEXColorCode,
  validateOpacityValue,
  validateSaturationValue,
} from './index';

/**
 * Generate the complete icon configuration object that can be written as JSON file.
 */
export const generateIconConfigurationObject = (options: IconJsonOptions): IconConfiguration => {
  const iconConfig = merge({}, new IconConfiguration(), { options });
  const languageIconDefinitions = loadLanguageIconDefinitions([], iconConfig, options);
  const fileIconDefinitions = loadFileIconDefinitions([], iconConfig, options);
  const folderIconDefinitions = loadFolderIconDefinitions([], iconConfig, options);

  return merge({}, languageIconDefinitions, fileIconDefinitions, folderIconDefinitions);
};

/**
 * Create the JSON file that is responsible for the icons in the editor.
 * @param updatedConfigs Options that have been changed.
 * @param updatedJSONConfig New JSON options that already include the updatedConfigs.
 */
export const createIconFile = (updatedConfigs?: IconJsonOptions, updatedJSONConfig: IconJsonOptions = {}) => {
  // override the default options with the new options
  const options: IconJsonOptions = merge({}, getDefaultIconOptions(), updatedJSONConfig);
  const json = generateIconConfigurationObject(options);

  // make sure that the folder color, opacity and saturation values are entered correctly
  if (updatedConfigs?.opacity && !validateOpacityValue(updatedConfigs?.opacity)) {
    throw Error('Atom Material Icons: Invalid opacity value!');
  }
  if (updatedConfigs?.saturation && !validateSaturationValue(updatedConfigs?.saturation)) {
    throw Error('Atom Material Icons: Invalid saturation value!');
  }
  if (updatedConfigs?.folders?.color && !validateHEXColorCode(updatedConfigs?.folders?.color)) {
    throw Error('Atom Material Icons: Invalid folder color value!');
  }

  try {
    let iconJsonPath = __dirname;
    // if executed via script
    if (path.basename(__dirname) !== 'dist') {
      iconJsonPath = path.join(__dirname, '..', '..', '..', 'dist');
    }
    if (!updatedConfigs || (updatedConfigs.folders || {}).color) {
      // if updatedConfigs do not exist (because of initial setup)
      // or new config value was detected by the change detection
      generateFolderIcons(options.folders?.color);
      setIconOpacity(options, ['folder.svg', 'folder-open.svg', 'folder-root.svg', 'folder-root-open.svg']);
    }
    if (!updatedConfigs || updatedConfigs.opacity !== undefined) {
      setIconOpacity(options);
    }
    if (!updatedConfigs || updatedConfigs.saturation !== undefined) {
      setIconSaturation(options);
    }
  }
  catch (error) {
    throw new Error('Failed to update icons: ' + error);
  }

  try {
    let iconJsonPath = __dirname;
    // if executed via script
    if (path.basename(__dirname) !== 'dist') {
      iconJsonPath = path.join(__dirname, '..', '..', '..', 'dist');
    }
    fs.writeFileSync(path.join(iconJsonPath, JSON_FILE_NAME), JSON.stringify(json, undefined, 2), 'utf-8');
  }
  catch (error) {
    throw new Error('Failed to create icon file: ' + error);
  }

  return JSON_FILE_NAME;
};

/**
 * The options control the generator and decide which icons are disabled or not.
 */
export const getDefaultIconOptions = (): Required<IconJsonOptions> => ({
  folders: {
    theme: 'specific',
    color: '#90a4ae',
    associations: {},
  },
  activeIconPack: 'angular',
  hidesExplorerArrows: false,
  opacity: 1,
  saturation: 1,
  files: { associations: {} },
  languages: { associations: {} },
  showUpdateMessage: false,
  showWelcomeMessage: false,
});

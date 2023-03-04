import { EXTENSION_KEY, FONT_NAME } from 'src/helpers/constants';

import type { AtomConfig } from 'src/@types/config';

type IconDefinition = {
  fontCharacter: string;
};

type FontDefinition = {
  id: string;
  src: Array<{ format: 'woff', path: string }>;
  style: 'normal';
  weight: 'normal';
}

/**
 * A model representing the icon theme configuration.
 * See https://code.visualstudio.com/api/extension-guides/file-icon-theme
 */
export class ProductConfiguration {

  /**
   * Associate icon definitions to font characters.
   * @type {Record<string, IconDefinition>}
   */
  iconDefinitions: Record<string, IconDefinition>;

  /**
   * Font definition.
   * @type {FontDefinition[]}
   */
  fonts: FontDefinition[] = [
    {
      'id': EXTENSION_KEY,
      'src': [
        {
          'format': 'woff',
          'path': `../productIcons/${FONT_NAME}`,
        },
      ],
      'style': 'normal',
      'weight': 'normal',
    },
  ];

  /**
   * Atom file config
   */
  atomConfig?: Partial<AtomConfig>;

  constructor(options: Partial<AtomConfig> = {}) {
    this.iconDefinitions = {};

    this.atomConfig = options;
  }
}

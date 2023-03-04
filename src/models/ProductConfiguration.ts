import type { AtomConfig } from 'src/@types/config';

type IconDefinition = {
  fontCharacter: string;
};

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
   * Atom file config
   */
  atomConfig?: Partial<AtomConfig>;

  constructor(options: Partial<AtomConfig> = {}) {
    this.iconDefinitions = {};

    this.atomConfig = options;
  }
}

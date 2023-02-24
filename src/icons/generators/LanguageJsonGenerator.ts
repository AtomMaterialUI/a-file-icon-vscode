import merge from 'lodash.merge';
import { AbstractJsonGenerator } from 'src/icons/generators/AbstractJsonGenerator';
import { languageIcons } from 'src/icons/languageIcons';

import type { IconConfiguration } from 'src/models/IconConfiguration';
import type { LanguageAssociation } from 'src/@types/associations';
import type { AtomConfig } from 'src/@types/config';

export class LanguageJsonGenerator extends AbstractJsonGenerator {
  constructor(override readonly atomConfig: AtomConfig, override readonly iconConfig: IconConfiguration) {
    super(atomConfig, iconConfig);
  }

  /**
   * Load the language icon definitions onto the icon configuration object.
   * @returns {IconConfiguration} a new icon configuration object with the language icons loaded
   * @private
   */
  public loadLanguageIconAssociations() {
    // first, remove languages by pack
    const enabledLanguages = this.disableLanguagesByPack(languageIcons);

    // Fetch custom language associations
    const customIcons = this.getCustomLanguageAssociations();

    const allLanguageIcons = [...enabledLanguages, ...customIcons];

    // Load the language icons onto the config
    for (const language of allLanguageIcons) {
      if (language.disabled) continue;

      this.loadLanguageAssociation(language);
    }
  }

  /**
   * Convert custom icon associations into icons
   * @private
   */
  public getCustomLanguageAssociations(): LanguageAssociation[] {
    const languagesAssociations = this.atomConfig.languagesAssociations;
    if (!languagesAssociations) return [];

    return Object.entries(languagesAssociations).map(([key, value]) => ({
      icon: {
        name: value.toLowerCase(),
      },
      ids: [key.toLowerCase()],
      name: key.toLowerCase(),
    }));
  }

  /**
   * Filter language list by whether or not they are relevant with the chosen icon packs
   * @param {LanguageAssociation[]} languageIcons
   * @returns {LanguageAssociation[]}
   * @private
   */
  public disableLanguagesByPack(languageIcons: LanguageAssociation[]): LanguageAssociation[] {
    const activeIconPacks = this.atomConfig.activeIconPacks;

    return languageIcons.filter((language) => {
      if (!language.enabledFor) return true;

      // Check if the language is enabled for any of the active icon packs
      return language.enabledFor.some((pack) => activeIconPacks.includes(pack));
    });
  }

  /**
   * Load the language association onto the iconDefinitions
   * @param {LanguageAssociation} language the language definition
   * @private
   */
  private loadLanguageAssociation(language: LanguageAssociation) {
    const assocName = language.icon.name;
    // First create the file association to map the language ids to
    // this.addFileAssociation(assocName);

    // Add regular language association
    this.addLanguageAssociation(assocName, language.ids);

    // Add a light variant if necessary
    if (language.light) {
      // todo check if it indeed works with light/dark
      this.iconConfig.light = merge({}, this.iconConfig.light);
      this.addLanguageAssociation(assocName, language.ids);
    }

    // Add a high contrast variant if necessary
    if (language.highContrast) {
      // todo check if it indeed works with high contrast
      this.iconConfig.highContrast = merge({}, this.iconConfig.highContrast);
      this.addLanguageAssociation(assocName, language.ids);
    }
  }

  /**
   * Add a mapping of language ids to the assoc name
   * @param {string} assocName the assoc name
   * @param {string[]} languageIds list of ids to map to the assocName
   * @returns {IconConfiguration}
   * @private
   */
  private addLanguageAssociation(assocName: string, languageIds: string[]) {
    for (const languageId of languageIds) {
      if (!this.iconConfig.languageIds) continue;
      this.iconConfig.languageIds[languageId] = assocName;
    }
  }
}

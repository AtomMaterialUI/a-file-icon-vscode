import type { LanguageAssociation, IconAssociations } from 'src/@types/icons';
import type { IconConfiguration } from 'src/models';
import type { AtomConfig, IconPack } from 'src/@types/config';
import merge from 'lodash.merge';
import type { JsonGenerator } from 'src/helpers/JsonGenerator';
import { languageIcons } from 'src/icons/languageIcons';

export class LanguageJsonGenerator {
  constructor(private readonly jsonGenerator: JsonGenerator) {}

  /**
   * Load the language icon definitions onto the icon configuration object.
   * @param config
   * @param {AtomConfig} options atom config
   * @returns {IconConfiguration} a new icon configuration object with the language icons loaded
   * @private
   */
  public loadLanguageIconAssociations(config: IconConfiguration, options: AtomConfig): void {
    // first, remove languages by pack
    const enabledLanguages = this.disableLanguagesByPack(
      languageIcons,
      options.activeIconPacks,
    );

    // Fetch custom language associations
    const customIcons = this.getCustomLanguageAssociations(options.languagesAssociations);

    const allLanguageIcons = [...enabledLanguages, ...customIcons];

    // Load the language icons onto the config
    allLanguageIcons.forEach(language => {
      if (language.disabled) return;

      this.loadLanguageAssociation(config, language);
    });
  }

  /**
   * Convert custom icon associations into icons
   * @param {IconAssociations[]} languagesAssociations
   * @private
   */
  public getCustomLanguageAssociations(languagesAssociations?: IconAssociations): LanguageAssociation[] {
    if (!languagesAssociations) return [];

    return Object.entries(languagesAssociations).map(([key, value]) => ({
      name: key.toLowerCase(),
      icon: {
        name: value.toLowerCase(),
      },
      ids: [key.toLowerCase()],
    }));
  }

  /**
   * Filter language list by whether or not they are relevant with the chosen icon packs
   * @param {LanguageAssociation[]} languageIcons
   * @param {IconPack[]} activeIconPacks
   * @returns {LanguageAssociation[]}
   * @private
   */
  public disableLanguagesByPack(languageIcons: LanguageAssociation[], activeIconPacks: IconPack[]): LanguageAssociation[] {
    return languageIcons.filter(language => {
      if (!language.enabledFor) return true;

      // Check if the language is enabled for any of the active icon packs
      return language.enabledFor.some(pack => activeIconPacks.includes(pack));
    });
  }

  /**
   * Load the language association onto the iconDefinitions
   * @param {IconConfiguration} config the config to populate
   * @param {LanguageAssociation} language the language definition
   * @private
   */
  private loadLanguageAssociation(config: IconConfiguration, language: LanguageAssociation) {
    const assocName = language.icon.name;
    // First create the file association to map the language ids to
    this.jsonGenerator.addFileAssociation(config, assocName);

    // Add regular language association
    this.addLanguageAssociation(config, assocName, language.ids);

    // Add a light variant if necessary
    if (language.light) {
      // todo check if it indeed works with light/dark
      config.light = merge({}, config.light);
      this.addLanguageAssociation(config.light, assocName, language.ids);
    }

    // Add a high contrast variant if necessary
    if (language.highContrast) {
      // todo check if it indeed works with high contrast
      config.highContrast = merge({}, config.highContrast);
      this.addLanguageAssociation(config.highContrast, assocName, language.ids);
    }
  }

  /**
   * Add a mapping of language ids to the assoc name
   * @param {IconConfiguration} config the config to populate
   * @param {string} assocName the assoc name
   * @param {string[]} languageIds list of ids to map to the assocName
   * @returns {IconConfiguration}
   * @private
   */
  private addLanguageAssociation(config: IconConfiguration, assocName: string, languageIds: string[]): void {
    languageIds.forEach(languageId => {
      if (config.languageIds) {
        config.languageIds[languageId] = assocName;
      }
    });
  }
}

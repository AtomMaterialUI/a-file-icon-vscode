import { DARK_FILE_ENDING, HIGH_CONTRAST_FILE_ENDING, PYCHARM_PYTHON_ICON } from 'src/helpers/constants';
import { findCustomIcon, getCustomIconName, isCustomIconPath } from 'src/helpers/customIcons';
import { IconPack } from 'src/@types/config';
import { AbstractJsonGenerator } from 'src/icons/generators/AbstractJsonGenerator';
import { fileIcons } from 'src/icons/index';
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
   */
  public loadLanguageIconAssociations() {
    // languages only give file icons
    if (this.atomConfig.hideFileIcons) return;

    // first, remove languages by pack
    const enabledLanguages = this.disableLanguagesByPack(languageIcons);

    // PyCharm pack: the Python language gets the PyCharm Python icon, like the .py files
    const pycharmLanguages: LanguageAssociation[] = this.atomConfig.activeIconPacks.includes(IconPack.PyCharm)
      ? [{ icon: { name: PYCHARM_PYTHON_ICON }, ids: ['python'], light: true, name: 'python' }]
      : [];

    // Fetch custom language associations
    const customIcons = this.getCustomLanguageAssociations();

    const allLanguageIcons = [...enabledLanguages, ...pycharmLanguages, ...customIcons];

    // Load the language icons onto the config
    for (const language of allLanguageIcons) {
      if (language.disabled) continue;

      this.loadLanguageAssociation(language);
    }
  }

  /**
   * Convert custom icon associations into icons.
   * The value is a bundled icon name or the path of a custom SVG file.
   */
  public getCustomLanguageAssociations(): LanguageAssociation[] {
    const languagesAssociations = this.atomConfig.languagesAssociations;
    if (!languagesAssociations) return [];

    return Object.entries(languagesAssociations)
      .filter(([key, value]) => key.trim().length > 0 && typeof value === 'string' && value.length > 0)
      // a custom SVG that does not exist would point to a missing file
      .filter(([, value]) => !isCustomIconPath(value) || findCustomIcon(value))
      .map(([key, value]) => {
        const name = isCustomIconPath(value) ? getCustomIconName(value) : this.resolveFileIconName(value);
        // reuse the light/high contrast variants of the built-in icon, if any
        const builtIn = fileIcons.icons.find((icon) => icon.name === name);

        return {
          highContrast: builtIn?.highContrast,
          icon: { name },
          // language ids are case-sensitive (`javascriptreact`, `COBOL`...)
          ids: [key.trim()],
          light: builtIn?.light,
          name: key.trim(),
        };
      });
  }

  /**
   * Filter language list by whether or not they are relevant with the chosen icon packs
   * @param {LanguageAssociation[]} languageIcons
   * @returns {LanguageAssociation[]}
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
   * Map the language ids to their icon, defining the icon itself: a language icon does not need
   * a file association of the same name.
   * As for files, `<name>_dark.svg` is the variant for dark backgrounds (the default theme)
   * and the plain icon goes to the light theme.
   * @param {LanguageAssociation} language the language definition
   * @private
   */
  private loadLanguageAssociation(language: LanguageAssociation) {
    const name = language.icon.name;
    this.addFileIconDefinition(name);

    if (language.light) {
      this.addFileIconDefinition(name, DARK_FILE_ENDING);
      this.addLanguageAssociation(this.iconConfig, `${name}${DARK_FILE_ENDING}`, language.ids);
      this.addLanguageAssociation(this.lightConfig(), name, language.ids);
    } else {
      this.addLanguageAssociation(this.iconConfig, name, language.ids);
      // drop the light variant of an earlier association of these ids
      this.removeLanguageAssociation(this.iconConfig.light, language.ids);
    }

    if (language.highContrast) {
      this.addFileIconDefinition(name, HIGH_CONTRAST_FILE_ENDING);
      this.addLanguageAssociation(this.highContrastConfig(), `${name}${HIGH_CONTRAST_FILE_ENDING}`, language.ids);
    } else {
      this.removeLanguageAssociation(this.iconConfig.highContrast, language.ids);
    }
  }

  private lightConfig(): IconConfiguration {
    this.iconConfig.light ??= {};
    return this.iconConfig.light;
  }

  private highContrastConfig(): IconConfiguration {
    this.iconConfig.highContrast ??= {};
    return this.iconConfig.highContrast;
  }

  /**
   * Add a mapping of language ids to the icon
   * @param {IconConfiguration} config the base, light or high contrast config
   * @param {string} iconName the icon definition
   * @param {string[]} languageIds list of ids to map to the icon
   * @private
   */
  private addLanguageAssociation(config: IconConfiguration, iconName: string, languageIds: string[]) {
    config.languageIds ??= {};
    for (const languageId of languageIds) {
      config.languageIds[languageId] = iconName;
    }
  }

  private removeLanguageAssociation(config: IconConfiguration | undefined, languageIds: string[]) {
    for (const languageId of languageIds) {
      delete config?.languageIds?.[languageId];
    }
  }
}

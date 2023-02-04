import merge from 'lodash.merge';
import { getFileConfigHash } from '../../helpers/fileConfig';
import type {
  DefaultIcon,
  IconAssociations,
  IconConfiguration,
  IconJsonOptions,
  LanguageIcon,
} from '../../models/index';
import { highContrastColorFileEnding, iconFolderPath, darkFileEnding } from './constants';

/**
 * Get all file icons that can be used in this theme.
 */
export const loadLanguageIconDefinitions = (
  languages: LanguageIcon[],
  config: IconConfiguration,
  options: IconJsonOptions
): IconConfiguration => {
  config = merge({}, config);
  const enabledLanguages = disableLanguagesByPack(languages, options.activeIconPack);
  const customIcons = getCustomIcons(options.languages?.associations);
  const allLanguageIcons = [...enabledLanguages, ...customIcons];

  allLanguageIcons.forEach((lang) => {
    if (lang.disabled) {
      return;
    }
    config = setIconDefinitions(config, lang.icon);

    if (lang.icon.light) {
      config = merge({}, config, setLanguageIdentifiers(lang.icon.name + darkFileEnding, lang.ids));
      config.light = merge({}, config.light, setLanguageIdentifiers(lang.icon.name, lang.ids));
    } else {
      config = merge({}, config, setLanguageIdentifiers(lang.icon.name, lang.ids));
    }

    if (lang.icon.highContrast) {
      config.highContrast = merge(
        {},
        config.highContrast,
        setLanguageIdentifiers(lang.icon.name + highContrastColorFileEnding, lang.ids)
      );
    }
  });

  return config;
};

const setIconDefinitions = (config: IconConfiguration, icon: DefaultIcon) => {
  config = merge({}, config);
  config = createIconDefinitions(config, icon.name);

  if (icon.light) {
    config = merge({}, config, createIconDefinitions(config, icon.name + darkFileEnding));
  }

  if (icon.highContrast) {
    config = merge({}, config, createIconDefinitions(config, icon.name + highContrastColorFileEnding));
  }

  return config;
};

const createIconDefinitions = (config: IconConfiguration, iconName: string) => {
  config = merge({}, config);
  const fileConfigHash = getFileConfigHash(config.atomConfig ?? {});
  if (config.iconDefinitions) {
    config.iconDefinitions[iconName] = {
      iconPath: `${iconFolderPath}/files/${iconName}${fileConfigHash}.svg`,
    };
  }
  return config;
};

const setLanguageIdentifiers = (iconName: string, languageIds: string[]) => {
  const obj: Partial<IconConfiguration> = { languageIds: {} };
  languageIds.forEach((id) => {
    obj.languageIds![id as keyof IconConfiguration] = iconName;
  });
  return obj;
};

const getCustomIcons = (languageAssociations: IconAssociations | undefined) => {
  if (!languageAssociations) {
    return [];
  }

  const icons: LanguageIcon[] = Object.keys(languageAssociations).map((fa) => ({
    icon: { name: languageAssociations[fa].toLowerCase() },
    ids: [fa.toLowerCase()],
  }));

  return icons;
};

/**
 * Disable all file icons that are in a pack which is disabled.
 */
const disableLanguagesByPack = (languageIcons: LanguageIcon[], activatedIconPack: string | undefined) => {
  return languageIcons.filter((language) => {
    return !language.enabledFor ? true : language.enabledFor.some((p) => p === activatedIconPack);
  });
};

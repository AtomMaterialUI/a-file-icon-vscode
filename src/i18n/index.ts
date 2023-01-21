import { env } from 'vscode';
import { getObjectPropertyValue } from '../helpers/objects';
import { Translation } from '../models';

// Get current language of the vs code workspace
export const getCurrentLanguage = (): string => env.language;

let currentTranslation: Translation;
let fallbackTranslation: Translation;

const placeholder = '%';

/** Initialize the translations */
export const initTranslations = async () => {
  try {
    currentTranslation = await loadTranslation(getCurrentLanguage());
    fallbackTranslation = await loadTranslation('en');
  } catch (error) {
    console.error(error);
  }
};

/** Load the required translation */
const loadTranslation = async (language: string) => {
  try {
    return await getTranslationObject(language);
  } catch (error) {
    return await getTranslationObject('en');
  }
};

const languages: Record<string, Function> = {
  de: () => import(/* webpackMode: "eager" */ './lang-de'),
  en: () => import(/* webpackMode: "eager" */ './lang-en'),
  es: () => import(/* webpackMode: "eager" */ './lang-es'),
  fr: () => import(/* webpackMode: "eager" */ './lang-fr'),
  ja: () => import(/* webpackMode: "eager" */ './lang-ja'),
  nl: () => import(/* webpackMode: "eager" */ './lang-nl'),
  pl: () => import(/* webpackMode: "eager" */ './lang-pl'),
  'pt-br': () => import(/* webpackMode: "eager" */ './lang-pt-br'),
  'pt-pt': () => import(/* webpackMode: "eager" */ './lang-pt-pt'),
  ru: () => import(/* webpackMode: "eager" */ './lang-ru'),
  uk: () => import(/* webpackMode: "eager" */ './lang-uk'),
  'zh-cn': () => import(/* webpackMode: "eager" */ './lang-zh-cn'),
  'zh-tw': () => import(/* webpackMode: "eager" */ './lang-zh-tw'),
};

/** Get the translation object of the separated translation files */
const getTranslationObject = async (language: string): Promise<Translation> => {
  const lang = await languages[language]();
  return lang.translation as Translation;
};

/**
 * We look up the matching translation in the translation files.
 * If we cannot find a matching key in the file we use the fallback.
 * With optional parameters you can configure both the translations
 * and the fallback (required for testing purposes).
 * */
export const getTranslationValue = (
  key: string,
  translations = currentTranslation,
  fallback = fallbackTranslation
): string | undefined => {
  return (
    getObjectPropertyValue(translations, key) ??
    getObjectPropertyValue(fallback, key)
  );
};

/**
 * The instant method is required for the translate pipe.
 * It helps to translate a word instantly.
 */
export const translate = (key: string, ...variables: string[]): string => {
  const translation = getTranslationValue(key);

  if (variables.length === 0) {
    return translation ?? key;
  }
  return replace(translation, ...variables);
};

/**
 * The replace function will replace the current placeholder with the
 * data parameter from the translation. You can give it one or more optional
 * parameters ('variables').
 */
export const replace = (value: string = '', ...variables: string[]) => {
  let translation: string = value;
  variables.forEach((variable, i) => {
    translation = translation.replace(`${placeholder}${i}`, variable);
  });

  return translation;
};

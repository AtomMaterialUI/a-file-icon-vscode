import i18next from 'i18next';
import type { EnvLanguage } from 'src/@types/languages';
import { env } from 'vscode';

/**
 * Gets the current vs code language
 */
const getCurrentLanguage = () => env.language as EnvLanguage;

/**
 * Initialize the translations
 */
export const initI18next = async () => {
  await i18next
    .init({
      lng: getCurrentLanguage(),
      fallbackLng: 'en',
      returnNull: false,
      debug: true,
      keySeparator: '.',
      nsSeparator: false,
      interpolation: {
        escapeValue: false,
      },
      resources: {
        // Cannot find a way to use dynamic import with module: commonjs, so fuck it and lets load them all
        en: { translation: await import('./locales/en.json') },
        de: { translation: await import('./locales/de.json') },
        es: { translation: await import('./locales/es.json') },
        fr: { translation: await import('./locales/fr.json') },
        nl: { translation: await import('./locales/nl.json') },
        ja: { translation: await import('./locales/ja.json') },
        pl: { translation: await import('./locales/pl.json') },
        'pt-br': { translation: await import('./locales/pt-br.json') },
        'pt-pt': { translation: await import('./locales/pt-pt.json') },
        ru: { translation: await import('./locales/ru.json') },
        uk: { translation: await import('./locales/uk.json') },
        'zh-cn': { translation: await import('./locales/zh-cn.json') },
        'zh-tw': { translation: await import('./locales/zh-tw.json') },
      },
    });
};

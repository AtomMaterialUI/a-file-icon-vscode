import i18next from 'i18next';
import { env } from 'vscode';

import type { EnvLanguage } from 'src/@types/languages';

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
      debug: true,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      keySeparator: '.',
      lng: getCurrentLanguage(),
      ns: ['translation'],
      nsSeparator: false,
      resources: {
        // Cannot find a way to use dynamic import with module: commonjs, so fuck it and lets load them all
        de: { translation: await import('./locales/de.json') },
        en: { translation: await import('./locales/en.json') },
        es: { translation: await import('./locales/es.json') },
        fr: { translation: await import('./locales/fr.json') },
        ja: { translation: await import('./locales/ja.json') },
        nl: { translation: await import('./locales/nl.json') },
        pl: { translation: await import('./locales/pl.json') },
        'pt-br': { translation: await import('./locales/pt-br.json') },
        'pt-pt': { translation: await import('./locales/pt-pt.json') },
        ru: { translation: await import('./locales/ru.json') },
        uk: { translation: await import('./locales/uk.json') },
        'zh-cn': { translation: await import('./locales/zh-cn.json') },
        'zh-tw': { translation: await import('./locales/zh-tw.json') },
      },
      returnNull: false,
    });
};

import i18next from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import type { EnvLanguage } from 'src/@types/languages';
import { env } from 'vscode';

/**
 * Gets the current vs code language
 */
const getCurrentLanguage = () => env.language as EnvLanguage;

/**
 * Initialize the translations
 */
export const initTranslations = async () => {
  await i18next
    .use(
      resourcesToBackend((language: string, _, callback) =>
        import(`src/locales/${language}.json`)
          .then((resources) => callback(null, resources))
          .catch((error) => callback(error, null)),
      ),
    )
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
    });
};






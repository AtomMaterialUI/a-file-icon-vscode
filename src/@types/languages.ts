import type { env } from 'vscode';
import type { Translation } from './translation';

export type TranslationImport = () => Promise<{ translation: Translation }>;

export type Language =
  | 'de'
  | 'en'
  | 'es'
  | 'fr'
  | 'ja'
  | 'nl'
  | 'pl'
  | 'pt-br'
  | 'pt-pt'
  | 'ru'
  | 'uk'
  | 'zh-cn'
  | 'zh-tw';

export type EnvLanguage = Language & typeof env.language;

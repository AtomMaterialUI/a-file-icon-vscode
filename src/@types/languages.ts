import type {env} from 'vscode';

export type Language =
    | 'de'
    | 'en'
    | 'es'
    | 'fr'
    | 'ja'
    | 'ko'
    | 'nl'
    | 'pl'
    | 'pt-br'
    | 'pt-pt'
    | 'ru'
    | 'uk'
    | 'zh-cn'
    | 'zh-tw';

export type EnvLanguage = Language & typeof env.language;

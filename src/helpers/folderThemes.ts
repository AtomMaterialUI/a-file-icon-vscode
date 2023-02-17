import i18next from 'i18next';
import { FolderTheme } from 'src/@types/config';

type FolderThemeConfig = {
  name: string;
  description: string;
}

export const folderThemes: Record<FolderTheme, FolderThemeConfig> = {
  [FolderTheme.Classic]: {
    name: i18next.t('classic'),
    description: i18next.t('folderThemes.classicFolders'),
  },
  [FolderTheme.None]: {
    name: i18next.t('none'),
    description: i18next.t('folderThemes.noFolders'),
  },
  [FolderTheme.Specific]: {
    name: i18next.t('specific'),
    description: i18next.t('folderThemes.specificFolders'),
  },
};
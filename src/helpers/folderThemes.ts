import i18next from 'i18next';
import { FolderTheme } from 'src/@types/config';

type FolderThemeConfig = {
  icon?: string;
  id: FolderTheme,
  name: string;
  description: string;
}

export const folderThemes: Record<FolderTheme, FolderThemeConfig> = {
  [FolderTheme.Classic]: {
    description: i18next.t('folderThemes.classicFolders'),
    id: FolderTheme.Classic,
    name: i18next.t('classic'),
  },
  [FolderTheme.None]: {
    description: i18next.t('folderThemes.noFolders'),
    id: FolderTheme.None,
    name: i18next.t('none'),
  },
  [FolderTheme.Specific]: {
    description: i18next.t('folderThemes.specificFolders'),
    id: FolderTheme.Specific,
    name: i18next.t('specific'),
  },
};
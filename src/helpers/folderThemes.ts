import i18next from 'i18next';
import { FolderTheme } from 'src/@types/config';
import { QuickPickItemKind } from 'vscode';

type FolderThemeQuickPickItem = {
  icon?: string;
  id?: FolderTheme,
  order: number;
  kind: QuickPickItemKind;
  title?: string;
  description?: string;
}

/**
 * Returns the folder themes.
 * @returns {Record<FolderTheme, FolderThemeQuickPickItem>}
 */
export const getFolderThemes = (): FolderThemeQuickPickItem[] => {
  return [
    {
      description: i18next.t('folderThemes.specificFolders'),
      icon: '$(atom-folder-specific)',
      id: FolderTheme.Specific,
      kind: QuickPickItemKind.Default,
      order: 1,
      title: i18next.t('specific'),
    },
    {
      description: i18next.t('folderThemes.classicFolders'),
      icon: '$(atom-folder-classic)',
      id: FolderTheme.Classic,
      kind: QuickPickItemKind.Default,
      order: 1,
      title: i18next.t('classic'),
    },
    {
      kind: QuickPickItemKind.Separator,
      order: 1,
    },
    {
      description: i18next.t('folderThemes.noFolders'),
      id: FolderTheme.None,
      kind: QuickPickItemKind.Default,
      order: 2,
      title: i18next.t('none'),
    },
  ];
};

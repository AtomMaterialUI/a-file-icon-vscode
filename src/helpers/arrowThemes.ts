import i18next from 'i18next';
import { ArrowTheme } from 'src/@types/config';
import { QuickPickItemKind } from 'vscode';

type ArrowThemeQuickPickItem = {
  icon?: string;
  id?: ArrowTheme,
  order: number;
  kind: QuickPickItemKind;
  title?: string;
  description?: string;
}

export const getArrowThemes = (): ArrowThemeQuickPickItem[] => {
  return [
    {
      description: i18next.t('arrowThemes.material'),
      id: ArrowTheme.Material,
      kind: QuickPickItemKind.Default,
      order: 1,
      title: i18next.t('material'),
    },
    {
      description: i18next.t('arrowThemes.triangle'),
      icon: '$(atom-folder-classic)',
      id: ArrowTheme.Triangle,
      kind: QuickPickItemKind.Default,
      order: 1,
      title: i18next.t('triangle'),
    },
    {
      description: i18next.t('arrowThemes.plusMinus'),
      icon: '$(atom-folder-classic)',
      id: ArrowTheme.PlusMinus,
      kind: QuickPickItemKind.Default,
      order: 1,
      title: i18next.t('plusMinus'),
    },
    {
      description: i18next.t('arrowThemes.arrow'),
      icon: '$(atom-folder-classic)',
      id: ArrowTheme.Arrow,
      kind: QuickPickItemKind.Default,
      order: 1,
      title: i18next.t('arrows'),
    },
    {
      kind: QuickPickItemKind.Separator,
      order: 1,
    },
    {
      description: i18next.t('arrowThemes.none'),
      id: ArrowTheme.None,
      kind: QuickPickItemKind.Default,
      order: 2,
      title: i18next.t('none'),
    },
  ];
};

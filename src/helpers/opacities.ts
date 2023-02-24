import i18next from 'i18next';
import { PredefinedOpacity } from 'src/@types/config';
import { QuickPickItemKind } from 'vscode';

type OpacityQuickPickItem = {
  description?: string;
  icon?: string;
  id?: PredefinedOpacity,
  kind: QuickPickItemKind;
  title?: string;
  order: number;
  value?: number;
}

/**
 * Returns the opacities
 */
export const getOpacities = (): OpacityQuickPickItem[] => {
  return [
    {
      description: i18next.t('opacity.transparent'),
      id: PredefinedOpacity.Transparent,
      kind: QuickPickItemKind.Default,
      order: 1,
      title: i18next.t('transparent'),
      value: 0,
    },
    {
      description: i18next.t('opacity.semiTransparent'),
      id: PredefinedOpacity.SemiTransparent,
      kind: QuickPickItemKind.Default,
      order: 1,
      title: i18next.t('semiTransparent'),
      value: 0.7,
    },
    {
      description: i18next.t('opacity.opaque'),
      id: PredefinedOpacity.Opaque,
      kind: QuickPickItemKind.Default,
      order: 1,
      title: i18next.t('opaque'),
      value: 1,
    },
    {
      kind: QuickPickItemKind.Separator,
      order: 1,
    },
    {
      description: i18next.t('customOpacity'),
      id: PredefinedOpacity.Custom,
      kind: QuickPickItemKind.Default,
      order: 2,
      title: i18next.t('custom'),
    },
  ];
};

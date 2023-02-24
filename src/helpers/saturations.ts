import i18next from 'i18next';
import { PredefinedSaturation } from 'src/@types/config';
import { QuickPickItemKind } from 'vscode';

type SaturationQuickPickItem = {
  description?: string;
  icon?: string;
  id?: PredefinedSaturation,
  kind: QuickPickItemKind;
  title?: string;
  order: number;
  value?: number;
}

/**
 * Returns the opacities
 */
export const getSaturations = (): SaturationQuickPickItem[] => {
  return [
    {
      description: i18next.t('saturation.grayscale'),
      id: PredefinedSaturation.Grayscale,
      kind: QuickPickItemKind.Default,
      order: 1,
      title: i18next.t('grayscales'),
      value: 0,
    },
    {
      description: i18next.t('saturation.desaturated'),
      id: PredefinedSaturation.Desaturated,
      kind: QuickPickItemKind.Default,
      order: 1,
      title: i18next.t('desaturated'),
      value: 0.7,
    },
    {
      description: i18next.t('saturation.vivid'),
      id: PredefinedSaturation.Vivid,
      kind: QuickPickItemKind.Default,
      order: 1,
      title: i18next.t('vivid'),
      value: 1,
    },
    {
      kind: QuickPickItemKind.Separator,
      order: 1,
    },
    {
      description: i18next.t('customSaturation'),
      icon: '$(atom-folder-classic)',
      id: PredefinedSaturation.Custom,
      kind: QuickPickItemKind.Default,
      order: 2,
      title: i18next.t('custom'),
    },
  ];
};

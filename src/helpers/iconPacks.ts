import { IconPack } from 'src/@types/config';
import { QuickPickItemKind } from 'vscode';

type IconPackQuickItem = {
  id?: IconPack;
  title?: string;
  icon?: string;
  kind: QuickPickItemKind;
  order: number;
}

export const getIconPacks = (): IconPackQuickItem[] => {
  return [
    {
      icon: '$(angular)',
      id: IconPack.Angular,
      kind: QuickPickItemKind.Default,
      order: 1,
      title: IconPack.Angular.toLowerCase(),
    },
    {
      icon: '$(ngrx)',
      id: IconPack.Ngrx,
      kind: QuickPickItemKind.Default,
      order: 1,
      title: IconPack.Ngrx.toLowerCase(),
    },
    {
      icon: '$(nest)',
      id: IconPack.Nest,
      kind: QuickPickItemKind.Default,
      order: 1,
      title: IconPack.Nest.toLowerCase(),
    },
    {
      kind: QuickPickItemKind.Separator,
      order: 1,
    },
    {
      icon: '$(react)',
      id: IconPack.React,
      kind: QuickPickItemKind.Default,
      order: 2,
      title: IconPack.React.toLowerCase(),
    },
    {
      icon: '$(redux)',
      id: IconPack.Redux,
      kind: QuickPickItemKind.Default,
      order: 2,
      title: IconPack.Redux.toLowerCase(),
    },
    {
      icon: '$(recoil)',
      id: IconPack.Recoil,
      kind: QuickPickItemKind.Default,
      order: 2,
      title: IconPack.Recoil.toLowerCase(),
    },
    {
      kind: QuickPickItemKind.Separator,
      order: 2,
    },
    {
      icon: '$(vue)',
      id: IconPack.Vue,
      kind: QuickPickItemKind.Default,
      order: 3,
      title: IconPack.Vue.toLowerCase(),
    },
    {
      icon: '$(vuex)',
      id: IconPack.Vuex,
      kind: QuickPickItemKind.Default,
      order: 3,
      title: IconPack.Vuex.toLowerCase(),
    },
    {
      kind: QuickPickItemKind.Separator,
      order: 3,
    },
    {
      icon: '$(rails)',
      id: IconPack.Rails,
      kind: QuickPickItemKind.Default,
      order: 4,
      title: IconPack.Rails.toLowerCase(),
    },
    {
      kind: QuickPickItemKind.Separator,
      order: 4,
    },
    {
      icon: '$(phalcon)',
      id: IconPack.Phalcon,
      kind: QuickPickItemKind.Default,
      order: 5,
      title: IconPack.Phalcon.toLowerCase(),
    },
    {
      icon: '$(volt)',
      id: IconPack.Volt,
      kind: QuickPickItemKind.Default,
      order: 5,
      title: IconPack.Volt.toLowerCase(),
    },
    {
      kind: QuickPickItemKind.Separator,
      order: 5,
    },
    {
      icon: '',
      id: IconPack.None,
      kind: QuickPickItemKind.Default,
      order: 6,
      title: IconPack.None.toLowerCase(),
    },
  ];
};
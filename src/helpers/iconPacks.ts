import { IconPack } from 'src/@types/config';
import { QuickPickItemKind } from 'vscode';

type IconPackQuickItem = {
  id?: IconPack;
  title?: string;
  icon?: string;
  kind: QuickPickItemKind;
  order: number;
}

export const iconPacks: IconPackQuickItem[] = [
  {
    id: IconPack.Angular,
    title: IconPack.Angular.toLowerCase(),
    icon: '$(angular)',
    kind: QuickPickItemKind.Default,
    order: 1,
  },
  {
    id: IconPack.Ngrx,
    title: IconPack.Ngrx.toLowerCase(),
    icon: '$(ngrx)',
    kind: QuickPickItemKind.Default,
    order: 1,
  },
  {
    id: IconPack.Nest,
    title: IconPack.Nest.toLowerCase(),
    icon: '$(nest)',
    kind: QuickPickItemKind.Default,
    order: 1,
  },
  {
    kind: QuickPickItemKind.Separator,
    order: 1,
  },
  {
    id: IconPack.React,
    title: IconPack.React.toLowerCase(),
    icon: '$(react)',
    kind: QuickPickItemKind.Default,
    order: 2,
  },
  {
    id: IconPack.Redux,
    title: IconPack.Redux.toLowerCase(),
    icon: '$(redux)',
    kind: QuickPickItemKind.Default,
    order: 2,
  },
  {
    id: IconPack.Recoil,
    title: IconPack.Recoil.toLowerCase(),
    icon: '$(recoil)',
    kind: QuickPickItemKind.Default,
    order: 2,
  },
  {
    kind: QuickPickItemKind.Separator,
    order: 2,
  },
  {
    id: IconPack.Vue,
    title: IconPack.Vue.toLowerCase(),
    icon: '$(vue)',
    kind: QuickPickItemKind.Default,
    order: 3,
  },
  {
    id: IconPack.Vuex,
    title: IconPack.Vuex.toLowerCase(),
    icon: '$(vuex)',
    kind: QuickPickItemKind.Default,
    order: 3,
  },
  {
    kind: QuickPickItemKind.Separator,
    order: 3,
  },
  {
    id: IconPack.Rails,
    title: IconPack.Rails.toLowerCase(),
    icon: '$(rails)',
    kind: QuickPickItemKind.Default,
    order: 4,
  },
  {
    kind: QuickPickItemKind.Separator,
    order: 4,
  },
  {
    id: IconPack.Phalcon,
    title: IconPack.Phalcon.toLowerCase(),
    icon: '$(phalcon)',
    kind: QuickPickItemKind.Default,
    order: 5,
  },
  {
    id: IconPack.Volt,
    title: IconPack.Volt.toLowerCase(),
    icon: '$(volt)',
    kind: QuickPickItemKind.Default,
    order: 5,
  },
  {
    kind: QuickPickItemKind.Separator,
    order: 5,
  },
  {
    id: IconPack.None,
    title: IconPack.None.toLowerCase(),
    icon: '',
    kind: QuickPickItemKind.Default,
    order: 6,
  },
];

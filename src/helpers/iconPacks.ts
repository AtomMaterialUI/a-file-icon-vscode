import { IconPack } from 'src/@types/config';
import { QuickPickItemKind } from 'vscode';

type IconPackQuickItem = {
  icon?: string;
  id?: IconPack;
  kind: QuickPickItemKind;
  order: number;
  title?: string;
}

export const getIconPacks = (): IconPackQuickItem[] => {
  return [
    {
      icon: '$(atom-angular)',
      id: IconPack.Angular,
      kind: QuickPickItemKind.Default,
      order: 1,
      title: IconPack.Angular.toLowerCase(),
    },
    {
      icon: '$(atom-angular2)',
      id: IconPack.Angular2,
      kind: QuickPickItemKind.Default,
      order: 1,
      title: IconPack.Angular2.toLowerCase(),
    },
    {
      icon: '$(atom-ngrx)',
      id: IconPack.Ngrx,
      kind: QuickPickItemKind.Default,
      order: 1,
      title: IconPack.Ngrx.toLowerCase(),
    },
    {
      icon: '$(atom-nest)',
      id: IconPack.Nest,
      kind: QuickPickItemKind.Default,
      order: 1,
      title: IconPack.Nest.toLowerCase(),
    },
    {
      icon: '$(atom-next)',
      id: IconPack.Next,
      kind: QuickPickItemKind.Default,
      order: 1,
      title: IconPack.Next.toLowerCase(),
    },
    {
      kind: QuickPickItemKind.Separator,
      order: 1,
    },
    {
      icon: '$(atom-react)',
      id: IconPack.React,
      kind: QuickPickItemKind.Default,
      order: 2,
      title: IconPack.React.toLowerCase(),
    },
    {
      icon: '$(atom-redux)',
      id: IconPack.Redux,
      kind: QuickPickItemKind.Default,
      order: 2,
      title: IconPack.Redux.toLowerCase(),
    },
    {
      icon: '$(atom-recoil)',
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
      icon: '$(atom-vue)',
      id: IconPack.Vue,
      kind: QuickPickItemKind.Default,
      order: 3,
      title: IconPack.Vue.toLowerCase(),
    },
    {
      icon: '$(atom-vuex)',
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
      icon: '$(atom-rails)',
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
      icon: '$(atom-phalcon)',
      id: IconPack.Phalcon,
      kind: QuickPickItemKind.Default,
      order: 5,
      title: IconPack.Phalcon.toLowerCase(),
    },
    {
      icon: '$(atom-volt)',
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

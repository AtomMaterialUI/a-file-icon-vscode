# Third-party notices

This extension is an unofficial fork of
[AtomMaterialUI/a-file-icon-vscode](https://github.com/AtomMaterialUI/a-file-icon-vscode). It is not affiliated with or
endorsed by the original authors, JetBrains, or the owners of any logo shown in the icons.

## Code and icons from the original project

- `a-file-icon-vscode` — MIT, Copyright (c) 2023 Elior "Mallowigi" Boukhobza and Philipp "PKief" Kief
  (see [LICENSE.md](./LICENSE.md)). The implementation is based on
  [Material Icon Theme](https://github.com/PKief/vscode-material-icon-theme) (MIT).
- `iconGenerator` (the icon SVGs in `iconGenerator/assets/icons`) — MIT, Copyright (c) 2017-2019 Elior Boukhobza
  (<https://github.com/AtomMaterialUI/iconGenerator>). The full text is in `iconGenerator/LICENSE`.

## Sources the original icons credit

The `iconGenerator` project credits the following sources for its icons. Each keeps its own license; see the linked
projects for the exact terms (for example, Font Awesome 4.7 icons are CC BY 4.0, the font is SIL OFL 1.1).

- [Atom File Icons](https://github.com/file-icons/atom) and [File-Icons](https://github.com/file-icons/source)
- [Font Awesome 4.7.0](https://fontawesome.com/v4.7.0/)
- [MFixx](https://github.com/file-icons/MFixx), [Devicons](https://github.com/file-icons/DevOpicons)
- [Octicons](https://primer.style/foundations/icons)
- [Material Design Icons](https://pictogrammers.com/library/mdi/)

## Extension logo

`logo.svg` and `logo.png` were drawn for this fork and are covered by the MIT license of this repository
(the original project's atom logo is not used).

## Icons added by this fork

- `assets/icons/files/pycharm-python*.svg` — from
  [JetBrains/intellij-community](https://github.com/JetBrains/intellij-community), Apache License 2.0,
  Copyright 2000-2024 JetBrains s.r.o. and contributors. See [assets/icons/NOTICE.md](./assets/icons/NOTICE.md) and
  [assets/icons/LICENSE-APACHE-2.0.txt](./assets/icons/LICENSE-APACHE-2.0.txt).

## Colors from the JetBrains IDEs

The color themes (`themes/cool-islands-*.base.json` and the `dist/cool-islands-*-color-theme.json` made from them) are
derived from the Islands, Dark, Light, Darcula and IntelliJ themes and color schemes of
[JetBrains/intellij-community](https://github.com/JetBrains/intellij-community) and of the Python, Markdown, YAML,
shell and XML plugins in it, at the commit given in `themes/jetbrains-source.json`. Apache License 2.0,
Copyright 2000-2026 JetBrains s.r.o. and contributors; the license text is in
[assets/icons/LICENSE-APACHE-2.0.txt](./assets/icons/LICENSE-APACHE-2.0.txt). The colors were converted to the VS Code
color theme format by `src/scripts/themes/syncJetbrainsColors.ts`.

## Trademarks

Product names, logos and brands (Angular, React, Vue, Python, and so on) are the property of their respective owners.
They appear only to identify file and folder types.

## Other icon themes

The Mix Icon Themes feature reads the icon themes you have installed and copies their icons into this extension's
folder on your own computer. Those icons stay under the license of their own theme and are not part of this package.

### Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

#### 0.1.0 (2026-11-21)

The first version of `woogajjangka.cool-theme-kit`. The versions below it (1.0.0 to 1.3.0) were released as
`woogajjangka.cool-icon-vscode`.

- feat!: the extension id is now `woogajjangka.cool-theme-kit`, the name of the extension, and the repository is
  `WoogaJJangka/cool-theme-kit`. The old extension `woogajjangka.cool-icon-vscode` is removed from the Marketplace:
  install this one and uninstall the old one (Cool Theme Kit offers to when it finds it installed). The setting ids and
  theme ids do not change, so your settings still apply.
- feat: **Copy Diagnostics (for a Bug Report)** copies what a bug report needs (versions, the selected themes, the
  editor font, the other theme extensions, the settings changed from the defaults, with the home folder written `~`)
  and offers to open the bug report form. New issue forms: bug report, "Looks different from PyCharm" and idea, in
  English and Korean.

- feat!: the JetBrains fonts are opt-in. Installing the extension no longer changes `editor.fontFamily` and
  `markdown.preview.fontFamily` (they were `configurationDefaults`), so a user of the file icons alone keeps the font of
  VS Code. The **Use the JetBrains Fonts** command writes them to the user settings (asking before it replaces a font
  set there), **Stop Using the JetBrains Fonts** removes them, and selecting a Cool Islands color theme without an
  editor font of your own offers them once. If you used the fonts of an earlier version, accept that offer or run the
  command to keep them.
- feat: a **Get Started with Cool Theme Kit** walkthrough with a button for each part of the kit (file icons, color
  theme, product icons, fonts, mixing), each applied only when chosen.
- feat: the settings are grouped by kind in the Settings editor: File Icons, Color Themes, Product Icons, Fonts.
- docs: the README starts with screenshots of Cool Islands Dark and Light, the walkthrough and the Mix Themes page
  (`bun run screenshots` captures them again in an isolated VS Code), and lists what VS Code cannot do (rounded panels,
  colored product icons). The changelog of the original extension moved to `docs/CHANGELOG-upstream.md`.

#### 1.3.0 (2026-11-21)

- feat: a new logo for Cool Theme Kit: Islands panels layered over each other (a light theme, code colors, the file
  icons on the accent blue), in the Cool Islands palette, on a Cool Islands Dark Marketplace banner. `logo.png` is
  rendered from `logo.svg` by `bun run build:logo`
- fix: once a product icon theme had been mixed in, the icon theme was not regenerated any more (settings were ignored
  and an error was shown)
- fix: the files of another theme (icons, fonts, included color themes) are read only from inside its own extension,
  as VS Code does
- fix: in an untrusted folder (Restricted Mode), the file, folder and language icon associations of the folder's
  settings are ignored, since they may point to SVG files that would be copied into the icon theme; those of the user
  settings still apply
- fix: a Mix Themes sample pinned with `iconThemeByName` is found whatever the Unicode form of its name (Korean names
  on macOS)
- chore: the build and test tools are updated within their ranges, mocha 12, and puppeteer (used only by an unused
  screenshot script, removed) is gone: no high or critical advisory left. The smoke test's heap budget is 3 MB
- ci: checks for security (bundled dependency audit, CodeQL), compatibility (the smoke test next to other icon and
  color theme extensions, on Linux and Windows) and memory, described in `docs/MAINTENANCE.md`

#### 1.2.1 (2026-11-20)

- ci: the release workflow takes an exact `version` (greater than the latest release) instead of a patch/minor/major change
- fix: when the extension cannot write in its own folder (a system-wide install, a read-only folder), it says so once per
  version and keeps its default themes, instead of an error at every change of a setting. Other failures are still shown
- test: `bun run test:smoke [version]` starts a real VS Code with the extension (activation, Mix Themes page, regenerated
  icon and color themes); it passes on the lowest supported VS Code, 1.95.0, and on 1.147.0
- docs: a compatibility table in the README (desktop, VS Code for the Web, read-only installs)

- perf: a Mix Themes page that is not shown is no longer kept alive: VS Code drops the hidden page and loads it again when
  shown (its tab and scroll position come back), and a hidden page is not sent states to build any more
- perf: at every start the extension no longer parses the generated theme files (about 900 KB of json) to compare them with
  the settings: it reads a small `dist/.state.json` written beside them, and reads the theme files only when they are not
  the ones the state was written for
- perf: the installed color themes and product icon themes are no longer listed (a read of the manifest of every extension)
  when no theme is mixed in, and the list is kept until an extension is installed, updated or removed
- chore: the debug output of `i18next` is off; `COOL_THEME_KIT_MEMORY=1` makes the extension log the memory of its extension
  host and the time of its start and regeneration to its output channel (nothing is logged without it)

- feat: `accentColor` replaces the blue of Cool Islands Dark and Light (focus ring, buttons, links, active tab, selection),
  with a color picker and swatches on the Colors tab of the Mix Themes page. It wins over the color layers and loses to
  `colorThemeByKey`; the text on the accent stays readable (black or white when needed)
- feat: more language colors of the JetBrains color schemes in Cool Islands Dark/Light: regular expressions (every key of
  the IDE: classes, escapes, meta characters, brackets, group names, flags; plain characters are strings), JavaScript and
  TypeScript (regex literals, member functions, `console`/`window`/`Math`… in the globals color), XML (tags, names,
  namespace prefixes, prologue), HTML custom elements and the separator of properties files
- fix: the brackets of HTML tags have the color of the tag, as in the IDE (they had the plain text color in the dark theme)

#### 1.1.0 (2026-11-20)

- feat: **Cool Islands Icons** product icon theme: the JetBrains New UI icons (tool windows, tree arrows, editor and panel
  actions, find, problems, run and debug, source control, symbols), built into a font by `bun run build:product-icons`
- feat: mix other product icon themes into Cool Islands Icons: `productIconThemeLayers` (`fill` / `override` / `off`,
  Cool Material Icons included) and `productIconByName` (icon ids or globs), with a Product icons tab in the Mix Themes
  page and a reload notification
- perf: a settings change no longer blocks the extension host (and so every other extension) for 6 to 9 seconds while
  the icon theme is regenerated: unchanged icons are not written again, the regeneration waits for the end of a burst
  of events and ignores the settings of other extensions, and it runs after the activation (about 1.3 s now)
- fix: the icons written for a non-default opacity, saturation, folder color or monochrome color no longer pile up in
  the extension folder (a full copy of the icons for every settings change)
- feat: mix other installed color themes into Cool Islands: `colorThemeLayers` (`fill` / `override` / `off` for the
  workbench colors and the syntax colors separately, into the Cool Islands theme of the same kind or `applyTo`) and
  `colorThemeByKey` (single color ids or globs, `scope:` TextMate scopes and `semantic:` selectors from a theme). A
  notification offers to reload the window when the selected theme changes
- feat: the Mix Themes page has a Colors tab with a preview of the result, Cool Islands and each mixed theme; new
  command Mix Color Themes (with Preview)
- feat: the extension is now **Cool Theme Kit**: a JetBrains (PyCharm New UI) style base theme for VS Code, with other
  installed themes layered on top. The file icon theme is **Cool Icons** and the product icon theme **Cool Material
  Icons** in the pickers; their ids, the extension id and the settings do not change
- feat: **Cool Islands Dark** and **Cool Islands Light** color themes, generated from the JetBrains Islands themes
  and color schemes (with the PyCharm colors for Python), `bun run sync:colors`
- feat: JetBrains fonts as defaults for the settings you leave empty: `editor.fontFamily` (JetBrains Mono, then D2Coding
  and the Korean system fonts) and `markdown.preview.fontFamily` (Inter, then the Korean system fonts), with a one-time
  notification to download the missing fonts (`showFontMessage`)
- fix: Korean file and folder names typed in their decomposed Unicode form (NFD) now match in the associations and
  `iconThemeByName`; the Mix Icon Themes page uses Korean fallback fonts and breaks Korean lines between words
- fix: the Polish, Portuguese, Russian and Chinese command titles started with a stray "vuex"
- fix: Korean messages use the right particles after the theme names
- feat: mix other installed icon themes (`iconThemeLayers`: `fill` the names this theme does not know or `override`
  its icons, for files and folders separately; `iconThemeByName`: one name from a given theme). By default the
  Material Icon Theme, when installed, fills the names this theme does not know
- feat: the icons follow the JetBrains plugin: every file and folder name it knows gets the icon PyCharm shows
  (`CONTRIBUTING.md`, `Jenkinsfile`, `index.php`, `setup.cfg`, `.devcontainer`...), in dark and light themes
- feat: default icon packs are the JetBrains defaults (Angular 2 instead of AngularJS, Nest, Next, NgRx, Recoil, Redux)
- fix: file names and extensions are written in lower case, as VS Code reads them (a light theme kept a replaced icon)
- feat: `pycharm` icon pack (on by default): Python files use the two-tone Python icon of PyCharm
- feat: Tests icon pack (on by default) and CSS icon pack (off by default) from the JetBrains plugin
- feat: monochrome icons (`monochrome`, `monochromeColor`) with toggle and color commands
- feat: `hideFileIcons` setting
- feat: custom SVG files in `filesAssociations` / `foldersAssociations`
- feat: `presentation` folders use the views icon (#65)
- feat: icons and associations synced from the JetBrains plugin (`bun run sync:upstream`, weekly CI)
- fix: settings changes rebuild the theme from all the settings (#74, #71, #70)
- fix: theme files are written atomically (#67) and generation errors are shown (#73)
- fix: commands write to the user settings when no folder is opened (#73)
- fix: an active icon pack replaces the base icon in light themes too
- fix: language icons that no file association used had no icon (bower, gruntfile, gulpfile, jupyter...)
- fix: light themes use the plain icon instead of the `_dark` variant made for dark backgrounds
- fix: icons pointing to missing svgs (image2/3, archive2/3, empty, profile, skeleton, zod folders, plastic open folder)
- feat: custom SVG files in `languagesAssociations`, language ids keep their case
- note: test icons now come from the `tests` pack. If you set `activeIconPacks` yourself, add `"tests"` to keep them.

The changelog of the original extension (Atom Material Icons, before the fork) is in
[docs/CHANGELOG-upstream.md](docs/CHANGELOG-upstream.md).

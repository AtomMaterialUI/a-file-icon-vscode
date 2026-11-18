# Atom Material Icons Plugin for VSCode

<h1 align="center">
  <br>
    <img src="https://raw.githubusercontent.com/mallowigi/a-file-icon-vscode/master/logo.png?sanitize=true" alt="logo" width="200">
  <br><br>
  Atom Material File Icons for VSCode
  <br>
  <br>
</h1>


This plugin is a port of the [Atom File Icons](https://github.com/file-icons/atom) for VSCode.

It replaces the icons and folder icons with better suited icons, related to the file type, framework or language.

This plugin is inspired by the [Material Icon Theme](https://github.com/PKief/vscode-material-icon-theme)
and [Atom Material Icons for JetBrains](https://github.com/mallowigi/a-file-icon-idea).

## Features

- Replaces **file icons** with their relevant logo icons
    - According to their extension (`.java`, `.php`, `.ruby`...)
    - According to the framework (Android, NPM, RSpec...)
    - According to the program used in conjonction (Babel, Docker, CircleCI...)
    - According to the parent directory (`.github/*`, `.vscode/*`...)
    - And others...
- Replaces **folder icons**:
    - From common patterns: `src`, `main`, `app`, `img`, `docs`...
    - From specific use cases: `node_modules`, `.vscode`, `.git.`..
- Provides it's own **Product Icons** from the _Material Design Icons_.

## Associations

You can find a list of all the available associations in the following links:

- [File Associations](https://material-theme.com/docs/reference/associations/)
- [Folder Associations](https://material-theme.com/docs/reference/folder-associations/)
- Language Associations: [`src/icons/languageIcons.ts`](./src/icons/languageIcons.ts) (VS Code language ids, used when no file
  name or extension matches)

## File Icons

![File Icons](https://raw.githubusercontent.com/mallowigi/iconGenerator/master/assets/files.png)

## Folder Icons

![Folder Icons](https://raw.githubusercontent.com/mallowigi/iconGenerator/master/assets/folders.png)


---- 

## Usage

Since this extension is based off the
original [Material Icon Theme](https://github.com/PKief/vscode-material-icon-theme),
you can find most of the original settings here as well.

Therefore, this extension exposes a bunch of commands that you can invoke via the command palette:

![commandPalette.png](./docs/commandPalette.png)

Just type `Atom Material` in order to see the commands that are available.

----

## Settings

You can customize many aspects of the extension, either via the VSCode settings or by invoking the commands via the
command palette.

When setting the option via the _Preferences_, they will affect **all projects**, whereas the commands only
affect the **current workspace**.

---

### Icon Packs

While this extension contains a lot of icons, there are some icons that overlap with each other. For example, _Angular_,
and _NestJS_ use similar icon filename patterns. If you are working with an angular project you wouldn't want to see
NestJS icons and vice-versa.

This command will allow you to decide which pack(s) to enable for the current workspace.

As in the JetBrains plugin, two packs do not belong to a framework:

- **tests** (enabled by default): `*.test.ts`, `*.spec.py`... use the test icon of their language.
- **css** (disabled by default): `.css` files use the alternative CSS icon.
- **pycharm** (enabled by default): Python files look like in PyCharm. Every `.py`, `.pyi` and `.pyw` file, whatever its
  name (`manage.py`, `__init__.py`, `test_app.py`...), uses the two-tone Python icon of PyCharm instead of the Atom icons.

![iconPacks.png](./docs/iconPacks.png)

> **Note**: Since you can enable multiple packs, there is still a way to enable both overlapping icon packs. It's
> recommended to not do as such as it would return unexpected results.

---

### Arrow Styles

You can customize the look of the arrows in the tree view using the command palette:

![arrowStyles.png](./docs/arrowStyles.png)

or via user settings:

```json
{
  "a-file-icon-vscode.arrowTheme": "material"
}
```

The available options are:

- `material`: Material Design arrows (chevrons)
- `triangle`: Triangle arrows
- `plusMinus`: Plus and minus signs
- `arrow`: Simple Arrows
- `none`: No arrows

> Note: This setting affects not only arrows from the tree view, but also arrows that you can find in many other places,
> such as the collapsible sections, code folding, etc.

> Another note: Arrows in the tree view work differently than arrows in the other places, as they are currently rotated
> from
> the "down arrow". As a result, some styles will display "weird results", such as the "Plus-Minus" style, that only
> displays the minus sign, but rotated. This could be solved via custom CSS in the future.

---

### Custom Folder Color

You can customize the color of the default folder icon using the command palette:

![folderColor.png](./docs/folderColor.png)

or via user settings:

```json
{
  "a-file-icon-vscode.folderColor": "#ef5350"
}

```

----

### Folder Theme

You can change the style of the folder icons using the command palette:

![folderTheme.png](./docs/folderTheme.png)

or via user settings:

```json
{
  "a-file-icon-vscode.folderTheme": "specific"
}
```

The available options are:

- `specific`: Replace specific folders, such as `src`, `main`, `app`, `img`, `docs`, etc.
- `classic`: Replace all folders with the default folder icon
- `none`: No folder icons

----

#### Custom icons' opacity

You can customize the opacity of the icons, between totally opaque to completely gone.

You can either choose a predefined opacity or enter your own opacity via the command palette:

![opacity.png](./docs/opacity.png)

or via user settings:

```json
{
  "a-file-icon-vscode.opacity": 0.5
}
```

---

## Custom icons' saturation

You can customize the saturation of the icons. The less saturated they are, the more grayscale they will appear.

You can either choose a predefined saturation or enter your own saturation via the command palette:

![saturation.png](./docs/saturation.png)

or via user settings:

```json
{
  "a-file-icon-vscode.saturation": 0.5
}
```

## Monochrome icons

Display every file and folder icon in shades of a single color, like the _Monochrome icons_ option of the JetBrains
plugin. Use the **Toggle Monochrome Icons** and **Change Monochrome Color** commands, or the settings:

```json
{
  "a-file-icon-vscode.monochrome": true,
  "a-file-icon-vscode.monochromeColor": "#90a4ae"
}
```

## Hide file icons

Remove the file icons and keep the folder icons (`"a-file-icon-vscode.folderTheme": "none"` does the opposite):

```json
{
  "a-file-icon-vscode.hideFileIcons": true
}
```

----

## Product Theme

In addition to file, folder and language icons, this extension also modifies the IDE's product icons to match the icons
of the JetBrains's equivalent extension and the Material Design Icons.

![prodIcon.png](./docs/prodIcon.png)

![productIconTheme.png](./docs/productIconTheme.png)
------

## Custom associations

You can customize the icon associations directly in the user settings. The value is the name of one of the bundled
icons (the file name without `.svg` in `iconGenerator/assets/icons/files` or `.../folders`).

### File associations

With the `*.[extension]` pattern you can define custom file icon associations. For example you could define an icon
for `*.sample` and every file that ends with `.sample` will have the defined icon. However, not all files with the same
file extension always have the same icon. For some specific file names there is a special icon. In order to overwrite
all the specific file icons as well, two asterisks must be set instead of one, i.e. `**.[extension]`.

If there's no leading `*` it will be automatically configured as filename and not as file extension.

```json
{
  "a-file-icon-vscode.filesAssociations": {
    "*.ts": "typescript",
    "**.json": "json",
    "fileName.ts": "angular"
  }
}
```

#### Custom SVG icons

Instead of a bundled icon name, the value can be the path of your own SVG file. Use an absolute path, or a path starting
with `~` for your home directory:

```json
{
  "a-file-icon-vscode.filesAssociations": {
    "*.foo": "~/icons/foo.svg",
    "fileName.ts": "C:/icons/sample.svg"
  },
  "a-file-icon-vscode.foldersAssociations": {
    "recipes": "~/icons/recipes.svg"
  }
}
```

The file is copied into the extension when the theme is regenerated, with the same opacity, saturation and monochrome
filters as the bundled icons. For a folder, a `recipes-open.svg` (or `recipes_open.svg`) next to it is used for the
expanded state, otherwise the same icon is used. A path that does not exist is ignored.

_Note: the icon is copied when the settings change. After editing the SVG file itself, change any setting (or remove and
add the association again) to pick up the new version._

### Folder associations

The following configuration can customize the folder icons. It is also possible to overwrite existing associations and
create nice combinations. For example you could change the folder theme to "classic" and define icons only for the
folder names you like.

```json
{
  "a-file-icon-vscode.foldersAssociations": {
    "customFolderName": "src",
    "sample": "dist"
  }
}
```

#### Custom SVG folder icons

See [Custom SVG icons](#custom-svg-icons): the same paths work in `foldersAssociations`.

### Language associations

With the following configuration you can customize the language icons. It is also possible to overwrite existing
associations.

```json
{
  "a-file-icon-vscode.languagesAssociations": {
    "languageId": "iconName",
    "json": "json",
    "mylang": "~/icons/mylang.svg"
  }
}
```

The key is a [language identifier](https://code.visualstudio.com/docs/languages/identifiers) (case-sensitive). VS Code
uses it only for files whose name and extension have no icon. The value is a bundled icon name or the path of a custom
SVG file, as for the [file associations](#custom-svg-icons).

## Commands

Here's a list of the available commands:

| Command                           | Description                                                                        |
|-----------------------------------|------------------------------------------------------------------------------------|
| **Arrows Style**                  | Change the style of the arrows in the project tree.                                |
| **Change Folder Color**           | Change the color of the folder icons.                                              |
| **Change Folder Theme**           | Change the design of the folder icons.                                             |
| **Change Monochrome Color**       | Pick the color of the monochrome icons (and enable them).                          |
| **Change Opacity**                | Change the opacity of the icons.                                                   |
| **Change Saturation**             | Change the saturation value of the icons.                                          |
| **Icon Packs**                    | Select icon packs that enable additional icons (e.g. for Angular, React, Ngrx...). |
| **Restore Default Configuration** | Reset the default configurations of the icon theme.                                |
| **Toggle Monochrome Icons**       | Switch between colored and monochrome icons.                                       |

## Differences with the JetBrains plugin

Some options of the JetBrains plugin cannot be built with the VS Code icon theme API:

- **Hollow folders** (folders that contain open files): an icon theme does not know which files are open.
- **Accent color**: it colors UI icons, and VS Code product icons are a font that takes the color of the theme.
- **Icon size and row height**, **PSI icons** (icons based on the file content), and icons of the whole IDE UI.
- Associations based on the parent folder (`tests/*.ts`): VS Code matches only file names and extensions.

----

## Credits

- The PyCharm Python icon comes from [JetBrains/intellij-community](https://github.com/JetBrains/intellij-community)
  (Apache License 2.0), see [assets/icons/NOTICE.md](./assets/icons/NOTICE.md)

Special credits to:

- [VSCode Material Icon Theme](https://github.com/PKief/vscode-material-icon-theme) for the implementation
- [Atom File Icons](https://github.com/file-icons/atom)
  and [Sublime Text A File Icon](https://github.com/SublimeText/AFileIcon) for the idea
- [Scientifics Study Vectors](https://www.svgrepo.com/svg/121720/atom) for the plugin icon
- [File-Icons](https://github.com/file-icons/source/blob/master/charmap.md)
- [FontAwesome 4.7.0](https://fontawesome.com/v4.7.0/cheatsheet/)
- [MFixx](https://github.com/file-icons/MFixx/blob/master/charmap.md)
- [Devicons](https://github.com/file-icons/DevOpicons/blob/master/charmap.md)
- [Octicons](https://octicons.github.com/)
- [Material Design Icons](https://materialdesignicons.com/)

## Related extensions

- [VSCode Material Icon Theme](https://github.com/PKief/vscode-material-icon-theme)
- [Material Icons for GitHub](https://github.com/Claudiohbsantos/github-material-icons-extension)

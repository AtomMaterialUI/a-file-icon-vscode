# Atom Material Icons Plugin for Web

<h1 align="center">
  <br>
    <img src="https://raw.githubusercontent.com/mallowigi/a-file-icon-idea/master/src/main/resources/META-INF/pluginIcon.svg?sanitize=true" alt="logo" width="200">
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
    - According to their extension (Java, PHP, Ruby...)
    - According to the framework (Android, NPM, RSpec...)
    - According to the program used with (Babel, Docker, CircleCI...)
- Replaces **directories**:
    - With a common pattern: src, main, app, img, docs...
    - With a specific pattern: node_modules, .vscode, .git...

## File Icons

![File Icons](https://raw.githubusercontent.com/mallowigi/iconGenerator/master/assets/files.png)

## Folder Icons

![Folder Icons](https://raw.githubusercontent.com/mallowigi/iconGenerator/master/assets/folders.png)

---- 

### Settings

#### Customize folder color

You can change the color of the default folder icon using the command palette:

<img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/images/set-folder-color.gif" alt="custom folder colors">

or via user settings:

```json
{
  "a-file-icon-vscode.folders.color": "#ef5350"
}
```

#### Folder themes

You can change the design of the folder icons using the command palette:

<img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/images/set-folder-theme.gif" alt="folder themes">

or via user settings:

```json
{
  "a-file-icon-vscode.folders.theme": "specific"
}
```

## Custom icon opacity

You can set a custom opacity for the icons:

```json
{
  "a-file-icon-vscode.opacity": 0.5
}
```

## Custom icon saturation

If colors do not make you happy you can change the icons to have less saturation making them look grayish or completely
grayscale by setting saturation to 0:

```json
{
  "a-file-icon-vscode.saturation": 0.5
}
```

## Custom icon associations

You can customize the icon associations directly in the user settings.

### File associations

With the `*.[extension]` pattern you can define custom file icon associations. For example you could define an icon
for `*.sample` and every file that ends with `.sample` will have the defined icon. However, not all files with the same
file extension always have the same icon. For some specific file names there is a special icon. In order to overwrite
all the specific file icons as well, two asterisks must be set instead of one, i.e. `**.[extension]`.

If there's no leading `*` it will be automatically configured as filename and not as file extension.

```json
{
  "a-file-icon-vscode.files.associations": {
    "*.ts": "typescript",
    "**.json": "json",
    "fileName.ts": "angular"
  }
}
```

#### Custom SVG icons

It's possible to add custom icons by adding a path to an SVG file which is located relative to the extension's dist
folder. However, the restriction applies that the directory in which the custom icons are located must be within
the `extensions` directory of the `.vscode` folder in the user directory.

For example a custom SVG file called `sample.svg` can be placed in an `icons` folder inside of VS Code's `extensions`
folder:

```
.vscode
 ┗ extensions
   ┗ icons
     ┗ sample.svg
```

In the settings.json the icon can be associated to a file name or file extension like this:

```json
"a-file-icon-vscode.files.associations": {
"fileName.ts": "../../icons/sample"
}
```

_Note: The custom file name must be configured in the settings without the file ending `.svg` as shown in the example
above._

### Folder associations

The following configuration can customize the folder icons. It is also possible to overwrite existing associations and
create nice combinations. For example you could change the folder theme to "classic" and define icons only for the
folder names you like.

```json
"a-file-icon-vscode.folders.associations": {
"customFolderName": "src",
"sample": "dist"
}
```

#### Custom SVG folder icons

Similar to the files, it is also possible to reference your own SVG icons for folder icons. Here it's important to
provide two SVG files: one for the folder if it's closed and another one for the opened state. These two files - let's
call them "folder-sample.svg" and "folder-sample-open.svg" - have to be placed into a directory which is relative to the
extensions dist folder. This directory has to be somewhere inside of the `.vscode/extensions` folder.

In our example we place them into an `icons` folder inside of the `.vscode/extensions` folder:

```
.vscode
 ┗ extensions
   ┗ icons
     ┣ folder-sample.svg
     ┗ folder-sample-open.svg
```

In the settings.json the folder icons can be associated to a folder name (e.g. "src") like this:

```json
{
  "a-file-icon-vscode.folders.associations": {
    "src": "../../../../icons/folder-sample"
  }
}
```

### Language associations

With the following configuration you can customize the language icons. It is also possible to overwrite existing
associations.

```json
{
  "a-file-icon-vscode.languages.associations": {
    "languageId": "iconName",
    "json": "json"
  }
}
```

## One-click activation

After installation or update you can click on the 'Activate'-button to activate the icon theme, if you haven't already.
The icons will be visible immediately.

<img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/images/oneclickactivation.png" alt="activation">

## Commands

Press `Ctrl-Shift-P` to open the command palette and type `Atom Material Icons`.

<img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/images/commandPalette.png" alt="commands">

<p></p>

| Command                           | Description                                                                        |
|-----------------------------------|------------------------------------------------------------------------------------|
| **Activate Icon Theme**           | Activate the icon theme.                                                           |
| **Change Folder Color**           | Change the color of the folder icons.                                              |
| **Change Folder Theme**           | Change the design of the folder icons.                                             |
| **Change Opacity**                | Change the opacity of the icons.                                                   |
| **Change Saturation**             | Change the saturation value of the icons.                                          |
| **Configure Icon Packs**          | Select an icon pack that enables additional icons (e.g. for Angular, React, Ngrx). |
| **Hide Folder Arrows**            | Hides the arrows next to the folder icons.                                         |
| **Restore Default Configuration** | Reset the default configurations of the icon theme.                                |
| **Toggle Grayscale**              | Sets the saturation of the icons to zero, so that they are grayscale.              |

----

## Credits

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

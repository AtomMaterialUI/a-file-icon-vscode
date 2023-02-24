import { red, green } from '../../helpers/painter';
import { fileIcons, folderIcons, languageIcons } from './../../../icons';

/**
 * Store all icons that are wrong configured
 */
const allConflicts: {
  fileIcons: {
    fileExtensions: Record<string, string[]>;
    fileNames: Record<string, string[]>;
  };
  folderIcons: Record<string, string[]>;
  languageIcons: Record<string, string[]>;
} = {
  fileIcons: {
    fileExtensions: {},
    fileNames: {},
  },
  folderIcons: {},
  languageIcons: {},
};

const checkFileIcons = () => {
  checkForConflictsInFileIcons('fileExtensions');
  checkForConflictsInFileIcons('fileNames');
};

const checkForConflictsInFileIcons = (
  fileIconDefinitionType: 'fileExtensions' | 'fileNames',
) => {
  const icons: Record<string, string> = {};
  for (const icon of fileIcons.icons) {
    if (!icon[fileIconDefinitionType]) {
      continue;
    }
    for (const definition of (icon[fileIconDefinitionType] ?? [])
      .map((d: string) => d.toLowerCase())) {
      if (
        !icons[definition] ||
        (icon.enabledFor && icon.enabledFor.length > 0)
      ) {
        icons[definition] = icon.name;
      }
      else {
        if (allConflicts.fileIcons[fileIconDefinitionType][definition]) {
          allConflicts.fileIcons[fileIconDefinitionType][definition].push(
            icon.name,
          );
        }
        else {
          allConflicts.fileIcons[fileIconDefinitionType][definition] = [
            icons[definition],
            icon.name,
          ];
        }
      }
    }
  }
};

const checkFolderIcons = () => {
  for (const theme of folderIcons) {
    if (!theme.icons) {
      continue;
    }
    const icons: Record<string, string> = {};
    for (const icon of theme.icons) {
      for (const folderName of icon.folderNames
                                   .map((f: string) => f.toLowerCase())) {
        if (
          !icons[folderName] ||
          (icon.enabledFor && icon.enabledFor.length > 0)
        ) {
          icons[folderName] = icon.name;
        }
        else {
          if (allConflicts.folderIcons[folderName]) {
            allConflicts.folderIcons[folderName].push(icon.name);
          }
          else {
            allConflicts.folderIcons[folderName] = [
              icons[folderName],
              icon.name,
            ];
          }
        }
      }
    }
  }
};

const checkLanguageIcons = () => {
  const icons: Record<string, string> = {};
  for (const langIcon of languageIcons) {
    for (const id of langIcon.ids
                             .map((id: string) => id.toLowerCase())) {
      if (icons[id]) {
        if (allConflicts.languageIcons[id]) {
          allConflicts.languageIcons[id].push(langIcon.icon.name);
        }
        else {
          allConflicts.languageIcons[id] = [icons[id], langIcon.icon.name];
        }
      }
      else {
        icons[id] = langIcon.icon.name;
      }
    }
  }
};

const handleErrors = () => {
  if (
    [
      ...Object.keys(allConflicts.fileIcons.fileExtensions),
      ...Object.keys(allConflicts.fileIcons.fileNames),
      ...Object.keys(allConflicts.folderIcons),
      ...Object.keys(allConflicts.languageIcons),
    ].length > 0
  ) {
    console.log('> Atom Material Icons:', red('Icon conflicts:'));
    console.log(red('--------------------------------------'));

    printErrorMessage(allConflicts.fileIcons.fileExtensions, 'fileExtension');
    printErrorMessage(allConflicts.fileIcons.fileNames, 'fileName');
    printErrorMessage(allConflicts.folderIcons, 'folderName');
    printErrorMessage(allConflicts.languageIcons, 'languageId');

    console.log(
      '\n' + red('Please check the wrong icon configurations!\n'),
    );
    throw new Error('Icon conflicts found!');
  }
  else {
    console.log(
      '> Atom Material Icons:',
      green('Passed icon conflict checks!'),
    );
  }
};

const printErrorMessage = (icons: any, definitionType: string) => {
  const keys = Object.keys(icons);
  for (const key of keys) {
    const conflictIcons = icons[key];
    console.log(
      red(
        `For ${definitionType} "${key}" are ${
          conflictIcons.length
        } icons defined: [${conflictIcons.join(', ')}]`,
      ),
    );
  }
};

export const checkIconConflicts = () => {
  checkFolderIcons();
  checkFileIcons();
  checkLanguageIcons();

  handleErrors();
};

/* eslint-disable unicorn/prefer-top-level-await */
import { writeJSONSync } from 'fs-extra';
import { writeFileSync } from 'node:fs';
import { webfont } from 'webfont';

const fontName = 'a-file-icon-vscode';
const START_CODEPOINT = 0xEA_00;

const formatUnicode = (codepoint: number | string) => {
  return `\\${codepoint.toString(16)}`;
};

webfont({
  centerHorizontally: true,
  files: 'iconGenerator/assets/icons/*/*.svg',
  fixedWidth: true,
  fontHeight: 1024,
  fontName,
  formats: ['woff'],
  glyphTransformFn: (object) => {
    const filePath = object as { path?: string };

    console.log('filePath %s - %s', filePath.path, object.name);
    switch (true) {
      case filePath.path?.includes('foldersOpen/'): {
        object.name = `folder-open_${object.name}`;
        break;
      }
      case filePath.path?.includes('folders/'): {
        object.name = `folder_${object.name}`;
        break;
      }
      case filePath.path?.includes('files/'): {
        object.name = `file_${object.name}`;
        break;
      }
    }

    return object;
  },
  normalize: true,
  prependUnicode: false,
  startUnicode: START_CODEPOINT,
})
  .then((result) => {
    const icons = result.glyphsData ?? [];

    writeJSONSync(`productIcons/${fontName}-product-icon-theme.json`,
      {
        fonts: [
          {
            id: fontName,
            src: [
              {
                format: 'woff',
                path: `./${fontName}.woff`,
              },
            ],
            style: 'normal',
            weight: 'normal',
          },
        ],

        iconDefinitions: Object.fromEntries(icons.map((icon, index) => [icon.metadata?.name, {
          fontCharacter: formatUnicode(START_CODEPOINT + index),
        }])),

      },
      { spaces: 2 },
    );

    writeFileSync('productIcons/a-file-icon-vscode.woff', result.woff as Uint8Array, 'utf8');
  })
  .catch((error) => {
    console.error(error);
  });
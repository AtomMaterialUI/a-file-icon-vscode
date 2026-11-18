import { IconPack } from 'src/@types/config';

/** Test files: `*.test.ts`, `*.spec.ts`... (JetBrains 'Tests' icon pack). Files in test folders cannot be matched by VS Code. */
export const tests = [
  {
    enabledFor: [IconPack.Tests],
    fileExtensions: ['spec.coffee', 'spec.litcoffee', 'test.coffee', 'test.litcoffee'],
    name: 'testcoffee',
  },
  {
    enabledFor: [IconPack.Tests],
    fileExtensions: ['spec.dart', 'test.dart'],
    name: 'testdart',
  },
  {
    enabledFor: [IconPack.Tests],
    fileExtensions: ['spec.go', 'test.go'],
    name: 'testgo',
  },
  {
    enabledFor: [IconPack.Tests],
    fileExtensions: ['spec.hs', 'test.hs'],
    name: 'testhaskell',
  },
  {
    enabledFor: [IconPack.Tests],
    fileExtensions: [
      'spec.cjs',
      'spec.es6',
      'spec.js',
      'spec.mjs',
      'test.cjs',
      'test.es6',
      'test.js',
      'test.mjs',
    ],
    light: true,
    name: 'testjs',
  },
  {
    enabledFor: [IconPack.Tests],
    fileExtensions: [
      'spec.perl',
      'spec.ph',
      'spec.pl',
      'spec.pl6',
      'spec.pm6',
      'test.perl',
      'test.ph',
      'test.pl',
      'test.pl6',
      'test.pm6',
    ],
    name: 'testperl',
  },
  {
    enabledFor: [IconPack.Tests],
    fileExtensions: ['spec.jsx', 'spec.tsx', 'test.jsx', 'test.tsx'],
    name: 'testreact',
  },
  {
    enabledFor: [IconPack.Tests],
    fileExtensions: [
      'spec.ipy',
      'spec.pep',
      'spec.py',
      'spec.py3',
      'spec.python',
      'spec.whl',
      'test.ipy',
      'test.pep',
      'test.py',
      'test.py3',
      'test.python',
      'test.whl',
    ],
    name: 'testpy',
  },
  {
    enabledFor: [IconPack.Tests],
    fileExtensions: ['spec.rb', 'spec.rbs', 'spec.ruby', 'test.rb', 'test.rbs', 'test.ruby'],
    name: 'testruby',
  },
  {
    enabledFor: [IconPack.Tests],
    fileExtensions: ['spec.rs', 'test.rs'],
    name: 'testrust',
  },
  {
    enabledFor: [IconPack.Tests],
    fileExtensions: ['spec.scala', 'test.scala'],
    name: 'testscala',
  },
  {
    enabledFor: [IconPack.Tests],
    fileExtensions: ['spec.ts', 'test.ts'],
    name: 'testts',
  },
  {
    enabledFor: [IconPack.Tests],
    fileExtensions: ['spec.php', 'test.php', 'unit.php'],
    name: 'testphp',
  },
];

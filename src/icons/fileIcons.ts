import { IconPack } from 'src/@types/config';

import type { FileIcons } from 'src/@types/iconTypes';

/**
 * Defines file icons
 */
export const fileIcons: FileIcons = {
  defaultIcon: {name: 'file'},
  icons: [
    // region [Custom]
    {
      fileNames: [
        'index.html',
        'index.htm',
        'index.phtml',
        'index.pug',
        'index.jade',
        'index.hbs',
        'index.handlebars',
        'index.twig',
        'index.php',
        'index.jsp',
        'index.ejs',
      ],
      name: 'indexhtml',
    },
    {
      fileNames: [
        'index.cjs',
        'index.coffee',
        'index.css',
        'index.dart',
        'index.es6',
        'index.js',
        'index.jsx',
        'index.mjs',
        'index.scss',
        'index.svelte',
        'index.ts',
        'index.tsx',
        'index.vue',
      ],
      name: 'index',
    },
    {
      fileNames: ['architecture', 'architecture.md', 'architecture.rst', 'architecture.txt'],
      name: 'architecture',
    },
    {
      fileNames: [
        '.github/build.yaml',
        '.github/build.yml',
        '.github/ci.yaml',
        '.github/ci.yml',
        '.github/config.yaml',
        '.github/config.yml',
        '.github/main.yaml',
        '.github/main.yml',
        '.github/release.yaml',
        '.github/release.yml',
        '.github/workflow.yaml',
        '.github/workflow.yml',
      ],
      name: 'githubActions',
    },
    {
      fileNames: ['CODE_OF_CONDUCT.md', 'CODE_OF_CONDUCT.txt'],
      name: 'githubCode',
    },
    {
      fileNames: ['CONTRIBUTING.md', 'CONTRIBUTING.txt'],
      name: 'githubContributing',
    },
    {
      fileNames: [
        'COMMIT_MESSAGE_TEMPLATE.md',
        'COMMIT_MESSAGE_TEMPLATE.txt',
        'PULL_REQUEST_TEMPLATE.md',
        'PULL_REQUEST_TEMPLATE.txt',
        'TEMPLATE.md',
        'TEMPLATE.txt',
      ],
      light: true,
      name: 'github',
    },
    {
      fileNames: ['readme', 'readme.md', 'readme.txt'],
      light: true,
      name: 'readme',
    },
    {
      fileNames: ['COMMIT_EDITMSG', 'ATOM_COMMIT_EDITMSG'],
      name: 'gitcommit',
    },
    {
      fileNames: ['COMMIT_MESSAGE_CONVENTION.md', 'COMMIT_MESSAGE_CONVENTION.txt'],
      name: 'githubCommit',
    },
    {
      fileNames: ['MERGE_HEAD', 'MERGE_MODE', 'MERGE_MSG'],
      name: 'gitmerge',
    },
    {
      fileNames: ['install', 'install.md', 'install.sh', 'install.txt', 'install.yaml', 'install.yml'],
      name: 'install',
    },
    {
      fileNames: ['funding', 'funding.md', 'funding.sh', 'funding.txt', 'funding.yaml', 'funding.yml'],
      name: 'funding',
    },
    {
      fileNames: ['stale.yml', 'stale.yaml'],
      name: 'stalebot',
    },
    {
      fileNames: ['META-INF/xml'],
      name: 'plugin',
    },
    {
      fileExtensions: ['bundle.properties', 'messages/properties'],
      name: 'i18nProperties',
    },
    {
      fileExtensions: ['bundle.java', 'messages/java'],
      name: 'i18nJava',
    },
    {
      fileExtensions: ['bundle.kt', 'messages/kt'],
      name: 'i18nKotlin',
    },
    {
      fileNames: ['application.conf', 'reference.conf', 'spray.conf'],
      name: 'spray',
    },
    // endregion [Custom]

    // region [Tests]
    {
      fileExtensions: [
        'spec.coffee',
        'spec.litcoffee',
        'spec/coffee',
        'spec/litcoffee',
        'specs/coffee',
        'specs/litcoffee',
        'test.coffee',
        'test.litcoffee',
        'test/coffee',
        'test/litcoffee',
        'tests/coffee',
        'tests/litcoffee',
      ],
      name: 'testcoffee',
    },
    {
      fileExtensions: ['spec.dart', 'spec/dart', 'specs/dart', 'test.dart', 'test/dart', 'tests/dart'],
      name: 'testdart',
    },
    {
      fileExtensions: ['spec.go', 'spec/go', 'specs/go', 'test.go', 'test/go', 'tests/go'],
      name: 'testgo',
    },
    {
      fileExtensions: ['spec.hs', 'spec/hs', 'specs/hs', 'test.hs', 'test/hs', 'tests/hs'],
      name: 'testhaskell',
    },
    {
      fileExtensions: ['junit/java', 'test/java', 'tests/java', 'unit/java'],
      name: 'testjava',
    },
    {
      fileExtensions: ['junit/kt', 'test/kt', 'tests/kt', 'unit/kt'],
      name: 'testkt',
    },
    {
      fileExtensions: [
        'spec.cjs',
        'spec.es6',
        'spec.js',
        'spec.mjs',
        'spec/cjs',
        'spec/es6',
        'spec/js',
        'spec/mjs',
        'specs/cjs',
        'specs/es6',
        'specs/js',
        'specs/mjs',
        'test.cjs',
        'test.es6',
        'test.js',
        'test.mjs',
        'test/cjs',
        'test/es6',
        'test/js',
        'test/mjs',
        'tests/cjs',
        'tests/es6',
        'tests/js',
        'tests/mjs',
      ],
      light: true,
      name: 'testjs',
    },
    {
      fileExtensions: [
        'spec.perl',
        'spec.ph',
        'spec.pl',
        'spec.pl6',
        'spec.pm6',
        'spec/perl',
        'spec/ph',
        'spec/pl',
        'spec/pl6',
        'spec/pm6',
        'specs/perl',
        'specs/ph',
        'specs/pl',
        'specs/pl6',
        'specs/pm6',
        'test.perl',
        'test.ph',
        'test.pl',
        'test.pl6',
        'test.pm6',
        'test/perl',
        'test/ph',
        'test/pl',
        'test/pl6',
        'test/pm6',
        'tests/perl',
        'tests/ph',
        'tests/pl',
        'tests/pl6',
        'tests/pm6',
      ],
      name: 'testperl',
    },
    {
      fileExtensions: [
        'spec.jsx',
        'spec.tsx',
        'spec/jsx',
        'spec/tsx',
        'specs/jsx',
        'specs/tsx',
        'test.jsx',
        'test.tsx',
        'test/jsx',
        'test/tsx',
        'tests/jsx',
        'tests/tsx',
      ],
      name: 'testreact',
    },
    {
      fileExtensions: [
        'spec.ipy',
        'spec.pep',
        'spec.py',
        'spec.py3',
        'spec.python',
        'spec.whl',
        'spec/ipy',
        'spec/pep',
        'spec/py',
        'spec/py3',
        'spec/python',
        'spec/whl',
        'specs/ipy',
        'specs/pep',
        'specs/py',
        'specs/py3',
        'specs/python',
        'specs/whl',
        'test.ipy',
        'test.pep',
        'test.py',
        'test.py3',
        'test.python',
        'test.whl',
        'test/ipy',
        'test/pep',
        'test/py',
        'test/py3',
        'test/python',
        'test/whl',
        'tests/ipy',
        'tests/pep',
        'tests/py',
        'tests/py3',
        'tests/python',
        'tests/whl',
      ],
      name: 'testpy',
    },
    {
      fileExtensions: [
        'spec.rb',
        'spec.rbs',
        'spec.ruby',
        'spec/rb',
        'spec/rbs',
        'spec/ruby',
        'specs/rb',
        'specs/rbs',
        'specs/ruby',
        'test.rb',
        'test.rbs',
        'test.ruby',
        'test/rb',
        'test/rbs',
        'test/ruby',
        'tests/rb',
        'tests/rbs',
        'tests/ruby',
      ],
      name: 'testruby',
    },
    {
      fileExtensions: ['spec.rs', 'spec/rs', 'specs/rs', 'test.rs', 'test/rs', 'tests/rs'],
      name: 'testrust',
    },
    {
      fileExtensions: ['spec.scala', 'spec/scala', 'specs/scala', 'test.scala', 'test/scala', 'tests/scala'],
      name: 'testscala',
    },
    {
      fileExtensions: ['spec.ts', 'spec/ts', 'specs/ts', 'test.ts', 'test/ts', 'tests/ts'],
      name: 'testts',
    },
    {
      fileExtensions: [
        'spec.php',
        'spec/php',
        'specs/php',
        'test.php',
        'test/php',
        'tests/php',
        'unit.php',
        'unit/php',
        'units/php',
        'phpunit/php',
      ],
      name: 'testphp',
    },
    // endregion [Tests]

    // region [0-9]
    {
      fileExtensions: [
        '11ty.cjs',
        '11ty.js',
        '11ty.mjs',
        '11ty.ts',
        '11tyignore',
        'eleventy.cjs',
        'eleventy.js',
        'eleventy.mjs',
        'eleventy.ts',
        'eleventyignore',
      ],
      light: true,
      name: '11ty',
    },
    {
      fileExtensions: ['bsl', 'mdo', 'os', 'sdbl'],
      name: '1c',
    },
    {
      fileExtensions: ['ac', 'c4d', 'cginc', 'dxf', 'geo', 'obj', 'shader', 'stl', 'tesc', 'tese'],
      name: '3d',
    },
    {
      fileExtensions: ['3dm', '3dmodel'],
      name: '3dmodel',
    },
    {
      fileExtensions: ['3ds', 'dwg', 'osl'],
      name: '3dsmax',
    },
    {
      fileExtensions: ['4db', '4dm'],
      name: '4d',
    },

    // endregion [0-9]

    // region [A]
    {
      fileExtensions: ['a+'],
      name: 'aplus',
    },
    {
      fileExtensions: ['accda', 'accdb', 'accde', 'accdr', 'accdt', 'adn', 'laccdb', 'maf', 'mam', 'maq', 'mar', 'mdw'],
      name: 'access',
    },
    {
      fileExtensions: ['abap', 'abp'],
      name: 'abap',
    },
    {
      fileExtensions: ['abc'],
      name: 'abc',
    },
    {
      fileExtensions: ['ab1', 'abif', 'fsa'],
      name: 'abif',
    },
    {
      fileNames: ['acre.config'],
      name: 'acre',
    },
    {
      fileExtensions: ['actrc'],
      name: 'act',
    },
    {
      fileExtensions: ['as', 'as3', 'jsfl'],
      name: 'actionscript',
    },
    {
      fileExtensions: ['ada', 'adb', 'ads'],
      name: 'ada',
    },
    {
      fileExtensions: ['fla', 'xfl'],
      name: 'animate',
    },
    {
      fileExtensions: ['aep', 'aet'],
      name: 'ae',
    },
    {
      fileExtensions: ['ai', 'aia', 'ait'],
      name: 'ai',
    },
    {
      fileExtensions: ['id', 'idml', 'indb', 'indd', 'indl', 'indt'],
      name: 'indesign',
    },
    {
      fileExtensions: ['atn', 'psb', 'psd'],
      name: 'psd',
    },
    {
      fileExtensions: ['prel', 'prproj', 'psq'],
      name: 'premiere',
    },
    {
      fileExtensions: ['ahu', 'aph', 'prw', 'tlpp'],
      name: 'advpl',
    },
    {
      fileExtensions: ['affect'],
      name: 'affectscript',
    },
    {
      fileExtensions: ['afdesign', 'afphoto', 'afpub'],
      name: 'affinity',
    },
    {
      fileExtensions: ['agda', 'lagda'],
      name: 'agda',
    },
    {
      fileExtensions: ['akka'],
      name: 'akka',
    },
    {
      fileExtensions: ['al'],
      name: 'al',
    },
    {
      fileExtensions: ['alacritty.yml'],
      fileNames: ['alacritty.yml'],
      name: 'alacritty',
    },
    {
      fileExtensions: ['alex', 'alexrc'],
      fileNames: ['alexrc'],
      name: 'alex',
    },
    {
      fileExtensions: ['alexignore'],
      name: 'alexignore',
    },
    {
      fileExtensions: ['all-contributorsrc', 'allcontributorsrc'],
      fileNames: ['all-contributorsrc', 'allcontributorsrc'],
      name: 'allcontributors',
    },
    {
      fileExtensions: ['als'],
      name: 'alloy',
    },
    {
      fileExtensions: ['apkbuild'],
      fileNames: ['APKBUILD'],
      name: 'alpine',
    },
    {
      fileExtensions: ['arexx'],
      name: 'amigaos',
    },
    {
      fileExtensions: ['ampl'],
      name: 'ampl',
    },
    {
      fileNames: ['ampconfig.json'],
      name: 'amplication',
    },
    {
      fileNames: ['amplify.yml', 'amplify.yaml'],
      name: 'amplify',
    },
    {
      fileExtensions: ['muse'],
      name: 'amusewiki',
    },
    {
      fileExtensions: ['ana'],
      name: 'analytica',
    },
    {
      fileNames: ['AndroidManifest.xml'],
      name: 'androidManifest',
    },
    {
      fileNames: ['MainActivity.java', 'MainActivity.kt'],
      name: 'android',
    },
    {
      fileExtensions: ['smali', 'rsh', 'webarchivexml'],
      name: 'androidSmali',
    },
    {
      fileExtensions: ['acs', 'angelscript'],
      name: 'angelscript',
    },
    {
      fileExtensions: ['angular-cli.json', 'angular.json'],
      fileNames: ['angular-cli.json', 'angular.json'],
      name: 'angularCli',
    },
    {
      fileNames: ['angular.js', 'angular.min.js'],
      name: 'angularjs',
    },
    {
      fileExtensions: ['ng-template', 'ng.html', 'ng.js', 'ng.ts', 'ngtemplate'],
      name: 'angular',
    },
    {
      fileExtensions: ['container.dart', 'container.js', 'container.ts'],
      name: 'ngrxjs',
    },
    {
      enabledFor: [IconPack.Angular, IconPack.Ngrx],
      fileExtensions: ['comp.dart', 'comp.js', 'comp.ts', 'component.dart', 'component.js', 'component.ts'],
      name: 'angularcomponent',
    },
    {
      enabledFor: [IconPack.Angular, IconPack.Ngrx],
      fileExtensions: ['controller.dart', 'controller.js', 'controller.ts', 'ctrl.dart', 'ctrl.js', 'ctrl.ts'],
      name: 'angularcontroller',
    },
    {
      enabledFor: [IconPack.Angular, IconPack.Ngrx],
      fileExtensions: ['directive.js', 'directive.ts', 'directive.dart'],
      name: 'angulardirective',
    },
    {
      enabledFor: [IconPack.Angular, IconPack.Ngrx],
      fileExtensions: ['guard.js', 'guard.ts', 'guard.dart'],
      name: 'angularguard',
    },
    {
      enabledFor: [IconPack.Angular, IconPack.Ngrx],
      fileExtensions: ['interceptor.js', 'interceptor.ts', 'interceptor.dart'],
      name: 'angularinterceptor',
    },
    {
      enabledFor: [IconPack.Angular, IconPack.Ngrx],
      fileExtensions: ['routing.js', 'routing.ts', 'routing.dart'],
      fileNames: [
        'angular-routing.dart',
        'angular-routing.js',
        'angular-routing.ts',
        'angular_routing.dart',
        'angular_routing.js',
        'angular_routing.ts',
      ],
      name: 'angularrouting',
    },
    {
      fileNames: ['app-routing.module.dart', 'app-routing.module.js', 'app-routing.module.ts'],
      name: 'angularapprouting',
    },
    {
      enabledFor: [IconPack.Angular, IconPack.Ngrx],
      fileExtensions: ['module.js', 'module.ts', 'module.dart'],
      name: 'angularmodule',
    },
    {
      enabledFor: [IconPack.Angular, IconPack.Ngrx],
      fileExtensions: ['service.js', 'service.ts', 'service.dart'],
      name: 'angularservice',
    },
    {
      enabledFor: [IconPack.Angular, IconPack.Ngrx],
      fileExtensions: ['page.js', 'page.ts', 'page.dart'],
      name: 'ionic',
    },
    {
      enabledFor: [IconPack.Angular, IconPack.Ngrx],
      fileExtensions: ['pipe.js', 'pipe.ts', 'pipe.dart'],
      name: 'angularpipe',
    },
    {
      enabledFor: [IconPack.Angular, IconPack.Ngrx],
      fileExtensions: ['resolver.js', 'resolver.ts', 'resolver.dart'],
      name: 'angularresolver',
    },
    {
      fileNames: ['ng-tailwind.js', 'ng-tailwind.ts', 'ng-tailwind.dart'],
      name: 'angulartailwind',
    },
    {
      fileExtensions: ['anime', 'animestudio'],
      name: 'animestudio',
    },
    {
      fileNames: [
        'ansible.cfg',
        'ansible.yaml',
        'ansible.yml',
        'ansible_inventory.yml',
        'dbservers.yaml',
        'dbservers.yml',
        'inventory.yaml',
        'inventory.yml',
        'playbook.cfg',
        'playbook.yaml',
        'playbook.yml',
        'site.yaml',
        'site.yml',
        'webservers.yaml',
        'webservers.yml',
      ],
      name: 'ansible',
    },
    {
      fileExtensions: ['ant'],
      fileNames: ['ant.xml'],
      name: 'ant',
    },
    {
      fileExtensions: ['antlers.html'],
      name: 'antlers',
    },
    {
      fileExtensions: ['g', 'g4'],
      name: 'antlr',
    },
    {
      fileExtensions: [
        'antwar.conf.cjs',
        'antwar.conf.js',
        'antwar.conf.mjs',
        'antwar.config.cjs',
        'antwar.config.js',
        'antwar.config.mjs',
      ],
      fileNames: [
        'antwar.conf.cjs',
        'antwar.conf.js',
        'antwar.conf.mjs',
        'antwar.config.cjs',
        'antwar.config.js',
        'antwar.config.mjs',
      ],
      name: 'antwar',
    },
    {
      fileExtensions: ['any'],
      name: 'any',
    },
    {
      fileExtensions: ['apache.conf', 'apache2.conf', 'apacheconf'],
      fileNames: [
        'apache.conf',
        'apache.dev.conf',
        'apache.prod.conf',
        'apache.vhost.conf',
        'apache2.conf',
        'apache2.dev.conf',
        'apache2.prod.conf',
        'apache2.vhost.conf',
        'httpd.conf',
        'httpd.dev.conf',
        'httpd.prod.conf',
        'httpd.vhost.conf',
      ],
      name: 'apacheconf',
    },
    {
      fileExtensions: ['thrift', 'vhost'],
      name: 'apache',
    },
    {
      fileExtensions: ['apex', 'cls'],
      name: 'apex',
    },
    {
      fileExtensions: ['apib'],
      name: 'apib',
    },
    {
      fileNames: ['api-extractor-base.json', 'api-extractor.common.json', 'api-extractor.json'],
      name: 'apiextractor',
    },
    {
      fileExtensions: ['apk'],
      name: 'apk',
    },
    {
      fileExtensions: ['apl', 'apla', 'aplc', 'aplf', 'apli', 'apln', 'aplo'],
      name: 'apl',
    },
    {
      fileNames: ['apollo.config.cjs', 'apollo.config.js', 'apollo.config.mjs', 'apollo.config.ts'],
      name: 'apollo',
    },
    {
      fileNames: ['appcelerator.cjs', 'appcelerator.js', 'appcelerator.mjs', 'appcelerator.ts'],
      name: 'appcelerator',
    },
    {
      fileExtensions: ['appsemblerc', 'appsemblerc.yaml', 'appsemblerc.yml'],
      fileNames: ['app-definition.yaml', 'app-definition.yml'],
      name: 'appsemble',
    },
    {
      fileExtensions: ['appveyor.yaml', 'appveyor.yml'],
      fileNames: ['appveyor.yaml', 'appveyor.yml'],
      name: 'appveyor',
    },
    {
      fileExtensions: ['applescript', 'scpt'],
      name: 'applescript',
    },
    {
      fileExtensions: ['arc'],
      name: 'arc',
    },
    {
      fileExtensions: ['PKGBUILD', 'SRCINFO', 'yaourtrc'],
      fileNames: ['PKGBUILD', 'SRCINFO'],
      name: 'archlinux',
    },
    {
      fileNames: ['makepkg.conf', 'pacman.conf', 'pamac.conf'],
      name: 'pacman',
    },
    {
      fileExtensions: ['ino'],
      name: 'arduino',
    },
    {
      fileExtensions: ['ard', 'arend'],
      fileNames: ['arend.yml', 'arend.yaml'],
      name: 'arend',
    },
    {
      fileExtensions: ['arm'],
      name: 'arm',
    },
    {
      fileExtensions: ['art3', 'art4'],
      name: 'arttext',
    },
    {
      fileExtensions: ['ad', 'adoc', 'asc', 'asciidoc'],
      name: 'asciidoc',
    },
    {
      fileExtensions: ['aj', 'aspectj'],
      name: 'aspectj',
    },
    {
      fileExtensions: ['a', 'i', 's'],
      name: 'asmpure',
    },
    {
      fileExtensions: ['aea', 'agc', 'argus', 'asm', 'inc', 'lst', 'mitigus'],
      name: 'asm',
    },
    {
      fileExtensions: ['h8', 'h8000', 'h8300', 'h8S', 'h8SX'],
      name: 'hitachi',
    },
    {
      fileExtensions: ['i386', 'x86', '80386', 'x32', 'x64'],
      name: 'intel',
    },
    {
      fileExtensions: ['vax', 'vmasm'],
      name: 'vax',
    },
    {
      fileExtensions: ['asa', 'asax', 'ascx', 'ashx', 'asmx', 'asp', 'aspx', 'axd'],
      name: 'asp',
    },
    {
      fileExtensions: ['astro'],
      name: 'astro',
    },
    {
      fileNames: ['astro.config.cjs', 'astro.config.js', 'astro.config.mjs', 'astro.config.ts'],
      name: 'astroconfig',
    },
    {
      fileNames: ['artisan', 'artisan.php'],
      name: 'artisan',
    },
    {
      fileNames: ['.astylerc'],
      name: 'astyle',
    },
    {
      fileExtensions: ['asy'],
      name: 'asymptote',
    },
    {
      fileExtensions: ['atomproject.cson', 'atomproject.json'],
      light: true,
      name: 'atom',
    },
    {
      fileNames: ['.apmrc'],
      light: true,
      name: 'apm',
    },
    {
      fileExtensions: ['atoum.php'],
      fileNames: ['atoum.config.php'],
      name: 'atoum',
    },
    {
      fileExtensions: ['ats', 'dats', 'hats', 'sats'],
      name: 'ats',
    },
    {
      fileExtensions: ['audacity', 'aup'],
      name: 'audacity',
    },
    {
      fileExtensions: ['aug', 'augeas'],
      name: 'augeas',
    },
    {
      fileNames: [
        'aurelia.cjs',
        'aurelia.js',
        'aurelia.json',
        'aurelia.mjs',
        'aurelia.ts',
        'aureliafile.cjs',
        'aureliafile.js',
        'aureliafile.json',
        'aureliafile.mjs',
        'aureliafile.ts',
      ],
      name: 'aurelia',
    },
    {
      fileNames: ['authors', 'authors.md', 'authors.rst', 'authors.txt'],
      name: 'authors',
    },
    {
      fileExtensions: [
        'autorc',
        'autorc.cjs',
        'autorc.js',
        'autorc.json',
        'autorc.mjs',
        'autorc.yaml',
        'autorc.yml',
        'auto.config.cjs',
        'auto.config.js',
        'auto.config.json',
        'auto.config.mjs',
        'auto.config.ts',
        'auto.config.yaml',
        'auto.config.yml',
      ],
      fileNames: [
        'auto.config.cjs',
        'auto.config.js',
        'auto.config.json',
        'auto.config.mjs',
        'auto.config.ts',
        'auto.config.yaml',
        'auto.config.yml',
      ],
      name: 'auto',
    },
    {
      fileExtensions: ['ahk', 'ahkl'],
      name: 'ahk',
    },
    {
      fileExtensions: ['au3', 'autoit'],
      name: 'autoit',
    },
    {
      fileExtensions: [
        'avarc',
        'avarc.cjs',
        'avarc.js',
        'avarc.json',
        'avarc.mjs',
        'avarc.ts',
        'avarc.yaml',
        'avarc.yml',
      ],
      fileNames: [
        'ava.config.cjs',
        'ava.config.js',
        'ava.config.json',
        'ava.config.mjs',
        'ava.config.ts',
        'ava.config.yaml',
        'ava.config.yml',
      ],
      name: 'ava',
    },
    {
      fileExtensions: ['avif'],
      name: 'avif',
    },
    {
      fileExtensions: ['avr', 'avrasm'],
      name: 'avr',
    },
    {
      fileExtensions: ['avcs', 'avdl', 'avpr', 'avsc'],
      name: 'avro',
    },
    {
      fileExtensions: ['awk', 'gawk', 'mawk', 'nawk', 'pawk', 'tawk'],
      name: 'awk',
    },
    {
      fileExtensions: ['azcli'],
      name: 'azure',
    },
    {
      fileNames: [
        'azure-pipelines.ci.yaml',
        'azure-pipelines.ci.yml',
        'azure-pipelines.release.yaml',
        'azure-pipelines.release.yml',
        'azure-pipelines.yaml',
        'azure-pipelines.yml',
      ],
      name: 'azurepipelines',
    },

    // endregion

    // region [B]
    {
      fileExtensions: ['babel', 'babelrc', 'babelrc.cjs', 'babelrc.js', 'babelrc.mjs', 'languagebabel'],
      name: 'babel',
    },
    {
      fileNames: ['babel.config.cjs', 'babel.config.js', 'babel.config.json', 'babel.config.mjs', 'babel.json'],
      name: 'babelconfig',
    },
    {
      fileNames: ['baboon.config.cjs', 'baboon.config.js', 'baboon.config.json', 'baboon.config.mjs', 'baboon.json'],
      name: 'baboon',
    },
    {
      fileNames: ['backbone-min.js', 'backbone.cjs', 'backbone.js', 'backbone.min.js', 'backbone.mjs'],
      name: 'backbone',
    },
    {
      fileExtensions: ['backup', 'bak', 'old', 'orig'],
      name: 'backup',
    },
    {
      fileExtensions: ['bal', 'balx'],
      name: 'ballerina',
    },
    {
      fileExtensions: ['bandit', 'bandit.yml', 'bandit.yaml'],
      fileNames: ['bandit.yml', 'bandit.yaml'],
      name: 'bandit',
    },
    {
      fileExtensions: ['bas', 'basic', 'bi', 'bm', 'bml', 'bms', 'bmx'],
      name: 'basic',
    },
    {
      fileExtensions: ['bats'],
      light: true,
      name: 'bats',
    },
    {
      fileExtensions: ['bzrignore'],
      name: 'bazaar',
    },
    {
      fileExtensions: ['bazel', 'bzl', 'sky', 'star'],
      name: 'bazel',
    },
    {
      fileExtensions: ['bazelignore', 'bzlignore'],
      name: 'bazelignore',
    },
    {
      fileExtensions: ['bazelrc'],
      fileNames: ['bazel.rc'],
      name: 'bazelconfig',
    },
    {
      fileExtensions: ['bc', 'dc', 'dcrc'],
      name: 'bc',
    },
    {
      fileExtensions: ['bean/java', 'bean/kt', 'beans/java', 'beans/kt'],
      name: 'bean',
    },
    {
      fileExtensions: ['feature.php'],
      name: 'behat',
    },
    {
      fileNames: ['behat.config.yaml', 'behat.config.yml', 'behat.yaml', 'behat.yml'],
      name: 'behatconfig',
    },
    {
      fileExtensions: ['bemjson', 'bemjson.cjs', 'bemjson.js', 'bemjson.mjs'],
      name: 'bem',
    },
    {
      fileExtensions: ['bbl', 'bbx', 'bib', 'bst', 'cbx'],
      name: 'bibtex',
    },
    {
      fileExtensions: ['bicep'],
      name: 'bicep',
    },
    {
      fileExtensions: ['biml'],
      name: 'biml',
    },
    {
      fileNames: [
        'binder-requirements.in',
        'binder-requirements.txt',
        'binder_requirements.in',
        'binder_requirements.txt',
      ],
      name: 'binder',
    },
    {
      fileExtensions: ['bintray.json'],
      name: 'bintray',
    },
    {
      fileExtensions: ['bison', 'y', 'yacc', 'ypp', 'yy'],
      name: 'bison',
    },
    {
      fileNames: ['bitcoin.conf'],
      name: 'bitcoin',
    },
    {
      fileExtensions: ['bithoundrc'],
      name: 'bithound',
    },
    {
      fileNames: ['bitbucket-pipelines.yaml', 'bitbucket-pipelines.yml'],
      name: 'bitbucket',
    },
    {
      fileExtensions: ['blade', 'blade.php'],
      name: 'blade',
    },
    {
      fileExtensions: ['blend', 'bphys'],
      name: 'blender',
    },
    {
      fileExtensions: ['bb', 'decls'],
      name: 'blitzbasic',
    },
    {
      fileNames: [
        'blitz.config.cjs',
        'blitz.config.compiled.js',
        'blitz.config.compiled.ts',
        'blitz.config.js',
        'blitz.config.mjs',
        'blitz.config.ts',
      ],
      name: 'blitz',
    },
    {
      fileNames: [
        'AppBloc.dart',
        'AppEvent.dart',
        'AppState.dart',
        'bloc.dart',
        'bloc/dart',
        'blocs/dart',
        'event/dart',
        'events/dart',
        'flutter_bloc.dart',
        'habit_event.dart',
        'habit_state.dart',
        'state/dart',
        'states/dart',
      ],
      name: 'bloc',
    },
    {
      fileExtensions: ['bspec', 'bsv'],
      name: 'bluespec',
    },
    {
      fileExtensions: ['blink', 'nk', 'gizmo', 'blinkscript'],
      name: 'blink',
    },
    {
      fileExtensions: ['abnf', 'bnf', 'ebnf', 'grammar', 'lbnf', 'xnbf'],
      name: 'bnf',
    },
    {
      fileExtensions: ['boo', 'boo.unity'],
      name: 'boo',
    },
    {
      fileNames: ['bors.toml'],
      name: 'bors',
    },
    {
      fileExtensions: ['boot'],
      name: 'boot',
    },
    {
      fileExtensions: ['bunfig.toml'],
      fileNames: ['bunfig.toml'],
      light: true,
      name: 'bun',
    },
    {
      fileNames: ['bun.lockb'],
      name: 'bunlock',
    },
    {
      fileNames: [
        'bootstrap.cjs',
        'bootstrap.css',
        'bootstrap.js',
        'bootstrap.min.css',
        'bootstrap.min.js',
        'bootstrap.mjs',
        'bootstrap.scss',
        'bootstrap.ts',
        'custom.bootstrap.cjs',
        'custom.bootstrap.css',
        'custom.bootstrap.js',
        'custom.bootstrap.mjs',
        'custom.bootstrap.ts',
      ],
      name: 'bootstrap',
    },
    {
      fileExtensions: ['bootstraprc'],
      name: 'bootstraprc',
    },
    {
      fileExtensions: ['bsq'],
      name: 'bosque',
    },
    {
      fileExtensions: ['bowerrc'],
      fileNames: ['bower.json', 'bowerfile'],
      name: 'bower',
    },
    {
      fileExtensions: ['b', 'bf', 'brainfuck', 'bfp'],
      name: 'brainfuck',
    },
    {
      fileNames: ['brakeman.yml', 'brakeman.yaml'],
      name: 'brakeman',
    },
    {
      fileNames: ['brewfile'],
      name: 'brew',
    },
    {
      fileExtensions: ['bro'],
      name: 'bro',
    },
    {
      fileNames: ['brocfile'],
      name: 'broccoli',
    },
    {
      fileExtensions: ['br'],
      name: 'brotli',
    },
    {
      fileExtensions: ['browserslist', 'browserslistrc'],
      name: 'browserslist',
    },
    {
      fileNames: [
        'browser-sync.js',
        'browser-sync.json',
        'browsersync.js',
        'browsersync.json',
        'bs-config.js',
        'bs-config.json',
      ],
      name: 'browsersync',
    },
    {
      fileNames: ['brunch-config.coffee', 'brunch-config.js', 'brunch-config.ts'],
      name: 'brunch',
    },
    {
      fileExtensions: ['buck', 'buckconfig'],
      name: 'buck',
    },
    {
      fileExtensions: ['cmj'],
      name: 'bucklescript',
    },
    {
      fileExtensions: ['buildkite'],
      fileNames: ['buildkite.yml', 'buildkite.yaml'],
      name: 'buildkite',
    },
    {
      fileExtensions: ['gemfile'],
      fileNames: ['gemfile'],
      name: 'bundle',
    },
    {
      fileExtensions: ['dm'],
      name: 'byond',
    },
    // endregion

    // region [C]
    {
      fileExtensions: ['c', 'cats', 'idc', 'objc', 'upc', 'w', 'xpm'],
      name: 'c',
    },
    {
      fileExtensions: ['cabal'],
      name: 'cabal',
    },
    {
      fileNames: ['cabal.config', 'cabal.project'],
      name: 'cabalProject',
    },
    {
      fileNames: ['caddyfile'],
      name: 'caddy',
    },
    {
      fileExtensions: ['cadence', 'cdc'],
      name: 'cadence',
    },
    {
      fileExtensions: ['caffemodel', 'solverstate'],
      name: 'caffe',
    },
    {
      fileExtensions: ['caffe2model', 'prototxt'],
      name: 'caffe2',
    },
    {
      fileExtensions: ['cairo'],
      name: 'cairo',
    },
    {
      fileNames: ['cakefile'],
      name: 'cakefile',
    },
    {
      fileExtensions: ['cake', 'ctp'],
      name: 'cakephp',
    },
    {
      fileExtensions: ['calva', 'calva-repl'],
      name: 'calva',
    },
    {
      fileExtensions: ['cap', 'cds'],
      name: 'cap',
    },
    {
      fileNames: [
        'capacitor.config.cjs',
        'capacitor.config.js',
        'capacitor.config.json',
        'capacitor.config.mjs',
        'capacitor.config.ts',
      ],
      name: 'capacitor',
    },
    {
      fileExtensions: ['carbon'],
      name: 'carbon',
    },
    {
      fileNames: ['cargo.lock', 'cargo.toml'],
      name: 'cargo',
    },
    {
      fileNames: ['cartfile', 'cartfile.private', 'cartfile.resolved'],
      name: 'carthage',
    },
    {
      fileExtensions: ['casc', 'cas'],
      name: 'casc',
    },
    {
      fileExtensions: [
        'catala',
        'catala_an',
        'catala_ar',
        'catala_au',
        'catala_cn',
        'catala_de',
        'catala_en',
        'catala_es',
        'catala_fr',
        'catala_he',
        'catala_it',
        'catala_ja',
        'catala_jp',
        'catala_pt',
        'catala_ro',
        'catala_ru',
        'catala_uk',
        'catala_zh',
      ],
      name: 'catala',
    },
    {
      fileExtensions: ['cddl'],
      name: 'cddl',
    },
    {
      fileExtensions: ['cert', 'crt', 'csr', 'p12', 'pfx', 'pks', 'x509'],
      name: 'certificate',
    },
    {
      fileExtensions: ['ceylon'],
      name: 'ceylon',
    },
    {
      fileExtensions: ['cfc', 'cfm', 'cfml', 'lucee'],
      name: 'cfc',
    },
    {
      fileNames: ['chai.cjs', 'chai.coffee', 'chai.es6', 'chai.js', 'chai.min.js', 'chai.mjs', 'chai.ts'],
      name: 'chai',
    },
    {
      fileExtensions: ['pt'],
      name: 'chameleon',
    },
    {
      fileExtensions: ['changelog', 'changes'],
      fileNames: [
        'changelog',
        'changelog.md',
        'changelog.rst',
        'changelog.txt',
        'changes',
        'changes.md',
        'changes.rst',
        'changes.txt',
      ],
      name: 'changelog',
    },
    {
      fileExtensions: ['chapel', 'chpl'],
      name: 'chapel',
    },
    {
      fileNames: [
        'chart.bundle.cjs',
        'chart.bundle.js',
        'chart.bundle.min.js',
        'chart.bundle.mjs',
        'chart.bundle.ts',
        'chart.cjs',
        'chart.js',
        'chart.min.js',
        'chart.mjs',
        'chart.ts',
      ],
      name: 'chartjs',
    },
    {
      fileExtensions: ['jas'],
      name: 'cheetah',
    },
    {
      fileNames: ['knife.rb'],
      name: 'chef',
    },
    {
      fileNames: ['berksfile', 'berksfile.lock', 'policyfile'],
      name: 'berksfile',
    },
    {
      fileNames: ['chocolatey.ps1', 'chocolateyinstall.ps1', 'chocolateyuninstall.ps1'],
      name: 'chocolatey',
    },
    {
      fileExtensions: ['crdownload', 'crx'],
      name: 'chrome',
    },
    {
      fileExtensions: ['ck'],
      name: 'chuck',
    },
    {
      fileExtensions: ['circleci'],
      fileNames: ['circle.yml', 'circle.yaml'],
      name: 'circleci',
    },
    {
      fileExtensions: [
        'brd',
        'cir',
        'ckt',
        'dsn',
        'fab',
        'g0',
        'g1',
        'g2',
        'g3',
        'g5',
        'g6',
        'g7',
        'g8',
        'g9',
        'g90',
        'gbl',
        'gbo',
        'gbp',
        'gbs',
        'gko',
        'gm0',
        'gm1',
        'gpb',
        'gpt',
        'gtl',
        'gto',
        'gtp',
        'gts',
        'pcb',
        'pho',
        'sch',
      ],
      name: 'circuit',
    },
    {
      fileExtensions: ['cirru'],
      name: 'cirru',
    },
    {
      fileNames: ['ckeditor5-metadata.json'],
      name: 'ckeditor',
    },
    {
      fileExtensions: ['clm', 'clmn', 'clmx', 'clw', 'clwn', 'clwx', 'clwz'],
      name: 'clarion',
    },
    {
      fileExtensions: ['dcl'],
      name: 'clean',
    },
    {
      fileExtensions: ['click'],
      name: 'click',
    },
    {
      fileExtensions: ['clio'],
      name: 'clio',
    },
    {
      fileExtensions: ['clp'],
      name: 'clips',
    },
    {
      fileExtensions: ['soy'],
      name: 'closuretpl',
    },
    {
      fileExtensions: ['cfignore'],
      name: 'cloudfoundry',
    },
    {
      fileExtensions: ['cmake', 'cmake.in'],
      name: 'cmake',
    },
    {
      fileNames: ['cmakelists.txt', 'cmakelists'],
      name: 'cmakelists',
    },
    {
      fileNames: ['cname'],
      name: 'cname',
    },
    {
      fileNames: ['bundle.json'],
      name: 'cnab',
    },
    {
      fileExtensions: ['coafile', 'coarc'],
      name: 'coala',
    },
    {
      fileExtensions: ['cbl', 'ccp', 'cob', 'cobol', 'cpy', 'jcl', 'pli'],
      name: 'cobol',
    },
    {
      fileExtensions: ['podfile', 'podfile.lock', 'podspec'],
      name: 'cocoapods',
    },
    {
      fileExtensions: ['coco'],
      name: 'coconut',
    },
    {
      fileExtensions: ['codacy.yml', 'codacy.yaml'],
      name: 'codacy',
    },
    {
      fileExtensions: ['codeclimate.yml', 'codeclimate.yaml'],
      name: 'codeclimate',
    },
    {
      fileExtensions: ['codecov.yml', 'codecov.yaml'],
      fileNames: ['codecov.yml', 'codecov.yaml'],
      name: 'codecov',
    },
    {
      fileExtensions: ['codekit', 'codekit2', 'codekit3'],
      fileNames: ['codekit-config.json'],
      name: 'codekit',
    },
    {
      fileNames: ['codemeta.json', 'codemeta.jsonld'],
      name: 'codemeta',
    },
    {
      fileNames: [
        'codemirror.cjs',
        'codemirror.css',
        'codemirror.js',
        'codemirror.min.css',
        'codemirror.min.js',
        'codemirror.mjs',
        'codemirror.ts',
      ],
      name: 'codemirror',
    },
    {
      fileNames: ['codeowners'],
      name: 'codeowners',
    },
    {
      fileNames: ['codeship-services.yml', 'codeship-steps.yml'],
      name: 'codeship',
    },
    {
      fileExtensions: ['ql'],
      name: 'codeql',
    },
    {
      fileNames: ['coffeelint.json'],
      name: 'coffeelint',
    },
    {
      fileExtensions: ['coffeelintignore'],
      name: 'coffeelintignore',
    },
    {
      fileExtensions: ['cf'],
      name: 'cf',
    },
    {
      fileExtensions: ['collada', 'dae'],
      name: 'khronos',
    },
    {
      fileExtensions: ['cz', 'cz.json', 'cz.toml', 'cz.yaml', 'cz.yml', 'czrc'],
      fileNames: [
        'commitizen.json',
        'commitizen.toml',
        'commitizen.yaml',
        'commitizen.yml',
        'cz.json',
        'cz.toml',
        'cz.yaml',
        'cz.yml',
      ],
      name: 'commitizen',
    },
    {
      fileExtensions: [
        'commitlintrc',
        'commitlintrc.cjs',
        'commitlintrc.js',
        'commitlintrc.json',
        'commitlintrc.mjs',
        'commitlintrc.yaml',
        'commitlintrc.yml',
      ],
      fileNames: [
        'commitlint.config',
        'commitlint.config.cjs',
        'commitlint.config.js',
        'commitlint.config.json',
        'commitlint.config.mjs',
        'commitlint.config.yaml',
        'commitlint.config.yml',
      ],
      name: 'commitlint',
    },
    {
      fileNames: ['config.rb'],
      name: 'compassConfig',
    },
    {
      fileNames: [
        '_compass.sass',
        '_compass.scss',
        'compass.rb',
        'compass.sass',
        'compass.scss',
        'lemonade.sass',
        'lemonade.scss',
      ],
      name: 'compass',
    },
    {
      fileExtensions: ['cp', 'cps'],
      name: 'cp',
    },
    {
      fileNames: ['composer.json'],
      name: 'composer',
    },
    {
      fileNames: ['composer.lock'],
      name: 'composerlock',
    },
    {
      fileNames: ['composer.phar'],
      name: 'composerphar',
    },
    {
      fileExtensions: ['cdf'],
      name: 'cdf',
    },
    {
      fileNames: ['conan.conf', 'conanfile', 'conanfile.py', 'conanfile.txt'],
      name: 'conan',
    },
    {
      fileExtensions: ['condarc'],
      name: 'conda',
    },
    {
      fileExtensions: ['confluence'],
      name: 'confluence',
    },
    {
      fileExtensions: ['conll', 'conllu'],
      name: 'conll',
    },
    {
      fileExtensions: ['cml'],
      name: 'cml',
    },
    {
      fileExtensions: ['contributors'],
      name: 'contributors',
    },
    {
      fileNames: ['config.xml', 'cordova-2.js', 'cordova-config.js', 'cordova.js', 'cordova_plugins.js'],
      name: 'cordova',
    },
    {
      fileExtensions: ['coq'],
      name: 'coq',
    },
    {
      fileExtensions: ['ccx', 'cdr', 'cdrx', 'cdt', 'cmx'],
      name: 'corel',
    },
    {
      fileExtensions: ['coveralls.yml', 'coveralls.yaml'],
      name: 'coveralls',
    },
    {
      fileNames: ['cpanfile', 'meta.json', 'meta.yaml', 'meta.yml'],
      name: 'cpan',
    },
    {
      fileNames: ['credits', 'credits.md', 'credits.rst', 'credits.txt'],
      name: 'credits',
    },
    {
      fileExtensions: ['cpc'],
      name: 'cpcdocs',
    },
    {
      fileExtensions: ['creole'],
      name: 'creole',
    },
    {
      fileNames: ['crowdin.yml', 'crowdin.yaml'],
      name: 'crowdin',
    },
    {
      fileExtensions: ['cr', 'ecr'],
      name: 'crystal',
    },
    {
      fileExtensions: ['csc', 'ins', 'orc', 'sco', 'udo'],
      light: true,
      name: 'csound',
    },
    {
      fileExtensions: ['cspell', 'cspell.json', 'cspell.yaml', 'cspell.yml'],
      fileNames: [
        'cspell.config.cjs',
        'cspell.config.js',
        'cspell.config.json',
        'cspell.config.mjs',
        'cspell.config.yaml',
        'cspell.config.yml',
      ],
      name: 'cspell',
    },
    {
      fileExtensions: ['csscomb.js', 'csscomb.json', 'csscomb.yaml', 'csscomb.yml'],
      name: 'csscomb',
    },
    {
      fileExtensions: ['csslintrc'],
      name: 'csslint',
    },
    {
      fileExtensions: ['css.map'],
      name: 'cssmap',
    },
    {
      fileExtensions: ['csv', 'tsv'],
      name: 'csv',
    },
    {
      fileExtensions: ['feature'],
      fileNames: [
        'cucumber.cjs',
        'cucumber.js',
        'cucumber.json',
        'cucumber.mjs',
        'cucumber.ts',
        'cucumber.yaml',
        'cucumber.yml',
      ],
      name: 'cucumber',
    },
    {
      fileExtensions: ['cu'],
      name: 'nvidia',
    },
    {
      fileExtensions: ['cuh'],
      name: 'cuh',
    },
    {
      fileExtensions: ['cue'],
      name: 'cue',
    },
    {
      fileExtensions: ['cfl'],
      name: 'cuneiform',
    },
    {
      fileExtensions: ['curlrc'],
      name: 'curl',
    },
    {
      fileExtensions: ['curry', 'icurry', 'fcy'],
      name: 'curry',
    },
    {
      fileExtensions: ['cwl'],
      name: 'cwl',
    },
    {
      fileExtensions: ['pxd', 'pxi', 'pyx'],
      name: 'cython',
    },
    {
      fileNames: ['cypress.json', 'cypress.env.json'],
      name: 'cypress',
    },
    {
      fileExtensions: ['c++', 'cc', 'cpp', 'cxx', 'ii', 'inl', 'ipp', 'mii', 'tcc'],
      name: 'cpp',
    },
    {
      fileExtensions: ['cs', 'csx'],
      name: 'csharp',
    },
    {
      fileExtensions: ['csproj'],
      name: 'csproj',
    },
    {
      fileExtensions: ['vcxproj', 'vcxproj.filters'],
      name: 'vcxproj',
    },
    // endregion

    // region [D]
    {
      fileNames: [
        'd3.cjs',
        'd3.js',
        'd3.json',
        'd3.min.js',
        'd3.mjs',
        'd3.v2-min.js',
        'd3.v2.cjs',
        'd3.v2.js',
        'd3.v2.min.js',
        'd3.v2.mjs',
        'd3.v3-min.js',
        'd3.v3.cjs',
        'd3.v3.js',
        'd3.v3.min.js',
        'd3.v3.mjs',
        'd3.v4-min.js',
        'd3.v4.cjs',
        'd3.v4.js',
        'd3.v4.min.js',
        'd3.v4.mjs',
      ],
      name: 'd3',
    },
    {
      fileExtensions: ['dafny', 'dfy'],
      name: 'dafny',
    },
    {
      fileExtensions: ['dnh'],
      name: 'danmakufu',
    },
    {
      fileExtensions: ['dal'],
      name: 'dal',
    },
    {
      fileExtensions: ['dartignore', 'pubignore'],
      name: 'dartignore',
    },
    {
      fileExtensions: ['darcspatch', 'dpatch'],
      name: 'darcs',
    },
    {
      fileExtensions: ['boringignore'],
      name: 'boringignore',
    },
    {
      fileExtensions: ['cloc', 'cpuprofile', 'heapprofile'],
      name: 'dashboard',
    },
    {
      fileExtensions: ['dfl', 'dw', 'dwl'],
      name: 'dataweave',
    },
    {
      fileExtensions: ['dbproj', 'sqlproj'],
      name: 'dbproj',
    },
    {
      fileExtensions: ['dbf'],
      name: 'dbase',
    },
    {
      fileExtensions: ['control', 'deb', 'udeb'],
      name: 'debian',
    },
    {
      fileExtensions: ['deepsource.toml'],
      light: true,
      name: 'deepsource',
    },
    {
      fileExtensions: ['delphi', 'dfm', 'dof', 'dpk', 'dpr', 'dproj', 'int', 'nfm'],
      name: 'delphi',
    },
    {
      fileExtensions: ['dsc'],
      name: 'denizen',
    },
    {
      fileExtensions: ['denorc'],
      fileNames: ['deno.json'],
      name: 'denorc',
    },
    {
      fileExtensions: ['denoignore'],
      name: 'denoignore',
    },
    {
      fileNames: ['import_map.json', 'mod.ts'],
      light: true,
      name: 'deno',
    },
    {
      fileExtensions: ['dependencies', 'deps', 'pydeps'],
      fileNames: ['DEPS', 'Dependencies', 'deps.edn', 'deps.js', 'deps.json', 'deps.ts', 'deps.yaml', 'deps.yml'],
      name: 'deps',
    },
    {
      fileNames: ['dependabot.yml', 'dependabot.yaml'],
      name: 'dependabot',
    },
    {
      fileNames: ['detekt-config.yaml', 'detekt-config.yml', 'detekt.yaml', 'detekt.yml', 'detekt/yml'],
      name: 'detekt',
    },
    {
      fileExtensions: ['devcontainer.json'],
      fileNames: ['devcontainer.json'],
      name: 'devcontainer',
    },
    {
      fileExtensions: ['dts', 'dtsi'],
      name: 'devicetree',
    },
    {
      fileExtensions: ['dhall'],
      light: true,
      name: 'dhall',
    },
    {
      fileExtensions: ['dia'],
      name: 'dia',
    },
    {
      fileExtensions: ['dig'],
      name: 'digdag',
    },
    {
      fileExtensions: ['bubble', 'dino'],
      name: 'dinophp',
    },
    {
      fileExtensions: ['arpa', 'zone'],
      name: 'dns',
    },
    {
      fileExtensions: ['diff', 'diffs'],
      name: 'diff',
    },
    {
      fileNames: ['asgi.py', 'manage.py', 'settings.py', 'urls.py', 'wsgi.py'],
      name: 'djangoconfig',
    },
    {
      fileExtensions: ['django', 'djt'],
      name: 'django',
    },
    {
      fileExtensions: ['dlc', 'dll'],
      name: 'dll',
    },
    {
      fileExtensions: ['do'],
      name: 'do',
    },
    {
      fileExtensions: ['dbk', 'docb', 'docbkx', 'docbook'],
      name: 'docbook',
    },
    {
      fileExtensions: ['doclets', 'doclets.yaml', 'doclets.yml'],
      name: 'doclets',
    },
    {
      fileExtensions: ['dockerfile'],
      fileNames: [
        'docker/dockerfile',
        'dockerfile',
        'dockerfile.dev',
        'dockerfile.prod',
        'dockerfile.test',
        'dockerfiles/dockerfile',
      ],
      name: 'docker',
    },
    {
      fileExtensions: [
        'docker-compose.yaml',
        'docker-compose.yml',
        'docker/yaml',
        'docker/yml',
        'dockerfiles/yaml',
        'dockerfiles/yml',
      ],
      fileNames: [
        'compose.yaml',
        'compose.yml',
        'docker-compose.dev.yaml',
        'docker-compose.dev.yml',
        'docker-compose.prod.yaml',
        'docker-compose.prod.yml',
        'docker-compose.test.yaml',
        'docker-compose.test.yml',
        'docker-compose.yaml',
        'docker-compose.yml',
      ],
      name: 'dockercompose',
    },
    {
      fileExtensions: ['dockerignore'],
      name: 'dockerignore',
    },
    {
      fileExtensions: ['eco'],
      name: 'docpad',
    },
    {
      fileExtensions: [
        'doczrc',
        'doczrc.cjs',
        'doczrc.js',
        'doczrc.json',
        'doczrc.mjs',
        'doczrc.ts',
        'docz.config.cjs',
        'docz.config.js',
        'docz.config.mjs',
        'docz.config.ts',
      ],
      fileNames: ['docz.config.cjs', 'docz.config.js', 'docz.config.mjs', 'docz.config.ts'],
      name: 'doczconfig',
    },
    {
      fileExtensions: ['docz'],
      name: 'docz',
    },
    {
      fileExtensions: ['djs', 'doge'],
      name: 'dogescript',
    },
    {
      fileExtensions: ['dojo', 'dojorc'],
      fileNames: ['dojo.cjs', 'dojo.js', 'dojo.mjs'],
      name: 'dojo',
    },
    {
      fileExtensions: ['component'],
      name: 'donejs',
    },
    {
      fileNames: ['dosbox-0.74.conf', 'dosbox.conf', 'dosbox.conf.default'],
      name: 'dosbox',
    },
    {
      fileExtensions: ['dot', 'jst'],
      name: 'dotjs',
    },
    {
      fileExtensions: ['net', 'netcore', 'netframework', 'netstandard'],
      name: 'dotnet',
    },
    {
      fileExtensions: ['doxyfile', 'doxygen'],
      fileNames: ['doxyfile', 'doxygen'],
      name: 'doxyfile',
    },
    {
      fileExtensions: ['dox'],
      name: 'doxygen',
    },
    {
      fileNames: [
        'dragula.cjs',
        'dragula.css',
        'dragula.js',
        'dragula.min.cjs',
        'dragula.min.css',
        'dragula.min.js',
        'dragula.min.mjs',
        'dragula.mjs',
      ],
      name: 'dragula',
    },
    {
      fileExtensions: ['dfly', 'dflybsd', 'dragonfly'],
      name: 'dragonflybsd',
    },
    {
      fileExtensions: ['dio', 'dio.png', 'dio.svg', 'drawio', 'drawio.png', 'drawio.svg'],
      name: 'drawio',
    },
    {
      fileExtensions: ['drone.yml', 'drone.yaml'],
      name: 'drone',
    },
    {
      fileExtensions: ['drl'],
      name: 'drools',
    },
    {
      fileExtensions: ['drools'],
      name: 'drupal',
    },
    {
      fileNames: ['dub.json', 'dub.sdl', 'dub.selections.json'],
      name: 'dub',
    },
    {
      fileNames: ['dune', 'dune-project', 'dune-workspace'],
      name: 'dune',
    },
    {
      fileExtensions: ['dust'],
      name: 'dustjs',
    },
    {
      fileExtensions: ['dvc'],
      name: 'dvc',
    },
    {
      fileExtensions: ['dyalog', 'dyapp', 'mipage'],
      name: 'dyalog',
    },
    {
      fileExtensions: ['dyl', 'dylan', 'intr', 'lid'],
      name: 'dylan',
    },
    {
      fileExtensions: ['bundle', 'dylib', 'pkg'],
      name: 'dylib',
    },
    // endregion

    // region [E]
    {
      fileExtensions: ['e'],
      name: 'e',
    },
    {
      fileExtensions: ['eup'],
      name: 'eagle',
    },
    {
      fileExtensions: ['earth', 'earthfile'],
      fileNames: ['Earthfile'],
      name: 'earthly',
    },
    {
      fileExtensions: ['earthignore', 'earthlyignore'],
      name: 'earthlyignore',
    },
    {
      fileNames: ['store.config.json'],
      name: 'eas',
    },
    {
      fileExtensions: ['eb'],
      name: 'easybuild',
    },
    {
      fileExtensions: ['ec', 'eh'],
      name: 'ec',
    },
    {
      fileExtensions: ['epj'],
      name: 'ecere',
    },
    {
      fileExtensions: ['ecl', 'ecl.txt'],
      name: 'clipse',
    },
    {
      fileExtensions: ['classpath', 'cproject', 'eclipse', 'project'],
      name: 'eclipse',
    },
    {
      fileExtensions: ['edge'],
      name: 'edge',
    },
    {
      fileExtensions: ['ecrc', 'editorconfig', 'editorconfig.json'],
      name: 'editorconfig',
    },
    {
      fileNames: ['config.default.js', 'config.local.js', 'config.prod.js', 'config.test.js', 'config.unittest.js'],
      name: 'egg',
    },
    {
      fileExtensions: ['compilerc', 'compilerc.json'],
      fileNames: ['electron-builder.json', 'electron-builder.yml'],
      name: 'electron',
    },
    {
      fileExtensions: ['asar'],
      name: 'electronasar',
    },
    {
      fileExtensions: ['electronforge', 'forge.config.cjs', 'forge.config.js', 'forge.config.mjs', 'forge.config.ts'],
      fileNames: ['forge.config.cjs', 'forge.config.js', 'forge.config.mjs', 'forge.config.ts'],
      name: 'electronforge',
    },
    {
      fileExtensions: ['appdata.xml'],
      name: 'elementaryos',
    },
    {
      fileExtensions: ['ecf', 'eif', 'eiffel'],
      name: 'eiffel',
    },
    {
      fileExtensions: ['ejs', 'ets'],
      name: 'ejs',
    },
    {
      fileExtensions: ['edql', 'es'],
      name: 'elastic',
    },
    {
      fileNames: ['elasticsearch.yml', 'elasticsearch.yaml'],
      name: 'elasticconf',
    },
    {
      fileExtensions: ['eex', 'elixir', 'ex', 'exs', 'heex', 'leex'],
      name: 'ex',
    },
    {
      fileExtensions: ['elm'],
      name: 'elm',
    },
    {
      fileExtensions: ['emacs', 'emacs.conf', 'emacsconfig', 'emacsrc'],
      name: 'emacs',
    },
    {
      fileExtensions: ['ede', 'el', 'elc', 'eld', 'elisp', 'emacs-lisp', 'gnus', 'viper'],
      name: 'emacslisp',
    },
    {
      fileExtensions: ['cask'],
      fileNames: ['cask', 'Caskfile'],
      name: 'emacscask',
    },
    {
      fileExtensions: ['email', 'eml', 'mail', 'mailmap', 'mbox'],
      name: 'email',
    },
    {
      fileExtensions: ['ember-cli', 'ember-cli-build'],
      name: 'embercli',
    },
    {
      fileExtensions: ['ember', 'ember.json'],
      name: 'ember',
    },
    {
      fileExtensions: ['em', 'emberscript'],
      name: 'emberscript',
    },
    {
      fileExtensions: ['ensime'],
      name: 'ensime',
    },
    {
      fileExtensions: ['eq', 'eq1', 'eq2'],
      name: 'eq',
    },
    {
      fileExtensions: ['esdoc', 'esdoc.cjs', 'esdoc.js', 'esdoc.json', 'esdoc.mjs', 'esdoc.yaml', 'esdoc.yml'],
      name: 'esdoc',
    },
    {
      fileExtensions: [
        'eslint/js',
        'eslint/ts',
        'eslint/cjs',
        'eslint/ms',
        'rules/js',
        'rules/ts',
        'rules/cjs',
        'rules/ms',
        'eslintrc',
        'eslintrc.cjs',
        'eslintrc.js',
        'eslintrc.json',
        'eslintrc.mjs',
        'eslintrc.ts',
        'eslintrc.yaml',
        'eslintrc.yml',
      ],
      name: 'eslint',
    },
    {
      fileExtensions: ['eslintcache', 'eslintignore'],
      name: 'eslintignore',
    },
    {
      fileExtensions: ['erb', 'erb.deface', 'erb.deface.orig', 'ru'],
      name: 'erb',
    },
    {
      fileExtensions: ['beam', 'erc', 'erl', 'erlang', 'escript', 'hrl', 'xrl', 'yaws', 'yrl'],
      name: 'erlang',
    },
    {
      fileExtensions: ['emakerfile', 'emakefile', 'emake'],
      fileNames: ['emakefile', 'emake'],
      name: 'makefile',
    },
    {
      fileExtensions: ['odx', 'xla', 'xlam', 'xlm', 'xls', 'xlsb', 'xlsm', 'xlsx', 'xlt', 'xltm', 'xltx'],
      name: 'excel',
    },
    {
      fileNames: [
        'app.config.cjs',
        'app.config.js',
        'app.config.json',
        'app.config.mjs',
        'app.config.ts',
        'app.json',
        'expo/cjs',
        'expo/js',
        'expo/mjs',
        'expo/json',
        'expo/ts',
      ],
      name: 'expo',
    },
    {
      fileNames: [
        'extjs-build.js',
        'extjs-ext.cjs',
        'extjs-ext.js',
        'extjs-ext.mjs',
        'extjs.cjs',
        'extjs.js',
        'extjs.mjs',
      ],
      name: 'extjs',
    },
    // endregion

    // region [F]
    {
      fileNames: ['fabric.mod.json'],
      name: 'fabric',
    },
    {
      fileNames: ['fabfile.py'],
      name: 'fabfile',
    },
    {
      fileExtensions: ['factor', 'factor-boot-rc', 'factor-rc', 'facts'],
      name: 'factor',
    },
    {
      fileExtensions: ['fal', 'falcon'],
      name: 'falcon',
    },
    {
      fileExtensions: ['fancypack', 'fy'],
      name: 'fancy',
    },
    {
      fileNames: ['fakefile'],
      name: 'fakefile',
    },
    {
      fileExtensions: ['fan', 'fantom'],
      name: 'fantom',
    },
    {
      fileExtensions: ['fa', 'faa', 'fas', 'fasta', 'fastq', 'ffn', 'fna', 'fq', 'fqs', 'frn', 'mpfa', 'sam', 'seq'],
      name: 'fasta',
    },
    {
      fileNames: ['appfile', 'fastfile', 'gymfile', 'matchfile', 'pluginfile', 'snapshotfile'],
      name: 'fastlane',
    },
    {
      fileExtensions: ['fauna', 'faunaql', 'faunarc', 'fql'],
      name: 'fauna',
    },
    {
      fileExtensions: ['dsp', 'faust'],
      name: 'faust',
    },
    {
      fileNames: ['favicon.gif', 'favicon.ico', 'favicon.jpeg', 'favicon.jpg', 'favicon.png', 'favicon.svg'],
      name: 'favicon',
    },
    {
      fileExtensions: ['fbx'],
      name: 'fbx',
    },
    {
      fileExtensions: ['fexl', 'fxl'],
      name: 'fexl',
    },
    {
      fileExtensions: ['figma'],
      name: 'figma',
    },
    {
      fileExtensions: ['fdx', 'fdxtpl'],
      name: 'finaldraft',
    },
    {
      fileExtensions: ['DS_Store', '_', '_MACOSX', '__MACOSX'],
      name: 'finder',
    },
    {
      fileExtensions: ['firebaserc'],
      name: 'firebaserc',
    },
    {
      fileExtensions: ['rules'],
      fileNames: ['firestore.rules', 'firestore.indexes.json'],
      name: 'firestore',
    },
    {
      fileExtensions: ['indexes.json'],
      fileNames: ['firebase.json'],
      name: 'firebase',
    },
    {
      fileExtensions: ['fba'],
      name: 'fitbit',
    },
    {
      fileExtensions: ['bolt'],
      name: 'firebasebolt',
    },
    {
      fileExtensions: ['webapp', 'xpi'],
      name: 'firefox',
    },
    {
      fileNames: ['electron-fiddle', 'electron-fiddle.json', 'electron-fiddle.rpm', 'electron-fiddle.zip'],
      name: 'fiddle',
    },
    {
      fileExtensions: ['flash', 'swf'],
      name: 'flash',
    },
    {
      fileNames: ['flask', 'flask.py', 'flaskapp.py'],
      name: 'flask',
    },
    {
      fileExtensions: ['flooignore', 'floorc.json'],
      name: 'floobits',
    },
    {
      fileExtensions: ['flowconfig', 'flow'],
      light: true,
      name: 'flow',
    },
    {
      fileExtensions: ['flutter-plugins', 'flutter-plugins-dependencies', 'metadata', 'packages'],
      name: 'flutter',
    },
    {
      fileNames: ['pubspec.lock', 'pubspec.yaml'],
      name: 'flutterlock',
    },
    {
      fileExtensions: ['flux', 'fluxc', 'fx'],
      name: 'flux',
    },
    {
      fileExtensions: ['bdf', 'bmf', 'dwf', 'flf', 'fnt', 'fon', 'pcf', 'psf', 'psftx', 'snf', 'tlf'],
      name: 'fontbitmap',
    },
    {
      fileExtensions: ['ff', 'pe', 'sfd'],
      name: 'fontforge',
    },
    {
      fileExtensions: ['fossil', 'fossil-ignore', 'fossil-settings', 'fossil-wiki', 'fslckout'],
      fileNames: ['_FOSSIL_', 'fossil.exe'],
      name: 'fossil',
    },
    {
      fileExtensions: ['ftr', 'trm'],
      name: 'ftr',
    },
    {
      fileExtensions: ['fork', 'issuetracker'],
      name: 'fork',
    },
    {
      fileExtensions: ['4th', 'forth', 'frt', 'fth'],
      name: 'forth',
    },
    {
      fileExtensions: ['f03', 'f08', 'f15', 'f77', 'f90', 'f95', 'for', 'fpp'],
      name: 'fortran',
    },
    {
      fileExtensions: ['fossa.local.yaml', 'fossa.local.yml', 'fossa.yaml', 'fossa.yml'],
      name: 'fossa',
    },
    {
      fileExtensions: ['fossaignore'],
      name: 'fossaignore',
    },
    {
      fileExtensions: ['fountain', 'ftn'],
      name: 'fountain',
    },
    {
      fileExtensions: ['fxp', 'prg'],
      name: 'foxpro',
    },
    {
      fileExtensions: ['fdepl', 'fdl', 'fidl', 'franca'],
      name: 'franca',
    },
    {
      fileExtensions: ['desktop', 'desktop.in', 'fd.o', 'menu', 'mime', 'mimeapps'],
      name: 'freedesktop',
    },
    {
      fileExtensions: ['dxelib', 'sys'],
      name: 'freedos',
    },
    {
      fileExtensions: ['freemarker', 'ftl'],
      name: 'freemarker',
    },
    {
      fileExtensions: ['mat'],
      name: 'freemat',
    },
    {
      fileExtensions: ['fr', 'frege'],
      name: 'frege',
    },
    {
      fileExtensions: ['fs', 'fsi', 'fsproj', 'fsscript', 'fsx'],
      name: 'fsharp',
    },
    {
      fileExtensions: ['fthtml'],
      name: 'fthtml',
    },
    {
      fileNames: ['fuelux.css', 'fuelux.js', 'fuelux.min.css', 'fuelux.min.js'],
      name: 'fuelux',
    },
    {
      fileNames: ['fuse.js', 'fuse.mjs', 'fuse.ts', 'fusebox.js', 'fusebox.mjs', 'fusebox.ts'],
      name: 'fusebox',
    },
    {
      fileExtensions: ['fut', 'futhark'],
      name: 'futhark',
    },
    // endregion

    // region [G]
    {
      fileNames: ['galaxy.yml', 'galaxy.yaml', 'galaxy.ini'],
      name: 'galaxy',
    },
    {
      fileExtensions: ['gspec', 'gtest'],
      name: 'galen',
    },
    {
      fileExtensions: ['gml'],
      name: 'gamemaker',
    },
    {
      fileExtensions: ['gms', 'gmsx', 'gmsi', 'gmsinc', 'gmsincx'],
      name: 'gams',
    },
    {
      fileExtensions: ['gi', 'gap'],
      name: 'gap',
    },
    {
      fileExtensions: ['gss'],
      name: 'gss',
    },
    {
      fileNames: [
        'gatsby.js',
        'gatsby.cjs',
        'gatsby.mjs',
        'gatsby.ts',
        'gatsby-config.js',
        'gatsby-config.ts',
        'gatsby-config.cjs',
        'gatsby-config.mjs',
        'gatsby-node.js',
        'gatsby-node.ts',
        'gatsby-node.cjs',
        'gatsby-node.mjs',
        'gatsby-ssr.js',
        'gatsby-ssr.cjs',
        'gatsby-ssr.mjs',
        'gatsby-ssr.ts',
        'gatsby-browser.js',
        'gatsby-browser.cjs',
        'gatsby-browser.mjs',
        'gatsby-browser.ts',
        'gatsby.config.js',
        'gatsby.config.cjs',
        'gatsby.config.mjs',
        'gatsby.config.ts',
      ],
      name: 'gatsby',
    },
    {
      fileExtensions: ['spec'],
      light: true,
      name: 'gauge',
    },
    {
      fileExtensions: ['gcloud', 'gcloudignore'],
      name: 'gcp',
    },
    {
      fileExtensions: [
        'apt',
        'cnc',
        'dnc',
        'fnc',
        'g00',
        'gc',
        'gcode',
        'hnc',
        'knc',
        'maz',
        'nc',
        'ncc',
        'ncf',
        'tap',
      ],
      name: 'gcode',
    },
    {
      fileExtensions: ['gdb'],
      name: 'gdb',
    },
    {
      fileNames: ['gemfile.lock'],
      name: 'gemfile',
    },
    {
      fileExtensions: ['gmi', 'gemini'],
      name: 'gemini',
    },
    {
      fileExtensions: ['kid'],
      name: 'genshi',
    },
    {
      fileExtensions: ['gen', 'gpi'],
      name: 'genstat',
    },
    {
      fileExtensions: ['ebuild', 'eclass', 'ekeyword', 'euse'],
      name: 'gentoo',
    },
    {
      fileExtensions: ['geojson', 'geo.json', 'topojson', 'topo.json'],
      name: 'geojson',
    },
    {
      fileExtensions: ['ghostscript'],
      name: 'ghostscript',
    },
    {
      fileExtensions: ['xcf', 'gbr', 'ggr', 'gih', 'vbr'],
      name: 'gimp',
    },
    {
      fileExtensions: ['gitlab-ci.yml', 'gitlab-ci.yaml'],
      name: 'gitlab',
    },
    {
      fileExtensions: ['gitignore'],
      name: 'gitignore',
    },
    {
      fileExtensions: ['gitpod.yml', 'gitpod.yaml'],
      name: 'gitpod',
    },
    {
      fileExtensions: ['glade'],
      name: 'glade',
    },
    {
      fileExtensions: ['gleam'],
      name: 'gleam',
    },
    {
      fileNames: ['glide.lock', 'glide.yaml', 'glide.yml'],
      name: 'glide',
    },
    {
      fileExtensions: ['glitter', 'glitterrc'],
      name: 'glitter',
    },
    {
      fileExtensions: ['gltf', 'glb'],
      name: 'gltf',
    },
    {
      fileExtensions: ['glf'],
      name: 'pointwise',
    },
    {
      fileExtensions: ['glyphs'],
      name: 'glyphs',
    },
    {
      fileExtensions: ['gni', 'gn', 'gnl'],
      name: 'gn',
    },
    {
      fileExtensions: ['gnome', 'gtk'],
      name: 'gnome',
    },
    {
      fileExtensions: ['gnu', 'gpl', 'gplv2', 'gplv3', 'lgpl', 'lgplv2', 'lgplv3'],
      fileNames: ['AGPL', 'GPL', 'LGPL', 'COPYING', 'COPYING.LESSER', 'ALGPL', 'GFDL'],
      name: 'gnu',
    },
    {
      fileExtensions: ['gp', 'gnuplot', 'plot', 'plt'],
      name: 'gnuplot',
    },
    {
      fileNames: ['go.mod', 'go.sum', 'go.sub', 'go.work'],
      name: 'goconfig',
    },
    {
      fileExtensions: ['gotmpl', 'tmpl', 'gohtml'],
      name: 'goTemplate',
    },
    {
      fileExtensions: ['gd', 'godot', 'tres', 'tscn', 'scn'],
      name: 'godot',
    },
    {
      fileExtensions: ['golo'],
      name: 'golo',
    },
    {
      fileExtensions: ['gs', 'gsx', 'gst', 'gsp', 'vark'],
      name: 'gosu',
    },
    {
      fileExtensions: ['api'],
      name: 'goctl',
    },
    {
      fileExtensions: ['goreleaser', 'goreleaser.yml', 'goreleaser.yaml'],
      name: 'goreleaser',
    },
    {
      fileExtensions: ['gradle'],
      name: 'gradle',
    },
    {
      fileExtensions: ['gradle.kts'],
      name: 'gradlekts',
    },
    {
      fileNames: ['gradlew', 'gradlew.bat'],
      name: 'gradlew',
    },
    {
      fileExtensions: ['grain'],
      name: 'grain',
    },
    {
      fileExtensions: ['gf'],
      name: 'gf',
    },
    {
      fileExtensions: ['graphcool'],
      name: 'graphcool',
    },
    {
      fileExtensions: ['grapher', 'gcx'],
      name: 'grapher',
    },
    {
      fileExtensions: ['graphql', 'gql', 'graphqls', 'gqls'],
      name: 'graphql',
    },
    {
      fileExtensions: [
        'gqlconfig',
        'graphqlconfig',
        'graphql.config.js',
        'graphql.config.cjs',
        'graphql.config.mjs',
        'graphql.config.ts',
        'graphql.config.json',
        'graphql.config.yaml',
        'graphql.config.yml',
        'graphqlrc',
        'graphqlrc.js',
        'graphqlrc.cjs',
        'graphqlrc.mjs',
        'graphqlrc.ts',
        'graphqlrc.json',
      ],
      name: 'graphqlconfig',
    },
    {
      fileExtensions: ['gv', 'graphviz'],
      name: 'graphviz',
    },
    {
      fileNames: ['codegen.yml', 'codegen.yaml', 'codegen.json'],
      name: 'gql-codegen',
    },
    {
      fileExtensions: ['gravit', 'gravitdesign', 'gvdesign'],
      name: 'gravit',
    },
    {
      fileNames: ['greenkeeper.json'],
      name: 'greenkeeper',
    },
    {
      fileNames: [
        'gridsome.config.js',
        'gridsome.config.cjs',
        'gridsome.config.mjs',
        'gridsome.config.ts',
        'gridsome.client.js',
        'gridsome.client.cjs',
        'gridsome.client.mjs',
        'gridsome.client.ts',
        'gridsome.server.js',
        'gridsome.server.cjs',
        'gridsome.server.mjs',
        'gridsome.server.ts',
      ],
      name: 'gridsome',
    },
    {
      fileExtensions: ['groovy', 'grt', 'gtpl', 'gpp', 'gy', 'gvy', 'gdsl'],
      name: 'groovy',
    },
    {
      fileNames: ['groovyfile', 'groovyfile.groovy'],
      name: 'groovyfile',
    },
    {
      fileNames: [
        'gruntfile',
        'gruntfile.js',
        'gruntfile.cjs',
        'gruntfile.mjs',
        'gruntfile.ts',
        'grunt/ts',
        'grunt/js',
        'grunt/cjs',
        'grunt/mjs',
        'gruntfiles/ts',
        'gruntfiles/js',
        'gruntfiles/cjs',
        'gruntfiles/mjs',
      ],
      name: 'gruntfile',
    },
    {
      fileNames: [
        'gulpfile',
        'gulpfile.js',
        'gulpfile.cjs',
        'gulpfile.mjs',
        'gulpfile.ts',
        'gulp/ts',
        'gulp/js',
        'gulp/cjs',
        'gulp/mjs',
        'gulpfiles/ts',
        'gulpfiles/js',
        'gulpfiles/cjs',
        'gulpfiles/mjs',
      ],
      name: 'gulpfile',
    },
    // endregion

    // region [H]
    {
      fileExtensions: ['h', 'h++', 'hm', 'hpp', 'hxx', 'objh'],
      name: 'hh',
    },
    {
      fileExtensions: ['hack', 'hh', 'hhconfig', 'hhi'],
      name: 'hack',
    },
    {
      fileExtensions: ['haml', 'haml.deface', 'hamlc', 'hamlcoffee'],
      name: 'haml',
    },
    {
      fileNames: ['hardhat.config.cjs', 'hardhat.config.js', 'hardhat.config.mjs', 'hardhat.config.ts'],
      name: 'hardhat',
    },
    {
      fileNames: [
        'actions.yaml',
        'actions.yml',
        'allow_list.yaml',
        'allow_list.yml',
        'allowlist.yaml',
        'allowlist.yml',
        'cron_triggers.yaml',
        'cron_triggers.yml',
        'event_triggers.yaml',
        'event_triggers.yml',
        'query_collections.yaml',
        'query_collections.yml',
        'remote_relationships.yaml',
        'remote_relationships.yml',
        'remote_schemas.yaml',
        'remote_schemas.yml',
        'rest_endpoints.yaml',
        'rest_endpoints.yml',
        'tables.yaml',
        'tables.yml',
        'version.yaml',
        'version.yml',
      ],
      name: 'hasura',
    },
    {
      fileNames: ['hasura.config.yaml', 'hasura.config.yml', 'hasura.yaml', 'hasura.yml'],
      name: 'hasuraconfig',
    },
    {
      fileExtensions: ['ch', 'hb', 'hrb', 'prg'],
      name: 'harbour',
    },
    {
      fileExtensions: ['hcl', 'workflow'],
      name: 'hcl',
    },
    {
      fileExtensions: ['hs', 'lhs', 'hsc', 'c2hs', 'hsig', 'haskell', 'hs-boot'],
      name: 'haskell',
    },
    {
      fileNames: ['haskellconfig.json', 'haskellconfig.yaml', 'haskellconfig.yml'],
      name: 'haskellconfig',
    },
    {
      fileExtensions: ['hxproj'],
      name: 'haxedevelop',
    },
    {
      fileExtensions: ['haxe', 'hx', 'hxml', 'hxs', 'hxsl'],
      name: 'haxe',
    },
    {
      fileNames: ['haxelib.json'],
      name: 'haxelib',
    },
    {
      fileExtensions: ['helm', 'helmfile', 'helmrc'],
      name: 'helm',
    },
    {
      fileExtensions: ['helmignore'],
      name: 'helmignore',
    },
    {
      fileNames: ['chart.yaml', 'chart.yml', 'helmfile.yaml', 'helmfile.yml', 'values.yaml', 'values.yml'],
      name: 'helmcharts',
    },
    {
      fileExtensions: ['chm', 'help', 'hlp'],
      name: 'question',
    },
    {
      fileExtensions: ['buildpacks', 'heroku'],
      fileNames: ['Procfile', 'Procfile.windows'],
      name: 'heroku',
    },
    {
      fileExtensions: ['herokuignore', 'slugignore'],
      name: 'herokuignore',
    },
    {
      fileExtensions: ['hex', 'hexfile', 'hxh', 'hxl', 'ihe', 'ihex', 'ihx', 'obh', 'obl'],
      name: 'hex',
    },
    {
      fileNames: ['hie.yaml', 'hie.yml'],
      name: 'hie',
    },
    {
      fileExtensions: [
        'histoire',
        'histoire.cjs',
        'histoire.js',
        'histoire.jsx',
        'histoire.mjs',
        'histoire.ts',
        'histoire.tsx',
        'histoireconfig',
      ],
      fileNames: [
        'histoire.config.cjs',
        'histoire.config.js',
        'histoire.config.jsx',
        'histoire.config.mjs',
        'histoire.config.ts',
        'histoire.config.tsx',
      ],
      name: 'histoire',
    },
    {
      fileExtensions: ['stories.vue', 'story.vue'],
      name: 'histoirestories',
    },
    {
      fileExtensions: [
        'bash_history',
        'csh_history',
        'fish_history',
        'irb-history',
        'ksh_history',
        'lesshst',
        'tcsh_history',
        'zsh_history',
      ],
      fileNames: ['history', 'history.md', 'history.txt', 'historyfile'],
      name: 'history',
    },
    {
      fileExtensions: ['hjson'],
      name: 'hjson',
    },
    {
      fileExtensions: ['hlsl', 'hlsli'],
      name: 'hlsl',
    },
    {
      fileExtensions: ['hc', 'hc.z'],
      name: 'hc',
    },
    {
      fileExtensions: ['homeassistant'],
      name: 'homeassistant',
    },
    {
      fileExtensions: ['hl', 'hoplon'],
      name: 'hoplon',
    },
    {
      fileExtensions: ['horusec', 'horusecignore', 'horusecrc'],
      fileNames: ['horusec-config.json'],
      name: 'horusec',
    },
    {
      fileExtensions: ['hosts', 'host'],
      fileNames: ['hosts', 'host'],
      name: 'hosts',
    },
    {
      fileExtensions: ['hda', 'hip', 'houdini', 'houdinicomp', 'houdiniparm', 'i3d', 'pic', 'picnc', 'vfl'],
      name: 'houdini',
    },
    {
      fileExtensions: ['hound.yml', 'hound.yaml'],
      name: 'houndci',
    },
    {
      fileExtensions: ['hp', 'hpg', 'hpgl'],
      name: 'hp',
    },
    {
      fileExtensions: ['htaccess', 'htpasswd'],
      name: 'htaccess',
    },
    {
      fileExtensions: ['http', 'rest'],
      name: 'http',
    },
    {
      fileExtensions: ['htmlhintrc'],
      name: 'htmlhint',
    },
    {
      fileNames: ['config.toml'],
      name: 'hugo',
    },
    {
      fileExtensions: ['aff', 'dic'],
      name: 'hunspell',
    },
    {
      fileNames: [
        '.husky/sh',
        'hooks/sh',
        'post-checkout',
        'post-commit',
        'post-merge',
        'post-push',
        'post-rebase',
        'pre-checkout',
        'pre-commit',
        'pre-merge',
        'pre-push',
        'pre-rebase',
      ],
      name: 'huskyhooks',
    },
    {
      fileExtensions: [
        'huskyrc',
        'huskyrc.cjs',
        'huskyrc.js',
        'huskyrc.json',
        'huskyrc.mjs',
        'huskyrc.ts',
        'huskyrc.yaml',
        'huskyrc.yml',
      ],
      name: 'husky',
    },
    {
      fileExtensions: ['hy'],
      name: 'hy',
    },
    {
      fileExtensions: ['ejs.t', 'hygen.cjs', 'hygen.js', 'hygen.mjs', 'hygen.ts'],
      name: 'hygen',
    },
    {
      fileExtensions: ['hyper.cjs', 'hyper.js', 'hyper.mjs', 'hyper.ts'],
      name: 'hyper',
    },
    {
      fileNames: [
        'hypestyle.config.cjs',
        'hypestyle.config.js',
        'hypestyle.config.mjs',
        'hypestyle.config.ts',
        'hypestyle.json',
      ],
      name: 'hypestyle',
    },
    {
      fileExtensions: ['hypr', 'hyprlive', 'hypr.live'],
      name: 'hypr',
    },
    // endregion

    // region [I]
    {
      fileExtensions: ['po', 'pot', 'strings'],
      name: 'i18n',
    },
    {
      fileExtensions: [
        'i18n/js',
        'i18n/jsx',
        'i18n/cjs',
        'i18n/mjs',
        'i18n/json',
        'i18n/md',
        'i18n/rst',
        'i18n/ts',
        'i18n/tsx',
        'i18n/yaml',
        'i18n/yml',
        'lang/js',
        'lang/jsx',
        'lang/cjs',
        'lang/mjs',
        'lang/json',
        'lang/md',
        'lang/rst',
        'lang/ts',
        'lang/tsx',
        'lang/yaml',
        'lang/yml',
        'locale/js',
        'locale/jsx',
        'locale/cjs',
        'locale/mjs',
        'locale/json',
        'locale/md',
        'locale/rst',
        'locale/ts',
        'locale/tsx',
        'locale/yaml',
        'locale/yml',
        'locales/js',
        'locales/cjs',
        'locales/mjs',
        'locales/jsx',
        'locales/json',
        'locales/md',
        'locales/rst',
        'locales/ts',
        'locales/tsx',
        'locales/yaml',
        'locales/yml',
        'translation/js',
        'translation/mjs',
        'translation/cjs',
        'translation/jsx',
        'translation/json',
        'translation/md',
        'translation/rst',
        'translation/ts',
        'translation/tsx',
        'translation/yaml',
        'translation/yml',
        'translations/js',
        'translations/cjs',
        'translations/mjs',
        'translations/jsx',
        'translations/json',
        'translations/md',
        'translations/rst',
        'translations/ts',
        'translations/tsx',
        'translations/yaml',
        'translations/yml',
      ],
      name: 'i18nlang',
    },
    {
      fileExtensions: ['icl'],
      name: 'icl',
    },
    {
      fileNames: ['icomoon.json', 'icomoon.dev.json', 'icomoon.prod.json'],
      name: 'icomoon',
    },
    {
      fileExtensions: ['icu', 'nrm'],
      name: 'icu',
    },
    {
      fileExtensions: ['icls', 'iml'],
      name: 'idea',
    },
    {
      fileExtensions: ['ibc', 'idr', 'idris', 'ipkg', 'lidr'],
      name: 'idris',
    },
    {
      fileExtensions: ['dlm', 'idl'],
      name: 'idl',
    },
    {
      fileExtensions: ['ipf'],
      name: 'igor',
    },
    {
      fileExtensions: ['imba', 'imba2'],
      name: 'imba',
    },
    {
      fileExtensions: ['imgbotconfig'],
      name: 'imgbot',
    },
    {
      fileExtensions: ['4gl'],
      name: 'informix',
    },
    {
      fileNames: ['__init__.py'],
      name: 'indexpy',
    },
    {
      fileExtensions: ['infopathxml', 'xsf', 'xsn', 'xtp2'],
      name: 'infopath',
    },
    {
      fileExtensions: ['i7x', 'ni'],
      name: 'inform',
    },
    {
      fileExtensions: ['ink', 'ink2'],
      name: 'ink',
    },
    {
      fileExtensions: ['inx'],
      light: true,
      name: 'inkscape',
    },
    {
      fileExtensions: ['isl', 'iss'],
      name: 'inno',
    },
    {
      fileExtensions: ['img', 'iso', 'nrg', 'udf'],
      name: 'iso',
    },
    {
      fileExtensions: ['nycrc', 'nycrc.json', 'nycrc.yaml', 'nycrc.yml'],
      name: 'istanbul',
    },
    {
      fileNames: [
        'nyc.config.cjs',
        'nyc.config.js',
        'nyc.config.json',
        'nyc.config.mjs',
        'nyc.config.ts',
        'nyc.config.yaml',
        'nyc.config.yml',
      ],
      name: 'istanbulconf',
    },
    {
      fileExtensions: ['io'],
      name: 'io',
    },
    {
      fileExtensions: ['iodine'],
      name: 'iodine',
    },
    {
      fileExtensions: ['ik'],
      name: 'ioke',
    },
    {
      fileNames: [
        'ionic.config',
        'ionic.config.js',
        'ionic.config.json',
        'ionic.project',
        'ionic.project.js',
        'ionic.project.json',
      ],
      name: 'ionic',
    },
    {
      fileExtensions: ['thy'],
      light: true,
      name: 'isabelle',
    },

    // endregion

    // region [J]
    {
      fileExtensions: ['ij', 'ijs'],
      name: 'j',
    },
    {
      fileExtensions: ['jade', 'pug'],
      name: 'pug',
    },
    {
      fileExtensions: [
        'jade-lintrc',
        'jade-lintrc.cjs',
        'jade-lintrc.js',
        'jade-lintrc.json',
        'jade-lintrc.mjs',
        'pug-lintrc',
        'pug-lintrc.cjs',
        'pug-lintrc.js',
        'pug-lintrc.json',
        'pug-lintrc.mjs',
      ],
      name: 'puglint',
    },
    {
      fileExtensions: ['jake'],
      name: 'jake',
    },
    {
      fileNames: ['Jakefile', 'jakefile.cjs', 'jakefile.js', 'jakefile.mjs', 'jakefile.ts'],
      name: 'jakefile',
    },
    {
      fileExtensions: ['jakt'],
      name: 'jakt',
    },
    {
      fileExtensions: ['janet', 'jpm'],
      name: 'janet',
    },
    {
      fileNames: [
        'jasmine.cjs',
        'jasmine.config.js',
        'jasmine.config.ts',
        'jasmine.dev.coffee',
        'jasmine.js',
        'jasmine.json',
        'jasmine.mjs',
        'jasmine.ts',
      ],
      name: 'jasmine',
    },
    {
      fileExtensions: ['htc', 'jsb', 'jscript', 'jslib', 'jsm', 'jspre', 'pjs', 'ssjs'],
      name: 'js',
    },
    {
      fileExtensions: ['jbuilder'],
      name: 'jbuilder',
    },
    {
      fileExtensions: ['jekyll'],
      fileNames: ['_config.yml', '_config.yaml'],
      name: 'jekyll',
    },
    {
      fileExtensions: ['jellycut', 'jelly'],
      name: 'jellycut',
    },
    {
      fileExtensions: ['jenkinsfile', 'jenkins'],
      fileNames: ['Jenkinsfile', 'jenkinsfile.groovy', 'jenkinsfile.kt'],
      name: 'jenkins',
    },
    {
      fileExtensions: ['jest/cjs', 'jest/js', 'jest/mjs', 'jest/ts'],
      fileNames: [
        'jest.babel.cjs',
        'jest.babel.js',
        'jest.babel.json',
        'jest.babel.mjs',
        'jest.babel.ts',
        'jest.config.cjs',
        'jest.config.js',
        'jest.config.json',
        'jest.config.jsx',
        'jest.config.mjs',
        'jest.config.ts',
        'jest.config.tsx',
        'jest.setup.cjs',
        'jest.setup.js',
        'jest.setup.json',
        'jest.setup.mjs',
        'jest.setup.ts',
        'jest.teardown.cjs',
        'jest.teardown.js',
        'jest.teardown.json',
        'jest.teardown.mjs',
        'jest.teardown.ts',
      ],
      name: 'jest',
    },
    {
      fileExtensions: ['jestrc', 'jestrc.cjs', 'jestrc.js', 'jestrc.json', 'jestrc.mjs', 'jestrc.ts'],
      name: 'jestrc',
    },
    {
      fileExtensions: ['theme', 'theme.json'],
      name: 'theme',
    },
    {
      fileExtensions: ['form', 'jfd'],
      name: 'jfd',
    },
    {
      fileExtensions: ['j2', 'jinja', 'jinja-html', 'jinja2', 'jnj', 'jnj2'],
      name: 'jinja',
    },
    {
      fileExtensions: ['jison', 'jisonlex'],
      name: 'jison',
    },
    {
      fileExtensions: ['iol', 'jolie', 'ol'],
      name: 'jolie',
    },
    {
      fileExtensions: ['joomla'],
      name: 'joomla',
    },
    {
      fileNames: [
        'jquery.coffee',
        'jquery.es6',
        'jquery.js',
        'jquery.latest.js',
        'jquery.latest.min.js',
        'jquery.min.js',
        'jquery.slim.coffee',
        'jquery.slim.es6',
        'jquery.slim.js',
        'jquery.slim.min.js',
      ],
      name: 'jquery',
    },
    {
      fileExtensions: ['jsbeautify', 'jsbeautifyrc', 'jsbeautifyrc.json'],
      name: 'jsbeautify',
    },
    {
      fileExtensions: ['jscs.cjs', 'jscs.js', 'jscs.json', 'jscs.mjs', 'jscsrc'],
      name: 'jscs',
    },
    {
      fileExtensions: ['jshintrc'],
      name: 'jshint',
    },
    {
      fileExtensions: ['jshintignore'],
      name: 'jshintignore',
    },
    {
      fileExtensions: ['cjs.map', 'js.map', 'mjs.map'],
      name: 'jsmap',
    },
    {
      fileExtensions: ['jsconfig.cjs', 'jsconfig.js', 'jsconfig.json', 'jsconfig.mjs', 'jsconfig.ts'],
      fileNames: ['jsconfig.cjs', 'jsconfig.js', 'jsconfig.json', 'jsconfig.mjs', 'jsconfig.ts'],
      name: 'jsconfig',
    },
    {
      fileExtensions: ['jscpd', 'jscpd.html', 'jscpd.json', 'jscpd.xml'],
      name: 'jscpd',
    },
    {
      fileExtensions: ['json5'],
      name: 'json5',
    },
    {
      fileExtensions: ['json-ld', 'jsonl', 'jsonld', 'ldjson'],
      name: 'jsonld',
    },
    {
      fileExtensions: ['jsonn', 'jsonnet', 'libsonnet'],
      name: 'jsonnet',
    },
    {
      fileExtensions: ['jhtm', 'jhtml', 'jsf', 'jsp', 'jspf', 'jspx'],
      name: 'jsp',
    },
    {
      fileExtensions: ['jss'],
      name: 'jss',
    },
    {
      fileExtensions: ['jl', 'julia'],
      name: 'julia',
    },
    {
      fileExtensions: ['ipynb'],
      fileNames: ['Notebook'],
      name: 'jupyter',
    },
    {
      fileExtensions: ['jos', 'junos', 'slax'],
      name: 'junos',
    },
    {
      fileExtensions: ['jwt'],
      name: 'jwt',
    },
    // endregion

    // region [K]
    {
      fileExtensions: ['ksy'],
      name: 'kaitai',
    },
    {
      fileNames: [
        'karma.conf.cjs',
        'karma.conf.coffee',
        'karma.conf.js',
        'karma.conf.mjs',
        'karma.conf.ts',
        'karma.config.cjs',
        'karma.config.coffee',
        'karma.config.js',
        'karma.config.mjs',
        'karma.config.ts',
      ],
      light: true,
      name: 'karma',
    },
    {
      fileExtensions: ['ks'],
      name: 'kerboscript',
    },
    {
      fileNames: ['keybase.txt'],
      name: 'keybase',
    },
    {
      fileExtensions: ['knt', 'keynote'],
      name: 'keynote',
    },
    {
      fileExtensions: ['der', 'enc', 'gpg', 'kdbx', 'key', 'passwd', 'pem', 'ssh'],
      name: 'key',
    },
    {
      fileNames: ['publishToken', 'publishToken.md', 'publishToken.txt', 'publishToken.xml'],
      name: 'publishToken',
    },
    {
      fileExtensions: ['kibo'],
      name: 'kibo',
    },
    {
      fileExtensions: ['kicad_mod', 'kicad_pcb', 'kicad_pcb-bak', 'kicad_sch', 'kicad_wks'],
      name: 'kicad',
    },
    {
      fileExtensions: ['kitchen.yml', 'kitchen.yaml'],
      fileNames: [
        'kitchen.ci.yaml',
        'kitchen.dev.yaml',
        'kitchen.dev.yml',
        'kitchen.local.yaml',
        'kitchen.local.yml',
        'kitchen.prod.yaml',
        'kitchen.prod.yml',
        'kitchen.yaml',
        'kitchen.yml',
      ],
      name: 'kitchenci',
    },
    {
      fileExtensions: ['kite', 'kiteignore'],
      name: 'kite',
    },
    {
      fileExtensions: ['kv'],
      name: 'kivy',
    },
    {
      fileExtensions: ['kml'],
      name: 'kml',
    },
    {
      fileExtensions: ['kl'],
      name: 'kl',
    },
    {
      fileExtensions: ['knim', 'knime', 'knwf'],
      fileNames: ['knime.ini'],
      name: 'knime',
    },
    {
      fileExtensions: ['knockout'],
      fileNames: ['knockout.js', 'knockout.min.js'],
      name: 'knockout',
    },
    {
      fileExtensions: ['kk', 'koka'],
      light: true,
      name: 'koka',
    },
    {
      fileExtensions: ['k8s', 'k8s.yaml', 'k8s.yml', 'kubernetes', 'kubernetes.yaml', 'kubernetes.yml'],
      fileNames: [
        'kubernetes',
        'kubernetes.dev.yaml',
        'kubernetes.dev.yml',
        'kubernetes.prod.yaml',
        'kubernetes.prod.yml',
        'kubernetes.yaml',
        'kubernetes.yml',
      ],
      name: 'kubernetes',
    },
    {
      fileNames: [
        'configmap.yaml',
        'configmap.yml',
        'cronjob.yaml',
        'cronjob.yml',
        'daemonset.yaml',
        'daemonset.yml',
        'deployment.yaml',
        'deployment.yml',
        'ingress.yaml',
        'ingress.yml',
        'job.yaml',
        'job.yml',
        'persistentvolume.yaml',
        'persistentvolume.yml',
        'persistentvolumeclaim.yaml',
        'persistentvolumeclaim.yml',
        'pod.yaml',
        'pod.yml',
        'replicaset.yaml',
        'replicaset.yml',
        'replicationcontroller.yaml',
        'replicationcontroller.yml',
        'service.yaml',
        'service.yml',
        'statefulset.yaml',
        'statefulset.yml',
      ],
      name: 'kubernetesdepl',
    },
    {
      fileExtensions: ['kazel', 'kazelcfg.json'],
      fileNames: ['kazelcfg.json'],
      name: 'kazel',
    },
    {
      fileExtensions: ['csl', 'kql', 'kqlx', 'kusto'],
      name: 'kusto',
    },
    {
      fileNames: ['kustomization.yaml', 'kustomization.yml', 'kustomize.yaml', 'kustomize.yml'],
      name: 'kustomize',
    },
    // endregion

    // region [L]
    {
      fileExtensions: ['lvclass', 'lvlib', 'lvlibp', 'lvlibpc', 'lvproj'],
      name: 'labview',
    },
    {
      fileExtensions: ['lark'],
      name: 'lark',
    },
    {
      fileExtensions: ['las', 'lasso', 'lasso8', 'lasso9', 'lassoapp', 'lasx', 'ldml'],
      name: 'lasso',
    },
    {
      fileExtensions: ['lat'],
      name: 'latino',
    },
    {
      fileExtensions: ['latte'],
      light: true,
      name: 'latte',
    },
    {
      fileNames: [
        'leaflet-src.js',
        'leaflet.css',
        'leaflet.draw-src.js',
        'leaflet.draw.css',
        'leaflet.js',
        'leaflet.min.js',
        'leaflet.spin.css',
        'leaflet.src.js',
        'wicket-leaflet.cjs',
        'wicket-leaflet.js',
        'wicket-leaflet.mjs',
      ],
      name: 'leaflet',
    },
    {
      fileExtensions: ['hlean', 'lean'],
      name: 'lean',
    },
    {
      fileExtensions: ['aleo', 'leo'],
      name: 'leo',
    },
    {
      fileExtensions: ['lefthook.yml', 'lefthook.yaml'],
      fileNames: ['lefthook-local.yaml', 'lefthook-local.yml', 'lefthook.yaml', 'lefthook.yml'],
      name: 'lefthook',
    },
    {
      fileExtensions: ['lektor', 'lektorproject', 'lr'],
      name: 'lektor',
    },
    {
      fileNames: ['project.clj'],
      name: 'leiningen',
    },
    {
      fileNames: ['lerna.json'],
      name: 'lerna',
    },
    {
      fileExtensions: ['flex', 'lex', 'lexer', 'x'],
      name: 'lex',
    },
    {
      fileExtensions: ['lfe'],
      name: 'lfe',
    },
    {
      fileExtensions: ['lgtm', 'lgtm.yml', 'lgtm.yaml'],
      fileNames: ['lgtm.yml', 'lgtm.yaml'],
      name: 'lgtm',
    },
    {
      fileExtensions: ['lib'],
      name: 'lib',
    },
    {
      fileExtensions: ['libuv', 'luv', 'luvit', 'uv'],
      name: 'libuv',
    },
    {
      fileExtensions: ['license', 'licence', 'lic'],
      fileNames: ['licence', 'licence.md', 'licence.txt', 'license', 'license.md', 'license.txt'],
      name: 'license',
    },
    {
      fileExtensions: ['licrc'],
      name: 'licensebat',
    },
    {
      fileExtensions: [
        'lighthouserc',
        'lighthouserc.cjs',
        'lighthouserc.js',
        'lighthouserc.json',
        'lighthouserc.mjs',
        'lighthouserc.ts',
        'lighthouserc.yaml',
        'lighthouserc.yml',
      ],
      fileNames: [
        'lighthouserc.cjs',
        'lighthouserc.js',
        'lighthouserc.json',
        'lighthouserc.mjs',
        'lighthouserc.ts',
        'lighthouserc.yaml',
        'lighthouserc.yml',
      ],
      name: 'lighthouse',
    },
    {
      fileExtensions: ['lwo', 'lws'],
      name: 'lightwave',
    },
    {
      fileExtensions: ['ily', 'ly'],
      name: 'lilypond',
    },
    {
      fileExtensions: ['hxp', 'lime'],
      name: 'lime',
    },
    {
      fileExtensions: ['alias', 'link', 'lnk', 'url'],
      name: 'link',
    },
    {
      fileExtensions: ['linq'],
      name: 'linqpad',
    },
    {
      fileExtensions: ['lintstagedrc', 'lintstagedrc.js', 'lintstagedrc.json', 'lintstagedrc.yaml', 'lintstagedrc.yml'],
      fileNames: [
        'lint-staged.config.cjs',
        'lint-staged.config.js',
        'lint-staged.config.json',
        'lint-staged.config.mjs',
        'lint-staged.config.ts',
        'lint-staged.config.yaml',
        'lint-staged.config.yml',
      ],
      name: 'lint-staged',
    },
    {
      fileExtensions: ['liquid'],
      name: 'liquid',
    },
    {
      fileExtensions: ['cl', 'lisp', 'lsp', 'nl', 'ny', 'podsl', 'sbclrc', 'sexp'],
      name: 'lisp',
    },
    {
      fileExtensions: ['changelog.json', 'changelog.sql', 'changelog.xml', 'changelog.yaml', 'changelog.yml'],
      name: 'liquibase',
    },
    {
      fileNames: ['liquibase.properties'],
      name: 'liquibase_props',
    },
    {
      fileExtensions: ['_ls', 'ls', 'ls6', 'lsc', 'lsx'],
      fileNames: ['Slakefile'],
      name: 'livescript',
    },
    {
      fileExtensions: ['clang-format', 'll', 'llir', 'llvm'],
      name: 'llvm',
    },
    {
      fileExtensions: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'bug-report', 'log', 'logs', 'rpt'],
      name: 'log',
    },
    {
      fileExtensions: ['lgt', 'logtalk'],
      name: 'logtalk',
    },
    {
      fileExtensions: ['lol'],
      name: 'lolcode',
    },
    {
      fileExtensions: ['lkml', 'lookml'],
      name: 'lookml',
    },
    {
      fileExtensions: ['lsl', 'lslp'],
      name: 'lsl',
    },
    {
      fileExtensions: ['luau', 'rbxl'],
      name: 'luau',
    },
    {
      fileNames: ['lakefile'],
      name: 'lakefile',
    },
    {
      fileExtensions: ['crec', 'ocrec'],
      name: 'lync',
    },

    // endregion

    // region [M]
    {
      fileExtensions: ['m2'],
      name: 'macaulay',
    },
    {
      fileExtensions: ['mage'],
      name: 'magento',
    },
    {
      fileExtensions: ['magit'],
      name: 'magit',
    },
    {
      fileExtensions: ['am', 'mak', 'make', 'mk', 'mms'],
      name: 'make',
    },
    {
      fileNames: [
        'BSDmakefile',
        'GNUmakefile',
        'Kbuild',
        'Makefile.boot',
        'Makefile.in',
        'Makefile.inc',
        'Makefile.unix',
        'Makefile.unx',
        'Makefile.vc',
        'Makefile.wat',
        'Makefile.watcom',
        'Makefile.win',
        'makefile',
        'mkfile',
      ],
      name: 'makefile',
    },
    {
      fileExtensions: ['mako', 'mao'],
      name: 'mako',
    },
    {
      fileExtensions: [
        'man',
        'man1',
        'man2',
        'man3',
        'man4',
        'man5',
        'man6',
        'man7',
        'man8',
        'man9',
        'mdoc',
        'rnh',
        'rno',
        'roff',
        'runoff',
      ],
      name: 'manpage',
    },
    {
      fileExtensions: ['manifest', 'mf', 'webmanifest'],
      fileNames: [
        'manifest',
        'manifest.bak',
        'manifest.json',
        'manifest.skip',
        'manifest.txt',
        'manifest.webapp',
        'manifest.xml',
        'manifest.yaml',
        'manifest.yml',
      ],
      name: 'manifest',
    },
    {
      fileExtensions: ['pkg.tar.bz2', 'pkg.tar.gz', 'pkg.tar.xz', 'pkg.tar.zst'],
      name: 'manjaro',
    },
    {
      fileExtensions: ['mss'],
      name: 'mapbox',
    },
    {
      fileExtensions: [
        'markdownlint',
        'markdownlint.json',
        'markdownlint.jsonc',
        'markdownlint.yaml',
        'markdownlint.yml',
        'markdownlintrc',
        'mdlrc',
      ],
      name: 'markdownlint',
    },
    {
      fileExtensions: ['markdownlintignore', 'mdlignore'],
      name: 'markdownlintignore',
    },
    {
      fileExtensions: ['marko', 'marko.js', 'marko.cjs', 'marko.mjs'],
      name: 'marko',
    },
    {
      fileExtensions: ['dhtm', 'dhtml', 'dtd', 'shtm', 'shtml', 'xht'],
      name: 'markup',
    },
    {
      fileNames: ['master.cjs', 'master.js', 'master.json', 'master.mjs', 'master.ts'],
      name: 'master',
    },
    {
      fileNames: [
        'materialize.cjs',
        'materialize.css',
        'materialize.js',
        'materialize.min.css',
        'materialize.min.js',
        'materialize.mjs',
        'materialize.scss',
      ],
      name: 'materialize',
    },
    {
      fileExtensions: ['ma', 'mb', 'mt', 'nb', 'nbp', 'math'],
      name: 'mathematica',
    },
    {
      fileExtensions: [
        'fig',
        'matlab',
        'mdlp',
        'mex',
        'mexa',
        'mexglx',
        'mexmaci',
        'mexmaci64',
        'mexn',
        'mexrs6',
        'mexw',
        'mexw32',
        'mexw64',
        'mlappinstall',
        'mlpkginstall',
        'mltbx',
        'mlx',
        'mn',
        'mum',
        'mx',
        'mx3',
        'rwd',
        'sldd',
        'slx',
        'slxc',
        'slxp',
        'smv',
        'xvc',
      ],
      name: 'matlab',
    },
    {
      fileNames: [
        'MathJax-config.cjs',
        'MathJax-config.js',
        'MathJax-config.js.gz',
        'MathJax-config.js.map',
        'MathJax-config.mjs',
        'MathJax.cjs',
        'MathJax.js',
        'MathJax.js.gz',
        'MathJax.js.map',
        'MathJax.mjs',
        'TeX-MML-AM_CHTML.cjs',
        'TeX-MML-AM_CHTML.js',
        'TeX-MML-AM_CHTML.js.gz',
        'TeX-MML-AM_CHTML.js.map',
        'TeX-MML-AM_CHTML.mjs',
      ],
      name: 'mathjax',
    },
    {
      fileExtensions: ['pom', 'flattened-pom.xml'],
      fileNames: ['pom.xml'],
      name: 'maven',
    },
    {
      fileExtensions: ['maxhelp', 'maxobj', 'maxpat', 'maxproj', 'maxref', 'maxscript', 'mxt', 'pat'],
      name: 'max',
    },
    {
      fileExtensions: ['maya', 'mcfi', 'mcfp', 'mel'],
      name: 'maya',
    },
    {
      fileExtensions: ['mdx'],
      name: 'mdx',
    },
    {
      fileExtensions: ['mediawiki', 'wiki'],
      name: 'mediawiki',
    },
    {
      fileExtensions: ['hg', 'hgrc', 'hgsub', 'hgsubstate'],
      name: 'mercurial',
    },
    {
      fileExtensions: ['hgignore'],
      name: 'mercurialignore',
    },
    {
      fileExtensions: ['moo'],
      name: 'mercury',
    },
    {
      fileExtensions: ['merlin'],
      name: 'merlin',
    },
    {
      fileExtensions: ['mermaid', 'mmd', 'mmdc'],
      name: 'mermaid',
    },
    {
      fileNames: ['meson.build', 'meson_options.txt'],
      name: 'meson',
    },
    {
      fileExtensions: ['air', 'metal', 'metallib'],
      name: 'metal',
    },
    {
      fileExtensions: ['mp', 'mpost', 'mpx', 'mpy'],
      name: 'metapost',
    },
    {
      fileExtensions: ['meteor'],
      name: 'meteor',
    },
    {
      fileExtensions: ['mcfunction', 'mclevel', 'mcmeta', 'mcmod', 'mcpack', 'mcrcon', 'mcreator', 'mcworld'],
      name: 'minecraft',
    },
    {
      fileExtensions: ['dzn', 'fzn', 'mzn'],
      name: 'minizinc',
    },
    {
      fileExtensions: ['mint'],
      name: 'mint',
    },
    {
      fileExtensions: ['druby', 'duby', 'mir', 'mirah'],
      name: 'mirah',
    },
    {
      fileExtensions: ['mixin', 'mixin.json', 'mixins', 'mixins.json'],
      name: 'mixin',
    },
    {
      fileExtensions: ['mirc', 'mircscript', 'mrc'],
      name: 'mirc',
    },
    {
      fileExtensions: ['mjml', 'mjmlslim'],
      name: 'mjml',
    },
    {
      fileExtensions: ['mkdocs.yml', 'mkdocs.yaml'],
      fileNames: ['mkdocs.yml', 'mkdocs.yaml'],
      name: 'mkdocs',
    },
    {
      fileExtensions: ['mlang', 'pq'],
      name: 'mlang',
    },
    {
      fileExtensions: [
        'mobx',
        'mobx.cjs',
        'mobx.js',
        'mobx.mjs',
        'mobx.ts',
        'observable.cjs',
        'observable.js',
        'observable.mjs',
        'observable.ts',
      ],
      name: 'mobx',
    },
    {
      fileExtensions: [
        'mocha.cjs',
        'mocha.js',
        'mocha.json',
        'mocha.mjs',
        'mocha.ts',
        'mocha.yaml',
        'mocha.yml',
        'mocharc',
        'mocharc.js',
        'mocharc.json',
      ],
      fileNames: ['mocha.opts'],
      name: 'mocha',
    },
    {
      fileExtensions: [
        'mocks/cjs',
        'mocks/cs',
        'mocks/dart',
        'mocks/go',
        'mocks/java',
        'mocks/js',
        'mocks/json',
        'mocks/mjs',
        'mocks/php',
        'mocks/pl',
        'mocks/py',
        'mocks/rb',
        'mocks/swift',
        'mocks/ts',

        'mock.cjs',
        'mock.cs',
        'mock.dart',
        'mock.go',
        'mock.java',
        'mock.js',
        'mock.json',
        'mock.mjs',
        'mock.php',
        'mock.pl',
        'mock.py',
        'mock.rb',
        'mock.swift',
        'mock.ts',

        'spy',
        'spy.cjs',
        'spy.cs',
        'spy.dart',
        'spy.go',
        'spy.java',
        'spy.js',
        'spy.json',
        'spy.mjs',
        'spy.php',
        'spy.pl',
        'spy.py',
        'spy.rb',
        'spy.swift',
        'spy.ts',

        'stub.cjs',
        'stub.cs',
        'stub.dart',
        'stub.go',
        'stub.java',
        'stub.js',
        'stub.json',
        'stub.mjs',
        'stub.php',
        'stub.pl',
        'stub.py',
        'stub.rb',
        'stub.swift',
        'stub.ts',
      ],
      name: 'mock',
    },
    {
      fileExtensions: ['mo', 'mos'],
      name: 'modelica',
    },
    {
      fileExtensions: [
        'modernizrrc',
        'modernizrrc.cjs',
        'modernizrrc.js',
        'modernizrrc.json',
        'modernizrrc.mjs',
        'modernizrrc.ts',
      ],
      fileNames: [
        'modernizr-dev.cjs',
        'modernizr-dev.js',
        'modernizr-dev.mjs',
        'modernizr-dev.ts',
        'modernizr.cjs',
        'modernizr.custom.cjs',
        'modernizr.custom.js',
        'modernizr.custom.mjs',
        'modernizr.custom.ts',
        'modernizr.js',
        'modernizr.json',
        'modernizr.mjs',
        'modernizr.ts',
      ],
      name: 'modernizr',
    },
    {
      fileNames: [
        'web-dev-server.config.cjs',
        'web-dev-server.config.js',
        'web-dev-server.config.mjs',
        'web-dev-server.config.ts',
        'web-test-runner.config.cjs',
        'web-test-runner.config.js',
        'web-test-runner.config.mjs',
        'web-test-runner.config.ts',
      ],
      name: 'modernweb',
    },
    {
      fileExtensions: ['lxo', 'modo'],
      name: 'modo',
    },
    {
      fileExtensions: ['def', 'mod'],
      name: 'modula2',
    },
    {
      fileExtensions: ['i3', 'ig', 'm3', 'mg'],
      fileNames: ['m3config', 'm3makefile', 'm3overrides'],
      name: 'modula3',
    },
    {
      fileExtensions: ['moho', 'mohoaction', 'mohobrush', 'mohoexport', 'mohoproj', 'mohostyle'],
      name: 'moho',
    },
    {
      fileExtensions: ['ep', 'epl'],
      name: 'mojolicious',
    },
    {
      fileNames: [
        'moleculer.config.cjs',
        'moleculer.config.js',
        'moleculer.config.json',
        'moleculer.config.mjs',
        'moleculer.config.ts',
      ],
      name: 'moleculer',
    },
    {
      fileNames: [
        'moment-with-locales.cjs',
        'moment-with-locales.js',
        'moment-with-locales.mjs',
        'moment.cjs',
        'moment.js',
        'moment.min.cjs',
        'moment.min.js',
        'moment.min.mjs',
        'moment.mjs',
      ],
      name: 'moment',
    },
    {
      fileExtensions: ['monkey'],
      name: 'monkey',
    },
    {
      fileExtensions: ['bson', 'mongo', 'mongodb'],
      name: 'mongodb',
    },
    {
      fileExtensions: ['monotone', 'mtn', 'mtn-ignore'],
      name: 'monotone',
    },
    {
      fileExtensions: ['moon'],
      name: 'moonscript',
    },
    {
      fileNames: [
        'mootools-core.cjs',
        'mootools-core.js',
        'mootools-core.mjs',
        'mootools-nocompat.cjs',
        'mootools-nocompat.js',
        'mootools-nocompat.min.js',
        'mootools-nocompat.mjs',
        'mootools.cjs',
        'mootools.js',
        'mootools.min.js',
        'mootools.mjs',
      ],
      name: 'mootools',
    },
    {
      fileExtensions: ['more', 'msg', 'utf8'],
      name: 'more',
    },
    {
      fileExtensions: ['mrb'],
      name: 'mruby',
    },
    {
      fileExtensions: ['chk', 'com', 'dos', 'ful'],
      name: 'msdos',
    },
    {
      fileExtensions: ['mson'],
      name: 'mson',
    },
    {
      fileExtensions: ['ldf', 'mdf', 'ndf'],
      name: 'msql',
    },
    {
      fileExtensions: ['mnb', 'mu', 'mup', 'mupad', 'mupadnotebook'],
      name: 'mupad',
    },
    {
      fileExtensions: ['emblem', 'hamlbars', 'handlebars', 'hbs', 'mustache', 'stache'],
      name: 'mustache',
    },
    {
      fileExtensions: ['mxml'],
      name: 'mxml',
    },
    {
      fileNames: ['mybatis-config.xml', 'mybatis.xml'],
      name: 'mybatis',
    },

    // endregion

    // region [N]
    {
      fileExtensions: ['n64'],
      name: 'n64',
    },
    {
      fileExtensions: ['build'],
      name: 'nant',
    },
    {
      fileExtensions: ['nano', 'nanorc'],
      name: 'nano',
    },
    {
      fileExtensions: ['nasm'],
      name: 'nasm',
    },
    {
      fileExtensions: [
        'ncurc',
        'ncurc.cjs',
        'ncurc.js',
        'ncurc.json',
        'ncurc.mjs',
        'ncurc.ts',
        'ncurc.yaml',
        'ncurc.yml',
      ],
      name: 'ncu',
    },
    {
      fileExtensions: ['ndproj'],
      name: 'ndepend',
    },
    {
      fileExtensions: ['ne'],
      name: 'nearley',
    },
    {
      fileExtensions: ['n', 'neko'],
      name: 'neko',
    },
    {
      fileExtensions: ['cyp', 'cypher'],
      name: 'neo4j',
    },
    {
      fileExtensions: ['neon'],
      light: true,
      name: 'neon',
    },
    {
      fileExtensions: ['nasl'],
      name: 'nessus',
    },
    {
      fileNames: ['egg.json', 'egg.yaml', 'egg.yml'],
      name: 'nestland',
    },
    {
      fileExtensions: ['nest-cli.json'],
      fileNames: ['nest-cli.json'],
      name: 'nest',
    },
    {
      fileExtensions: ['nestconfig.json'],
      fileNames: ['nestconfig.json'],
      name: 'nestconfig',
    },
    {
      enabledFor: [IconPack.Nest],
      fileExtensions: ['adapter.ts', 'adapter.js'],
      name: 'nestadapter',
    },
    {
      enabledFor: [IconPack.Nest],
      fileExtensions: ['controller.ts', 'controller.js'],
      name: 'nestcontroller',
    },
    {
      enabledFor: [IconPack.Nest],
      fileExtensions: ['decorator.ts', 'decorator.js'],
      name: 'nestdecorator',
    },
    {
      enabledFor: [IconPack.Nest],
      fileExtensions: ['dto.ts', 'dto.js'],
      name: 'nestdto',
    },
    {
      enabledFor: [IconPack.Nest],
      fileExtensions: ['filter.ts', 'filter.js'],
      name: 'nestfilter',
    },
    {
      enabledFor: [IconPack.Nest],
      fileExtensions: ['gateway.ts', 'gateway.js'],
      name: 'nestgateway',
    },
    {
      enabledFor: [IconPack.Nest],
      fileExtensions: ['guard.ts', 'guard.js'],
      name: 'nestguard',
    },
    {
      enabledFor: [IconPack.Nest],
      fileExtensions: ['interceptor.ts', 'interceptor.js'],
      name: 'nestinterceptor',
    },
    {
      enabledFor: [IconPack.Nest],
      fileExtensions: ['middleware.ts', 'middleware.js'],
      name: 'nestmiddleware',
    },
    {
      enabledFor: [IconPack.Nest],
      fileExtensions: ['module.ts', 'module.js'],
      name: 'nestmodule',
    },
    {
      enabledFor: [IconPack.Nest],
      fileExtensions: ['pipe.ts', 'pipe.js'],
      name: 'nestpipe',
    },
    {
      enabledFor: [IconPack.Nest],
      fileExtensions: ['provider.ts', 'provider.js'],
      name: 'nestprovider',
    },
    {
      enabledFor: [IconPack.Nest],
      fileExtensions: ['schema.ts', 'schema.js'],
      name: 'nestschema',
    },
    {
      enabledFor: [IconPack.Nest],
      fileExtensions: ['repository.ts', 'repository.js'],
      name: 'nestrepository',
    },
    {
      enabledFor: [IconPack.Nest],
      fileExtensions: ['service.ts', 'service.js'],
      name: 'nestservice',
    },
    {
      enabledFor: [IconPack.Nest],
      fileExtensions: ['strategy.ts', 'strategy.js'],
      name: 'neststrategy',
    },
    {
      fileNames: ['netlify.toml'],
      name: 'netlify',
    },
    {
      fileNames: ['_headers'],
      name: 'netlify_headers',
    },
    {
      fileNames: ['_redirects'],
      name: 'netlify_redirects',
    },
    {
      fileExtensions: ['axi', 'axs', 'axb'],
      name: 'netlinx',
    },
    {
      fileExtensions: ['nlogo', 'nls'],
      name: 'netlogo',
    },
    {
      fileNames: ['newrelic.yml', 'newrelic.yaml'],
      name: 'newrelic',
    },
    {
      fileExtensions: ['nextflow', 'nf'],
      name: 'nextflow',
    },
    {
      fileNames: ['nextflow.config.cjs', 'nextflow.config.js', 'nextflow.config.ts', 'nextflow.config.mjs'],
      name: 'nextflowconfig',
    },
    {
      fileNames: ['next.config.cjs', 'next.config.js', 'next.config.mjs', 'next.config.ts'],
      name: 'nextjs',
    },
    {
      enabledFor: [IconPack.Ngrx],
      fileExtensions: [
        'action.js',
        'action.jsx',
        'action.ts',
        'action.tsx',
        'actions.js',
        'actions.jsx',
        'actions.ts',
        'actions.tsx',
        'actions/cjs',
        'actions/js',
        'actions/jsx',
        'actions/mjs',
        'actions/ts',
        'actions/tsx',
      ],
      fileNames: [
        'action.js',
        'action.jsx',
        'action.ts',
        'action.tsx',
        'actions.js',
        'actions.jsx',
        'actions.ts',
        'actions.tsx',
      ],
      name: 'ngrx-actions',
    },
    {
      enabledFor: [IconPack.Ngrx],
      fileExtensions: [
        'effect.js',
        'effect.jsx',
        'effect.ts',
        'effect.tsx',
        'effects.js',
        'effects.jsx',
        'effects.ts',
        'effects.tsx',
        'effects/cjs',
        'effects/js',
        'effects/jsx',
        'effects/mjs',
        'effects/ts',
        'effects/tsx',
      ],
      fileNames: [
        'effect.js',
        'effect.jsx',
        'effect.ts',
        'effect.tsx',
        'effects.js',
        'effects.jsx',
        'effects.ts',
        'effects.tsx',
      ],
      name: 'ngrx-effects',
    },
    {
      enabledFor: [IconPack.Ngrx],
      fileExtensions: [
        'entities.js',
        'entities.jsx',
        'entities.ts',
        'entities.tsx',
        'entities/cjs',
        'entities/js',
        'entities/jsx',
        'entities/mjs',
        'entities/ts',
        'entities/tsx',
        'entity.js',
        'entity.jsx',
        'entity.ts',
        'entity.tsx',
        'entity/cjs',
        'entity/js',
        'entity/jsx',
        'entity/mjs',
        'entity/ts',
        'entity/tsx',
      ],
      fileNames: [
        'entities.js',
        'entities.jsx',
        'entities.ts',
        'entities.tsx',
        'entity.js',
        'entity.jsx',
        'entity.ts',
        'entity.tsx',
      ],
      name: 'ngrx-entities',
    },
    {
      enabledFor: [IconPack.Ngrx],
      fileExtensions: [
        'reducer.js',
        'reducer.jsx',
        'reducer.ts',
        'reducer.tsx',
        'reducers.js',
        'reducers.jsx',
        'reducers.ts',
        'reducers.tsx',
        'reducers/cjs',
        'reducers/js',
        'reducers/jsx',
        'reducers/mjs',
        'reducers/ts',
        'reducers/tsx',
      ],
      fileNames: [
        'reducer.js',
        'reducer.jsx',
        'reducer.ts',
        'reducer.tsx',
        'reducers.js',
        'reducers.jsx',
        'reducers.ts',
        'reducers.tsx',
      ],
      name: 'ngrx-reducers',
    },
    {
      enabledFor: [IconPack.Ngrx],
      fileExtensions: [
        'repo.js',
        'repo.jsx',
        'repo.ts',
        'repo.tsx',
        'repos.js',
        'repos.jsx',
        'repos.ts',
        'repos.tsx',
        'repos/cjs',
        'repos/js',
        'repos/jsx',
        'repos/mjs',
        'repos/ts',
        'repos/tsx',
        'repositories.js',
        'repositories.jsx',
        'repositories.ts',
        'repositories.tsx',
        'repositories/cjs',
        'repositories/js',
        'repositories/jsx',
        'repositories/mjs',
        'repositories/ts',
        'repositories/tsx',
        'repository.js',
        'repository.jsx',
        'repository.ts',
        'repository.tsx',
      ],
      fileNames: [
        'repo.js',
        'repo.jsx',
        'repo.ts',
        'repo.tsx',
        'repos.js',
        'repos.jsx',
        'repos.ts',
        'repos.tsx',
        'repositories.js',
        'repositories.jsx',
        'repositories.ts',
        'repositories.tsx',
        'repository.js',
        'repository.jsx',
        'repository.ts',
        'repository.tsx',
      ],
      name: 'ngrx-repo',
    },
    {
      enabledFor: [IconPack.Ngrx],
      fileExtensions: [
        'state.js',
        'state.jsx',
        'state.ts',
        'state.tsx',
        'state/cjs',
        'state/js',
        'state/jsx',
        'state/mjs',
        'state/ts',
        'state/tsx',
        'states.js',
        'states.jsx',
        'states.ts',
        'states.tsx',
        'states/cjs',
        'states/js',
        'states/jsx',
        'states/mjs',
        'states/ts',
        'states/tsx',
      ],
      fileNames: [
        'state.js',
        'state.jsx',
        'state.ts',
        'state.tsx',
        'states.js',
        'states.jsx',
        'states.ts',
        'states.tsx',
      ],
      name: 'ngrx-state',
    },
    {
      enabledFor: [IconPack.Ngrx],
      fileExtensions: [
        'selector.js',
        'selector.jsx',
        'selector.ts',
        'selector.tsx',
        'selectors.js',
        'selectors.jsx',
        'selectors.ts',
        'selectors.tsx',
        'selectors/cjs',
        'selectors/js',
        'selectors/jsx',
        'selectors/mjs',
        'selectors/ts',
        'selectors/tsx',
      ],
      fileNames: [
        'selector.js',
        'selector.jsx',
        'selector.ts',
        'selector.tsx',
        'selectors.js',
        'selectors.jsx',
        'selectors.ts',
        'selectors.tsx',
      ],
      name: 'ngrx-selectors',
    },
    {
      fileExtensions: ['nib'],
      name: 'nib',
    },
    {
      fileExtensions: ['5c'],
      name: 'nickle',
    },
    {
      fileNames: [
        'nightwatch.conf.cjs',
        'nightwatch.conf.js',
        'nightwatch.conf.mjs',
        'nightwatch.config.cjs',
        'nightwatch.config.js',
        'nightwatch.config.mjs',
        'nightwatch.json',
      ],
      name: 'nightwatch',
    },
    {
      fileExtensions: ['nimble'],
      name: 'nimble',
    },
    {
      fileExtensions: ['nim', 'nimrod'],
      name: 'nimrod',
    },
    {
      fileExtensions: ['nit'],
      name: 'nit',
    },
    {
      fileExtensions: ['ninja', 'ninja.d'],
      name: 'shuriken',
    },
    {
      fileExtensions: ['nix'],
      name: 'nix',
    },
    {
      fileExtensions: ['nmap', 'nse'],
      name: 'nmap',
    },
    {
      fileExtensions: ['noc'],
      name: 'noc',
    },
    {
      fileNames: [
        'app.cjs',
        'app.js',
        'app.mjs',
        'app.ts',
        'main.cjs',
        'main.js',
        'main.mjs',
        'main.ts',
        'server.cjs',
        'server.js',
        'server.mjs',
        'server.ts',
      ],
      name: 'nodejs',
    },
    {
      fileExtensions: ['njs', 'node', 'node-version'],
      name: 'nodeversion',
    },
    {
      fileExtensions: ['nodemon.json'],
      fileNames: ['nodemon.json'],
      name: 'nodemon',
    },
    {
      fileExtensions: ['nodemonignore'],
      name: 'nodemonignore',
    },
    {
      fileExtensions: ['nokogiri', 'nokogirirc'],
      name: 'nokogiri',
    },
    {
      fileExtensions: ['nomad'],
      name: 'nomad',
    },
    {
      fileExtensions: ['noon'],
      name: 'noon',
    },
    {
      fileNames: [
        'normalize-min.css',
        'normalize-min.less',
        'normalize-min.postcss',
        'normalize-min.sass',
        'normalize-min.scss',
        'normalize-min.styl',
        'normalize-min.stylus',
        'normalize.css',
        'normalize.less',
        'normalize.postcss',
        'normalize.sass',
        'normalize.scss',
        'normalize.styl',
        'normalize.stylus',
      ],
      name: 'normalize',
    },
    {
      fileExtensions: ['note', 'notes', 'scratch'],
      name: 'note',
    },
    {
      fileNames: ['now.json'],
      name: 'now',
    },
    {
      fileExtensions: ['nowignore'],
      name: 'nowignore',
    },
    {
      fileExtensions: ['npmrc'],
      fileNames: ['package.json'],
      name: 'npm',
    },
    {
      fileExtensions: ['npmignore'],
      name: 'npmignore',
    },
    {
      fileNames: ['package-lock.json'],
      name: 'npmlock',
    },
    {
      fileNames: ['npm-shrinkwrap.json'],
      name: 'npmshrinkwrap',
    },
    {
      fileExtensions: ['nsh', 'nsi', 'nsis'],
      name: 'nsis',
    },
    {
      fileExtensions: [
        'integrity.config.cjs',
        'integrity.config.js',
        'integrity.config.mjs',
        'integrity.config.yaml',
        'integrity.config.yml',
        'integrity.json',
        'integrityrc',
        'nsrirc',
        'nsrirc.config.cjs',
        'nsrirc.config.js',
        'nsrirc.config.mjs',
        'nsrirc.config.yaml',
        'nsrirc.config.yml',
        'nsrirc.json',
      ],
      name: 'nsri',
    },
    {
      fileExtensions: ['nsriignore'],
      name: 'nsriignore',
    },
    {
      fileExtensions: ['nu'],
      fileNames: ['Nukefile'],
      name: 'nu',
    },
    {
      fileExtensions: ['npy', 'npz', 'numpy', 'numpyw', 'numsc'],
      name: 'numpy',
    },
    {
      fileExtensions: ['nuclide', 'nuc'],
      name: 'nuclide',
    },
    {
      fileExtensions: ['nupkg', 'nuspec', 'psmdcp', 'snupkg'],
      name: 'nuget',
    },
    {
      fileNames: ['nuget.config'],
      name: 'nugetconfig',
    },
    {
      fileExtensions: ['njk', 'nunj', 'nunjucks'],
      name: 'nunjucks',
    },
    {
      fileNames: ['nuxt.config.cjs', 'nuxt.config.js', 'nuxt.config.mjs', 'nuxt.config.ts'],
      name: 'nuxt',
    },
    {
      fileExtensions: ['esmrc', 'nvmrc'],
      fileNames: ['esmrc', 'nvmrc'],
      name: 'nvm',
    },
    {
      fileExtensions: ['ncs', 'ndb', 'nss'],
      name: 'nwscript',
    },
    {
      fileNames: ['nx.json', 'project.json', 'workspace.json'],
      light: true,
      name: 'nx',
    },
    {
      fileExtensions: ['nxc'],
      name: 'nxc',
    },

    // endregion [N]

    // region [O]
    {
      fileExtensions: ['ob', 'ob2'],
      name: 'oberon',
    },
    {
      fileExtensions: ['mm', 'm'],
      name: 'objc',
    },
    {
      fileExtensions: ['j', 'sj'],
      name: 'objj',
    },
    {
      fileExtensions: ['ml', 'ml4', 'mli', 'mll', 'mly', 'ocaml', 'ocamllex', 'ocamlyacc'],
      name: 'ocaml',
    },
    {
      fileExtensions: ['octave', 'octave_hist', 'octaverc'],
      name: 'octave',
    },
    {
      fileExtensions: ['odin'],
      name: 'odin',
    },
    {
      fileExtensions: ['o3', 'ogone'],
      name: 'ogone',
    },
    {
      fileExtensions: ['gdiagramstyle', 'graffle', 'gstencil', 'gtemplate'],
      name: 'omnigraffle',
    },
    {
      fileExtensions: ['one', 'onenote'],
      name: 'onenote',
    },
    {
      fileExtensions: ['ooc'],
      name: 'ooc',
    },
    {
      fileExtensions: ['opa'],
      name: 'opa',
    },
    {
      fileExtensions: ['opam'],
      name: 'opam',
    },
    {
      fileNames: ['openapi.json', 'openapi.yml', 'openapi.yaml'],
      name: 'openapi',
    },
    {
      fileExtensions: ['bsd', 'openbsd'],
      name: 'openbsd',
    },
    {
      fileExtensions: ['opencl'],
      name: 'opencl',
    },
    {
      fileExtensions: ['abl', 'p'],
      name: 'progress',
    },
    {
      fileExtensions: ['exr'],
      name: 'openexr',
    },
    {
      fileExtensions: ['glsl', 'glslv', 'gsh', 'gshader'],
      name: 'opengl',
    },
    {
      fileExtensions: ['vert', 'vertex', 'vrx', 'vsh', 'vshader'],
      name: 'vertex',
    },
    {
      fileExtensions: ['fp', 'fra', 'frag', 'fsh', 'fshader'],
      name: 'shader',
    },
    {
      fileExtensions: ['things'],
      name: 'openhab',
    },
    {
      fileExtensions: ['p5i'],
      name: 'openindiana',
    },
    {
      fileExtensions: ['fodg', 'fodp', 'fods', 'fodt', 'odb', 'odf', 'odg', 'odp', 'ods', 'otg', 'otp', 'ots', 'ott'],
      name: 'openoffice',
    },
    {
      fileExtensions: ['rego'],
      name: 'openpolicy',
    },
    {
      fileExtensions: ['scad', 'jscad'],
      name: 'openscad',
    },
    {
      fileExtensions: ['aki', 'ami', 'ari', 'ova', 'ovf'],
      name: 'openstack',
    },
    {
      fileExtensions: ['opensolaris', 'solaris'],
      name: 'opensolaris',
    },
    {
      fileExtensions: ['hlb', 'cld'],
      name: 'openvms',
    },
    {
      fileExtensions: ['ovpn'],
      name: 'openvpn',
    },
    {
      fileNames: ['vdev1', 'vdev2001'],
      name: 'openzfs',
    },
    {
      fileExtensions: ['org'],
      name: 'orgmode',
    },
    {
      fileExtensions: ['pck', 'pkb', 'pkh', 'plb', 'pls', 'plsql'],
      name: 'oracle',
    },
    {
      fileExtensions: ['dmg'],
      name: 'finder',
    },
    {
      fileExtensions: ['bcmx', 'nk2', 'oab', 'oft', 'otm', 'pst'],
      name: 'outlook',
    },
    {
      fileExtensions: ['oxygene'],
      name: 'oxygene',
    },
    {
      fileExtensions: ['oz'],
      name: 'oz',
    },

    // endregion

    // region [P]
    {
      fileNames: ['paket.dependencies', 'paket.local', 'paket.lock', 'paket.references', 'paket.template'],
      name: 'paket',
    },
    {
      fileExtensions: ['pan'],
      name: 'pan',
    },
    {
      fileExtensions: ['pex', 'psc'],
      name: 'papyrus',
    },
    {
      fileExtensions: ['parcel', 'parcelrc'],
      name: 'parcel',
    },
    {
      fileExtensions: ['parrot', 'pasm', 'pbc', 'pir'],
      name: 'parrot',
    },
    {
      fileExtensions: ['parquet', 'parq'],
      name: 'parquet',
    },
    {
      fileExtensions: ['lfm', 'lpi', 'lpk', 'lpr', 'lps', 'lrs', 'lrt', 'or', 'pas', 'pascal', 'ppu'],
      name: 'pascal',
    },
    {
      fileExtensions: ['meld', 'patch'],
      name: 'patch',
    },
    {
      fileNames: ['patreon', 'patreon.md', 'patreon.txt', 'patrons', 'patrons.md', 'patrons.txt'],
      name: 'patreon',
    },
    {
      fileExtensions: ['amx', 'fen', 'pawn', 'pgn', 'pwn'],
      name: 'pawn',
    },
    {
      fileExtensions: ['pcd'],
      name: 'pcd',
    },
    {
      fileExtensions: ['happenings', 'pddl', 'plan'],
      name: 'pddl',
    },
    {
      fileExtensions: ['pdf'],
      name: 'pdf',
    },
    {
      fileExtensions: ['pegjs', 'peg', 'pegcoffee', 'peggy'],
      name: 'pegjs',
    },
    {
      fileExtensions: ['percy', 'percy.js', 'percy.json', 'percy.yaml', 'percy.yml', 'percyrc'],
      name: 'percy',
    },
    {
      fileNames: [
        'perl-config.json',
        'perl5-config.json',
        'perl5config.json',
        'perl6-config.json',
        'perl6config.json',
        'perlconfig.json',
      ],
      name: 'perlconfig',
    },
    {
      fileExtensions: ['p4', 'p4config', 'p4include', 'p4info'],
      name: 'helix',
    },
    {
      fileExtensions: ['p4ignore'],
      name: 'helixignore',
    },
    {
      enabledFor: [IconPack.Phalcon],
      fileExtensions: ['phalcon', 'volt'],
      light: true,
      name: 'phalcon',
    },
    {
      fileExtensions: ['photorec.cfg'],
      name: 'photorec',
    },
    {
      fileExtensions: ['engine', 'phar', 'php2', 'php3', 'php4', 'php5', 'php6', 'php7', 'php8', 'php9'],
      name: 'php2',
    },
    {
      fileExtensions: ['php_cs'],
      fileNames: ['phpcs.xml', 'phpcs.xml.dist'],
      name: 'phpcs',
    },
    {
      fileNames: ['phpunit.xml', 'phpunit.xml.dist'],
      name: 'phpunit',
    },
    {
      fileExtensions: ['phtml'],
      name: 'phtml',
    },
    {
      fileNames: [
        'phoenix.cjs',
        'phoenix.esm.js',
        'phoenix.esm.min.js',
        'phoenix.ex',
        'phoenix.js',
        'phoenix.min.js',
        'phoenix.mjs',
      ],
      name: 'phoenix',
    },
    {
      fileExtensions: ['phrase.yaml', 'phrase.yml', 'phraseapp.yaml', 'phraseapp.yml'],
      name: 'phraseapp',
    },
    {
      fileExtensions: ['pickle', 'pkl'],
      name: 'pickle',
    },
    {
      fileExtensions: ['p8', 'pico8'],
      name: 'pico8',
    },
    {
      fileExtensions: ['l'],
      name: 'picolisp',
    },
    {
      fileExtensions: ['pike', 'pmod'],
      name: 'pike',
    },
    {
      fileExtensions: ['pine', 'pinescript', 'pinecode', 'tdps', 'tradingview'],
      name: 'pinescript',
    },
    {
      fileExtensions: ['pipfile'],
      fileNames: ['pipfile'],
      name: 'pipfile',
    },
    {
      fileNames: ['pipfile.lock'],
      name: 'pipfilelock',
    },
    {
      fileExtensions: ['pipeline'],
      name: 'pipeline',
    },
    {
      fileNames: ['mk.conf'],
      name: 'pkgsrc',
    },
    {
      fileNames: ['platformio.ini'],
      name: 'platformio',
    },
    {
      fileExtensions: ['play'],
      name: 'play',
    },
    {
      fileNames: ['playwright.config.cjs', 'playwright.config.js', 'playwright.config.mjs', 'playwright.config.ts'],
      name: 'playwright',
    },
    {
      fileExtensions: ['plist'],
      name: 'plist',
    },
    {
      fileNames: ['plopfile.js', 'plopfile.ts', 'plopfile.cjs', 'plopfile.mjs'],
      name: 'plopfile',
    },
    {
      fileNames: [
        'ecosystem.conf.cjs',
        'ecosystem.conf.ini',
        'ecosystem.conf.js',
        'ecosystem.conf.json',
        'ecosystem.conf.mjs',
        'ecosystem.conf.ts',
        'ecosystem.conf.yaml',
        'ecosystem.conf.yml',
        'ecosystem.config.cjs',
        'ecosystem.config.ini',
        'ecosystem.config.js',
        'ecosystem.config.json',
        'ecosystem.config.mjs',
        'ecosystem.config.ts',
        'ecosystem.config.yaml',
        'ecosystem.config.yml',
      ],
      name: 'pm2',
    },
    {
      fileNames: ['pnpm-debug.yaml', 'pnpm-lock.yaml', 'pnpm-workspace.yaml'],
      name: 'pnpm',
    },
    {
      fileNames: ['pnpmfile.cjs', 'pnpmfile.js', 'pnpmfile.mjs', 'pnpmfile.ts'],
      name: 'pnpmfile',
    },
    {
      fileExtensions: ['nqp', 'p6l', 'p6m', 'pod', 'pod6'],
      name: 'pod',
    },
    {
      fileNames: ['poetry.lock', 'pyproject.toml'],
      name: 'poetry',
    },
    {
      fileExtensions: ['pogo'],
      name: 'pogoscript',
    },
    {
      fileExtensions: ['polymer'],
      fileNames: ['polymer.json'],
      name: 'polymer',
    },
    {
      fileExtensions: ['pony'],
      name: 'pony',
    },
    {
      fileExtensions: ['pgsql'],
      name: 'pgsql',
    },
    {
      fileExtensions: [
        'pcss',
        'postcss',
        'postcssrc',
        'postcssrc.cjs',
        'postcssrc.js',
        'postcssrc.json',
        'postcssrc.mjs',
        'postcssrc.ts',
        'postcssrc.yaml',
        'postcssrc.yml',
      ],
      fileNames: [
        'postcss.config.cjs',
        'postcss.config.js',
        'postcss.config.json',
        'postcss.config.mjs',
        'postcss.config.ts',
        'postcss.config.yaml',
        'postcss.config.yml',
        'postcssrc.config.cjs',
        'postcssrc.config.js',
        'postcssrc.config.json',
        'postcssrc.config.mjs',
        'postcssrc.config.ts',
        'postcssrc.config.yaml',
        'postcssrc.config.yml',
      ],
      name: 'postcss',
    },
    {
      fileExtensions: [
        'posthtml',
        'posthtmlrc',
        'posthtmlrc.cjs',
        'posthtmlrc.js',
        'posthtmlrc.json',
        'posthtmlrc.mjs',
        'posthtmlrc.ts',
        'posthtmlrc.yaml',
        'posthtmlrc.yml',
      ],
      fileNames: [
        'posthtml.config.cjs',
        'posthtml.config.js',
        'posthtml.config.json',
        'posthtml.config.mjs',
        'posthtml.config.ts',
        'posthtml.config.yaml',
        'posthtml.config.yml',
      ],
      name: 'posthtml',
    },
    {
      fileExtensions: ['afm', 'amm', 'bez', 'eps', 'epsf', 'epsi', 'gsf', 'ps'],
      name: 'postscript',
    },
    {
      fileExtensions: ['pov', 'povray'],
      name: 'povray',
    },
    {
      fileExtensions: ['pbl', 'pbm', 'pbr', 'pbs', 'pbt', 'pbw', 'sra', 'srj', 'srp', 'sru', 'srw'],
      name: 'powerbuilder',
    },
    {
      fileExtensions: ['potm', 'potx', 'ppa', 'ppam', 'pps', 'ppsm', 'ppsx', 'ppt', 'pptm', 'pptx', 'sldm', 'sldx'],
      name: 'powerpoint',
    },
    {
      fileExtensions: ['cmd', 'powershell', 'ps1', 'ps1xml', 'psc1', 'psd1', 'psm1', 'psrc', 'pssc'],
      name: 'powershell',
    },
    {
      fileExtensions: [
        'pre-commit-config.yaml',
        'pre-commit-config.yml',
        'pre-commit-hooks.yaml',
        'pre-commit-hooks.yml',
        'pre-commit.yaml',
        'pre-commit.yml',
      ],
      name: 'precommit',
    },
    {
      fileNames: ['preact.config.cjs', 'preact.config.js', 'preact.config.mjs', 'preact.config.ts'],
      name: 'preact',
    },
    {
      fileExtensions: [
        'prettierrc',
        'prettierrc.js',
        'prettierrc.json',
        'prettierrc.toml',
        'prettierrc.yaml',
        'prettierrc.yml',
      ],
      name: 'prettier',
    },
    {
      fileNames: ['prettier.config.cjs', 'prettier.config.js', 'prettier.config.mjs', 'prettier.config.ts'],
      name: 'prettierconfig',
    },
    {
      fileExtensions: ['prettierignore'],
      name: 'prettierignore',
    },
    {
      fileNames: ['prisma.yml', 'prisma.yaml'],
      name: 'prismaconfig',
    },
    {
      fileExtensions: ['prisma'],
      name: 'prisma',
    },
    {
      fileExtensions: ['pde'],
      name: 'processing',
    },
    {
      fileExtensions: ['mpp', 'mpt'],
      name: 'project',
    },
    {
      fileExtensions: ['pro', 'prolog', 'yap'],
      name: 'prolog',
    },
    {
      fileExtensions: ['rules', 'rules.yml', 'rules.yaml'],
      name: 'prometheus',
    },
    {
      fileExtensions: ['spin'],
      name: 'propeller',
    },
    {
      fileExtensions: ['prop', 'properties', 'props'],
      name: 'source',
    },
    {
      fileExtensions: ['pros'],
      name: 'pros',
    },
    {
      fileExtensions: ['proselintrc'],
      name: 'proselint',
    },
    {
      fileExtensions: ['proto', 'protobuf', 'protobuf3', 'protodevel'],
      name: 'protobuf',
    },
    {
      fileNames: [
        'protractor.conf.cjs',
        'protractor.conf.js',
        'protractor.conf.json',
        'protractor.conf.mjs',
        'protractor.conf.ts',
        'protractor.config.cjs',
        'protractor.config.js',
        'protractor.config.json',
        'protractor.config.mjs',
        'protractor.config.ts',
        'protractor.js',
        'protractor.json',
      ],
      name: 'protractor',
    },
    {
      fileNames: [
        'proxy.conf.cjs',
        'proxy.conf.js',
        'proxy.conf.json',
        'proxy.conf.mjs',
        'proxy.conf.ts',
        'proxy.config.cjs',
        'proxy.config.js',
        'proxy.config.json',
        'proxy.config.mjs',
        'proxy.config.ts',
      ],
      name: 'proxy',
    },
    {
      fileExtensions: ['publi', 'publicodes'],
      fileNames: ['publi.yml', 'publi.yaml', 'publicodes.yml', 'publicodes.yaml', 'publiccode.yml', 'publiccode.yaml'],
      name: 'publiccode',
    },
    {
      fileExtensions: ['pub', 'puz'],
      name: 'publisher',
    },
    {
      fileExtensions: ['pullapprove.yml', 'pullapprove.yaml'],
      fileNames: ['pullapprove.yml', 'pullapprove.yaml'],
      name: 'pullapprove',
    },
    {
      fileExtensions: ['epp', 'pp', 'puppet'],
      name: 'puppet',
    },
    {
      fileExtensions: ['pure'],
      name: 'pure',
    },
    {
      fileExtensions: ['pb', 'pbi'],
      name: 'purebasic',
    },
    {
      fileExtensions: ['purescript', 'purs'],
      name: 'purescript',
    },
    {
      fileExtensions: ['pypirc', 'requirements'],
      fileNames: ['requirements.in', 'requirements.txt'],
      name: 'pypi',
    },
    {
      fileExtensions: ['arr'],
      name: 'pyret',
    },
    {
      fileNames: ['pytest.ini'],
      name: 'pytest',
    },
    {
      fileExtensions: ['py.typed', 'pypi', 'pytd', 'pytyped', 'typed'],
      name: 'pytyped',
    },
    {
      fileExtensions: ['coveragerc', 'pylintrc'],
      fileNames: ['manifest.in', 'python-config.json', 'pythonconfig.json'],
      name: 'pythonconfig',
    },
    {
      fileExtensions: ['py-version', 'python-version', 'pythonversion'],
      name: 'pythonversion',
    },
    {
      fileExtensions: ['pyup.yml', 'pyup.yaml'],
      name: 'pyup',
    },
    // endregion

    // region [Q]
    {
      fileExtensions: ['qs'],
      light: true,
      name: 'qsharp',
    },
    {
      fileExtensions: ['k', 'kdb', 'q', 'quke'],
      name: 'kx',
    },
    {
      fileExtensions: ['qasm', 'qiskit'],
      name: 'qiskit',
    },
    {
      fileExtensions: ['qvb', 'qvd', 'qvf', 'qvs', 'qvt', 'qvw', 'qvx'],
      name: 'qlikview',
    },
    {
      fileExtensions: ['qodana.yml', 'qodana.yaml'],
      fileNames: ['qodana.yml', 'qodana.yaml'],
      name: 'qodana',
    },
    {
      fileExtensions: ['qbs', 'qml', 'qmldir', 'qmlproject', 'qmltypes', 'qrc', 'qss'],
      name: 'qt',
    },
    {
      fileNames: ['quasar.conf.cjs', 'quasar.conf.js', 'quasar.conf.mjs', 'quasar.conf.ts'],
      name: 'quasar',
    },
    {
      fileExtensions: ['qtn'],
      name: 'quantum',
    },
    // endregion

    // region [R]
    {
      fileExtensions: ['r', 'rd', 'rhistory', 'rprofile', 'rsx'],
      name: 'r',
    },
    {
      fileExtensions: ['rmd', 'rmarkdown'],
      name: 'rmd',
    },
    {
      fileExtensions: ['rkt', 'rktd', 'rktl', 'scrbl'],
      name: 'racket',
    },
    {
      fileExtensions: ['raml'],
      name: 'raml',
    },
    {
      fileExtensions: ['rails'],
      fileNames: ['rails'],
      name: 'rails',
    },
    {
      fileExtensions: ['concern/rb', 'concerns/rb'],
      name: 'railsconcern',
    },
    {
      fileExtensions: ['controller/rb', 'controllers/rb'],
      name: 'railscontroller',
    },
    {
      fileNames: ['database.yml', 'database.yaml'],
      name: 'railsdb',
    },
    {
      fileExtensions: ['factory/rb', 'factories/rb'],
      name: 'railsfactory',
    },
    {
      fileExtensions: ['fixture/rb', 'fixtures/rb'],
      name: 'railsfixture',
    },
    {
      fileExtensions: ['helper/rb', 'helpers/rb'],
      name: 'railshelper',
    },
    {
      fileExtensions: ['job/rb', 'jobs/rb'],
      name: 'railsjob',
    },
    {
      fileExtensions: ['mailer/rb', 'mailers/rb'],
      name: 'railsmailer',
    },
    {
      fileNames: ['routes.rb'],
      name: 'railsroutes',
    },
    {
      fileExtensions: ['schema/rb', 'schemas/rb'],
      name: 'railsschema',
    },
    {
      fileExtensions: ['serializer/rb', 'serializers/rb'],
      name: 'railsserializer',
    },
    {
      fileExtensions: ['service/rb', 'services/rb'],
      name: 'railsservice',
    },
    {
      fileNames: ['seed.rb'],
      name: 'railsseed',
    },
    {
      fileExtensions: ['rake'],
      name: 'rake',
    },
    {
      fileNames: ['rakefile', 'rakefile.rb'],
      name: 'rakefile',
    },
    {
      fileExtensions: ['cshtml', 'vbhtml'],
      name: 'razor',
    },
    {
      fileNames: [
        'raphael-min.js',
        'raphael.js',
        'raphael.min.js',
        'raphael.no-deps.cjs',
        'raphael.no-deps.js',
        'raphael.no-deps.mjs',
      ],
      name: 'raphael',
    },
    {
      fileExtensions: ['rsc', 'rascal'],
      name: 'rascal',
    },
    {
      fileNames: [
        'razzle.config.cjs',
        'razzle.config.js',
        'razzle.config.mjs',
        'razzle.config.ts',
        'razzle.config.yaml',
        'razzle.config.yml',
      ],
      name: 'razzle',
    },
    {
      fileExtensions: ['rbs'],
      name: 'rbs',
    },
    {
      fileExtensions: ['rda', 'rdata', 'rds', 'rdx'],
      name: 'rdata',
    },
    {
      fileExtensions: ['rdoc'],
      name: 'rdoc',
    },
    {
      fileExtensions: ['readthedocs', 'readthedocs.yaml', 'readthedocs.yml'],
      name: 'readthedocs',
    },
    {
      enabledFor: [IconPack.Recoil],
      fileExtensions: [
        'atom.js',
        'atom.ts',
        'atoms.js',
        'atoms.ts',
        'atoms/js',
        'atoms/jsx',
        'atoms/ts',
        'atoms/tsx',
        'recoil/js',
        'recoil/jsx',
        'recoil/ts',
        'recoil/tsx',
        'selector.js',
        'selector.ts',
        'selectors.js',
        'selectors.ts',
      ],
      fileNames: [
        'atom.js',
        'atom.ts',
        'atoms.js',
        'atoms.ts',
        'selector.js',
        'selector.ts',
        'selectors.js',
        'selectors.ts',
      ],
      name: 'recoil',
    },
    {
      fileNames: [
        'remix.config.cjs',
        'remix.config.js',
        'remix.config.mjs',
        'remix.config.ts',
        'remix.config.yaml',
        'remix.config.yml',
      ],
      name: 'remix',
    },
    {
      fileExtensions: ['replit'],
      name: 'replit',
    },
    {
      fileExtensions: ['restql', 'rql'],
      name: 'restql',
    },
    {
      fileNames: ['restql.conf.json', 'restql.conf.yaml', 'restql.yaml', 'restql.yml'],
      name: 'restqlconf',
    },
    {
      fileExtensions: ['reactcli', 'react-cli'],
      name: 'reactcli',
    },
    {
      fileNames: ['react-min.js', 'react.cjs', 'react.js', 'react.min.js', 'react.mjs', 'react.production.min.js'],
      name: 'react',
    },
    {
      fileNames: ['reactos.deb', 'reactos.ios'],
      name: 'reactos',
    },
    {
      fileExtensions: ['re', 'rei'],
      name: 'reason',
    },
    {
      fileExtensions: ['reason', 'rns', 'rsn', 'rx2', 'sxt'],
      name: 'reasonstudios',
    },
    {
      fileExtensions: ['r2', 'r3', 'reb', 'rebol'],
      name: 'rebol',
    },
    {
      fileExtensions: ['rpm', 'rpmmacros', 'srpm'],
      name: 'redhat',
    },
    {
      fileExtensions: ['red', 'reds'],
      name: 'red',
    },
    {
      fileExtensions: ['rdb'],
      fileNames: ['redis.conf', 'redis-config.yml', 'redis-config.yaml'],
      name: 'redis',
    },
    {
      enabledFor: [IconPack.Redux],
      fileExtensions: [
        'action.js',
        'action.jsx',
        'action.ts',
        'action.tsx',
        'actions.js',
        'actions.jsx',
        'actions.ts',
        'actions.tsx',
        'actions/js',
        'actions/jsx',
        'actions/ts',
        'actions/tsx',
      ],
      fileNames: [
        'action.js',
        'action.jsx',
        'action.ts',
        'action.tsx',
        'actions.js',
        'actions.jsx',
        'actions.ts',
        'actions.tsx',
      ],
      name: 'redux-action',
    },
    {
      enabledFor: [IconPack.Redux],
      fileExtensions: [
        'epic.js',
        'epic.jsx',
        'epic.ts',
        'epic.tsx',
        'epics.js',
        'epics.jsx',
        'epics.ts',
        'epics.tsx',
        'epics/js',
        'epics/jsx',
        'epics/ts',
        'epics/tsx',
      ],
      fileNames: ['epic.js', 'epic.jsx', 'epic.ts', 'epic.tsx', 'epics.js', 'epics.jsx', 'epics.ts', 'epics.tsx'],
      name: 'redux-epic',
    },
    {
      enabledFor: [IconPack.Redux],
      fileExtensions: [
        'thunk.js',
        'thunk.jsx',
        'thunk.ts',
        'thunk.tsx',
        'thunks.js',
        'thunks.jsx',
        'thunks.ts',
        'thunks.tsx',
        'thunks/js',
        'thunks/jsx',
        'thunks/ts',
        'thunks/tsx',
      ],
      fileNames: [
        'thunk.js',
        'thunk.jsx',
        'thunk.ts',
        'thunk.tsx',
        'thunks.js',
        'thunks.jsx',
        'thunks.ts',
        'thunks.tsx',
      ],
      name: 'redux-thunk',
    },
    {
      enabledFor: [IconPack.Redux],
      fileExtensions: [
        'saga.js',
        'saga.jsx',
        'saga.ts',
        'saga.tsx',
        'saga/js',
        'saga/jsx',
        'saga/ts',
        'saga/tsx',
        'sagas.js',
        'sagas.jsx',
        'sagas.ts',
        'sagas.tsx',
        'sagas/js',
        'sagas/jsx',
        'sagas/ts',
        'sagas/tsx',
      ],
      fileNames: ['saga.js', 'saga.jsx', 'saga.ts', 'saga.tsx', 'sagas.js', 'sagas.jsx', 'sagas.ts', 'sagas.tsx'],
      name: 'redux-saga',
    },
    {
      enabledFor: [IconPack.Redux],
      fileExtensions: [
        'selector.js',
        'selector.jsx',
        'selector.ts',
        'selector.tsx',
        'selector/js',
        'selector/jsx',
        'selector/ts',
        'selector/tsx',
        'selectors.js',
        'selectors.jsx',
        'selectors.ts',
        'selectors.tsx',
        'selectors/js',
        'selectors/jsx',
        'selectors/ts',
        'selectors/tsx',
      ],
      fileNames: [
        'selector.js',
        'selector.jsx',
        'selector.ts',
        'selector.tsx',
        'selectors.js',
        'selectors.jsx',
        'selectors.ts',
        'selectors.tsx',
      ],
      name: 'redux-selector',
    },
    {
      enabledFor: [IconPack.Redux],
      fileExtensions: [
        'reducer.js',
        'reducer.jsx',
        'reducer.ts',
        'reducer.tsx',
        'reducer/js',
        'reducer/jsx',
        'reducer/ts',
        'reducer/tsx',
        'reducers.js',
        'reducers.jsx',
        'reducers.ts',
        'reducers.tsx',
        'reducers/js',
        'reducers/jsx',
        'reducers/ts',
        'reducers/tsx',
      ],
      fileNames: [
        'reducer.js',
        'reducer.jsx',
        'reducer.ts',
        'reducer.tsx',
        'reducers.js',
        'reducers.jsx',
        'reducers.ts',
        'reducers.tsx',
      ],
      name: 'redux-reducer',
    },
    {
      enabledFor: [IconPack.Redux],
      fileExtensions: [
        'slice.js',
        'slice.jsx',
        'slice.ts',
        'slice.tsx',
        'slice/js',
        'slice/jsx',
        'slice/ts',
        'slice/tsx',
        'slices.js',
        'slices.jsx',
        'slices.ts',
        'slices.tsx',
        'slices/js',
        'slices/jsx',
        'slices/ts',
        'slices/tsx',
      ],
      fileNames: [
        'slice.js',
        'slice.jsx',
        'slice.ts',
        'slice.tsx',
        'slices.js',
        'slices.jsx',
        'slices.ts',
        'slices.tsx',
      ],
      name: 'redux-slice',
    },
    {
      enabledFor: [IconPack.Redux],
      fileExtensions: [
        'store.js',
        'store.jsx',
        'store.ts',
        'store.tsx',
        'store/js',
        'store/jsx',
        'store/ts',
        'store/tsx',
        'stores.js',
        'stores.jsx',
        'stores.ts',
        'stores.tsx',
        'stores/js',
        'stores/jsx',
        'stores/ts',
        'stores/tsx',
      ],
      fileNames: [
        'store.js',
        'store.jsx',
        'store.ts',
        'store.tsx',
        'stores.js',
        'stores.jsx',
        'stores.ts',
        'stores.tsx',
      ],
      name: 'redux-store',
    },
    {
      fileExtensions: ['reek'],
      name: 'reek',
    },
    {
      fileExtensions: ['regex', 'regexp', 'rgx'],
      name: 'regex',
    },
    {
      fileExtensions: [
        'reh',
        'rehype',
        'rehyperc',
        'rehyperc.cjs',
        'rehyperc.js',
        'rehyperc.json',
        'rehyperc.mjs',
        'rehyperc.ts',
        'rehyperc.yaml',
        'rehyperc.yml',
      ],
      name: 'rehype',
    },
    {
      fileExtensions: ['rehypeignore'],
      name: 'rehypeignore',
    },
    {
      fileExtensions: [
        'remark',
        'remarkrc',
        'remarkrc.cjs',
        'remarkrc.js',
        'remarkrc.json',
        'remarkrc.mjs',
        'remarkrc.ts',
        'remarkrc.yaml',
        'remarkrc.yml',
      ],
      name: 'remark',
    },
    {
      fileExtensions: [
        'retext',
        'retextrc',
        'retextrc.cjs',
        'retextrc.js',
        'retextrc.json',
        'retextrc.mjs',
        'retextrc.ts',
        'retextrc.yaml',
        'retextrc.yml',
      ],
      name: 'retext',
    },
    {
      fileExtensions: ['retextignore'],
      name: 'retextignore',
    },
    {
      fileExtensions: ['remarkignore'],
      name: 'remarkignore',
    },
    {
      fileExtensions: ['renovaterc'],
      fileNames: ['renovate.json', 'renovate.json5', 'renovate.jsonc'],
      name: 'renovate',
    },
    {
      fileNames: ['require-dev.js', 'require.cjs', 'require.js', 'require.min.js', 'require.mjs'],
      name: 'requirejs',
    },
    {
      fileExtensions: ['res', 'resi'],
      name: 'rescript',
    },
    {
      fileExtensions: ['rst'],
      name: 'rst',
    },
    {
      fileExtensions: ['pprx', 'rex', 'rexx'],
      name: 'rexx',
    },
    {
      fileExtensions: ['3dmf', '3dmr', '3mf', '3mfz', '3mm', 'rvb'],
      name: 'rhino3d',
    },
    {
      fileNames: ['riemann.config'],
      name: 'riemann',
    },
    {
      fileExtensions: ['ring'],
      name: 'ring',
    },
    {
      fileExtensions: ['riot'],
      name: 'riot',
    },
    {
      fileExtensions: ['robot'],
      name: 'robot',
    },
    {
      fileNames: ['robots.txt', 'robots'],
      name: 'robots',
    },
    {
      fileNames: [
        'rollup.cjs',
        'rollup.conf.cjs',
        'rollup.conf.js',
        'rollup.conf.mjs',
        'rollup.conf.ts',
        'rollup.config.cjs',
        'rollup.config.js',
        'rollup.config.mjs',
        'rollup.config.ts',
        'rollup.js',
        'rollup.mjs',
        'rollup.ts',
      ],
      name: 'rollup',
    },
    {
      fileExtensions: ['rome', 'romeignore'],
      fileNames: ['rome.json'],
      name: 'rome',
    },
    {
      fileExtensions: [
        'router/js',
        'router/jsx',
        'router/ts',
        'router/tsx',
        'routes/js',
        'routes/jsx',
        'routes/ts',
        'routes/tsx',
        'routing/js',
        'routing/jsx',
        'routing/ts',
        'routing/tsx',
      ],
      fileNames: [
        'routes.js',
        'routes.jsx',
        'routes.ts',
        'routes.tsx',
        'routing.js',
        'routing.jsx',
        'routing.ts',
        'routing.tsx',
      ],
      name: 'routes',
    },
    {
      fileExtensions: ['rproj'],
      name: 'rstudio',
    },
    {
      fileExtensions: ['rspec'],
      name: 'rspec',
    },
    {
      fileExtensions: ['rss'],
      name: 'rss',
    },
    {
      fileNames: ['rsyncd.conf', 'rsyncd.secrets'],
      light: true,
      name: 'rsync',
    },
    {
      fileExtensions: ['rubocop.yaml', 'rubocop.yml', 'rubocop_todo.yml'],
      name: 'rubocop',
    },
    {
      fileExtensions: ['gem', 'gemspec'],
      name: 'rubygems',
    },
    {
      fileExtensions: ['gemrc', 'irbrc', 'pryrc', 'rubyrc'],
      name: 'rubyrc',
    },
    {
      fileExtensions: ['rb-gemset', 'ruby-gemset'],
      name: 'gemset',
    },
    {
      fileExtensions: ['rb-version', 'ruby-version'],
      name: 'rubyversion',
    },
    {
      fileExtensions: ['rlib', 'rlibc', 'rlibm', 'rlibstd', 'rs', 'rs.in', 'rust'],
      name: 'rust',
    },
    {
      fileExtensions: ['ron'],
      name: 'ron',
    },
    {
      fileExtensions: ['rust-toolchain'],
      name: 'rusttoolchain',
    },
    {
      fileExtensions: ['rvmrc'],
      name: 'rvm',
    },
    {
      fileNames: ['rxjs.js', 'rxjs.json', 'rxjs.ts'],
      name: 'rxjs',
    },
    // endregion

    // region [S]
    {
      fileExtensions: ['sac'],
      name: 'sac',
    },
    {
      fileExtensions: ['binarycookies', 'safariext', 'safariextz', 'webarchive'],
      name: 'safari',
    },
    {
      fileExtensions: ['sage', 'sagews'],
      name: 'sage',
    },
    {
      fileExtensions: ['sailsrc'],
      name: 'sails',
    },
    {
      fileExtensions: ['sls'],
      name: 'saltstack',
    },
    {
      fileExtensions: ['san'],
      name: 'san',
    },
    {
      fileExtensions: ['sb'],
      name: 'sandbox',
    },
    {
      fileExtensions: ['sas'],
      name: 'sas',
    },
    {
      fileNames: [
        'sapper.cjs',
        'sapper.config.cjs',
        'sapper.config.js',
        'sapper.config.mjs',
        'sapper.config.ts',
        'sapper.js',
        'sapper.mjs',
        'sapper.ts',
      ],
      name: 'sapper',
    },
    {
      fileExtensions: ['sbt'],
      name: 'sbt',
    },
    {
      fileExtensions: ['kojo', 'sc'],
      name: 'scala',
    },
    {
      fileExtensions: ['scheme', 'scm', 'sld', 'sps', 'xtm'],
      name: 'scheme',
    },
    {
      fileExtensions: ['scilla'],
      name: 'scilla',
    },
    {
      fileExtensions: ['sci', 'sce', 'tst'],
      name: 'scilab',
    },
    {
      fileExtensions: ['sb2', 'sb3'],
      name: 'scratch',
    },
    {
      fileExtensions: ['scrutinizer.yml', 'scrutinizer.yaml'],
      name: 'scrutinizer',
    },
    {
      fileExtensions: ['sdl'],
      name: 'sdlang',
    },
    {
      fileExtensions: ['safe', 'secret', 'secrets'],
      name: 'secret',
    },
    {
      fileExtensions: ['self'],
      name: 'self',
    },
    {
      fileNames: [
        'sencha-touch.js',
        'sencha-touch.min.js',
        'sencha.cjs',
        'sencha.js',
        'sencha.min.cjs',
        'sencha.min.js',
        'sencha.min.mjs',
        'sencha.mjs',
      ],
      name: 'sencha',
    },
    {
      fileExtensions: ['sentryclirc'],
      name: 'sentry',
    },
    {
      fileExtensions: [
        'releaserc',
        'releaserc.cjs',
        'releaserc.js',
        'releaserc.json',
        'releaserc.mjs',
        'releaserc.yaml',
        'releaserc.yml',
      ],
      fileNames: [
        'release.config.cjs',
        'release.config.js',
        'release.config.mjs',
        'semantic-release.config.cjs',
        'semantic-release.config.js',
        'semantic-release.config.mjs',
      ],
      name: 'semantic-release',
    },
    {
      fileExtensions: ['semgrep', 'semgrepignore'],
      name: 'semgrep',
    },
    {
      fileExtensions: [
        'serverless.cjs',
        'serverless.js',
        'serverless.json',
        'serverless.mjs',
        'serverless.ts',
        'serverless.yaml',
        'serverless.yml',
      ],
      fileNames: [
        'serverless.cjs',
        'serverless.js',
        'serverless.json',
        'serverless.mjs',
        'serverless.ts',
        'serverless.yaml',
        'serverless.yml',
      ],
      name: 'serverless',
    },
    {
      fileExtensions: ['sfproj'],
      name: 'servicefabric',
    },
    {
      fileExtensions: ['opt', 'option', 'options', 'opts', 'setting', 'settings'],
      name: 'settings',
    },
    {
      fileExtensions: ['sequelizerc', 'sequelizerc.cjs', 'sequelizerc.js', 'sequelizerc.json', 'sequelizerc.mjs'],
      name: 'sequelize',
    },
    {
      fileNames: ['shadow-cljs.edn'],
      name: 'shadowcljs',
    },
    {
      fileExtensions: ['shen'],
      name: 'shen',
    },
    {
      fileExtensions: ['shellcheckrc'],
      fileNames: ['shellcheckrc'],
      name: 'shellcheck',
    },
    {
      fileExtensions: [
        'ash',
        'bash',
        'bash_aliases',
        'bash_functions',
        'bash_profile',
        'bashrc',
        'csh',
        'cshrc',
        'dash',
        'elvish',
        'fish',
        'fishrc',
        'ion',
        'ksh',
        'kshrc',
        'mksh',
        'mkshrc',
        'nush',
        'nushell',
        'nurc',
        'oksh',
        'osh',
        'pdkshrc',
        'pksh',
        'pkshrc',
        'scsh',
        'shar',
        'tcsh',
        'tcshrc',
        'xiki',
        'xonsh',
        'yash',
        'zprofile',
        'zsh',
        'zshenv',
        'zshrc',
      ],
      name: 'shell',
    },
    {
      fileNames: ['shipitfile.babel.js', 'shipitfile.cjs', 'shipitfile.js', 'shipitfile.mjs', 'shipitfile.ts'],
      name: 'shipit',
    },
    {
      fileNames: ['shippable.yml', 'shippable.yaml'],
      name: 'shippable',
    },
    {
      fileExtensions: ['sigils'],
      name: 'sigils',
    },
    {
      fileExtensions: ['ss'],
      name: 'silverstripe',
    },
    {
      fileExtensions: ['siyuan', 'sy'],
      name: 'siyuan',
    },
    {
      fileExtensions: ['sketch'],
      name: 'sketch',
    },
    {
      fileExtensions: ['layout', 'skd', 'sketchup', 'sketchupproj', 'skm'],
      name: 'sketchup',
    },
    {
      fileExtensions: ['skp', 'style'],
      name: 'sketchmake',
    },
    {
      fileExtensions: ['eskip'],
      name: 'skipper',
    },
    {
      fileExtensions: ['sk', 'skript'],
      light: true,
      name: 'skript',
    },
    {
      fileExtensions: ['slang'],
      name: 'slang',
    },
    {
      fileExtensions: ['slash', 'sl'],
      name: 'slash',
    },
    {
      fileExtensions: ['ice'],
      name: 'slice',
    },
    {
      fileExtensions: ['slim'],
      name: 'slim',
    },
    {
      fileNames: [
        '[slug].cjs',
        '[slug].js',
        '[slug].jsx',
        '[slug].mjs',
        '[slug].php',
        '[slug].ts',
        '[slug].tsx',
        'slugs/cjs',
        'slugs/js',
        'slugs/jsx',
        'slugs/mjs',
        'slugs/php',
        'slugs/ts',
        'slugs/tsx',
      ],
      name: 'slug',
    },
    {
      fileNames: ['smartos.deb', 'smartos.img', 'smartos.iso'],
      name: 'smartos',
    },
    {
      fileExtensions: ['smarty', 'tpl'],
      name: 'smarty',
    },
    {
      fileExtensions: ['smithy'],
      name: 'smithy',
    },
    {
      fileExtensions: ['cm', 'fun', 'grm', 'mlb', 'mlton', 'sig', 'sml'],
      name: 'sml',
    },
    {
      fileExtensions: ['bam', 'rule', 'smk'],
      name: 'snakemake',
    },
    {
      fileNames: ['snakefile'],
      name: 'snakefile',
    },
    {
      fileNames: ['snapcraft.yaml', 'snapcraft.yml'],
      name: 'snapcraft',
    },
    {
      fileNames: ['snap.svg-min.js', 'snap.svg.cjs', 'snap.svg.js', 'snap.svg.min.js', 'snap.svg.mjs'],
      name: 'snapsvg',
    },
    {
      fileExtensions: ['snap'],
      name: 'snapshot',
    },
    {
      fileExtensions: ['snort'],
      name: 'snort',
    },
    {
      fileNames: [
        'snowpack.config.cjs',
        'snowpack.config.js',
        'snowpack.config.json',
        'snowpack.config.mjs',
        'snowpack.config.ts',
        'snowpack.config.yaml',
        'snowpack.config.yml',
      ],
      name: 'snowpack',
    },
    {
      fileExtensions: ['snyk'],
      name: 'snyk',
    },
    {
      fileExtensions: ['sol', 'solidity'],
      name: 'solidity',
    },
    {
      fileExtensions: ['solidarity', 'solidarity.json'],
      name: 'solidarity',
    },
    {
      fileExtensions: ['sonar', 'sonarlint', 'sonarlintignore', 'sonarqube', 'sonarrc'],
      name: 'sonar',
    },
    {
      fileExtensions: ['sonarcloud.properties', 'sonarcloud.yaml', 'sonarcloud.yml'],
      fileNames: [
        'sonar-project.json',
        'sonar-project.properties',
        'sonar-project.yaml',
        'sonar-project.yml',
        'sonarcloud.json',
        'sonarcloud.properties',
        'sonarcloud.yaml',
        'sonarcloud.yml',
      ],
      name: 'sonarcloud',
    },
    {
      fileExtensions: ['aesl', 'aes'],
      name: 'sophia',
    },
    {
      fileExtensions: ['rbi'],
      name: 'sorbet',
    },
    {
      fileExtensions: ['cidmap', 'enigma', 'map', 'mapping', 'match', 'tiny', 'tinyv2'],
      name: 'sourcemap',
    },
    {
      fileExtensions: ['spe'],
      name: 'spaceengine',
    },
    {
      fileExtensions: ['spacemacs'],
      fileNames: ['spacemacs'],
      name: 'spacemacs',
    },
    {
      fileExtensions: ['rq', 'sparql'],
      name: 'sparql',
    },
    {
      fileExtensions: ['spectral.yml', 'spectral.yaml'],
      name: 'spectral',
    },
    {
      fileExtensions: ['spring'],
      name: 'spring',
    },
    {
      fileExtensions: ['hqf', 'sqf'],
      name: 'sqf',
    },
    {
      fileExtensions: ['cql', 'hql', 'mysql', 'pdb', 'prc', 'psql', 'viw', 'xq', 'xql', 'xqm', 'xqy'],
      name: 'sql',
    },
    {
      fileExtensions: ['sqlite', 'sqlite3', 'sqlite3-journal'],
      name: 'sqlite',
    },
    {
      fileExtensions: ['jsont'],
      name: 'squarespace',
    },
    {
      fileExtensions: ['gnut', 'nut', 'nutf'],
      name: 'squirrel',
    },
    {
      fileExtensions: ['stan'],
      name: 'stan',
    },
    {
      fileExtensions: ['ado', 'doh', 'ihlp', 'mata', 'matah', 'oh', 'stata', 'sthlp'],
      name: 'stata',
    },
    {
      fileNames: [
        'stdlib.cjs',
        'stdlib.conf.cjs',
        'stdlib.conf.js',
        'stdlib.conf.mjs',
        'stdlib.conf.ts',
        'stdlib.js',
        'stdlib.min.cjs',
        'stdlib.min.js',
        'stdlib.min.mjs',
        'stdlib.mjs',
        'stdlib.ts',
      ],
      name: 'stdlib',
    },
    {
      fileNames: ['stencil.config.js', 'stencil.config.ts'],
      name: 'stencilconfig',
    },
    {
      fileExtensions: ['stencil'],
      name: 'stencil',
    },
    {
      fileExtensions: ['steadybit.yml', 'steadybit.yaml'],
      fileNames: ['steadybit.yml', 'steadybit.yaml'],
      name: 'steadybit',
    },
    {
      fileExtensions: ['stitches.config.cjs', 'stitches.config.js', 'stitches.config.mjs', 'stitches.config.ts'],
      fileNames: ['stitches.config.cjs', 'stitches.config.js', 'stitches.config.mjs', 'stitches.config.ts'],
      name: 'stitches',
    },
    {
      fileExtensions: ['storyboard'],
      name: 'storyboard',
    },
    {
      fileExtensions: ['story'],
      name: 'storyist',
    },
    {
      fileExtensions: [
        'stories.js',
        'stories.jsx',
        'stories.mdx',
        'stories.ts',
        'stories.tsx',
        'story.js',
        'story.jsx',
        'story.mdx',
        'story.ts',
        'story.tsx',
      ],
      name: 'storybook',
    },
    {
      fileExtensions: [
        'stylelintrc',
        'stylelintrc.cjs',
        'stylelintrc.js',
        'stylelintrc.json',
        'stylelintrc.mjs',
        'stylelintrc.yaml',
        'stylelintrc.yml',
      ],
      fileNames: [
        'stylelint.config.cjs',
        'stylelint.config.js',
        'stylelint.config.json',
        'stylelint.config.mjs',
        'stylelint.config.ts',
        'stylelint.config.yaml',
        'stylelint.config.yml',
      ],
      name: 'stylelint',
    },
    {
      fileExtensions: ['stylelintignore', 'stylelintignore.json'],
      name: 'stylelintignore',
    },
    {
      fileExtensions: [
        'styleguiderc',
        'styleguiderc.cjs',
        'styleguiderc.js',
        'styleguiderc.json',
        'styleguiderc.mjs',
        'styleguiderc.yaml',
        'styleguiderc.yml',
      ],
      fileNames: [
        'styleguide.config.cjs',
        'styleguide.config.js',
        'styleguide.config.json',
        'styleguide.config.mjs',
        'styleguide.config.ts',
        'styleguide.config.yaml',
        'styleguide.config.yml',
      ],
      name: 'styleguidist',
    },
    {
      fileExtensions: ['st.css'],
      name: 'stylable',
    },
    {
      fileExtensions: [
        'sc.cjs',
        'sc.js',
        'sc.jsx',
        'sc.mdx',
        'sc.mjs',
        'sc.ts',
        'sc.tsx',
        'styled',
        'styled.cjs',
        'styled.js',
        'styled.jsx',
        'styled.mdx',
        'styled.mjs',
        'styled.ts',
        'styled.tsx',
        'styles.cjs',
        'styles.js',
        'styles.jsx',
        'styles.mdx',
        'styles.mjs',
        'styles.ts',
        'styles.tsx',
      ],
      name: 'styledcomponents',
    },
    {
      fileExtensions: ['stylish-haskell.yaml', 'stylish-haskell.yml'],
      name: 'stylishhaskell',
    },
    {
      fileExtensions: ['styl'],
      name: 'stylus',
    },
    {
      fileExtensions: ['sublime-macro', 'sublime-package', 'sublime-project', 'sublime-workspace'],
      name: 'sublime',
    },
    {
      fileExtensions: ['sbv', 'srt', 'sub'],
      name: 'subtitle',
    },
    {
      fileExtensions: ['scd', 'scsyndef', 'scsynthdef', 'scx', 'scxt', 'scz'],
      name: 'scd',
    },
    {
      fileExtensions: ['sss'],
      name: 'sss',
    },
    {
      fileNames: ['supabase.js', 'supabase.json', 'supabase.py', 'supabase.ts', 'supabase.yaml', 'supabase.yml'],
      name: 'supabase',
    },
    {
      fileExtensions: ['svelte', 'svelte-kit'],
      name: 'svelte',
    },
    {
      fileNames: [
        'svelte.config.cjs',
        'svelte.config.js',
        'svelte.config.json',
        'svelte.config.mjs',
        'svelte.config.ts',
        'svelte.config.yaml',
        'svelte.config.yml',
      ],
      name: 'svelte_config',
    },
    {
      fileExtensions: ['svgo.cjs', 'svgo.js', 'svgo.json', 'svgo.mjs', 'svgo.yaml', 'svgo.yml'],
      fileNames: [
        'svgo.config.cjs',
        'svgo.config.js',
        'svgo.config.json',
        'svgo.config.mjs',
        'svgo.config.ts',
        'svgo.config.yaml',
        'svgo.config.yml',
      ],
      name: 'svgo',
    },
    {
      fileExtensions: [
        'svgrrc',
        'svgrrc.cjs',
        'svgrrc.js',
        'svgrrc.json',
        'svgrrc.mjs',
        'svgrrc.ts',
        'svgrrc.yaml',
        'svgrrc.yml',
      ],
      fileNames: [
        'svgr.config.cjs',
        'svgr.config.js',
        'svgr.config.json',
        'svgr.config.mjs',
        'svgr.config.ts',
        'svgr.config.yaml',
        'svgr.config.yml',
      ],
      name: 'svgr',
    },
    {
      fileExtensions: ['mdsvex', 'svx'],
      name: 'svx',
    },
    {
      fileExtensions: ['svn', 'svnignore'],
      name: 'svn',
    },
    {
      fileExtensions: ['swagger', 'swag'],
      fileNames: ['api.json', 'api.yaml', 'api.yml', 'swagger.json', 'swagger.yaml', 'swagger.yml'],
      name: 'swagger',
    },
    {
      fileExtensions: ['swc'],
      name: 'swc',
    },
    {
      fileNames: ['package.pins', 'package.resolved'],
      name: 'swiftlock',
    },
    {
      fileExtensions: ['swig'],
      name: 'swig',
    },
    {
      fileNames: ['symfony.lock'],
      light: true,
      name: 'symfony',
    },

    // endregion

    // region [T]
    {
      fileExtensions: ['listing', 'toc'],
      name: 'toc',
    },
    {
      fileExtensions: ['tailwind.cjs', 'tailwind.js', 'tailwind.mjs', 'tailwind.ts'],
      fileNames: [
        'tailwind.conf.cjs',
        'tailwind.conf.js',
        'tailwind.conf.mjs',
        'tailwind.conf.ts',
        'tailwind.config.cjs',
        'tailwind.config.js',
        'tailwind.config.mjs',
        'tailwind.config.ts',
        'tailwind.js',
      ],
      name: 'tailwindcss',
    },
    {
      fileNames: [
        'tauri.cjs',
        'tauri.conf.cjs',
        'tauri.conf.js',
        'tauri.conf.json',
        'tauri.conf.mjs',
        'tauri.conf.ts',
        'tauri.config.cjs',
        'tauri.config.js',
        'tauri.config.mjs',
        'tauri.config.ts',
        'tauri.js',
        'tauri.mjs',
        'tauri.ts',
      ],
      name: 'tauri',
    },
    {
      fileExtensions: ['adp', 'exp', 'itcl', 'itk', 'tcl', 'tkdiffrc', 'tkvcs', 'tm'],
      name: 'tcl',
    },
    {
      fileExtensions: ['tea'],
      name: 'tea',
    },
    {
      fileExtensions: ['teal'],
      name: 'teal',
    },
    {
      fileExtensions: ['tl', 'xps'],
      name: 'telegram',
    },
    {
      fileExtensions: ['tt', 'tt2', 'tt3', 'tt4', 'ttml'],
      name: 'tt',
    },
    {
      fileExtensions: ['tera'],
      name: 'tera',
    },
    {
      fileExtensions: ['tf', 'tf.json', 'tfplan', 'tfstate', 'tfvars'],
      name: 'terraform',
    },
    {
      fileExtensions: [
        'terserignore',
        'terserrc',
        'terserrc.conf',
        'terserrc.json',
        'uglifyignore',
        'uglifyrc',
        'uglifyrc.json',
      ],
      name: 'terser',
    },
    {
      fileExtensions: ['tern-config', 'tern-project', 'ternconfig'],
      name: 'tern',
    },
    {
      fileExtensions: ['testcaferc', 'testcaferc.json'],
      name: 'testcafe',
    },
    {
      fileExtensions: ['aux', 'dtx', 'lbx', 'ltx', 'mkii', 'mkiv', 'mkvi', 'pgf', 'sty', 'tex', 'texi', 'tikz', 'txi'],
      name: 'tex',
    },
    {
      fileExtensions: ['textlintrc', 'textlintrc.json'],
      name: 'textlint',
    },
    {
      fileExtensions: ['textile'],
      name: 'textile',
    },
    {
      fileExtensions: [
        'tmBundle',
        'tmCommand',
        'tmLanguage',
        'tmMacro',
        'tmPreferences',
        'tmProperties',
        'tmSnippet',
        'tmTheme',
        'tmcg',
      ],
      name: 'textmate',
    },
    {
      fileExtensions: ['thor'],
      name: 'thor',
    },
    {
      fileNames: [
        'thunder-collection.js',
        'thunder-collection.json',
        'thunder-collection_Web.json',
        'thunder-tests.js',
        'thunder-tests.json',
        'thunderclient.js',
        'thunderclient.json',
        'thunderclient.settings.js',
        'thunderclient.settings.json',
      ],
      name: 'thunderclient',
    },
    {
      fileExtensions: ['tidy', 'tidyparserrc', 'tidyparserrc.json'],
      name: 'tidyparse',
    },
    {
      fileNames: ['Tiltfile'],
      name: 'tilt',
    },
    {
      fileNames: [
        'tinymce.cjs',
        'tinymce.jquery.js',
        'tinymce.jquery.min.js',
        'tinymce.js',
        'tinymce.min.cjs',
        'tinymce.min.js',
        'tinymce.min.mjs',
        'tinymce.mjs',
        'tinymce.ts',
      ],
      name: 'tinymce',
    },
    {
      fileExtensions: ['tipe'],
      name: 'tipe',
    },
    {
      fileExtensions: ['tla'],
      name: 'tla',
    },
    {
      fileExtensions: ['tmux', 'tmux.conf'],
      fileNames: ['tmux.conf'],
      name: 'tmux',
    },
    {
      fileExtensions: ['truffle.cjs', 'truffle.js', 'truffle.mjs', 'truffle.ts'],
      fileNames: [
        'truffle-config.cjs',
        'truffle-config.js',
        'truffle-config.mjs',
        'truffle-config.ts',
        'truffle.cjs',
        'truffle.js',
        'truffle.mjs',
        'truffle.ts',
      ],
      name: 'truffle',
    },
    {
      fileExtensions: ['ttcn', 'ttcn3'],
      name: 'ttcn',
    },
    {
      fileNames: ['context.xml', 'server.xml', 'tomcat-users.xml', 'tomcat.conf', 'tomcat.java', 'web.xml'],
      name: 'tomcat',
    },
    {
      fileExtensions: ['taskpaper', 'todo'],
      fileNames: [
        'todo',
        'todo.adoc',
        'todo.c',
        'todo.cjs',
        'todo.conf',
        'todo.cpp',
        'todo.cs',
        'todo.cson',
        'todo.css',
        'todo.dart',
        'todo.go',
        'todo.h',
        'todo.htm',
        'todo.html',
        'todo.ini',
        'todo.java',
        'todo.js',
        'todo.json',
        'todo.jsx',
        'todo.kt',
        'todo.less',
        'todo.m',
        'todo.md',
        'todo.mjs',
        'todo.php',
        'todo.pl',
        'todo.plist',
        'todo.pm',
        'todo.pod',
        'todo.properties',
        'todo.py',
        'todo.rb',
        'todo.rst',
        'todo.scala',
        'todo.scss',
        'todo.sh',
        'todo.styl',
        'todo.swift',
        'todo.tex',
        'todo.texi',
        'todo.texinfo',
        'todo.toml',
        'todo.ts',
        'todo.tsx',
        'todo.txt',
        'todo.xml',
        'todo.yaml',
        'todo.yml',
      ],
      name: 'todo',
    },
    {
      fileExtensions: ['toit'],
      name: 'toit',
    },
    {
      fileNames: ['tox.ini'],
      name: 'tox',
    },
    {
      fileExtensions: [
        'tsconfig.cjs',
        'tsconfig.js',
        'tsconfig.json',
        'tsconfig.mjs',
        'tsconfig.ts',
        'tsconfig.yaml',
        'tsconfig.yml',
      ],
      fileNames: [
        'tsconfig.base.json',
        'tsconfig.build.json',
        'tsconfig.cjs',
        'tsconfig.eslint.json',
        'tsconfig.js',
        'tsconfig.json',
        'tsconfig.lib.json',
        'tsconfig.mjs',
        'tsconfig.spec.json',
        'tsconfig.ts',
        'tsconfig.yaml',
        'tsconfig.yml',
      ],
      name: 'tsconfig',
    },
    {
      fileExtensions: [
        'tslint.cjs',
        'tslint.js',
        'tslint.json',
        'tslint.mjs',
        'tslint.ts',
        'tslint.yaml',
        'tslint.yml',
      ],
      fileNames: [
        'tslint.base.json',
        'tslint.build.json',
        'tslint.cjs',
        'tslint.eslint.json',
        'tslint.js',
        'tslint.json',
        'tslint.lib.json',
        'tslint.mjs',
        'tslint.spec.json',
        'tslint.ts',
        'tslint.yaml',
        'tslint.yml',
      ],
      name: 'tslint',
    },
    {
      fileExtensions: ['travis.yml', 'travis.yaml'],
      name: 'travis',
    },
    {
      fileExtensions: ['tuc'],
      name: 'tuc',
    },
    {
      fileNames: ['turbo.config.cjs', 'turbo.config.js', 'turbo.config.mjs', 'turbo.config.ts', 'turbo.json'],
      name: 'turborepo',
    },
    {
      fileExtensions: ['tu'],
      name: 'turing',
    },
    {
      fileExtensions: ['twig'],
      name: 'twig',
    },
    {
      fileExtensions: ['tw', 'twee'],
      name: 'twine',
    },
    {
      fileExtensions: ['txl'],
      name: 'txl',
    },
    {
      fileNames: ['typedoc.cjs', 'typedoc.js', 'typedoc.json', 'typedoc.mjs', 'typedoc.ts'],
      name: 'typedoc',
    },
    {
      fileExtensions: ['d.ts'],
      name: 'dts',
    },
    {
      fileNames: ['typings.json'],
      name: 'typings',
    },
    {
      fileExtensions: ['typoscript'],
      name: 'typo3',
    },

    // endregion

    // region [U]
    {
      fileExtensions: ['glif', 'ufo', 'ufoz'],
      name: 'ufo',
    },
    {
      fileNames: ['uikit.cjs', 'uikit.js', 'uikit.min.cjs', 'uikit.min.js', 'uikit.min.mjs', 'uikit.mjs'],
      name: 'uikit',
    },
    {
      fileExtensions: ['iuml', 'plantuml', 'pu', 'puml', 'uml', 'wsd'],
      name: 'uml',
    },
    {
      fileExtensions: ['unicode'],
      name: 'unicode',
    },
    {
      fileExtensions: [
        'unibeautifyrc.cjs',
        'unibeautifyrc.js',
        'unibeautifyrc.json',
        'unibeautifyrc.mjs',
        'unibeautifyrc.ts',
        'unibeautifyrc.yaml',
        'unibeautifyrc.yml',
      ],
      fileNames: [
        'unibeautify.config.cjs',
        'unibeautify.config.js',
        'unibeautify.config.json',
        'unibeautify.config.mjs',
        'unibeautify.config.ts',
        'unibeautify.config.yaml',
        'unibeautify.config.yml',
      ],
      name: 'unibeautify',
    },
    {
      fileExtensions: ['unibeautifyrc'],
      fileNames: [
        'unibeautifyrc.config.cjs',
        'unibeautifyrc.config.js',
        'unibeautifyrc.config.json',
        'unibeautifyrc.config.mjs',
        'unibeautifyrc.config.ts',
        'unibeautifyrc.config.yaml',
        'unibeautifyrc.config.yml',
      ],
      name: 'unibeautifyrc',
    },
    {
      fileExtensions: [
        'anim',
        'asset',
        'cubemap',
        'meta',
        'ply',
        'prefab',
        'u3d',
        'unity',
        'unity3d',
        'unitypackage',
        'unityproj',
      ],
      name: 'unity',
    },
    {
      fileExtensions: ['uof', 'uop', 'uos', 'uot'],
      name: 'uos',
    },
    {
      fileExtensions: ['u'],
      name: 'unison',
    },
    {
      fileNames: [
        'unlicence',
        'unlicence.md',
        'unlicence.rst',
        'unlicence.txt',
        'unlicense',
        'unlicense.md',
        'unlicense.rst',
        'unlicense.txt',
      ],
      name: 'unlicense',
    },
    {
      fileExtensions: ['uno', 'unoproj'],
      name: 'uno',
    },
    {
      fileNames: [
        'uno.config.cjs',
        'uno.config.js',
        'uno.config.mjs',
        'uno.config.ts',
        'unocss.config.cjs',
        'unocss.config.js',
        'unocss.config.mjs',
        'unocss.config.ts',
      ],
      name: 'unocss',
    },
    {
      fileExtensions: [
        'uasset',
        'uax',
        'uc',
        'ukx',
        'umap',
        'umx',
        'unr',
        'upkg',
        'upl',
        'uplugin',
        'uproject',
        'utx',
        'uz',
      ],
      name: 'unreal',
    },
    {
      fileExtensions: ['ur', 'urs'],
      name: 'urweb',
    },

    // endregion [U]

    // region [V]
    {
      fileExtensions: ['v', 'vh'],
      name: 'v',
    },
    {
      fileExtensions: ['v8', 'v8flags'],
      name: 'v8',
    },
    {
      fileExtensions: ['vagrantfile'],
      fileNames: ['vagrantfile'],
      name: 'vagrant',
    },
    {
      fileExtensions: ['vala', 'vapi'],
      name: 'vala',
    },
    {
      fileExtensions: ['css.cjs', 'css.js', 'css.mjs', 'css.ts'],
      name: 'vanillaextract',
    },
    {
      fileNames: ['vapor.json', 'vapor.yaml', 'vapor.yml'],
      name: 'vapor',
    },
    {
      fileExtensions: ['vash'],
      name: 'vash',
    },
    {
      fileExtensions: ['vcl'],
      name: 'vcl',
    },
    {
      fileExtensions: ['fhtml', 'vm', 'vtl'],
      name: 'velocity',
    },
    {
      fileNames: ['vercel.json', 'vercel.yml', 'vercel.yaml'],
      light: true,
      name: 'vercel',
    },
    {
      fileExtensions: ['vercelignore'],
      name: 'vercelignore',
    },
    {
      fileNames: ['verdaccio.yml', 'verdaccio.yaml'],
      name: 'verdaccio',
    },
    {
      fileExtensions: ['sv', 'svh', 'veo'],
      name: 'verilog',
    },
    {
      fileExtensions: [
        'ctags',
        'gemtags',
        'hgtags',
        'idtags',
        'localtags',
        'pid',
        'pytags',
        'sha',
        'sha256',
        'shasum',
        'tag',
        'tags',
        'tld',
        'version',
      ],
      fileNames: [
        'ctags',
        'gemtags',
        'hgtags',
        'idtags',
        'localtags',
        'pytags',
        'tag',
        'tags',
        'version',
        'version.adoc',
        'version.md',
        'version.rst',
        'version.txt',
      ],
      name: 'version',
    },
    {
      fileExtensions: ['vhd', 'vhdl', 'vhf', 'vhi', 'vho', 'vhs', 'vht', 'vhw'],
      name: 'vhdl',
    },
    {
      fileExtensions: ['exrc', 'gvimrc', 'vim', 'viml', 'vimrc'],
      name: 'vim',
    },
    {
      fileExtensions: ['vdw', 'vdx', 'vrd', 'vsd', 'vsdx', 'vsl', 'vss', 'vssx', 'vst', 'vstx', 'vsw', 'vsx', 'vtx'],
      name: 'visio',
    },
    {
      fileExtensions: ['frm', 'vb', 'vba', 'vbs'],
      name: 'vb',
    },
    {
      fileExtensions: ['vbproj'],
      name: 'vbproj',
    },
    {
      fileExtensions: [
        'lsproj',
        'modelproj',
        'njsproj',
        'rc',
        'sln',
        'suo',
        'vs',
        'vsconfig',
        'vssettings',
        'vstemplate',
        'wmaproj',
      ],
      name: 'vs',
    },
    {
      fileNames: ['vitest.config.cjs', 'vitest.config.js', 'vitest.config.mjs', 'vitest.config.ts'],
      name: 'vitest',
    },
    {
      fileNames: ['vite.config.cjs', 'vite.config.js', 'vite.config.mjs', 'vite.config.ts'],
      name: 'vite',
    },
    {
      fileExtensions: ['vbox', 'vbox-extpack', 'vbox-prev', 'vbox_version', 'vdi', 'vhdx'],
      name: 'vm',
    },
    {
      fileExtensions: ['nvram', 'vmdk', 'vmsd', 'vmsn', 'vmss', 'vmtx', 'vmware', 'vmx', 'vmxf', 'vmx~', 'vswp'],
      name: 'vmware',
    },
    {
      enabledFor: [IconPack.Volt],
      fileExtensions: ['volt'],
      light: true,
      name: 'volt',
    },
    {
      fileExtensions: ['vray', 'vrimg', 'vrmat', 'vrmatlib', 'vrmatlib2', 'vrmesh', 'vrscene'],
      name: 'vray',
    },
    {
      fileExtensions: ['vsix', 'vsixmanifest'],
      light: true,
      name: 'vsix',
    },
    {
      fileExtensions: ['code-workspace', 'vscode'],
      name: 'vscode',
    },
    {
      fileNames: ['.vscode/json'],
      name: 'vscodesettings',
    },
    {
      fileExtensions: ['vscodeignore', 'vscodeignore.json'],
      name: 'vscodeignore',
    },
    {
      fileExtensions: ['vsts-ci.yml', 'vsts-ci.yaml'],
      fileNames: ['vsts-ci.yml', 'vsts-ci.yaml'],
      name: 'tfs',
    },
    {
      fileExtensions: ['tfignore', 'tfsignore'],
      name: 'tfsignore',
    },
    {
      fileNames: ['vue.config.cjs', 'vue.config.js', 'vue.config.mjs', 'vue.config.ts'],
      name: 'vueconfig',
    },
    {
      fileExtensions: ['vuerc'],
      name: 'vuerc',
    },
    {
      fileExtensions: ['vuex'],
      name: 'vuex',
    },
    {
      fileExtensions: ['vy', 'vyper'],
      name: 'vyper',
    },

    // endregion

    // region [W]
    {
      fileNames: ['w3c.json'],
      name: 'w3c',
    },
    {
      fileExtensions: ['wallaby.cjs', 'wallaby.js', 'wallaby.mjs', 'wallaby.ts'],
      fileNames: [
        'wallaby.cjs',
        'wallaby.conf.cjs',
        'wallaby.conf.js',
        'wallaby.conf.mjs',
        'wallaby.conf.ts',
        'wallaby.js',
        'wallaby.mjs',
        'wallaby.ts',
      ],
      name: 'wallaby',
    },
    {
      fileExtensions: ['walt'],
      name: 'walt',
    },
    {
      fileExtensions: ['watchmanconfig'],
      fileNames: ['watchman.json', 'watchman.config.json'],
      name: 'watchman',
    },
    {
      fileExtensions: ['jass', 'wc3', 'zn'],
      name: 'warcraft3',
    },
    {
      fileExtensions: ['wasm', 'wast', 'wat'],
      name: 'webassembly',
    },
    {
      fileExtensions: ['wdl'],
      name: 'wdl',
    },
    {
      fileExtensions: ['web2py'],
      name: 'web2py',
    },
    {
      fileExtensions: ['webgl'],
      name: 'webgl',
    },
    {
      fileExtensions: ['owl'],
      name: 'owl',
    },
    {
      fileNames: [
        'webpack.common.cjs',
        'webpack.common.coffee',
        'webpack.common.es6',
        'webpack.common.js',
        'webpack.common.mjs',
        'webpack.common.ts',
        'webpack.config.cjs',
        'webpack.config.coffee',
        'webpack.config.es6',
        'webpack.config.js',
        'webpack.config.mjs',
        'webpack.config.ts',
        'webpack.dev.cjs',
        'webpack.dev.coffee',
        'webpack.dev.es6',
        'webpack.dev.js',
        'webpack.dev.mjs',
        'webpack.dev.ts',
        'webpack.prod.cjs',
        'webpack.prod.coffee',
        'webpack.prod.es6',
        'webpack.prod.js',
        'webpack.prod.mjs',
        'webpack.prod.ts',
        'webpack/cjs',
        'webpack/js',
        'webpack/mjs',
        'webpack/ts',
      ],
      name: 'webpack',
    },
    {
      fileExtensions: ['vtt'],
      name: 'webvtt',
    },
    {
      fileExtensions: ['hintrc'],
      name: 'webhint',
    },
    {
      fileExtensions: ['wy'],
      name: 'wenyan',
    },
    {
      fileExtensions: ['wpy'],
      name: 'wepy',
    },
    {
      fileNames: ['wercker.yaml', 'wercker.yml'],
      name: 'wercker',
    },
    {
      fileExtensions: ['wget-hsts', 'wgetrc'],
      name: 'wget',
    },
    {
      fileExtensions: ['wgsl'],
      name: 'wgsl',
    },
    {
      fileNames: ['windi.config.cjs', 'windi.config.js', 'windi.config.mjs', 'windi.config.ts'],
      name: 'windi',
    },
    {
      fileExtensions: ['bat', 'exe', 'ms', 'msc', 'msi', 'reg'],
      name: 'windows',
    },
    {
      fileExtensions: ['baml', 'xaml'],
      name: 'winui',
    },
    {
      fileExtensions: ['wikitext', 'wt'],
      light: true,
      name: 'wikitext',
    },
    {
      fileExtensions: ['wix', 'wixobj', 'wixproj', 'wxi', 'wxl'],
      name: 'wix',
    },
    {
      fileExtensions: ['doc', 'docm', 'docx', 'docxml', 'dotm', 'dotx', 'odt', 'odtx', 'wri'],
      name: 'word',
    },
    {
      fileExtensions: ['wl', 'wls', 'wlt'],
      name: 'wolfram',
    },
    {
      fileExtensions: ['woodpecker.yml', 'woodpecker.yaml'],
      name: 'woodpecker',
    },
    {
      fileNames: ['wp-admin.php', 'wp-cli.yaml', 'wp-config.php', 'wp-env.json', 'wp-login.php'],
      name: 'wordpress',
    },
    {
      fileExtensions: ['distignore'],
      name: 'wordpressignore',
    },
    {
      fileNames: ['workbox-config.cjs', 'workbox-config.js', 'workbox-config.mjs', 'workbox-config.ts'],
      name: 'workbox',
    },
    {
      fileNames: ['wpml-config.xml'],
      name: 'wpml',
    },
    {
      fileExtensions: ['wurst'],
      name: 'wurst',
    },
    {
      fileExtensions: ['wxss'],
      name: 'wxss',
    },
    {
      fileExtensions: ['wxml'],
      name: 'wxml',
    },
    {
      fileExtensions: ['wxs'],
      name: 'wxs',
    },
    // endregion

    // region [X]
    {
      fileExtensions: ['x10'],
      name: 'x10',
    },
    {
      fileExtensions: [
        'Xauthority',
        'Xclients',
        'Xinitrc',
        'Xinputrc',
        'Xprofile',
        'Xresources',
        'Xscreensaver',
        'Xsession',
        'Xsession-errors',
        'Xsessionrc',
        'Xusers',
        'Xvnc-session',
      ],
      name: 'x11',
    },
    {
      fileExtensions: ['workbook'],
      name: 'xamarin',
    },
    {
      fileExtensions: ['xc'],
      name: 'xmos',
    },
    {
      fileExtensions: [
        'mode1v3',
        'mode3v3',
        'xcassets',
        'xccheckout',
        'xcconfig',
        'xcdatamodel',
        'xclangspec',
        'xcmappingmodel',
        'xcodeproj',
        'xcplayground',
        'xcplugindata',
        'xcscheme',
        'xcsettings',
        'xctarget',
        'xctask',
        'xctemplate',
        'xcuserstate',
        'xcworkspace',
        'xcworkspacedata',
      ],
      name: 'xcode',
    },
    {
      fileExtensions: ['xib'],
      name: 'xib',
    },
    {
      fileExtensions: ['xlf', 'xliff'],
      name: 'xliff',
    },
    {
      fileNames: ['xmake.lua'],
      name: 'xmake',
    },
    {
      fileExtensions: ['machine.cjs', 'machine.js', 'machine.mjs', 'machine.ts'],
      name: 'xstate',
    },
    {
      fileExtensions: ['xtend'],
      name: 'xtend',
    },
    {
      fileExtensions: ['xojo_code', 'xojo_menu', 'xojo_report', 'xojo_script', 'xojo_toolbar', 'xojo_window'],
      name: 'xojo',
    },
    {
      fileExtensions: ['xsp-config', 'xsp.metadata'],
      name: 'xpages',
    },
    {
      fileExtensions: ['xquery'],
      name: 'xquery',
    },
    {
      fileExtensions: ['xpl', 'xproc'],
      name: 'xproc',
    },
    {
      fileNames: ['xubuntu.iso', 'xubuntu.deb'],
      name: 'xubuntu',
    },
    // endregion

    // region [Y]
    {
      fileExtensions: ['yamllint', 'yamllint.yml', 'yamllint.yaml'],
      name: 'yamllint',
    },
    {
      fileExtensions: ['yaspellerignore', 'yaspellerrc', 'yaspellerrc.json'],
      name: 'yandex',
    },
    {
      fileExtensions: ['yang'],
      name: 'yang',
    },
    {
      fileExtensions: ['yar', 'yara'],
      name: 'yara',
    },
    {
      fileExtensions: ['yarnrc', 'yarnrc.yml', 'yarnrc.yaml'],
      fileNames: ['yarn.json', 'yarn.js'],
      name: 'yarn',
    },
    {
      fileNames: ['yarn.lock'],
      name: 'yarnlock',
    },
    {
      fileExtensions: ['yarn-integrity', 'yarn-metadata', 'yarnclean'],
      name: 'yarnclean',
    },
    {
      fileExtensions: ['yardopts'],
      name: 'yard',
    },
    {
      fileExtensions: ['yasm'],
      name: 'yasm',
    },
    {
      fileExtensions: ['yo-rc.json'],
      name: 'yeoman',
    },
    {
      fileExtensions: ['yona'],
      name: 'yona',
    },
    {
      fileExtensions: ['yorick'],
      name: 'yorick',
    },
    {
      fileExtensions: ['yue'],
      name: 'yue',
    },
    {
      fileNames: [
        'yahoo-config.cjs',
        'yahoo-config.js',
        'yahoo-config.mjs',
        'yahoo-config.ts',
        'yui-config.cjs',
        'yui-config.js',
        'yui-config.mjs',
        'yui-config.ts',
        'yui-min.js',
        'yui.cjs',
        'yui.js',
        'yui.min.js',
        'yui.mjs',
        'yui.ts',
      ],
      name: 'yui',
    },
    {
      fileExtensions: ['yvmrc'],
      name: 'yvmrc',
    },

    // endregion

    // region [Z]
    {
      fileExtensions: ['zbr', 'zpr', 'ztl'],
      name: 'zbrush',
    },
    {
      fileNames: ['zeit.json'],
      light: true,
      name: 'zeit',
    },
    {
      fileExtensions: ['zeitignore'],
      name: 'zeitignore',
    },
    {
      fileExtensions: ['zep', 'zephir'],
      name: 'zephir',
    },
    {
      fileExtensions: ['zig'],
      name: 'zig',
    },
    {
      fileExtensions: ['plx', 'z180', 'z180asm', 'z280', 'z280asm', 'z380', 'z380asm', 'z80', 'z80asm', 'zilog'],
      name: 'zilog',
    },
    {
      fileExtensions: ['zimpl', 'zmpl', 'zpl'],
      name: 'zimpl',
    },
    {
      fileNames: ['zorinos.iso', 'zorinos.deb'],
      name: 'zorinos',
    },
    {
      fileExtensions: ['mud', 'xzap', 'zabstr', 'zap', 'zil', 'zork'],
      name: 'zork',
    },
    {
      fileExtensions: ['zs'],
      name: 'zenscript',
    },
    {
      fileExtensions: ['zsrc', 'zsrc.json'],
      name: 'zsrc',
    },
    // endregion

    // region [Images]
    {
      fileExtensions: ['jpg', 'jpeg'],
      name: 'jpg',
    },
    {
      fileExtensions: ['gif', 'gifv'],
      name: 'gif',
    },
    {
      fileExtensions: ['png', 'apng'],
      name: 'png',
    },
    {
      fileExtensions: ['cur', 'icns', 'ico', 'icon', 'iconpackage'],
      name: 'icon',
    },
    {
      fileExtensions: ['bmp', 'jbmp', 'wbmp'],
      name: 'bmp',
    },
    {
      fileExtensions: [
        'bpg',
        'dcm',
        'djvu',
        'dpx',
        'ecw',
        'hdp',
        'hdr',
        'heic',
        'heif',
        'iff',
        'jng',
        'jps',
        'jxr',
        'pcx',
        'pict',
        'pxb',
        'pxg',
        'pxm',
        'pxr',
        'pxs',
        'raw',
        'sgi',
        'tga',
        'tiff',
        'vsdm',
        'wbm',
      ],
      name: 'image',
    },
    {
      fileExtensions: ['svg', 'svgz'],
      light: true,
      name: 'svg',
    },
    {
      fileExtensions: ['webp'],
      name: 'webp',
    },
    // endregion

    // region [Config]
    {
      fileExtensions: ['env', 'env.dev', 'env.prod', 'env.test', 'ini', 'kys', 'ld', 'ldif', 'lds', 'mcf'],
      fileNames: [
        'config.json',
        'config.txt',
        'config.yaml',
        'config.yml',
        'config/json',
        'config/yaml',
        'config/yml',
        'configs.json',
        'configs.txt',
        'configs.yaml',
        'configs.yml',
        'configs/json',
        'configs/yaml',
        'configs/yml',
        'option.json',
        'option.txt',
        'option.yaml',
        'option.yml',
        'option/json',
        'option/yaml',
        'option/yml',
        'options.json',
        'options.txt',
        'options.yaml',
        'options.yml',
        'options/json',
        'options/yaml',
        'options/yml',
        'pref.json',
        'pref.txt',
        'pref.yaml',
        'pref.yml',
        'pref/json',
        'pref/yaml',
        'pref/yml',
        'prefs.json',
        'prefs.txt',
        'prefs.yaml',
        'prefs.yml',
        'prefs/json',
        'prefs/yaml',
        'prefs/yml',
        'setting.json',
        'setting.txt',
        'setting.yaml',
        'setting.yml',
        'setting/json',
        'setting/yaml',
        'setting/yml',
        'settings.json',
        'settings.txt',
        'settings.yaml',
        'settings.yml',
        'settings/json',
        'settings/yaml',
        'settings/yml',
      ],
      name: 'preferences',
    },
    {
      fileExtensions: ['cfg', 'cnf', 'conf', 'config', 'pref', 'prefs'],
      fileNames: ['cnf', 'conf', 'config', 'pref', 'prefs'],
      light: true,
      name: 'config',
    },
    {
      fileExtensions: ['git', 'git-submodules', 'gitattributes', 'gitkeep', 'gitmodules', 'gitrc', 'keep', 'lfsconfig'],
      name: 'git',
    },

    // endregion

    // region [Binaries]
    {
      fileExtensions: [
        'axf',
        'bin',
        'bsdiff',
        'dat',
        'db-journal',
        'elf',
        'gco',
        'la',
        'objdump',
        'pak',
        'prx',
        'rnd',
        'swp',
      ],
      name: 'binary',
    },
    // endregion

    // region [Archive]
    {
      fileExtensions: [
        '7z',
        '7zip',
        'bz2',
        'ear',
        'egg',
        'gz',
        'gzip',
        'hak',
        'hqx',
        'lz',
        'lzma',
        'lzo',
        'pzip',
        'rar',
        'saz',
        'sit',
        'tar',
        'tgz',
        'tlz',
        'whl',
        'xar',
        'xz',
        'z',
        'zip',
        'zipx',
      ],
      name: 'archive',
    },
    // endregion

    // region [Audio]
    {
      fileExtensions: [
        'aac',
        'ac3',
        'aiff',
        'amr',
        'au',
        'cda',
        'f4a',
        'f4b',
        'f4p',
        'flac',
        'it',
        'm3u',
        'm4a',
        'm4b',
        'm4p',
        'mid',
        'midi',
        'mka',
        'mp3',
        'mpc',
        'oga',
        'ogg',
        'opus',
        'ra',
        'rmi',
        's3m',
        'snd',
        'sndh',
        'son',
        'vox',
        'wav',
        'wma',
      ],
      name: 'audio',
    },
    // endregion

    // region [Video]
    {
      fileExtensions: [
        '3g2',
        '3gp',
        '3gp2',
        '3gpp',
        'amv',
        'asf',
        'asx',
        'avi',
        'divx',
        'dvd',
        'flv',
        'h264',
        'm2v',
        'm4v',
        'mk3d',
        'mks',
        'mkv',
        'mov',
        'mp4',
        'mpeg',
        'mpg',
        'ogm',
        'ogv',
        'qt',
        'rm',
        'rmvb',
        'vob',
        'webm',
        'wmv',
        'yuv',
      ],
      name: 'video',
    },
    // endregion

    // region [Languages]
    {
      fileExtensions: ['clj', 'cljc', 'cljs', 'cljx', 'clojure', 'hic', 'rg'],
      name: 'clojure',
    },
    {
      fileExtensions: ['cjsx', 'coffee', 'iced', 'litcoffee'],
      name: 'coffeescript',
    },
    {
      fileExtensions: ['css', 'tss'],
      light: true,
      name: 'css',
    },
    {
      fileExtensions: ['dart'],
      name: 'dart',
    },
    {
      fileExtensions: ['d', 'di'],
      name: 'dlang',
    },
    {
      fileExtensions: ['go', 'golang'],
      name: 'go',
    },
    {
      fileExtensions: ['dtml', 'htm', 'html', 'isml', 'kit', 'mhtml', 'scaml', 'xhtml'],
      name: 'html',
    },
    {
      fileExtensions: ['java', 'jar', 'war'],
      name: 'java',
    },
    {
      fileExtensions: ['min.cjs', 'min.es6', 'min.js', 'min.jsx', 'min.mjs', 'min.ts', 'min.tsx'],
      name: 'jsmin',
    },
    {
      fileExtensions: ['jsx', 'tsx'],
      name: 'jsx',
    },
    {
      fileExtensions: ['cjs', 'es6', 'js', 'mjs'],
      name: 'js',
    },
    {
      fileExtensions: ['cson', 'ejson', 'json', 'jsonc', 'ndjson', 'rsj', 'rdjson', 'ston'],
      name: 'json',
    },
    {
      fileExtensions: ['kotlin', 'kt', 'ktm'],
      name: 'kotlin',
    },
    {
      fileExtensions: ['kts'],
      name: 'kotlinscript',
    },
    {
      fileExtensions: ['less'],
      name: 'less',
    },
    {
      fileExtensions: ['lua', 'luacheckrc', 'pd_lua', 'rbxs', 'rockspec', 'wlua'],
      name: 'lua',
    },
    {
      fileExtensions: ['nginx', 'nginxconf'],
      fileNames: ['nginx.conf'],
      name: 'nginx',
    },
    {
      fileExtensions: ['perl', 'ph', 'pl', 'pl6', 'pm', 'pm6', 'psgi'],
      name: 'perl',
    },
    {
      fileExtensions: ['php'],
      name: 'php',
    },
    {
      fileExtensions: [
        'gyp',
        'gypi',
        'ipy',
        'pep',
        'py',
        'py3',
        'pyde',
        'pyi',
        'pyp',
        'pyt',
        'python',
        'pyw',
        'pyz',
        'rpy',
        'tac',
        'wsgi',
        'xpy',
      ],
      name: 'python',
    },
    {
      fileExtensions: ['rabl', 'rb', 'ruby'],
      name: 'ruby',
    },
    {
      fileExtensions: ['sass', 'sassrc', 'sassrc.js'],
      name: 'sass',
    },
    {
      fileExtensions: ['scss', 'scssrc', 'scssrc.cjs', 'scssrc.js', 'scssrc.mjs'],
      name: 'scss',
    },
    {
      fileExtensions: ['scala'],
      name: 'scala',
    },
    {
      fileExtensions: ['sh'],
      name: 'shell',
    },
    {
      fileExtensions: ['sql'],
      name: 'sql',
    },
    {
      fileExtensions: ['swift'],
      name: 'swift',
    },
    {
      fileExtensions: ['template'],
      name: 'template',
    },
    {
      fileExtensions: ['toml'],
      name: 'toml',
    },
    {
      fileExtensions: ['abt', 'ans', 'brf', 'dri', 'lcov', 'no', 'rtf', 'txt'],
      name: 'text',
    },
    {
      fileExtensions: ['ts', 'tslint'],
      name: 'typeScript',
    },
    // endregion

    // region [Least priority]
    {
      fileExtensions: ['class', 'ko', 'o', 'out', 'pyc', 'pyo'],
      name: 'class',
    },
    {
      fileExtensions: [
        '2da',
        'cbor',
        'db',
        'db2',
        'db3',
        'dbi',
        'ddl',
        'dict',
        'edn',
        'eign',
        'fea',
        'icondb.js',
        'od',
        'onlydata',
        'pytb',
        'schema',
        'syntax',
        'termcap',
        'terminfo',
        'tgn',
      ],
      name: 'db',
    },
    {
      fileExtensions: ['dfont', 'eot', 'otf', 'pfa', 'pfb', 'pfm', 'tfm', 'ttc', 'ttf', 'woff', 'woff2'],
      name: 'font',
    },
    {
      fileExtensions: ['lock'],
      name: 'lock',
    },
    {
      fileExtensions: ['jmd', 'markdown', 'md', 'mdown', 'mkd', 'mkdn', 'mkdown', 'pmd'],
      name: 'markdown',
    },
    {
      fileExtensions: ['vue'],
      name: 'vue',
    },
    {
      fileExtensions: ['fxml', 'jnlp', 'jrxml', 'rng', 'xml', 'xsl', 'xslt', 'xul'],
      name: 'xml',
    },
    {
      fileExtensions: ['wsdl'],
      name: 'wsdl',
    },
    {
      fileExtensions: ['xsd'],
      name: 'xsd',
    },
    {
      fileExtensions: ['info', 'yaml', 'yml'],
      name: 'yaml',
    },
    // endregion
  ],
};

import { FileIcons } from '../models/index';

/**
 * Defines file icons
 */
export const fileIcons: FileIcons = {
  defaultIcon: { name: 'file' },
  icons: [
    // region [Custom]
    {
      name: 'githubActions',
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
    },
    {
      name: 'githubCode',
      fileNames: ['CODE_OF_CONDUCT.md', 'CODE_OF_CONDUCT.txt'],
    },
    {
      name: 'githubContributing',
      fileNames: ['CONTRIBUTING.md', 'CONTRIBUTING.txt'],
    },
    {
      name: 'github',
      fileNames: [
        'COMMIT_MESSAGE_TEMPLATE.md',
        'COMMIT_MESSAGE_TEMPLATE.txt',
        'PULL_REQUEST_TEMPLATE.md',
        'PULL_REQUEST_TEMPLATE.txt',
        'TEMPLATE.md',
        'TEMPLATE.txt',
      ],
      light: true,
    },
    {
      name: 'readme',
      fileNames: [
        'README',
        'README.md',
        'README.txt',
        'readme',
        'readme.md',
        'readme.txt',
      ],
      light: true,
    },
    {
      name: 'gitcommit',
      fileNames: ['COMMIT_EDITMSG', 'ATOM_COMMIT_EDITMSG'],
    },
    {
      name: 'githubCommit',
      fileNames: [
        'COMMIT_MESSAGE_CONVENTION.md',
        'COMMIT_MESSAGE_CONVENTION.txt',
      ],
    },
    {
      name: 'gitmerge',
      fileNames: ['MERGE_HEAD', 'MERGE_MODE', 'MERGE_MSG'],
    },
    {
      name: 'install',
      fileNames: [
        'INSTALL',
        'INSTALL.md',
        'INSTALL.sh',
        'INSTALL.txt',
        'INSTALL.yaml',
        'INSTALL.yml',
        'install',
        'install.md',
        'install.sh',
        'install.txt',
        'install.yaml',
        'install.yml',
      ],
    },
    {
      name: 'funding',
      fileNames: [
        'FUNDING',
        'FUNDING.md',
        'FUNDING.sh',
        'FUNDING.txt',
        'FUNDING.yaml',
        'FUNDING.yml',
        'funding',
        'funding.md',
        'funding.sh',
        'funding.txt',
        'funding.yaml',
        'funding.yml',
      ],
    },
    {
      name: 'stalebot',
      fileNames: ['stale.yml', 'stale.yaml'],
    },
    {
      name: 'plugin',
      fileNames: ['META-INF/plugin.xml'],
    },
    {
      name: 'i18nProperties',
      fileExtensions: ['bundle.properties', 'messages/properties'],
    },
    {
      name: 'i18nJava',
      fileExtensions: ['bundle.java', 'messages/java'],
    },
    {
      name: 'i18nKotlin',
      fileExtensions: ['bundle.kt', 'messages/kt'],
    },
    // endregion [Custom]

    // region [0-9]
    {
      name: '11ty',
      fileNames: [
        '.11ty.cjs',
        '.11ty.js',
        '.11ty.mjs',
        '.11ty.ts',
        '.11tyignore',
        '.eleventy.cjs',
        '.eleventy.js',
        '.eleventy.mjs',
        '.eleventy.ts',
        '.eleventyignore',
      ],
      light: true,
    },
    {
      name: '1c',
      fileExtensions: ['bsl', 'mdo', 'sdbl', 'os'],
    },
    {
      name: '3d',
      fileExtensions: [
        'ac',
        'c4d',
        'cginc',
        'dxf',
        'geo',
        'obj',
        'shader',
        'stl',
        'tesc',
        'tese',
        'x',
      ],
    },
    {
      name: '3dsmax',
      fileExtensions: ['osl', 'dwg', '3ds'],
    },
    {
      name: '4d',
      fileExtensions: ['4dm', '4db'],
    },

    // endregion [0-9]

    // region [A]
    {
      name: 'aplus',
      fileExtensions: ['a+'],
    },
    {
      name: 'access',
      fileExtensions: [
        'accda',
        'accdb',
        'accde',
        'accdr',
        'accdt',
        'adn',
        'laccdb',
        'maf',
        'mam',
        'maq',
        'mar',
        'mdw',
      ],
    },
    {
      name: 'abap',
      fileExtensions: ['abap', 'abp'],
    },
    {
      name: 'abc',
      fileExtensions: ['abc'],
    },
    {
      name: 'abif',
      fileExtensions: ['ab1', 'abif', 'fsa'],
    },
    {
      name: 'acre',
      fileNames: ['acre.config'],
    },
    {
      name: 'act',
      fileNames: ['.actrc'],
    },
    {
      name: 'actionscript',
      fileExtensions: ['as', 'as3', 'jsfl'],
    },
    {
      name: 'ada',
      fileExtensions: ['ada', 'adb', 'ads'],
    },
    {
      name: 'animate',
      fileExtensions: ['fla', 'xfl'],
    },
    {
      name: 'ae',
      fileExtensions: ['aep', 'aet'],
    },
    {
      name: 'ai',
      fileExtensions: ['ai', 'aia', 'ait'],
    },
    {
      name: 'indesign',
      fileExtensions: ['id', 'idml', 'indb', 'indd', 'indl', 'indt'],
    },
    {
      name: 'psd',
      fileExtensions: ['atn', 'psb', 'psd'],
    },
    {
      name: 'premiere',
      fileExtensions: ['prel', 'prproj', 'psq'],
    },
    {
      name: 'advpl',
      fileExtensions: ['ahu', 'aph', 'prw', 'tlpp'],
    },
    {
      name: 'affectscript',
      fileExtensions: ['affect'],
    },
    {
      name: 'affinity',
      fileExtensions: ['afdesign', 'afphoto', 'afpub'],
    },
    {
      name: 'agda',
      fileExtensions: ['agda', 'lagda'],
    },
    {
      name: 'akka',
      fileExtensions: ['akka'],
    },
    {
      name: 'al',
      fileExtensions: ['al'],
    },
    {
      name: 'alacritty',
      fileNames: ['alacritty.yml', '.alacritty.yml'],
    },
    {
      name: 'alex',
      fileNames: ['alexrc', '.alexrc'],
    },
    {
      name: 'alexignore',
      fileNames: ['.alexignore'],
    },
    {
      name: 'allcontributors',
      fileNames: [
        'all-contributorsrc',
        '.all-contributorsrc',
        'allcontributorsrc',
        '.allcontributorsrc',
      ],
    },
    {
      name: 'alloy',
      fileExtensions: ['als'],
    },
    {
      name: 'alpine',
      fileNames: ['APKBUILD', '.APKBUILD'],
    },
    {
      name: 'amigaos',
      fileExtensions: ['arexx'],
    },
    {
      name: 'ampl',
      fileExtensions: ['ampl'],
    },
    {
      name: 'amplication',
      fileNames: ['ampconfig.json'],
    },
    {
      name: 'amplify',
      fileNames: ['amplify.yml', 'amplify.yaml'],
    },
    {
      name: 'amusewiki',
      fileExtensions: ['muse'],
    },
    {
      name: 'analytica',
      fileExtensions: ['ana'],
    },
    {
      name: 'androidManifest',
      fileNames: ['AndroidManifest.xml'],
    },
    {
      name: 'android',
      fileNames: ['MainActivity.java', 'MainActivity.kt'],
    },
    {
      name: 'androidSmali',
      fileExtensions: ['smali', 'rsh', 'webarchivexml'],
    },
    {
      name: 'angelscript',
      fileExtensions: ['acs', 'angelscript'],
    },
    {
      name: 'angularCli',
      fileNames: [
        'angular.json',
        'angular-cli.json',
        '.angular-cli.json',
        '.angular.json',
      ],
    },
    {
      name: 'angularjs',
      fileNames: ['angular.js', 'angular.min.js'],
    },
    {
      name: 'angular',
      fileExtensions: [
        'ng.html',
        'ng.js',
        'ng.ts',
        'ng-template',
        'ngtemplate',
      ],
    },
    {
      name: 'ngrxjs',
      fileExtensions: ['container.js', 'container.ts', 'container.dart'],
    },
    {
      name: 'angularcomponent',
      fileExtensions: [
        'component.js',
        'component.ts',
        'component.dart',
        'comp.js',
        'comp.ts',
        'comp.dart',
      ],
    },
    {
      name: 'angularcontroller',
      fileExtensions: [
        'controller.js',
        'controller.ts',
        'controller.dart',
        'ctrl.js',
        'ctrl.ts',
        'ctrl.dart',
      ],
    },
    {
      name: 'angulardirective',
      fileExtensions: ['directive.js', 'directive.ts', 'directive.dart'],
    },
    {
      name: 'angularguard',
      fileExtensions: ['guard.js', 'guard.ts', 'guard.dart'],
    },
    {
      name: 'angularinterceptor',
      fileExtensions: ['interceptor.js', 'interceptor.ts', 'interceptor.dart'],
    },
    {
      name: 'angularrouting',
      fileNames: [
        'angular-routing.js',
        'angular-routing.ts',
        'angular-routing.dart',
        'angular_routing.js',
        'angular_routing.ts',
        'angular_routing.dart',
      ],
      fileExtensions: ['routing.js', 'routing.ts', 'routing.dart'],
    },
    {
      name: 'angularapprouting',
      fileNames: [
        'app-routing.module.js',
        'app-routing.module.ts',
        'app-routing.module.dart',
      ],
    },
    {
      name: 'angularmodule',
      fileExtensions: ['module.js', 'module.ts', 'module.dart'],
    },
    {
      name: 'angularservice',
      fileExtensions: ['service.js', 'service.ts', 'service.dart'],
    },
    {
      name: 'ionic',
      fileExtensions: ['page.js', 'page.ts', 'page.dart'],
    },
    {
      name: 'angularpipe',
      fileExtensions: ['pipe.js', 'pipe.ts', 'pipe.dart'],
    },
    {
      name: 'angularresolver',
      fileExtensions: ['resolver.js', 'resolver.ts', 'resolver.dart'],
    },
    {
      name: 'angulartailwind',
      fileNames: ['ng-tailwind.js', 'ng-tailwind.ts', 'ng-tailwind.dart'],
    },
    {
      name: 'animestudio',
      fileExtensions: ['anime', 'animestudio'],
    },
    {
      name: 'ansible',
      fileNames: [
        'ansible.yml',
        'ansible.yaml',
        'ansible.cfg',
        'ansible_inventory.yml',
        'site.yml',
        'site.yaml',
        'playbook.yml',
        'playbook.yaml',
        'playbook.cfg',
        'inventory.yml',
        'inventory.yaml',
        'webservers.yml',
        'webservers.yaml',
        'dbservers.yml',
        'dbservers.yaml',
        'galaxy.yml',
        'galaxy.yaml',
      ],
    },
    {
      name: 'ant',
      fileNames: ['ant.xml', '.ant'],
    },
    {
      name: 'antlers',
      fileExtensions: ['antlers.html'],
    },
    {
      name: 'antlr',
      fileExtensions: ['g', 'g4'],
    },
    {
      name: 'antwar',
      fileNames: [
        'antwar.conf.js',
        'antwar.conf.cjs',
        'antwar.conf.mjs',
        'antwar.config.js',
        'antwar.config.cjs',
        'antwar.config.mjs',
        '.antwar.conf.js',
        '.antwar.conf.cjs',
        '.antwar.conf.mjs',
        '.antwar.config.js',
        '.antwar.config.cjs',
        '.antwar.config.mjs',
      ],
    },
    {
      name: 'any',
      fileExtensions: ['any'],
    },
    {
      name: 'apacheconf',
      fileNames: [
        'apache.conf',
        'apache2.conf',
        'apache.dev.conf',
        'apache2.dev.conf',
        'apache.prod.conf',
        'apache2.prod.conf',
        'apache.vhost.conf',
        'apache2.vhost.conf',
        'httpd.conf',
        'httpd.dev.conf',
        'httpd.prod.conf',
        'httpd.vhost.conf',
        '.apacheconf',
        '.apache.conf',
        '.apache2.conf',
      ],
    },
    {
      name: 'apache',
      fileExtensions: ['vhost', 'thrift'],
    },
    {
      name: 'apex',
      fileExtensions: ['cls', 'apex'],
    },
    {
      name: 'apib',
      fileExtensions: ['apib'],
    },
    {
      name: 'apiextractor',
      fileNames: [
        'api-extractor.json',
        'api-extractor.common.json',
        'api-extractor-base.json',
      ],
    },
    {
      name: 'apk',
      fileExtensions: ['apk'],
    },
    {
      name: 'apl',
      fileExtensions: ['apl', 'apla', 'aplc', 'aplf', 'apli', 'apln', 'aplo'],
    },
    {
      name: 'apollo',
      fileNames: [
        'apollo.config.js',
        'apollo.config.cjs',
        'apollo.config.mjs',
        'apollo.config.ts',
      ],
    },
    {
      name: 'appcelerator',
      fileNames: [
        'appcelerator.js',
        'appcelerator.cjs',
        'appcelerator.mjs',
        'appcelerator.ts',
      ],
    },
    {
      name: 'appsemble',
      fileNames: [
        '.appsemblerc',
        '.appsemblerc.yml',
        '.appsemblerc.yaml',
        'app-definition.yml',
        'app-definition.yaml',
      ],
    },
    {
      name: 'appveyor',
      fileNames: [
        '.appveyor.yml',
        '.appveyor.yaml',
        'appveyor.yml',
        'appveyor.yaml',
      ],
    },
    {
      name: 'applescript',
      fileExtensions: ['applescript', 'scpt'],
    },
    {
      name: 'arc',
      fileExtensions: ['arc'],
    },
    {
      name: 'archlinux',
      fileNames: ['.install', '.SRCINFO', 'PKGBUILD', '.yaourtrc'],
    },
    {
      name: 'pacman',
      fileNames: ['pacman.conf', 'pamac.conf', 'makepkg.conf'],
    },
    {
      name: 'arduino',
      fileExtensions: ['ino'],
    },
    {
      name: 'arend',
      fileNames: ['arend.yml', 'arend.yaml'],
      fileExtensions: ['arc', 'ard', 'arend'],
    },
    {
      name: 'arm',
      fileExtensions: ['arm'],
    },
    {
      name: 'arttext',
      fileExtensions: ['art3', 'art4'],
    },
    {
      name: 'asciidoc',
      fileExtensions: ['adoc', 'asciidoc', 'asc', 'ad'],
    },
    {
      name: 'aspectj',
      fileExtensions: ['aj', 'aspectj'],
    },
    {
      name: 'asmpure',
      fileExtensions: ['a', 'i', 's'],
    },
    {
      name: 'asm',
      fileExtensions: [
        'asm',
        'inc',
        'ms',
        'agc',
        'lst',
        'aea',
        'argus',
        'mitigus',
      ],
    },
    {
      name: 'hitachi',
      fileExtensions: ['h8', 'h8S', 'h8SX', 'h8000', 'h8300'],
    },
    {
      name: 'intel',
      fileExtensions: ['x32', 'x64', 'x86', 'i386', '80386'],
    },
    {
      name: 'vax',
      fileExtensions: ['vax', 'vmasm'],
    },
    {
      name: 'asp',
      fileExtensions: [
        'asp',
        'asa',
        'asax',
        'ascx',
        'ashx',
        'asmx',
        'aspx',
        'axd',
      ],
    },
    {
      name: 'astro',
      fileExtensions: ['astro'],
    },
    {
      name: 'astroconfig',
      fileNames: [
        'astro.config.mjs',
        'astro.config.cjs',
        'astro.config.js',
        'astro.config.ts',
      ],
    },
    {
      name: 'artisan',
      fileNames: ['artisan', 'artisan.php'],
    },
    {
      name: 'astyle',
      fileNames: ['.astylerc'],
    },
    {
      name: 'asymptote',
      fileExtensions: ['asy'],
    },
    {
      name: 'atom',
      fileExtensions: ['atomproject.json', 'atomproject.cson'],
      light: true,
    },
    {
      name: 'apm',
      fileNames: ['.apmrc'],
      light: true,
    },
    {
      name: 'atoum',
      fileExtensions: ['atoum.php'],
      fileNames: ['atoum.config.php'],
    },
    {
      name: 'ats',
      fileExtensions: ['ats', 'dats', 'hats', 'sats'],
    },
    {
      name: 'audacity',
      fileExtensions: ['aup', 'audacity'],
    },
    {
      name: 'augeas',
      fileExtensions: ['aug', 'augeas'],
    },
    {
      name: 'aurelia',
      fileNames: [
        'aurelia.json',
        'aurelia.js',
        'aurelia.cjs',
        'aurelia.mjs',
        'aurelia.ts',
        'aureliafile.json',
        'aureliafile.js',
        'aureliafile.cjs',
        'aureliafile.mjs',
        'aureliafile.ts',
      ],
    },
    {
      name: 'authors',
      fileNames: ['authors', 'authors.txt', 'authors.md', 'authors.rst'],
    },
    {
      name: 'auto',
      fileNames: [
        '.autorc',
        '.autorc.json',
        '.autorc.yml',
        '.autorc.yaml',
        '.autorc.js',
        '.autorc.cjs',
        '.autorc.mjs',
        'auto.config.js',
        'auto.config.cjs',
        'auto.config.mjs',
        'auto.config.ts',
        'auto.config.yaml',
        'auto.config.yml',
        'auto.config.json',
      ],
    },
    {
      name: 'ahk',
      fileExtensions: ['ahk', 'ahkl'],
    },
    {
      name: 'autoit',
      fileExtensions: ['au3', 'autoit'],
    },
    {
      name: 'ava',
      fileNames: [
        '.avarc',
        '.avarc.json',
        '.avarc.yml',
        '.avarc.yaml',
        '.avarc.js',
        '.avarc.ts',
        '.avarc.cjs',
        '.avarc.mjs',
        'ava.config.js',
        'ava.config.cjs',
        'ava.config.mjs',
        'ava.config.ts',
        'ava.config.yaml',
        'ava.config.yml',
        'ava.config.json',
      ],
    },
    {
      name: 'avif',
      fileExtensions: ['avif'],
    },
    {
      name: 'avr',
      fileExtensions: ['avr', 'avrasm'],
    },
    {
      name: 'avro',
      fileExtensions: ['avsc', 'avpr', 'avdl', 'avcs'],
    },
    {
      name: 'awk',
      fileExtensions: ['awk', 'gawk', 'mawk', 'nawk', 'pawk', 'tawk'],
    },
    {
      name: 'azure',
      fileExtensions: ['azcli'],
    },
    {
      name: 'azurepipelines',
      fileNames: [
        'azure-pipelines.yml',
        'azure-pipelines.yaml',
        'azure-pipelines.ci.yml',
        'azure-pipelines.ci.yaml',
        'azure-pipelines.release.yml',
        'azure-pipelines.release.yaml',
      ],
    },

    // endregion

    // region [B]

    // endregion [B]
  ],
};

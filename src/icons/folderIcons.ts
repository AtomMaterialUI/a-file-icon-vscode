import { FolderTheme } from '../models/index';

/**
 * Defines folder icons
 */
export const folderIcons: FolderTheme[] = [
  {
    name: 'specific',
    defaultIcon: { name: 'folder' },
    rootFolder: { name: 'folder-root' },
    icons: [
      // region [A]
      {
        name: 'acf',
        folderNames: ['acf', 'acf-json', 'acf-jsons'],
      },
      {
        name: 'acre',
        folderNames: ['acre'],
      },
      {
        name: 'adapter',
        folderNames: ['adapter', 'adapters'],
      },
      {
        name: 'addon',
        folderNames: ['addon', 'addons'],
      },
      {
        name: 'admin',
        folderNames: ['admin', 'admins'],
      },
      {
        name: 'adr',
        folderNames: ['adr', 'adrs', 'decision', 'decisions'],
      },
      {
        name: 'agda',
        folderNames: ['agda'],
      },
      {
        name: 'alacritty',
        folderNames: ['alacritty'],
      },
      {
        name: 'android',
        folderNames: ['android', 'androidApp'],
      },
      {
        name: 'angular',
        folderNames: ['angular', 'ng', 'ngApp'],
      },
      {
        name: 'animations',
        folderNames: ['anim', 'animated', 'animation', 'animations', 'anims'],
      },
      {
        name: 'ansible',
        folderNames: [
          'ansible',
          'group_vars',
          'host_vars',
          'playbooks',
          'roles',
          'vars',
        ],
      },
      {
        name: 'api',
        folderNames: ['api', 'apis', 'openapi', 'rest', 'swagger'],
      },
      {
        name: 'apollo',
        folderNames: [
          'apollo',
          'apollo-cache',
          'apollo-client',
          'apollo-config',
        ],
      },
      {
        name: 'app',
        folderNames: ['app', 'apps', 'application', 'applications'],
      },
      {
        name: 'appstore',
        folderNames: [
          'xccheckout',
          'xcodeproj',
          'xcshareddata',
          'xcuserdata',
          'xcworkspace',
        ],
      },
      {
        name: 'archetype',
        folderNames: ['archetype', 'archetypes', 'schematic', 'schematics'],
      },
      {
        name: 'archive',
        folderNames: [
          'archive',
          'archives',
          'backup',
          'backups',
          'jar',
          'jars',
          'tar',
          'tars',
          'zip',
          'zips',
        ],
      },
      {
        name: 'article',
        folderNames: ['article', 'articles'],
      },
      {
        name: 'arttext',
        folderNames: ['art', 'arts', 'arttext', 'artx', 'wordart', 'wordarts'],
      },
      {
        name: 'atom',
        folderNames: [
          'atom',
          'atom-ci',
          'atom-packages',
          'atom-snippets',
          'atom-syntax',
          'atom-themes',
          'atoms',
        ],
      },
      {
        name: 'automator',
        folderNames: [
          'action',
          'actions',
          'automator',
          'automation',
          'automations',
          'caction',
          'cactions',
          'definition',
          'definitions',
          'workflow',
          'workflows',
        ],
      },
      {
        name: 'audio',
        folderNames: [
          'aud',
          'audio',
          'audios',
          'bgm',
          'bgms',
          'mp3',
          'mp4',
          'music',
          'musics',
          'midi',
          'midis',
          'ost',
          'osts',
          'sfx',
          'snd',
          'sound',
          'sounds',
          'soundtrack',
          'soundtracks',
          'wav',
          'wavs',
        ],
      },
      {
        name: 'aurelia',
        folderNames: ['aurelia', 'aurelia_project'],
      },
      {
        name: 'aws',
        folderNames: [
          'amazon',
          'athena',
          'aws',
          'aws-lambda',
          'cloudfront',
          'ecr',
          'ecs',
          's3',
          'tableau',
        ],
      },
      {
        name: 'azure-devops',
        folderNames: [
          'azure',
          'azure-devop',
          'azure-devops',
          'azuredevop',
          'azuredevops',
        ],
      },
      {
        name: 'azure-pipelines',
        folderNames: [
          'azure-pipelines',
          'azure-pipelines-ci',
          'azurepipelines',
        ],
      },
      // endregion

      // region [B]
      {
        name: 'base',
        folderNames: [
          'abstract',
          'abstracts',
          'base',
          'bases',
          'parent',
          'parents',
        ],
      },
      {
        name: 'bazaar',
        folderNames: ['bazaar', 'bzr'],
      },
      {
        name: 'benchmark',
        folderNames: [
          'benchmark',
          'benchmarks',
          'hprof',
          'measure',
          'measures',
          'perf',
          'performance',
          'performances',
          'perfs',
          'profiler',
          'profilers',
        ],
      },
      {
        name: 'bitcoin',
        folderNames: ['bitcoin'],
      },
      {
        name: 'bloc',
        folderNames: ['bloc', 'blocs'],
      },
      {
        name: 'blueprint',
        folderNames: ['blueprint', 'blueprints'],
      },
      {
        name: 'bower',
        folderNames: ['bower', 'bower_components'],
      },
      {
        name: 'buildkite',
        folderNames: ['buildkite'],
      },
      // endregion

      // region [C]
      {
        name: 'cabal',
        folderNames: ['cabal'],
      },
      {
        name: 'cake',
        folderNames: ['cake'],
      },
      {
        name: 'cart',
        folderNames: [
          'basket',
          'baskets',
          'cart',
          'carts',
          'marketing',
          'shop',
          'shops',
        ],
      },
      {
        name: 'channels',
        folderNames: ['channel', 'channels'],
      },
      {
        name: 'chef',
        folderNames: ['chef', 'recipe', 'recipes'],
      },
      {
        name: 'ci',
        folderNames: ['ci', 'integration', 'integrations'],
      },
      {
        name: 'client',
        folderNames: ['client', 'clients', 'frontend', 'frontends', 'pwa'],
      },
      {
        name: 'circleci',
        folderNames: ['circleci'],
      },
      {
        name: 'cluster',
        folderNames: ['cluster', 'clusters', 'node', 'nodes'],
      },
      {
        name: 'cmake',
        folderNames: ['cmake', 'cmake-build-debug', 'cmake-build-release'],
      },
      {
        name: 'cnab',
        folderNames: ['cnab'],
      },
      {
        name: 'cobol',
        folderNames: ['cobol'],
      },
      {
        name: 'codesandbox',
        folderNames: ['codesandbox'],
      },
      {
        name: 'components',
        folderNames: [
          'component',
          'components',
          'directive',
          'directives',
          'element',
          'elements',
          'ui',
          'widget',
          'widgets',
        ],
      },
      {
        name: 'composer',
        folderNames: ['composer', 'composer'],
      },
      {
        name: 'config',
        folderNames: [
          'cfg',
          'conf',
          'config',
          'configs',
          'configuration',
          'configurations',
          'setting',
          'settings',
        ],
      },
      {
        name: 'connection',
        folderNames: [
          'connect',
          'connection',
          'connections',
          'link',
          'links',
          'rel',
          'relation',
          'relations',
        ],
      },
      {
        name: 'container',
        folderNames: [
          'container',
          'containers',
          'devcontainer',
          'devcontainers',
        ],
      },
      {
        name: 'content',
        folderNames: ['content', 'contents', 'context', 'contexts', 'cont'],
      },
      {
        name: 'contract',
        folderNames: ['contract', 'contracts', 'pact', 'pacts'],
      },
      {
        name: 'controllers',
        folderNames: ['controller', 'controllers', 'ctrl', 'ctrls'],
      },
      {
        name: 'core',
        folderNames: [
          'bin',
          'binaries',
          'binary',
          'core',
          'cores',
          'io',
          'support',
        ],
      },
      {
        name: 'coverage',
        folderNames: ['coverage', 'coverages', 'cov', 'lcov'],
      },
      {
        name: 'crates',
        folderNames: ['crate', 'crates'],
      },
      {
        name: 'cron',
        folderNames: ['cron', 'crontab', 'schedule', 'schedules', 'scheduler'],
      },
      {
        name: 'cubit',
        folderNames: ['cubit', 'cubits'],
      },
      {
        name: 'cue',
        folderNames: ['cue', 'cue.mod'],
      },
      {
        name: 'custom',
        folderNames: ['custom', 'random'],
      },
      {
        name: 'cvs',
        folderNames: ['cvs'],
      },
      {
        name: 'cypress',
        folderNames: ['cypress'],
      },

      // endregion

      // region [D]
      {
        name: 'dapr',
        folderNames: ['dapr'],
      },
      {
        name: 'db',
        folderNames: [
          'database',
          'databases',
          'db',
          'migrate',
          'migrations',
          'repo',
          'repos',
          'repositories',
          'repository',
        ],
      },
      {
        name: 'debian',
        folderNames: ['debian', 'deb'],
      },
      {
        name: 'debug',
        folderNames: [
          'bug',
          'bugs',
          'debug',
          'debugger',
          'debuggers',
          'debugging',
        ],
      },
      {
        name: 'decorators',
        folderNames: ['annotation', 'annotations', 'decorator', 'decorators'],
      },
      {
        name: 'delta',
        folderNames: ['delta', 'deltas', 'diff', 'diffs'],
      },
      {
        name: 'deno',
        folderNames: ['deno'],
      },
      {
        name: 'dependabot',
        folderNames: ['dependabot'],
      },
      {
        name: 'deploy',
        folderNames: [
          'deploy',
          'deployer',
          'deployment',
          'deployments',
          'deploys',
        ],
      },
      {
        name: 'devcontainer',
        folderNames: ['devcontainer', 'devcontainers'],
      },
      {
        name: 'dist',
        folderNames: [
          'build',
          'dist',
          'distribution',
          'distributions',
          'out',
          'output',
          'release',
          'releases',
        ],
      },
      {
        name: 'docker',
        folderNames: ['docker', 'dockerfile', 'dockerfiles'],
      },
      {
        name: 'docs',
        folderNames: [
          'doc',
          'docs',
          'documentation',
          'documentations',
          'text',
          'texts',
        ],
      },
      {
        name: 'domain',
        folderNames: ['domain', 'domains'],
      },
      {
        name: 'download',
        folderNames: ['download', 'downloads', 'dl', 'dls'],
      },
      {
        name: 'dropbox',
        folderNames: ['dropbox', 'dropbox.cache'],
      },
      {
        name: 'dub',
        folderNames: ['dub'],
      },
      {
        name: 'dump',
        folderNames: ['dump', 'dumps'],
      },
      {
        name: 'dvc',
        folderNames: ['dvc'],
      },
      // endregion

      // region [E]
      {
        name: 'e2e',
        folderNames: ['e2e', 'e2e-tests', 'scenario', 'scenarios'],
      },
      {
        name: 'elastic',
        folderNames: [
          'eb-extensions',
          'elastic',
          'elasticbeanstalk',
          'elasticsearch',
        ],
      },
      {
        name: 'electron',
        folderNames: ['electron', 'electron-builder'],
      },
      {
        name: 'elixir',
        folderNames: ['eex', 'elixir', 'elixir_ls', 'ex', 'leex'],
      },
      {
        name: 'emacs',
        folderNames: ['emacs', 'emacs.d'],
      },
      {
        name: 'env',
        folderNames: ['env', 'envs', 'environment', 'environments'],
      },
      {
        name: 'error',
        folderNames: [
          'error',
          'errors',
          'exception',
          'exceptions',
          'prod',
          'production',
        ],
      },
      {
        name: 'event',
        folderNames: ['event', 'events'],
      },
      {
        name: 'example',
        folderNames: [
          'demo',
          'demos',
          'example',
          'examples',
          'sample',
          'samples',
        ],
      },
      {
        name: 'exclude',
        folderNames: [
          'exclude',
          'excludes',
          'export',
          'exported',
          'exports',
          'ignore',
          'ignores',
        ],
      },
      {
        name: 'expo',
        folderNames: ['expo', 'expo-shared'],
      },

      // endregion

      // region [F]
      {
        name: 'fastlane',
        folderNames: ['fastlane'],
      },
      {
        name: 'faq',
        folderNames: ['faq', 'faqs'],
      },
      {
        name: 'feature',
        folderNames: ['feature', 'features', 'feat', 'feats'],
      },
      {
        name: 'firebase',
        folderNames: ['firebase'],
      },
      {
        name: 'fixtures',
        folderNames: [
          'fabricator',
          'fabricators',
          'factories',
          'factory',
          'fixture',
          'fixtures',
        ],
      },
      {
        name: 'flow',
        folderNames: ['flow', 'flow-typed', 'def', 'defs'],
      },
      {
        name: 'fonts',
        folderNames: ['font', 'fonts'],
      },
      {
        name: 'functions',
        folderNames: [
          'func',
          'funcs',
          'function',
          'functions',
          'handler',
          'handlers',
          'lambda',
          'lambdas',
          'service',
          'services',
        ],
      },

      // endregion

      // region [G]
      {
        name: 'gcloud',
        folderNames: ['gcloud', 'gcp'],
      },
      {
        name: 'generated',
        folderNames: [
          'auto',
          'autogen',
          'gen',
          'generated',
          'generator',
          'generators',
        ],
      },
      {
        name: 'git',
        folderNames: ['git', 'gitignore', 'gitattributes', 'submodules'],
      },
      {
        name: 'github',
        folderNames: ['github'],
      },
      {
        name: 'gitlab',
        folderNames: ['gitlab'],
      },
      {
        name: 'global',
        folderNames: ['global', 'globals'],
      },
      {
        name: 'gradle',
        folderNames: ['gradle', 'gradles'],
      },
      {
        name: 'graphql',
        folderNames: ['graphql', 'gql', 'schema', 'schemas'],
      },
      {
        name: 'grunt',
        folderNames: ['grunt', 'gruntfile', 'gruntfiles'],
      },
      {
        name: 'guard',
        folderNames: [
          'dev',
          'develop',
          'development',
          'guard',
          'guardfile',
          'guardfiles',
        ],
      },
      {
        name: 'gulp',
        folderNames: ['gulp', 'gulpfile', 'gulpfiles'],
      },

      // endregion

      // region [H]
      {
        name: 'hasura',
        folderNames: ['hasura'],
      },
      {
        name: 'haxe',
        folderNames: ['haxe', 'hxml', 'haxelib', 'haxe_libraries'],
      },
      {
        name: 'helm',
        folderNames: [
          'chart',
          'charts',
          'helm',
          'helmchart',
          'helmcharts',
          'helmfile',
          'helmfiles',
        ],
      },
      {
        name: 'helper',
        folderNames: ['helper', 'helpers', 'help', 'helps'],
      },
      {
        name: 'home',
        folderNames: [
          'home',
          'homepage',
          'start',
          'tuto',
          'tutorial',
          'tutorials',
          'tutos',
        ],
      },
      {
        name: 'hook',
        folderNames: ['hook', 'hooks', 'trigger', 'triggers'],
      },
      {
        name: 'husky',
        folderNames: ['husky'],
      },

      // endregion

      // region [I]
      {
        name: 'i18n',
        folderNames: [
          'g11n',
          'i18n',
          'l10n',
          'lang',
          'langs',
          'language',
          'languages',
          'locale',
          'locales',
          'localization',
          'translation',
          'translations',
        ],
      },
      {
        name: 'icons',
        folderNames: [
          'favicon',
          'favicons',
          'glyph',
          'glyphs',
          'icns',
          'ico',
          'icon',
          'icons',
        ],
      },
      {
        name: 'idea',
        folderNames: ['idea', 'META-INF'],
      },
      {
        name: 'images',
        folderNames: [
          'figure',
          'figures',
          'gallery',
          'image',
          'images',
          'img',
          'imgs',
          'media',
          'medias',
          'pic',
          'pics',
          'picture',
          'pictures',
        ],
      },
      {
        name: 'include',
        folderNames: [
          'concern',
          'concerns',
          'dep',
          'dependencies',
          'dependency',
          'deps',
          'import',
          'imported',
          'imports',
          'inc',
          'include',
          'included',
          'includes',
          'input',
          'inputs',
        ],
      },
      {
        name: 'info',
        folderNames: ['info', 'infos', 'information', 'informations'],
      },
      {
        name: 'init',
        folderNames: [
          'init',
          'initialization',
          'initializer',
          'initializers',
          'startup',
        ],
      },
      {
        name: 'injection',
        folderNames: [
          'di',
          'inject',
          'injection',
          'injections',
          'injector',
          'injectors',
          'injects',
        ],
      },
      {
        name: 'istanbul',
        folderNames: ['istanbul', 'nyc', 'nyc_output', 'nyc-output'],
      },
      {
        name: 'ios',
        folderNames: ['lproj', 'xcassets'],
      },
      {
        name: 'iosapp',
        folderNames: ['ios', 'iosapp', 'ios-app'],
      },

      // endregion
    ],
  },
  {
    name: 'classic',
    defaultIcon: { name: 'folder' },
    rootFolder: { name: 'folder-root' },
  },
  { name: 'none', defaultIcon: { name: '' } },
];

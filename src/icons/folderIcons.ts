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
        name: 'amplication',
        folderNames: ['amplication'],
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
        name: 'events',
        folderNames: ['event', 'events'],
      },
      {
        name: 'examples',
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
        name: 'features',
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
        name: 'haxelib',
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

      // region [J]
      {
        name: 'java',
        folderNames: ['java', 'jdk'],
      },
      {
        name: 'js',
        folderNames: ['js', 'javascript', 'javascripts'],
      },
      {
        name: 'jest',
        folderNames: ['jest', 'jest-cache', 'jest-coverage'],
      },
      {
        name: 'jinja',
        folderNames: [
          'j2',
          'jinja',
          'jinja-templates',
          'jinja2',
          'jinja_templates',
        ],
      },
      {
        name: 'job',
        folderNames: ['job', 'jobs', 'resque', 'bull'],
      },
      {
        name: 'json',
        folderNames: [
          'json',
          'jsons',
          'serialization',
          'serializer',
          'serializers',
        ],
      },
      {
        name: 'jwt',
        folderNames: [
          'jwt',
          'jwt-keys',
          'jwt_keys',
          'jwtkeys',
          'token',
          'tokens',
        ],
      },
      {
        name: 'client',
        folderNames: ['client', 'clients', 'frontend', 'frontends', 'pwa'],
      },
      // endregion

      // region [K]
      {
        name: 'keys',
        folderNames: [
          'key',
          'keys',
          'secret',
          'secrets',
          'cert',
          'certs',
          'certificate',
          'certificates',
          'pem',
          'pems',
          'ssl',
          'ssh',
        ],
      },
      {
        name: 'kivy',
        folderNames: ['kivy', 'kv'],
      },
      {
        name: 'kotlin',
        folderNames: ['kotlin', 'kt', 'kts'],
      },
      {
        name: 'kubernetes',
        folderNames: [
          'k8s',
          'k8ses',
          'kube',
          'kubernetes',
          'kubes',
          'minikube',
        ],
      },
      {
        name: 'kustomize',
        folderNames: ['kustomize', 'kustomization', 'kustomizations'],
      },
      // endregion

      // region [L]
      {
        name: 'layouts',
        folderNames: [
          'fragment',
          'fragments',
          'layout',
          'layouts',
          'partial',
          'partials',
        ],
      },
      {
        name: 'less',
        folderNames: ['less'],
      },
      {
        name: 'linux',
        folderNames: ['linux', 'unix', 'nux', 'gnu'],
      },
      {
        name: 'logs',
        folderNames: ['log', 'logs'],
      },
      {
        name: 'lua',
        folderNames: ['lua', 'luac', 'luau'],
      },

      // endregion

      // region [M]
      {
        name: 'main',
        folderNames: ['main', 'mainapp', 'main-app'],
      },
      {
        name: 'mailers',
        folderNames: [
          'email',
          'emails',
          'mail',
          'mailer',
          'mailers',
          'mailing',
          'mailings',
          'mails',
        ],
      },
      {
        name: 'markdown',
        folderNames: ['markdown', 'md', 'mdown', 'mdx'],
      },
      {
        name: 'math',
        folderNames: [
          'algo',
          'algorithm',
          'algorithms',
          'algos',
          'computation',
          'computations',
          'compute',
          'computes',
          'formula',
          'formulas',
          'logic',
          'math',
          'mathjax',
          'maths',
          'scilab',
          'wolfram',
        ],
      },
      {
        name: 'maven',
        folderNames: ['maven', 'mvn', 'pom'],
      },
      {
        name: 'maps',
        folderNames: [
          'map',
          'maps',
          'mapping',
          'mappings',
          'mapper',
          'mappers',
        ],
      },
      {
        name: 'osx',
        folderNames: [
          'appex',
          'ccl',
          'ideplugin',
          'kext',
          'mdimporter',
          'osax',
          'osirixplugin',
          'qlgenerator',
        ],
      },
      {
        name: 'mac',
        folderNames: ['mac', 'macos', 'osx'],
      },
      {
        name: 'messages',
        folderNames: [
          'chat',
          'chatroom',
          'chatrooms',
          'chats',
          'comment',
          'comments',
          'forum',
          'forums',
          'message',
          'messages',
          'messaging',
          'msg',
          'msgs',
          'thread',
          'threads',
        ],
      },
      {
        name: 'mercurial',
        folderNames: ['hg', 'mercurial'],
      },
      {
        name: 'meta',
        folderNames: ['meta', 'metadata', 'metas'],
      },
      {
        name: 'meteor',
        folderNames: ['meteor'],
      },
      {
        name: 'middleware',
        folderNames: ['middleware', 'middlewares', 'thunk', 'thunks'],
      },
      {
        name: 'mjml',
        folderNames: ['mjml'],
      },
      {
        name: 'mobile',
        folderNames: ['mobile', 'mobiles', 'portable', 'portables'],
      },
      {
        name: 'mocks',
        folderNames: [
          'fake',
          'fakes',
          'mock',
          'mocks',
          'mockup',
          'mockups',
          'sketch',
          'sketches',
          'stub',
          'stubs',
          'wireframe',
          'wireframes',
        ],
      },
      {
        name: 'modals',
        folderNames: [
          'dialog',
          'dialogs',
          'modal',
          'modals',
          'popup',
          'popups',
          'usecase',
          'usecases',
        ],
      },
      {
        name: 'models',
        folderNames: [
          'class',
          'classes',
          'dto',
          'entities',
          'entity',
          'model',
          'models',
          'object',
          'objects',
          'struct',
          'structs',
        ],
      },
      {
        name: 'molecules',
        folderNames: ['molecule', 'molecules'],
      },
      {
        name: 'mongo',
        folderNames: ['mongo', 'mongodb', 'mongoid', 'mongoose'],
      },
      {
        name: 'moon',
        folderNames: ['moon', 'moonscript'],
      },

      // endregion

      // region [N]
      {
        name: 'navigation',
        folderNames: [
          'geo',
          'nav',
          'navigate',
          'navigation',
          'navigations',
          'navs',
        ],
      },
      {
        name: 'netlify',
        folderNames: ['netlify'],
      },
      {
        name: 'next',
        folderNames: ['next'],
      },
      {
        name: 'node',
        folderNames: ['node', 'node_modules', 'nodejs', 'npm'],
      },
      {
        name: 'notebooks',
        folderNames: [
          'jupyter',
          'jupyter-notebook',
          'jupyter-notebooks',
          'notebook',
          'notebooks',
        ],
      },
      {
        name: 'notification',
        folderNames: [
          'flash',
          'notif',
          'notification',
          'notifications',
          'notifs',
        ],
      },
      {
        name: 'nuget',
        folderNames: ['nuget', 'nupkg'],
      },
      {
        name: 'nuxt',
        folderNames: ['nuxt'],
      },
      // endregion

      // region [O]
      {
        name: 'openshift',
        folderNames: ['openshift'],
      },
      {
        name: 'other',
        folderNames: [
          'etc',
          'extra',
          'extras',
          'misc',
          'miscellaneous',
          'other',
          'others',
        ],
      },
      // endregion

      // region [P]
      {
        name: 'packages',
        folderNames: [
          'bundle',
          'bundles',
          'module',
          'modules',
          'package',
          'packages',
          'paket',
          'pkg',
          'pkgs',
        ],
      },
      {
        name: 'perl',
        folderNames: ['perl', 'pl'],
      },
      {
        name: 'pdf',
        folderNames: ['acrobat', 'adobe', 'pdf', 'pdfs'],
      },
      {
        name: 'php',
        folderNames: ['php', 'phpcs', 'phpmailer', 'phpt', 'phtml'],
      },
      {
        name: 'pinia',
        folderNames: ['pinia'],
      },
      {
        name: 'pipe',
        folderNames: ['pipe', 'pipes', 'filter', 'filters'],
      },
      {
        name: 'platformio',
        folderNames: ['pio', 'pioenv', 'pioenvs', 'platformio'],
      },
      {
        name: 'playwright',
        folderNames: ['playwright', 'pw'],
      },
      {
        name: 'plugin',
        folderNames: [
          'extension',
          'extensions',
          'mu-plugin',
          'mu-plugins',
          'plugin',
          'plugins',
        ],
      },
      {
        name: 'posts',
        folderNames: ['post', 'posts'],
      },
      {
        name: 'protobuf',
        folderNames: ['proto', 'protobuf'],
      },
      {
        name: 'prisma',
        folderNames: ['prisma'],
      },
      {
        name: 'private',
        folderNames: ['private', 'privates'],
      },
      {
        name: 'project',
        folderNames: ['project', 'projects', 'proj'],
      },
      {
        name: 'projects',
        folderNames: ['folder', 'folders', 'workspace', 'workspaces'],
      },
      {
        name: 'providers',
        folderNames: ['provider', 'providers'],
      },
      {
        name: 'python',
        folderNames: ['python', 'py', 'pytest_cache', '__pycache__'],
      },
      // endregion

      // region [Q]
      {
        name: 'quasar',
        folderNames: ['quasar'],
      },
      {
        name: 'quantum',
        folderNames: ['qtn', 'quantum'],
      },
      {
        name: 'queries',
        folderNames: ['query', 'queries'],
      },
      {
        name: 'queue',
        folderNames: ['bull', 'mq', 'queue', 'queues'],
      },
      // endregion

      // region [R]
      {
        name: 'react',
        folderNames: [
          'jsx',
          'react',
          'react-native',
          'react-scripts',
          'react_components',
          'react_scripts',
          'tsx',
        ],
      },
      {
        name: 'redhat',
        folderNames: ['redhat', 's2i'],
      },
      {
        name: 'redis',
        folderNames: ['redis'],
      },
      {
        name: 'redwood',
        folderNames: ['redwood'],
      },
      {
        name: 'recoil',
        folderNames: ['coil', 'recoil'],
      },
      {
        name: 'redux',
        folderNames: ['flux', 'organism', 'organisms', 'redux', 'rtk'],
      },
      {
        name: 'redux-actions',
        folderNames: ['action', 'actions', 'redux-actions'],
      },
      {
        name: 'redux-epics',
        folderNames: ['epic', 'epics', 'redux-epics'],
      },
      {
        name: 'redux-reducers',
        folderNames: ['reducer', 'reducers', 'redux-reducers'],
      },
      {
        name: 'redux-sagas',
        folderNames: [
          'effect',
          'effects',
          'redux-effects',
          'redux-sagas',
          'saga',
          'sagas',
        ],
      },
      {
        name: 'redux-stores',
        folderNames: [
          'redux-states',
          'redux-stores',
          'state',
          'states',
          'store',
          'stores',
        ],
      },
      {
        name: 'relay',
        folderNames: ['relay'],
      },
      {
        name: 'resolver',
        folderNames: ['resolver', 'resolvers', 'value', 'values'],
      },
      {
        name: 'resource',
        folderNames: [
          'asset',
          'assets',
          'report',
          'reports',
          'res',
          'resource',
          'resources',
        ],
      },
      {
        name: 'reviews',
        folderNames: [
          'pr',
          'prs',
          'pull',
          'pullrequest',
          'pullrequests',
          'pulls',
          'review',
          'reviewed',
          'reviews',
          'revision',
          'revisions',
        ],
      },
      {
        name: 'root',
        folderNames: ['root', 'roots'],
      },
      {
        name: 'routes',
        folderNames: ['route', 'routes', 'router', 'routers', 'routing'],
      },
      {
        name: 'ruby',
        folderNames: [
          'gem',
          'gem_rbs_collection',
          'gems',
          'rb',
          'rubies',
          'ruby',
          'sig',
        ],
      },
      {
        name: 'rules',
        folderNames: [
          'rule',
          'rules',
          'validation',
          'validations',
          'validator',
          'validators',
        ],
      },
      {
        name: 'rust',
        folderNames: ['cargo', 'rust', 'rs'],
      },
      // endregion

      // region [S]
      {
        name: 'sass',
        folderNames: ['sass', 'scss'],
      },
      {
        name: 'scala',
        folderNames: ['scala', 'sbt', 'sbt_modules'],
      },
      {
        name: 'screens',
        folderNames: [
          'capture',
          'captures',
          'screen',
          'screens',
          'screenshot',
          'screenshots',
          'screenvid',
          'screenvids',
        ],
      },
      {
        name: 'scripts',
        folderNames: [
          'polyfill',
          'polyfills',
          'script',
          'scripts',
          'selector',
          'selectors',
        ],
      },
      {
        name: 'scratch',
        folderNames: [
          'note',
          'notes',
          'scratch',
          'scratches',
          'scratchpad',
          'todo',
          'todos',
        ],
      },
      {
        name: 'security',
        folderNames: ['security', 'secure'],
      },
      {
        name: 'server',
        folderNames: [
          'backend',
          'http',
          'qa',
          'request',
          'requests',
          'response',
          'responses',
          'server',
          'servers',
          'staging',
        ],
      },
      {
        name: 'serverless',
        folderNames: ['infra', 'infrastructure', 'serverless'],
      },
      {
        name: 'shader',
        folderNames: [
          'glsl',
          'hlsl',
          'shader',
          'shaders',
          'vertex',
          'vertices',
        ],
      },
      {
        name: 'shared',
        folderNames: [
          'common',
          'commons',
          'share',
          'shared',
          'shared_components',
        ],
      },
      {
        name: 'src',
        folderNames: [
          'buildSrc',
          'code',
          'source',
          'sources',
          'src',
          'srcs',
          'srcset',
        ],
      },
      {
        name: 'sql',
        folderNames: [
          'maria',
          'mariadb',
          'mssql',
          'mysql',
          'pgsql',
          'postgres',
          'postgresql',
          'sql',
          'sqlite',
          'sqlserver',
        ],
      },
      {
        name: 'stack',
        folderNames: ['stack', 'stacks', 'structure', 'structures'],
      },
      {
        name: 'stencil',
        folderNames: ['stencil'],
      },
      {
        name: 'storage',
        folderNames: [
          'bucket',
          'buckets',
          'packet',
          'packets',
          'storage',
          'storages',
        ],
      },
      {
        name: 'storybook',
        folderNames: [
          '__stories__',
          'stories',
          'story',
          'storybook',
          'storybooks',
        ],
      },
      {
        name: 'storyblok',
        folderNames: ['storyblok', 'storybloks'],
      },
      {
        name: 'strategy',
        folderNames: ['strategy', 'strategies'],
      },
      {
        name: 'styles',
        folderNames: ['css', 'style', 'styles', 'stylesheet', 'stylesheets'],
      },
      {
        name: 'stylus',
        folderNames: ['styl', 'stylus'],
      },
      {
        name: 'sublime',
        folderNames: ['sublime'],
      },
      {
        name: 'supabase',
        folderNames: ['supabase'],
      },
      {
        name: 'svelte',
        folderNames: [
          'sapper',
          'svelte',
          'svelte-kit',
          'svelte_components',
          'sveltekit',
        ],
      },
      {
        name: 'svg',
        folderNames: [
          'gfx',
          'graphic',
          'graphics',
          'svg',
          'svgicon',
          'svgicons',
          'svgimage',
          'svgimages',
          'svgs',
          'vector',
          'vectors',
        ],
      },
      {
        name: 'svn',
        folderNames: ['svn', 'subversion'],
      },
      {
        name: 'sync',
        folderNames: ['sync', 'syncs', 'synced'],
      },
      {
        name: 'syntax',
        folderNames: [
          'grammar',
          'grammars',
          'spellcheck',
          'syntax',
          'syntaxes',
        ],
      },
      // endregion

      // region [T]
      {
        name: 'target',
        folderNames: ['target', 'targets'],
      },
      {
        name: 'tasks',
        folderNames: [
          'cli',
          'cmd',
          'command',
          'commands',
          'console',
          'consoles',
          'run',
          'task',
          'tasks',
          'terminal',
          'ticket',
          'tickets',
          'workflow',
          'workflows',
        ],
      },
      {
        name: 'taskfile',
        folderNames: ['taskfile', 'taskfiles'],
      },
      {
        name: 'tauri',
        folderNames: ['tauri', 'src-tauri'],
      },
      {
        name: 'tech',
        folderNames: ['tech', 'technologies', 'technology'],
      },
      {
        name: 'temp',
        folderNames: [
          'cache',
          'caches',
          'temp',
          'temporary',
          'temps',
          'tmp',
          'tmps',
        ],
      },
      {
        name: 'tests',
        folderNames: [
          '__tests__',
          'junit',
          'phpunit',
          'pytest',
          'rspec',
          'spec',
          'specs',
          'test',
          'testcase',
          'testcases',
          'tests',
          'unit',
          'units',
        ],
      },
      {
        name: 'terraform',
        folderNames: [
          'hcl',
          'terraform',
          'terragrunt',
          'tf',
          'tfstate',
          'tfvars',
        ],
      },
      {
        name: 'textmate',
        folderNames: ['textmate', 'tmbundle'],
      },
      {
        name: 'trait',
        folderNames: ['trait', 'traits'],
      },
      {
        name: 'themes',
        folderNames: [
          'color',
          'colors',
          'design',
          'designs',
          'palette',
          'palettes',
          'scheme',
          'schemes',
          'skin',
          'skins',
          'theme',
          'themes',
        ],
      },
      {
        name: 'ts',
        folderNames: [
          '@types',
          'interface',
          'interfaces',
          'ts',
          'tsconfig',
          'type',
          'types',
          'typescript',
          'typings',
        ],
      },
      // endregion

      // region [U]
      {
        name: 'unity',
        folderNames: ['unity', 'unity3d'],
      },
      {
        name: 'upload',
        folderNames: [
          'update',
          'updated',
          'updates',
          'upgrade',
          'upgraded',
          'upgrades',
          'upload',
          'uploaded',
          'uploads',
        ],
      },
      {
        name: 'users',
        folderNames: [
          'account',
          'accounts',
          'contact',
          'contacts',
          'friend',
          'friends',
          'member',
          'members',
          'partner',
          'partners',
          'profile',
          'profiles',
          'role',
          'roles',
          'user',
          'users',
        ],
      },
      {
        name: 'tools',
        folderNames: [
          'tool',
          'toolbox',
          'toolboxes',
          'toolkit',
          'toolkits',
          'tools',
          'util',
          'utilities',
          'utility',
          'utils',
        ],
      },
      // endregion

      // region [V]
      {
        name: 'vagrant',
        folderNames: ['vagrant', 'vagrant.d', 'vagrantfile', 'vagrantfiles'],
      },
      {
        name: 'lib',
        folderNames: [
          'lib',
          'libraries',
          'library',
          'libs',
          'pod',
          'pods',
          'stdlib',
          'vendor',
          'vendors',
        ],
      },
      {
        name: 'venv',
        folderNames: ['venv', 'virtualenv'],
      },
      {
        name: 'vercel',
        folderNames: ['now', 'vercel'],
      },
      {
        name: 'verdaccio',
        folderNames: ['verdaccio'],
      },
      {
        name: 'video',
        folderNames: ['movie', 'movies', 'video', 'videos'],
      },
      {
        name: 'views',
        folderNames: [
          'html',
          'page',
          'pages',
          'template',
          'templates',
          'view',
          'views',
          'webpage',
          'webpages',
        ],
      },
      {
        name: 'viewmodel',
        folderNames: ['crud', 'viewmodel', 'viewmodels'],
      },
      {
        name: 'vm',
        folderNames: ['desktop', 'virtual', 'vm', 'vms'],
      },
      {
        name: 'vs',
        folderNames: ['vs', 'visualstudio', 'vsix'],
      },
      {
        name: 'vitepress',
        folderNames: ['vitepress'],
      },
      {
        name: 'vscode',
        folderNames: ['vscode', 'vscode-test', 'vssettings'],
      },
      {
        name: 'vue',
        folderNames: ['vue'],
      },
      {
        name: 'vuepress',
        folderNames: ['vuepress'],
      },
      {
        name: 'vuex',
        folderNames: ['vuex'],
      },
      // endregion

      // region [W]
      {
        name: 'web',
        folderNames: [
          'public',
          'public_html',
          'static',
          'web',
          'website',
          'websites',
          'www',
          'wwwroot',
        ],
      },
      {
        name: 'webpack',
        folderNames: ['webpack', 'webpack.d', 'webpackfile', 'webpackfiles'],
      },
      {
        name: 'windows',
        folderNames: ['windows', 'win'],
      },
      {
        name: 'wine',
        folderNames: ['wine'],
      },
      {
        name: 'woocommerce',
        folderNames: ['woocommerce'],
      },
      {
        name: 'woodpecker',
        folderNames: ['woodpecker'],
      },
      {
        name: 'wordpress',
        folderNames: [
          'wordpress',
          'wp',
          'wp-admin',
          'wp-content',
          'wp-includes',
        ],
      },
      // endregion

      // region [X]
      {
        name: 'xstate',
        folderNames: ['xstate', 'machine', 'machines'],
      },
      // endregion

      // region [Y]
      {
        name: 'yarn',
        folderNames: ['yarn'],
      },
      // endregion

      // region [Z]
      // {
      //   name: 'zod',
      //   folderNames: ['zod'],
      // },
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

import {IconPack} from "../@types/config";

import type {LanguageAssociation} from 'src/@types/associations';

/**
 * Defines icons for language ids
 */
export const languageIcons: LanguageAssociation[] = [
  {
    icon: {name: 'preferences'},
    ids: ['ini'],
    name: 'preferences',
  },
  {
    icon: {name: 'source'},
    ids: ['properties', 'plist'],
    name: 'source',
  },
  // {
  //   icon: { name: 'twine' },
  //   ids: ['twee3', 'twee3-harlowe-3', 'twee3-chapbook-1', 'twee3-sugarcube-2'],
  // },
  // { icon: { name: 'angular' }, ids: ['ng-template'] },
  // { icon: { name: 'apiblueprint' }, ids: ['apiblueprint'] },
  // { icon: { name: 'applescript' }, ids: ['applescript'] },
  // { icon: { name: 'autoit' }, ids: ['autoit'] },
  // { icon: { name: 'blink' }, ids: ['blink'] },
  // { icon: { name: 'c' }, ids: ['c', 'objective-c', 'objective-cpp'] },
  // { icon: { name: 'cabal' }, ids: ['cabal'] },
  // { icon: { name: 'cake' }, ids: ['cake'] },
  // { icon: { name: 'chess' }, ids: ['pgn'] },
  {
    icon: {name: 'clojure'},
    ids: ['clojure'],
    name: 'clojure'
  },
  {
    icon: {name: 'coffeescript'},
    ids: ['coffee', 'coffeescript', 'iced', 'litcoffee'],
    name: 'coffeescript'
  },
  {
    icon: {name: 'coldfusion'},
    ids: ['coldfusion', 'lang-cfml'],
    name: 'coldfusion'
  },
  // { icon: { name: 'console' }, ids: ['bat', 'awk', 'shellscript'] },
  // { icon: { name: 'cpp' }, ids: ['cpp'] },
  // { icon: { name: 'csharp' }, ids: ['csharp'] },
  {
    icon: {name: 'css'},
    ids: ['css', 'tss'],
    name: 'css'
  },
  // { icon: { name: 'cucumber' }, ids: ['cucumber'] },
  {
    icon: {name: 'dart'},
    ids: ['dart'],
    name: 'dart'
  },
  // { icon: { name: 'dhall' }, ids: ['dhall'] },
  // { icon: { name: 'diff' }, ids: ['diff'] },
  // { icon: { name: 'django' }, ids: ['django-html', 'django-txt'] },
  {
    icon: {name: 'dlang'},
    ids: ['d', 'dlang'],
    name: 'dlang'
  },
  {
    icon: {name: 'db'},
    ids: ['db', 'termcap', 'terminfo'],
    name: 'db'
  },
  // { icon: { name: 'docker' }, ids: ['dockerfile'] },
  // { icon: { name: 'document' }, ids: ['plaintext'] },
  // { icon: { name: 'editorconfig' }, ids: ['editorconfig'] },
  // { icon: { name: 'elixir' }, ids: ['elixir'] },
  // { icon: { name: 'elm' }, ids: ['elm'] },
  {
    icon: {name: 'font'},
    ids: ['dfont', 'eot', 'otf', 'pfa', 'pfb', 'pfm', 'tfm', 'ttc', 'ttf', 'woff', 'woff2'],
    name: 'font'
  },
  // { icon: { name: 'erlang' }, ids: ['erlang'] },
  // { icon: { name: 'fsharp' }, ids: ['fsharp'] },
  // { icon: { name: 'gemini' }, ids: ['gemini', 'text-gemini'] },
  {
    icon: {name: 'git'},
    ids: ['git', 'gitattributes', 'git-commit', 'git-rebase'],
    name: 'git'
  },
  {
    icon: {name: 'gitignore'},
    ids: ['gitignore'],
    name: 'gitignore'
  },
  {
    icon: {name: 'go'},
    ids: ['go', 'go-template'],
    name: 'go'
  },
  // { icon: { name: 'go_gopher' }, ids: [] },
  // { icon: { name: 'godot' }, ids: ['gdscript'] },
  // { icon: { name: 'grain' }, ids: ['grain'] },
  // { icon: { name: 'graphql' }, ids: ['graphql'] },
  // { icon: { name: 'groovy' }, ids: ['groovy'] },
  // { icon: { name: 'hack' }, ids: ['hack'] },
  // { icon: { name: 'haml' }, ids: ['haml'] },
  // { icon: { name: 'handlebars' }, ids: ['handlebars'] },
  // { icon: { name: 'haskell' }, ids: ['haskell'] },
  // { icon: { name: 'haxe' }, ids: ['haxe', 'hxml'] },
  // { icon: { name: 'hcl' }, ids: ['hcl'] },
  {
    icon: {name: 'html'},
    ids: ['html'],
    name: 'html'
  },
  // { icon: { name: 'idris' }, ids: ['idris'] },
  {
    icon: {name: 'java'},
    ids: ['java'],
    name: 'java'
  },
  {
    icon: {
      name: 'js'
    },
    ids: ['cjs', 'javascript', 'mjs', 'es6'],
    name: 'js'
  },
  {
    icon: {name: 'jsx'},
    ids: ['jsx', 'javascriptreact', 'typescriptreact'],
    name: 'jsx'
  },
  // { icon: { name: 'jinja' }, ids: ['jinja'] },
  {
    icon: {name: 'json'},
    ids: ['cson', 'json', 'jsonc', 'ndjson', 'rdjson'],
    name: 'json'
  },
  {
    icon: {name: 'json5'},
    ids: ['json5'],
    name: 'json5'
  },
  // { icon: { name: 'julia' }, ids: ['julia'] },
  // { icon: { name: 'jupyter' }, ids: ['jupyter'] },
  {
    icon: {name: 'kotlin'},
    ids: ['kotlin'],
    name: 'kotlin'
  },
  {
    icon: {name: 'kotlinscript'},
    ids: ['kotlinscript'],
    name: 'kotlinscript'
  },
  // { icon: { name: 'kusto' }, ids: ['kql'] },
  {
    icon: {name: 'less'},
    ids: ['less'],
    name: 'less'
  },
  // { icon: { name: 'lib' }, ids: ['bibtex', 'bibtex-style'] },
  // { icon: { name: 'livescript' }, ids: ['livescript'] },
  // { icon: { name: 'lock' }, ids: ['ssh_config'] },
  // { icon: { name: 'log' }, ids: ['log'] },
  // { icon: { name: 'lolcode' }, ids: ['lolcode'] },
  {
    icon: {name: 'lua'},
    ids: ['lua'],
    name: 'lua'
  },
  {
    icon: {name: 'markdown'},
    ids: ['markdown', 'pmd'],
    name: 'markdown'
  },
  // { icon: { name: 'matlab' }, ids: ['matlab'] },
  // { icon: { name: 'minecraft' }, ids: ['mcfunction'] },
  // { icon: { name: 'mjml' }, ids: ['mjml'] },
  // { icon: { name: 'nim' }, ids: ['nim', 'nimble'] },
  // { icon: { name: 'nix' }, ids: ['nix'] },
  {
    icon: {name: 'nginx'},
    ids: ['nginx'],
    name: 'nginx'
  },
  // { icon: { name: 'nodejs_alt' }, ids: [] },
  // { icon: { name: 'nunjucks' }, ids: ['nunjucks'] },
  // { icon: { name: 'otne' }, ids: ['otne'] },
  // { icon: { name: 'pawn' }, ids: ['pawn'] },
  // { icon: { name: 'pdf' }, ids: ['pdf'] },
  // { icon: { name: 'perl' }, ids: ['perl', 'perl6'] },
  {
    icon: {name: 'perl'},
    ids: ['perl', 'perl6'],
    name: 'perl'
  },
  {
    icon: {name: 'php'},
    ids: ['php'],
    name: 'php'
  },
  // { icon: { name: 'php_elephant' }, ids: [] },
  // { icon: { name: 'php_elephant_pink' }, ids: [] },
  // { icon: { name: 'postcss' }, ids: ['postcss'] },
  // { icon: { name: 'powershell' }, ids: ['powershell'] },
  // { icon: { name: 'processing' }, ids: ['processing'] },
  // { icon: { name: 'prolog' }, ids: ['prolog'] },
  // { icon: { name: 'proto' }, ids: ['proto'] },
  // { icon: { name: 'pug' }, ids: ['jade'] },
  // { icon: { name: 'pug' }, ids: ['pug'] },
  // { icon: { name: 'puppet' }, ids: ['puppet'] },
  // { icon: { name: 'purescript' }, ids: ['purescript'] },
  // { icon: { name: 'python' }, ids: ['python'] },
  {
    icon: {name: 'python'},
    ids: ['python'],
    name: 'python'
  },
  // { icon: { name: 'python-misc' }, ids: ['pip-requirements'] },
  // { icon: { name: 'r' }, ids: ['r', 'rsweave'] },
  // { icon: { name: 'razor' }, ids: ['razor', 'aspnetcorerazor'] },
  // { icon: { name: 'react' }, ids: ['javascriptreact'] },
  // { icon: { name: 'react_ts' }, ids: ['typescriptreact'] },
  // { icon: { name: 'reason' }, ids: ['reason', 'reason_lisp'] },
  // { icon: { name: 'rescript' }, ids: ['rescript'] },
  // { icon: { name: 'riot' }, ids: ['riot'] },
  // { icon: { name: 'robot' }, ids: ['robotframework'] },
  // { icon: { name: 'ruby' }, ids: ['ruby'] },
  {
    icon: {name: 'ruby'},
    ids: ['rabl', 'ruby'],
    name: 'ruby'
  },
  // { icon: { name: 'rust' }, ids: ['rust'] },
  // { icon: { name: 'salesforce' }, ids: ['apex'] },
  // { icon: { name: 'sas' }, ids: ['sas'] },


  // { icon: { name: 'search' }, ids: ['search-result'] },
  // { icon: { name: 'shader' }, ids: ['hlsl', 'glsl', 'wgsl'] },

  // { icon: { name: 'shaderlab' }, ids: ['shaderlab'] },
  // { icon: { name: 'silverstripe' }, ids: ['ss'] },
  // { icon: { name: 'slim' }, ids: ['slim'] },
  // { icon: { name: 'sml' }, ids: ['sml'] },
  // { icon: { name: 'solidity' }, ids: ['solidity'] },
  // { icon: { name: 'stylus' }, ids: ['stylus'] },
  // { icon: { name: 'svelte' }, ids: ['svelte'] },
  // { icon: { name: 'svg' }, ids: ['svg'] },
  {
    icon: {name: 'swift'},
    ids: ['swift'],
    name: 'swift'
  },

  // region [S]
  {
    icon: {name: 'sac'},
    ids: ['sac'],
    name: 'sac'
  },
  {
    icon: {name: 'sage'},
    ids: ['sage'],
    name: 'sage'
  },
  {
    icon: {name: 'saltstack'},
    ids: ['saltstack', 'sls', 'tst'],
    name: 'saltstack'
  },
  {
    icon: {name: 'san'},
    ids: ['san', 'san-directives', 'san-interpolations', 'san-html', 'san-postcss'],
    name: 'san'
  },
  {
    icon: {name: 'sandbox'},
    ids: ['sandbox'],
    name: 'sandbox'
  },
  {
    icon: {name: 'sas'},
    ids: ['sas', 'sas-log'],
    name: 'sas'
  },
  {
    icon: {name: 'sass'},
    ids: ['sass'],
    name: 'sass'
  },
  {
    icon: {name: 'sbt'},
    ids: ['sbt'],
    name: 'sbt'
  },
  {
    icon: {name: 'scala'},
    ids: ['scala'],
    name: 'scala'
  },
  {
    icon: {name: 'scss'},
    ids: ['scss'],
    name: 'scss'
  },
  {
    icon: {name: 'scheme'},
    ids: ['scheme'],
    name: 'scheme'
  },
  {
    icon: {name: 'scilla'},
    ids: ['scilla'],
    name: 'scilla'
  },
  {
    icon: {name: 'scilab'},
    ids: ['scilab'],
    name: 'scilab'
  },
  {
    icon: {name: 'scratch'},
    ids: ['scratch', 'sb2', 'sb3'],
    name: 'scratch'
  },
  {
    icon: {name: 'sdlang'},
    ids: ['sdlang', 'sdl'],
    name: 'sdlang'
  },
  {
    icon: {name: 'self'},
    ids: ['self'],
    name: 'self'
  },
  {
    icon: {name: 'servicefabric'},
    ids: ['servicefabric', 'sf'],
    name: 'servicefabric'
  },
  {
    icon: {name: 'shellcheckrc'},
    ids: ['shellcheckrc', 'shellcheck-output'],
    name: 'shellcheckrc'
  },
  {
    icon: {name: 'shell'},
    ids: ['sh', 'shell', 'shellscript'],
    name: 'shell'
  },
  {
    icon: {name: 'shen'},
    ids: ['shen'],
    name: 'shen'
  },
  {
    icon: {name: 'shipit'},
    ids: ['shipit', 'shipitfile'],
    name: 'shipit'
  },
  {
    icon: {name: 'silverstripe'},
    ids: ['silverstripe'],
    name: 'silverstripe'
  },
  {
    icon: {name: 'siyuan'},
    ids: ['siyuan'],
    name: 'siyuan'
  },
  {
    icon: {name: 'skipper'},
    ids: ['skipper', 'eskip'],
    name: 'skipper'
  },
  {
    icon: {name: 'skript'},
    ids: ['skript', 'sk', 'skriptlang', 'sk-vsc'],
    name: 'skript'
  },
  {
    icon: {name: 'slang'},
    ids: ['slang'],
    name: 'slang'
  },
  {
    icon: {name: 'slash'},
    ids: ['slash'],
    name: 'slash'
  },
  {
    icon: {name: 'slice'},
    ids: ['slice'],
    name: 'slice'
  },
  {
    icon: {name: 'slim'},
    ids: ['slim'],
    name: 'slim'
  },
  {
    icon: {name: 'slug'},
    ids: ['slug'],
    name: 'slug'
  },
  {
    icon: {name: 'smarty'},
    ids: ['smarty'],
    name: 'smarty'
  },
  {
    icon: {name: 'smithy'},
    ids: ['smithy'],
    name: 'smithy'
  },
  {
    icon: {name: 'sml'},
    ids: ['sml'],
    name: 'sml'
  },
  {
    icon: {name: 'snakemake'},
    ids: ['snakemake'],
    name: 'snakemake'
  },
  {
    icon: {name: 'snapshot'},
    ids: ['snapshot', 'jest-snapshot'],
    name: 'snapshot'
  },
  {
    icon: {name: 'snort'},
    ids: ['snort'],
    name: 'snort'
  },
  {
    icon: {name: 'snyk'},
    ids: ['snyk'],
    name: 'snyk'
  },
  {
    icon: {name: 'solidity'},
    ids: ['solidity'],
    name: 'solidity'
  },
  {
    icon: {name: 'sonar'},
    ids: ['sonar', 'sonarlint', 'sonarqube'],
    name: 'sonar'
  },
  {
    icon: {name: 'sophia'},
    ids: ['sophia'],
    name: 'sophia'
  },
  {
    icon: {name: 'sorbet'},
    ids: ['sorbet'],
    name: 'sorbet'
  },
  {
    icon: {name: 'spaceengine'},
    ids: ['spaceengine'],
    name: 'spaceengine'
  },
  {
    icon: {name: 'sparql'},
    ids: ['sparql'],
    name: 'sparql'
  },
  {
    icon: {name: 'spring'},
    ids: ['spring', 'spring-boot-properties', 'spring-boot-properties-yaml', 'spring-factories'],
    name: 'spring'
  },
  {
    icon: {name: 'sqf'},
    ids: ['sqf'],
    name: 'sqf'
  },
  {
    icon: {name: 'sql'},
    ids: ['mysql', 'sql', 'plsql', 'oraclesql'],
    name: 'sql'
  },
  {
    icon: {name: 'sqlite'},
    ids: ['sqlite'],
    name: 'sqlite'
  },
  {
    icon: {name: 'squarespace'},
    ids: ['squarespace', 'jsont'],
    name: 'squarespace'
  },
  {
    icon: {name: 'squirrel'},
    ids: ['squirrel'],
    name: 'squirrel'
  },
  {
    icon: {name: 'stan'},
    ids: ['stan'],
    name: 'stan'
  },
  {
    icon: {name: 'stata'},
    ids: ['stata', 'stata-dyndoc-latex', 'stata-dyndoc-md', 'stata-dyndoc'],
    name: 'stata'
  },
  {
    icon: {name: 'stencil'},
    ids: ['stencil', 'stencil-html'],
    name: 'stencil'
  },
  {
    icon: {name: 'storyboard'},
    ids: ['storyboard'],
    name: 'storyboard'
  },
  {
    icon: {name: 'storyist'},
    ids: ['storyist', 'story'],
    name: 'storyist'
  },
  {
    icon: {name: 'storybook'},
    ids: ['storybook'],
    name: 'storybook'
  },
  {
    icon: {name: 'stylelint'},
    ids: ['stylelint'],
    name: 'stylelint'
  },
  {
    icon: {name: 'styleguidist'},
    ids: ['styleguidist'],
    name: 'styleguidist'
  },
  {
    icon: {name: 'stylable'},
    ids: ['stylable'],
    name: 'stylable'
  },
  {
    icon: {name: 'styledcomponents'},
    ids: ['styledcomponents', 'source.css.styled', 'styled-css', 'source.css.jsx.styled'],
    name: 'styledcomponents'
  },
  {
    icon: {name: 'stylus'},
    ids: ['stylus', 'styl'],
    name: 'stylus'
  },
  {
    icon: {name: 'subtitle'},
    ids: ['subtitle', 'subtitles', 'lrc', 'srt', 'ass'],
    name: 'subtitle'
  },
  {
    icon: {name: 'scd'},
    ids: ['scd'],
    name: 'scd'
  },
  {
    icon: {name: 'sss'},
    ids: ['sss'],
    name: 'sss'
  },
  {
    icon: {name: 'svelte'},
    ids: ['svelte'],
    name: 'svelte'
  },
  {
    icon: {name: 'svgo'},
    ids: ['svgo'],
    name: 'svgo'
  },
  {
    icon: {name: 'svx'},
    ids: ['svx', 'mdsvex'],
    name: 'svx'
  },
  {
    icon: {name: 'swagger'},
    ids: ['swagger', 'swag'],
    name: 'swagger'
  },
  {
    icon: {name: 'swig'},
    ids: ['swig'],
    name: 'swig'
  },
  // endregion

  // region [T]
  {
    icon: {name: 'toc'},
    ids: ['toc'],
    name: 'toc'
  },
  {
    icon: {name: 'tailwindcss'},
    ids: ['tailwindcss'],
    name: 'tailwindcss'
  },
  {
    icon: {name: 'todo'},
    ids: ['todo'],
    name: 'todo'
  },
  {
    icon: {name: 'tcl'},
    ids: ['tcl'],
    name: 'tcl'
  },
  {
    icon: {name: 'tea'},
    ids: ['tea'],
    name: 'tea'
  },
  {
    icon: {name: 'teal'},
    ids: ['teal'],
    name: 'teal'
  },
  {
    icon: {name: 'telegram'},
    ids: ['telegram', 'tgiv'],
    name: 'telegram'
  },
  {
    icon: {name: 'tt'},
    ids: ['tt', 'tt2', 'tt4'],
    name: 'tt'
  },
  {
    icon: {name: 'tera'},
    ids: ['tera', 'ttl'],
    name: 'tera'
  },
  {
    icon: {name: 'terraform'},
    ids: ['terraform', 'tf', 'tfvars', 'terraform-vars'],
    name: 'terraform'
  },
  {
    icon: {name: 'template'},
    ids: ['template'],
    name: 'template'
  },
  {
    icon: {name: 'text'},
    ids: ['abt', 'ans', 'brf', 'dri', 'lcov', 'no', 'rtf', 'text', 'plaintext'],
    name: 'text'
  },
  {
    icon: {name: 'tex'},
    ids: ['tex', 'latex', 'doctex', 'latex-expl3', 'django-tex'],
    name: 'tex'
  },
  {
    icon: {name: 'textile'},
    ids: ['textile'],
    name: 'textile'
  },
  {
    icon: {name: 'textmate'},
    ids: ['textmate', 'json-tmlanguage', 'yaml-tmlanguage'],
    name: 'textmate'
  },
  {
    icon: {name: 'thor'},
    ids: ['thor'],
    name: 'thor'
  },
  {
    icon: {name: 'thrift'},
    ids: ['thrift'],
    name: 'thrift'
  },
  {
    icon: {name: 'thunderclient'},
    ids: ['thunderclient', 'thunder'],
    name: 'thunderclient'
  },
  {
    icon: {name: 'tilt'},
    ids: ['tilt', 'tiltfile'],
    name: 'tilt'
  },
  {
    icon: {name: 'tla'},
    ids: ['tla', 'tlaplus', 'tlaplus_cfg', 'tlaplus_out'],
    name: 'tla'
  },
  {
    icon: {name: 'tmux'},
    ids: ['tmux'],
    name: 'tmux'
  },
  {
    icon: {name: 'todo'},
    ids: ['todo'],
    name: 'todo'
  },
  {
    icon: {name: 'toit'},
    ids: ['toit'],
    name: 'toit'
  },
  {
    icon: {name: 'toml'},
    ids: ['toml'],
    name: 'toml'
  },
  {
    icon: {name: 'tsconfig'},
    ids: ['tsconfig'],
    name: 'tsconfig'
  },
  {
    icon: {name: 'ttcn'},
    ids: ['ttcn', 'ttcn3'],
    name: 'ttcn'
  },
  {
    icon: {name: 'tuc'},
    ids: ['tuc'],
    name: 'tuc'
  },
  {
    icon: {name: 'turing'},
    ids: ['turing'],
    name: 'turing'
  },
  {
    icon: {name: 'twig'},
    ids: ['twig'],
    name: 'twig'
  },
  {
    icon: {name: 'twine'},
    ids: ['twee', 'twine', 'twee3', 'twee3-chapbook-1', 'twee3-harlowe-3', 'twee3-sugarcube-2'],
    name: 'twine'
  },
  {
    icon: {name: 'txl'},
    ids: ['txl'],
    name: 'txl'
  },
  {
    icon: {name: 'typeScript'},
    ids: ['tslint', 'typescript'],
    name: 'typeScript'
  },
  {
    icon: {name: 'typo3'},
    ids: ['typoscript'],
    name: 'typo3'
  },
  // endregion

  // region [U]
  {
    icon: {name: 'uml'},
    ids: ['uml', 'plantuml'],
    name: 'uml'
  },
  {
    icon: {name: 'unity'},
    ids: ['unity'],
    name: 'unity'
  },
  {
    icon: {name: 'uos'},
    ids: ['uos'],
    name: 'uos'
  },
  {
    icon: {name: 'unison'},
    ids: ['unison'],
    name: 'unison'
  },
  {
    icon: {name: 'unreal'},
    ids: ['unreal', 'unrealscript', 'unrealscript-pp'],
    name: 'unreal'
  },
  // endregion

  // region [V]
  {
    icon: {name: 'v'},
    ids: ['v'],
    name: 'v'
  },
  {
    icon: {name: 'vala'},
    ids: ['vala'],
    name: 'vala'
  },
  {
    icon: {name: 'vash'},
    ids: ['vash'],
    name: 'vash'
  },
  {
    icon: {name: 'vcl'},
    ids: ['vcl'],
    name: 'vcl'
  },
  {
    icon: {name: 'velocity'},
    ids: ['velocity', 'vtl', 'fhtml'],
    name: 'velocity'
  },
  {
    icon: {name: 'verilog'},
    ids: ['verilog', 'systemverilog', 'bhv'],
    name: 'verilog'
  },
  {
    icon: {name: 'vhdl'},
    ids: ['vhd', 'vhdl'],
    name: 'vhdl'
  },
  {
    icon: {name: 'vim'},
    ids: ['vim', 'viml', 'vim-help', 'vim-snippet', 'vim-markdown', 'vimrc'],
    name: 'vim'
  },
  {
    icon: {name: 'vb'},
    ids: ['vb', 'visualbasic', 'testOutput', 'vba', 'vb.net'],
    name: 'vb'
  },
  {
    enabledFor: [IconPack.Volt],
    icon: {name: 'volt'},
    ids: ['volt'],
    name: 'volt'
  },
  {
    icon: {name: 'vray'},
    ids: ['vray'],
    name: 'vray'
  },
  {
    icon: {name: 'vscodeignore'},
    ids: ['vscodeignore'],
    name: 'vscodeignore'
  },
  {
    icon: {name: 'tfsignore'},
    ids: ['tfignore', 'tfsignore'],
    name: 'tfsignore'
  },
  {
    icon: {name: 'vue'},
    ids: ['vue', 'vue-html', 'vue-postcss'],
    name: 'vue'
  },
  {
    icon: {name: 'vuex'},
    ids: ['vuex'],
    name: 'vuex'
  },
  {
    icon: {name: 'vyper'},
    ids: ['vyper'],
    name: 'vyper'
  },
  // endregion

  // region [W]
  {
    icon: {name: 'wallaby'},
    ids: ['quokka', 'quokka-output', 'quokka-recent', 'quokka-timeline', 'wallaby', 'wallaby-tests', 'wallaby-timeline', 'wallaby-inspector', 'wallaby-console'],
    name: 'wallaby'
  },
  {
    icon: {name: 'walt'},
    ids: ['walt'],
    name: 'walt'
  },
  {
    icon: {name: 'webassembly'},
    ids: ['webassembly', 'wasm', 'wat', 'wai'],
    name: 'webassembly'
  },
  {
    icon: {name: 'wdl'},
    ids: ['wdl'],
    name: 'wdl'
  },
  {
    icon: {name: 'webgl'},
    ids: ['glsl', 'webgl'],
    name: 'webgl'
  },
  {
    icon: {name: 'webvtt'},
    ids: ['vtt', 'webvtt'],
    name: 'webvtt'
  },
  {
    icon: {name: 'wenyan'},
    ids: ['wenyan'],
    name: 'wenyan'
  },
  {
    icon: {name: 'wepy'},
    ids: ['wepy'],
    name: 'wepy'
  },
  {
    icon: {name: 'wgsl'},
    ids: ['wgsl'],
    name: 'wgsl'
  },
  {
    icon: {name: 'winui'},
    ids: ['winui', 'xaml'],
    name: 'winui'
  },
  {
    icon: {name: 'wikitext'},
    ids: ['wikitext'],
    light: true,
    name: 'wikitext'
  },
  {
    icon: {name: 'wolframlanguage'},
    ids: ['wolfram'],
    name: 'wolfram'
  },
  {
    icon: {name: 'wurst'},
    ids: ['wurst'],
    name: 'wurst'
  },
  {
    icon: {name: 'wxml'},
    ids: ['wxml', 'wxml-pug'],
    name: 'wxml'
  },
  {
    icon: {name: 'wpml'},
    ids: ['wpml'],
    name: 'wpml'
  },
  {
    icon: {name: 'wxss'},
    ids: ['wxss'],
    name: 'wxss'
  },
  {
    icon: {name: 'wxs'},
    ids: ['wxs'],
    name: 'wxs'
  },
  {
    icon: {name: 'wsdl'},
    ids: ['wsdl'],
    name: 'wsdl'
  },
  // endregion

  // region [X]
  {
    icon: {name: 'xcode'},
    ids: ['xcode', 'strings'],
    name: 'xcode'
  },
  {
    icon: {name: 'xib'},
    ids: ['xib'],
    name: 'xib'
  },
  {
    icon: {name: 'xliff'},
    ids: ['xliff', 'xlf'],
    name: 'xliff'
  },
  {
    icon: {name: 'xmake'},
    ids: ['xmake'],
    name: 'xmake'
  },
  {
    icon: {name: 'xml'},
    ids: ['fxml', 'jnlp', 'jrxml', 'xslt', 'xul', 'xml', 'xquery'],
    name: 'xml'
  },
  {
    icon: {name: 'xsd'},
    ids: ['xsl', 'xsd'],
    name: 'xsd'
  },
  {
    icon: {name: 'xtend'},
    ids: ['xtend'],
    name: 'xtend'
  },
  {
    icon: {name: 'xquery'},
    ids: ['xquery', 'xquery-ml'],
    name: 'xquery'
  },
  {
    icon: {name: 'xproc'},
    ids: ['xproc', 'xpl'],
    name: 'xproc'
  },
  {
    icon: {name: 'xubuntu'},
    ids: ['xubuntu', 'xdefaults'],
    name: 'xubuntu'
  },
  // endregion

  // region [Y]
  {
    icon: {name: 'yandex'},
    ids: ['yandex', 'ydl'],
    name: 'yandex'
  },
  {
    icon: {name: 'yaml'},
    ids: ['info', 'yaml'],
    name: 'yaml'
  },
  {
    icon: {name: 'yang'},
    ids: ['yang'],
    name: 'yang'
  },
  {
    icon: {name: 'yara'},
    ids: ['yara'],
    name: 'yara'
  },
  {
    icon: {name: 'yarn'},
    ids: ['yarn', 'yarnlock'],
    name: 'yarn'
  },
  {
    icon: {name: 'yeoman'},
    ids: ['yeoman', 'yo'],
    name: 'yeoman'
  },
  {
    icon: {name: 'yue'},
    ids: ['yue', 'yuescript'],
    name: 'yue'
  },
  {
    icon: {name: 'yui'},
    ids: ['yui', 'yuiscript'],
    name: 'yui'
  },
  // endregion

  // region [Z]
  {
    icon: {name: 'zbrush'},
    ids: ['zbrush', 'zscript'],
    name: 'zbrush'
  },
  {
    icon: {name: 'zeit'},
    ids: ['zeit', 'zeitignore'],
    light: true,
    name: 'zeit'
  },
  {
    icon: {name: 'zephir'},
    ids: ['zephir'],
    name: 'zephir'
  },
  {
    icon: {name: 'zig'},
    ids: ['zig'],
    name: 'zig'
  },
  {
    icon: {name: 'zilog'},
    ids: ['zilog', 'z80', 'z80-macroasm', 'z80-asm-meter', 'asz80', 'as1802', 'retroasm_z80'],
    name: 'zilog'
  },
  {
    icon: {name: 'zimpl'},
    ids: ['zimpl'],
    name: 'zimpl'
  },
  {
    icon: {name: 'zork'},
    ids: ['zork'],
    name: 'zork'
  },
  {
    icon: {name: 'zenscript'},
    ids: ['zenscript', 'zs'],
    name: 'zenscript'
  },
  // endregion
];

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
  {
    icon: {name: 'sass'},
    ids: ['sass'],
    name: 'sass'
  },
  {
    icon: {name: 'scss'},
    ids: ['scss'],
    name: 'scss'
  },
  {
    icon: {name: 'scala'},
    ids: ['scala'],
    name: 'scala'
  },
  // { icon: { name: 'search' }, ids: ['search-result'] },
  // { icon: { name: 'shader' }, ids: ['hlsl', 'glsl', 'wgsl'] },
  {
    icon: {name: 'shell'},
    ids: ['sh', 'shellscript'],
    name: 'shell'
  },
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
  {
    icon: {name: 'sql'},
    ids: ['mysql', 'sql'],
    name: 'sql'
  },
  // { icon: { name: 'table' }, ids: ['csv', 'tsv', 'psv'] },
  // { icon: { name: 'terraform' }, ids: ['terraform'] },
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
  // { icon: { name: 'tex' }, ids: ['tex', 'doctex', 'latex', 'latex-expl3'] },
  // { icon: { name: 'tree' }, ids: ['tree'] },
  // { icon: { name: 'twig' }, ids: ['twig'] },
  {
    icon: {name: 'toml'},
    ids: ['toml'],
    name: 'toml'
  },
  {
    icon: {name: 'typeScript'},
    ids: ['tslint', 'typescript'],
    name: 'typeScript'
  },

  // region [U]
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
    ids: ['vb', 'visualbasic', 'testOutput'],
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
    icon: {name: 'xliff'},
    ids: ['xliff'],
    name: 'xliff'
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
  // endregion

  // region [Y]
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
    icon: {name: 'yue'},
    ids: ['yue', 'yuescript'],
    name: 'yue'
  },
  // endregion

  // region [Z]
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
    ids: ['zenscript'],
    name: 'zenscript'
  },
  // endregion
];

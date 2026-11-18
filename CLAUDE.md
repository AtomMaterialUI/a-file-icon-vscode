# a-file-icon-vscode — Claude Code 작업 메모

`AtomMaterialUI/a-file-icon-vscode`(VS Code용 Atom Material Icons)의 포크. 원본은 2025-01 이후 방치됐고,
목표는 JetBrains 마켓의 Atom Material Icons(`AtomMaterialUI/a-file-icon-idea`) 수준까지 따라잡는 것.
진행 상황·다음 단계는 메모리(`project-status`)에 있다.

## 환경 (Node·bun 은 conda env)
- conda env `a-file-icon-vscode` = Node 24 + bun 1.4 (`environment.yml`). 이 PC 에는 시스템 Node 가 없다.
  새 PC: `conda env create -f environment.yml`, 바뀌면 `conda env update -f environment.yml --prune`.
- 프로필 없이 도는 셸(Claude Code)에서는 env 를 PATH 앞에 붙여 쓴다. node.exe 는 env 루트, bun.exe 는 `Library\bin`:
  - Git Bash: `E=/c/Users/siwon/miniconda3/envs/a-file-icon-vscode; export PATH="$E:$E/Library/bin:$PATH"`
  - PowerShell: `conda run -n a-file-icon-vscode --no-capture-output bun run build`
- 처음 한 번: `git submodule update --init` → `PUPPETEER_SKIP_DOWNLOAD=1 bun install` (puppeteer 의 Chrome 다운로드 생략).
- `conda.bat` 인자에 `>=` 를 쓰면 cmd 가 리다이렉트로 읽어 파일이 생긴다. 버전 조건은 `=` 로 쓴다.

## 명령
| 목적 | 명령 |
|---|---|
| 빌드 (webpack dev + 테마 json 생성 + 아이콘 점검) | `bun run build` |
| 단위 테스트 (빌드된 `dist` 필요) | `bun run test:unit` |
| lint (`vsce package` 가 먼저 돌림, 0 errors 유지) | `bun run lint` |
| JetBrains 연결 규칙 동기화 | `bun run sync:upstream` |
| VSIX 만들기 | `npx --yes @vscode/vsce@3.6.0 package --no-dependencies --allow-missing-repository --skip-license -o <경로>.vsix` |

- `tsc --noEmit` 의 `@types/lodash` ↔ TS lib `WeakMap` 오류 4개는 원래 있던 것. 그 밖의 오류만 본다.
- `npx tsc` 는 엉뚱한 `tsc` 패키지를 받는다. `node node_modules/typescript/bin/tsc` 로 부른다.

## 구조
- 아이콘 원본은 서브모듈 `iconGenerator`(`AtomMaterialUI/iconGenerator`, HTTPS). JetBrains 플러그인과 같은 SVG·연결 json.
- 파일/폴더 연결: `src/icons/files/*.ts`, `src/icons/folders/*.ts`(알파벳별, 손으로 관리)
  + `upstream.ts`(생성물, **손대지 않는다**). `src/scripts/icons/syncUpstream.ts` 가 JetBrains 플러그인의 선택을
  `jetbrainsMatcher.ts`(정규식 + priority, 경로 패턴은 `/project/<이름>` 으로)로 흉내 내서, JetBrains 가 아는 이름
  (예시 이름 + 손으로 쓴 모든 이름, `.ext` 점 파일, 확장자와 같은 이름의 파일)마다 JetBrains 아이콘이 다르면 덮어쓴다.
  생성기는 손으로 쓴 것 → 그 팩 → upstream → pycharm → 사용자 설정 순으로 적용(뒤가 이김).
  JetBrains 가 모르는 이름만 손으로 고쳐서 바뀐다. 고친 뒤 `sync:upstream`.
- `test/unit/jetbrainsParity.test.ts` 가 기본 테마의 모든 키를 JetBrains 선택과 비교한다(어두운·밝은 테마).
- 포크가 직접 넣은 아이콘은 `assets/icons/files/`(iconGenerator 와 같은 구조, 출처·라이선스는 `assets/icons/NOTICE.md`).
  생성기가 iconGenerator 다음에 복사한다. 테스트 fixture 는 `iconGenerator`·`assets` 둘 다 junction 으로 건다.
- 방향: PyCharm(Atom Material Icons 설치)에서 보이는 모습에 맞춘다. PyCharm 은 `.py` 를 이름과 상관없이 자체 New UI
  Python 아이콘으로 보여 줘서 `pycharm` 팩이 그걸 따른다. 다른 차이는 PyCharm 화면과 나란히 비교해서 찾는다.
- `name` = SVG 파일 이름(확장자 제외). `light: true` = `<name>_dark.svg` 가 있다는 뜻(어두운 테마에 _dark 사용).
- 설정 → 테마: `services/ConfigChangeDetector` 가 `ConfigService.getIconConfigChanges()` 로 **설정 전체**를 저장된
  `atomConfig` 와 비교하고, 다르면 `IconThemeGenerator(전체 설정, 경로)` 로 `dist/` 의 json·SVG 를 다시 쓴다.
  바뀐 값만 넘기거나 `lodash.merge` 로 합치면 #74·#71·#70 이 되살아난다(`configUtils.withDefaults` 사용).
- 테마에 들어가는 설정을 추가할 때 고칠 곳: `@types/config.ts`(`AtomConfig`, `ICON_SETTING_KEYS`), `configUtils.getDefaultConfig`
  (+ SVG 를 바꾸면 `getFileConfigHash`), `ConfigService`(getter/setter, `getIconSettings`, `resetConfig`, `EMPTY_DEFAULTS`),
  `package.json` `contributes.configuration`, `package.nls*.json` 전부.
- 테마 섞기(방향: Atom 이 기본, 다른 테마는 겹쳐 쓰기): VS Code 는 아이콘 테마를 하나만 쓰므로, 생성 마지막에
  `ThemeLayerGenerator` 가 설치된 다른 테마 json 을 읽어 섞고 SVG 를 필터 적용해 `dist/layers/` 에 복사한다.
  - `iconThemeLayers`(기본 `["material-icon-theme"]`): 테마 id 또는 `{theme, files, folders}`, 모드는 `fill`(아무 테마도
    모르는 이름만, 이름·확장자 접미사·언어·폴더 이름의 마지막 조각으로 판단) / `override`(그 테마가 아이콘을 주는 이름은
    전부 그 테마, 기본 파일·폴더 아이콘도) / `off`. `iconThemeByName`: `파일이름`·`*.ext`·`폴더/` → 테마 id.
  - 우선순위: byName > override 층(앞이 이김, 사용자 `*Associations` 이름은 건드리지 않음) > Atom > fill 층(앞이 이김).
  - 이름 해석은 VS Code 와 같게(파일 이름 > 긴 확장자부터 > 언어). 밝은·고대비 변형은 같은 항목의 것만 쓰고 없으면
    우리 변형을 지운다. SVG 는 필터 적용 복사, Seti 같은 글꼴 테마는 글꼴을 `dist/layers` 에 복사하고 글리프마다
    `fontId`·`fontSize` 를 명시(VS Code 는 첫 글꼴을 모든 아이콘의 기본으로 씀). 글꼴 색은 채도·모노크롬만(VS Code 가 알파 없는
    `#rrggbb` 만 받아 불투명도는 못 씀). PNG 는 건너뜀.
  - 쓰는 테마들의 지문(`layerThemes`, 확장 버전 + json 수정 시각)을 테마 json 에 저장해 바뀌면 다시 만든다
    (`extension.ts` 가 각 json 을 watchFile). 스크립트·parity 테스트는 다른 테마 없이 돈다.
- 아이콘 팩(`enabledFor`) 항목은 생성 때 일반 항목 뒤에 적용돼 같은 확장자를 덮어쓴다(css → css2). 기본 팩은
  `package.json` 기본값과 `getDefaultConfig` 를 같이 고친다.
- dist 쓰기는 `helpers/fsUtils.writeFileAtomic`(임시 파일 + rename)만 쓴다(#67).
- CI(`.github/workflows`): `build.yml`(lint·build·test·VSIX), `sync-upstream.yml`(매주 iconGenerator 최신화 → PR,
  저장소 설정 "Allow GitHub Actions to create … pull requests" 필요), `release.yml`(수동, 토큰 시크릿 있을 때만 배포).
- 테스트: `test/run-unit.js` 가 esbuild 로 묶으며 `vscode` 를 `test/mocks/vscode.ts` 로 바꿔 mocha 실행.

## 확인 방법
- `package.json` 의 `"_watch": true` 는 개발 모드(`--extensionDevelopmentPath`)에서만 테마 파일을 다시 읽는다.
  사용자 환경을 확인하려면 VSIX 를 격리 프로필에 설치해 본다(사용자 VS Code 를 건드리지 않음):
  `code --user-data-dir <tmp>/u --extensions-dir <tmp>/x --install-extension <vsix>` →
  `<tmp>/u/User/settings.json` 에 `"workbench.iconTheme": "a-file-icon-vscode"` → `code --user-data-dir … --extensions-dir … <샘플 폴더>`.
  설정은 그 settings.json 을 고쳐서 바꾼다(창은 다시 열 필요 없음).

## git
- remote: `origin` = 포크 `WoogaJJangka/a-file-icon-vscode`, `upstream` = 원본. 작업 브랜치는 같은 이름의 origin 브랜치를 추적.
- 이슈 번호(#74 등)는 원본 저장소 것. 포크에서는 링크되지 않는다.

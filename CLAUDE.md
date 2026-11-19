# a-file-icon-vscode — Claude Code 작업 메모

`AtomMaterialUI/a-file-icon-vscode`(VS Code용 Atom Material Icons, 2025-01 이후 방치)의 포크. 마켓 표시 이름 "Cool Theme"
(확장 ID `woogajjangka.cool-icon-vscode`, 2026-11-19 에 "Cool Icon" 에서 바꿈).
- 이름 규칙: 확장·명령 분류·설정 제목·알림 = "Cool Theme", 파일 아이콘 테마 = "Cool Icons", 색 = "Cool Islands Dark/Light",
  제품 아이콘 = "Cool Islands Icons"(id `cool-islands-product-icons`)·"Cool Material Icons". 테마 id·설정 id 는 바꾸지 않는다(사용자 설정이 가리킴).
  `test/unit/packageIdentity.test.ts` 가 지킨다. 한국어 조사는 읽는 소리 기준: "Cool Theme이/과", "Cool Icons가/와".

## 방향 (2026-11-19 전면 수정)
- **JetBrains(PyCharm New UI, Islands) 모양의 기본 테마 묶음**을 VS Code 에 준다: 파일 아이콘(지금 것), 색 테마
  (Islands Dark/Light), 제품 아이콘(New UI), 폰트 기본값. 기준은 사용자 PyCharm 화면이다.
- VS Code 는 종류마다 테마를 하나만 고를 수 있다 → **JetBrains 기본 위에 다른 설치된 테마를 우선순위·예외로 얹는다**
  (파일 아이콘의 `iconThemeLayers`·`iconThemeByName` 과 같은 규칙을 색·제품 아이콘에도). 섞은 결과는 테마 파일을 다시
  써서 반영하고, VS Code 가 다시 읽지 않는 것(색·제품 아이콘)은 창 다시 로드를 권한다.
- 폰트: 사용자가 지정하지 않은 곳만 `configurationDefaults` 로 JetBrains 글꼴(JetBrains Mono, UI 쪽은 Inter) + 한글 대체 글꼴.
  VS Code 화면(UI) 글꼴은 확장이 못 바꾼다.
- 한국어 호환이 중요하다: 사용자 글꼴 `'Roboto Mono', 'D2Coding', monospace` 로 한글 이름·주석·화면 문구가 깨지지 않는지 확인.
- 단계별 로드맵은 포크 이슈 #19~#23, 진행 상황은 메모리(`project-status`).

## 환경 (Node·bun 은 conda env)
- conda env `a-file-icon-vscode` = Node 24 + bun 1.4 (`environment.yml`). 이 PC 에는 시스템 Node 가 없다.
  새 PC: `conda env create -f environment.yml`, 바뀌면 `conda env update -f environment.yml --prune`.
- 프로필 없이 도는 셸(Claude Code)에서는 env 를 PATH 앞에 붙여 쓴다. node.exe 는 env 루트, bun.exe 는 `Library\bin`:
  - Git Bash: `E=/c/Users/siwon/miniconda3/envs/a-file-icon-vscode; export PATH="$E:$E/Library/bin:$PATH"`
  - PowerShell: `conda run -n a-file-icon-vscode --no-capture-output bun run build`
- 처음 한 번: `git submodule update --init` → `PUPPETEER_SKIP_DOWNLOAD=1 bun install` (puppeteer 의 Chrome 다운로드 생략).
  잠금 파일은 텍스트 `bun.lock`(2026-11-19 `bun.lockb` 에서 변환, Dependabot `bun` 이 읽는 형식).
- `conda.bat` 인자에 `>=` 를 쓰면 cmd 가 리다이렉트로 읽어 파일이 생긴다. 버전 조건은 `=` 로 쓴다.

## 명령
| 목적 | 명령 |
|---|---|
| 빌드 (webpack dev + 테마 json 생성 + 아이콘 점검) | `bun run build` |
| 단위 테스트 (빌드된 `dist` 필요) | `bun run test:unit` |
| lint (`vsce package` 가 먼저 돌림, 0 errors 유지) | `bun run lint` |
| JetBrains 연결 규칙 동기화 | `bun run sync:upstream` |
| JetBrains 색 테마 동기화 (고정 커밋 / 최신) | `bun run sync:colors` / `bun run sync:colors -- --latest` |
| New UI 제품 아이콘 글꼴 만들기 (확인용 그림 포함) | `bun run build:product-icons` (`-- --sheet <png>`) |
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
  `package.json` `contributes.configuration`, `package.nls.json` + `package.nls.ko.json`(한국어는 필수, 다른 언어는 없으면 영어로
  대체). 화면 문구(`src/i18n/locales/`)도 `en.json` + `ko.json`. `test/unit/korean.test.ts` 가 한국어 누락·`{{자리}}` 불일치·
  다른 언어의 남는 키를 잡는다.
- 이름 비교는 `helpers/utils.normalizeName`(NFC + 소문자, VS Code 와 같은 소문자 비교에 한글 NFD 대응)만 쓴다. `toLowerCase()` 를
  따로 쓰지 않는다.
- 글꼴(`helpers/fonts.ts`): `package.json` `configurationDefaults` 의 `editor.fontFamily`·`markdown.preview.fontFamily` 는 여기
  상수와 같아야 한다(`fonts.test.ts`). `FontCheckService` 는 사용자가 에디터 글꼴을 안 정했을 때만 글꼴 폴더에서 JetBrains Mono
  (한국어 화면이면 D2Coding 도)를 찾고, 없으면 같은 조합에 대해 한 번만 알린다(globalState `fontMessageShown`).
  VS Code UI 글꼴은 확장이 못 바꾼다.
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
    `usesCurrentColor` 테마(VS Code Modern)는 VS Code 가 선택된 테마의 아이콘만 글자색으로 칠하므로, 복사할 때 `currentColor` 를
    어두운 테마 `#cccccc`, 밝은 변형 `#3b3b3b` 로 바꾼다(원본에 밝은 변형이 없어도 만든다).
  - 섞기 화면(`openThemeMixer` 명령, `src/panels/ThemeMixerPanel.ts` + `media/themeMixer.{js,css}`, 빌드 없는 정적 파일):
    두 설정을 고치고, 미리보기는 `helpers/themePreview.ts`(`LayerReader` 재사용)로 각 테마 json 과 생성된 우리 json 에서
    이름별 아이콘을 찾는다. 설정 쓰기 → 테마 재생성 → `extension.ts` 의 `regenerateTheme` 가 `ThemeMixerPanel.refresh()`.
    화면 문구는 `en.json` 의 `themeMixer.*`(다른 언어는 영어로 대체됨).
  - 쓰는 테마들의 지문(`layerThemes`, 확장 버전 + json 수정 시각)을 테마 json 에 저장해 바뀌면 다시 만든다
    (`extension.ts` 가 각 json 을 watchFile). 스크립트·parity 테스트는 다른 테마 없이 돈다.
- 색 테마(Cool Islands Dark/Light, `src/themes/`): `syncJetbrainsColors.ts` 가 `JetBrains/intellij-community` 의 고정 커밋
  (`themes/jetbrains-source.json`)에서 UI 테마 json·에디터 scheme xml·플러그인 추가 속성(Python·Markdown·YAML·sh·XML)을 받아
  `jetbrainsTheme.ts` 로 IDE 와 같게 푼다: UI 는 parent 체인 + 팔레트 이름 + `*` 와일드카드(부모 키 뒤에 자식 키가 붙고
  **뒤에 적용된 값이 이김** → 자식의 `*` 가 부모 명시 키를 덮음), scheme 은 parent 체인 + `baseAttributes`(값이 같이 있으면 자기 값)
  + 추가 속성(그 scheme 을 부모로 둔 scheme 이 물려받음). `jetbrainsUiMap.ts`(VS Code 색 id ← `ui:`/`color:`/`fg:`·`bg:`… 후보)와
  `jetbrainsTokenMap.ts`(TextMate·semantic ← 속성 키 후보, 코드에만 있는 대체 키는 여기 적음)로 `themes/cool-islands-*.base.json`
  (생성물, **손대지 않는다**)을 만들고, `ColorThemeGenerator` 가 빌드 때 `dist/` 로 쓴다. Python 규칙은 PyCharm `PyHighlighter.java`
  의 키·대체 키 기준(상수·속성 색 없음, 메서드 호출 = 함수 호출). 화면 확인은 격리 VS Code 를 `--remote-debugging-port` 로 띄워
  CDP `Page.captureScreenshot` 으로 캡처(창을 앞으로 가져오지 않아 사용자 작업을 방해하지 않음).
- 색 테마 섞기(`src/themes/colorLayers.ts` 순수 엔진, `readColorTheme.ts` JSONC·`include`·`tokenColors` 경로 읽기,
  `services/ColorThemeService.ts` 설치된 테마 목록·섞기·다시 로드 알림): `colorThemeLayers`(테마 id 또는 `{theme, ui, syntax, applyTo}`,
  `fill`/`override`/`off`, 같은 종류의 Islands 에만 — `applyTo` 로 바꿈)·`colorThemeByKey`(색 id glob, `scope:`, `semantic:`).
  우선순위: byKey(뒤가 이김) > override 층(앞이 이김) > Islands > fill 층(앞이 이김). 문법 override 는 Islands 문법을 통째로 대신하고,
  문법 fill 은 Islands 규칙이 덮지 않는 scope 만 앞에 붙인다. 아이콘 설정이 아니라 `ICON_SETTING_KEYS` 에 넣지 않는다.
  `regenerateTheme` 마다 `ColorThemeGenerator.createJsonThemes(mix)` 가 **내용이 바뀐 테마만** 쓰고, 선택된 테마가 바뀌면
  알림 하나(`showReloadMessage`)로 창 다시 로드를 권한다. 테마 id 는 `workbench.colorTheme` 값 = 기여한 `id` ?? label
  (VS Code 1.147 기본 테마 id 는 "Dark Modern" 처럼 "Default" 없이). JSONC 는 `jsonc-parser` 대신 자체 `stripJsonComments`
  (jsonc-parser 의 UMD 빌드는 esbuild 번들에서 깨짐). 섞기 화면은 아이콘/색 탭(`openColorMixer` 명령은 색 탭으로 연다),
  색 탭 상태는 `panels/colorMixerState.ts`. 격리 확인에서 탭 전환은 클릭 대신 이 명령으로.
- 제품 아이콘(Cool Islands Icons, `src/productIcons/`): `jetbrainsMap.ts`(VS Code 아이콘 id → New UI SVG, 손으로 관리, 폴더 없는 경로는
  `platform/icons/src/expui/`, 플러그인 것은 전체 경로)로 `buildJetbrainsFont.ts` 가 고정 커밋(`themes/jetbrains-source.json`)의 SVG 를
  받아 흑백으로 바꾸고(진한 색 검정, 흰색·밝은 채움은 구멍) resvg 로 그린 뒤 potrace 로 따서 `webfont` 로 글꼴을 만든다
  (`productIcons/cool-islands-icons.woff`·`cool-islands-product-icon-theme.json`, 생성물·**손대지 않는다**, ttf ts=0 이라 같은 입력이면 같은 파일).
  svg-fixer 는 그리기 전에 채움을 검정으로 덮어 흰 구멍이 사라져서 쓰지 않는다. 매핑에 없는 id 는 VS Code 코디콘.
  New UI 이름 대응은 `platform/icons/src/PlatformIconMappings.json` 이 참고가 된다(예: 브랜치 = `general/vcs`).
  섞기: `productIconThemeLayers`(fill/override/off)·`productIconByName`(id glob), 우선순위는 색·아이콘과 같다. 다른 테마 글꼴은
  `dist/layers/product/<테마>/` 로 복사하고 글리프마다 `fontId`(Islands 글꼴이 첫 번째라 fontId 없는 정의는 Islands). Cool Material Icons 도
  층으로 고를 수 있다. 화살표 스타일(`arrowTheme`)은 Material 테마에만 적용. 섞기 화면 제품 아이콘 탭(`openThemeMixer` 에 'product' 인자).
- 아이콘 팩(`enabledFor`) 항목은 생성 때 일반 항목 뒤에 적용돼 같은 확장자를 덮어쓴다(css → css2). 기본 팩은
  `package.json` 기본값과 `getDefaultConfig` 를 같이 고친다.
- dist 쓰기는 `helpers/fsUtils.writeFileAtomic`(임시 파일 + rename)만 쓴다(#67).
- CI(`.github/workflows`): `build.yml`(lint·build·test·VSIX), `sync-upstream.yml`(매주 iconGenerator 최신화 → PR,
  저장소 설정 "Allow GitHub Actions to create … pull requests" 필요), `release.yml`(수동, 토큰 시크릿 있을 때만 배포). main 이 보호돼 있어 커밋하지 않는다: 다음 버전은 이 저장소의
  마지막 GitHub Release 태그(없으면 package.json)에서 계산해 VSIX 안에만 넣고, package.json 버전은 그대로 둔다
  (원본의 v5.x 태그는 릴리스가 아니라서 무시).
- 테스트: `test/run-unit.js` 가 esbuild 로 묶으며 `vscode` 를 `test/mocks/vscode.ts` 로 바꿔 mocha 실행.

## 확인 방법
- `package.json` 의 `"_watch": true` 는 개발 모드(`--extensionDevelopmentPath`)에서만 테마 파일을 다시 읽는다.
  사용자 환경을 확인하려면 VSIX 를 격리 프로필에 설치해 본다(사용자 VS Code 를 건드리지 않음):
  `code --user-data-dir <tmp>/u --extensions-dir <tmp>/x --install-extension <vsix>` →
  `<tmp>/u/User/settings.json` 에 `"workbench.iconTheme": "a-file-icon-vscode"` → `code --user-data-dir … --extensions-dir … <샘플 폴더>`.
  설정은 그 settings.json 을 고쳐서 바꾼다(창은 다시 열 필요 없음).

## git
- remote: `origin` = 포크 `WoogaJJangka/a-file-icon-vscode`, `upstream` = 원본. 작업 브랜치는 같은 이름의 origin 브랜치를 추적.
  머지된 PR 의 브랜치는 GitHub 가 자동으로 지운다(저장소 설정) → 로컬에서도 `git fetch --prune` 후 `git branch -d`.
- 이 문서·코드 주석의 #74·#71·#70·#67 같은 번호는 원본 저장소 이슈다. 포크 이슈는 #17 부터(로드맵 #19~#23).
- 의존성 갱신은 `.github/dependabot.yml`(Actions 매주, bun 매월 묶음). 원본의 Renovate·semantic-release·techstack 설정은 지웠다.
- `.idea/` 는 추적하지 않는다(D:\dev 규칙). `.vscode/{launch,tasks,extensions}.json`·`settings.json` 은 확장 실행·디버그에
  쓰여서 예외로 커밋한다.

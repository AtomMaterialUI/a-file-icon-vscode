# 유지보수 지침: 보안 · 다른 확장과의 호환 · 메모리

Cool Theme Kit 을 고칠 때 지키는 규칙과, 그 규칙을 지키는지 확인하는 자동 검사(GitHub Actions·SonarQube Cloud)를 적는다.
규칙을 바꾸면 이 문서와 검사를 같은 PR 에서 고친다. 작업 방법 전반(빌드·구조·이름 규칙)은 `CLAUDE.md` 를 따른다.

## 한눈에 보기

| 영역 | 무엇을 확인하나 | 어디서 | 언제 | 실패 조건 |
|---|---|---|---|---|
| 보안 | 배포되는 의존성의 취약점 | `security.yml` → `bun run audit:shipped` | PR·main·매주 화 | 번들(`dist/`)에 들어가는 패키지에 high/critical |
| 보안 | Actions 를 커밋으로 고정 | `security.yml` | PR·main·매주 화 | `uses:` 가 40자 SHA 가 아님 |
| 보안 | 코드·워크플로 정적 분석 | `security.yml` CodeQL (`javascript-typescript`, `actions`) | PR·main·매주 화 | Code scanning 경고(PR 검사에 표시) |
| 보안·품질 | 버그·취약점·Hotspot·중복·(커버리지) | SonarQube Cloud (Automatic Analysis, 또는 `sonar.yml`) | PR·main | 품질 게이트 실패 |
| 회귀 | lint·빌드·아이콘 점검·단위 테스트 | `build.yml` | 모든 push·PR | 하나라도 실패 |
| 호환 | 실제 VS Code 1.95.0·stable, Linux·Windows | `smoke.yml` | PR·main·매주 수 | 활성화·명령·재생성 실패, 출력 채널에 `ERROR` |
| 호환 | 다른 테마 확장과 함께 섞기 | `smoke.yml` (`--with-extensions`) | PR·main·매주 수 | 섞은 결과가 테마 파일에 없음, `ERROR` |
| 메모리 | 재생성 반복 뒤 남는 힙 | `smoke.yml` (`suite.js`) | PR·main·매주 수 | 증가량 ≥ 10 MB |
| 메모리 | 번들·테마 json·VSIX 크기 | `build.yml` → `bun run check:size` | 모든 push·PR | 예산 초과 |
| 의존성 | 갱신 PR | Dependabot | Actions 매주, bun 매월 | — |

로컬에서 같은 검사를 돌리는 명령:

| 목적 | 명령 |
|---|---|
| 배포 의존성 감사 | `bun run audit:shipped` |
| 크기 예산 (VSIX 를 만든 뒤) | `bun run check:size <경로>.vsix` |
| 단위 테스트 + 커버리지(`coverage/lcov.info`) | `bun run test:coverage` |
| 스모크 (빌드 필요) | `bun run test:smoke -- 1.95.0` / `bun run test:smoke -- stable --with-extensions` |

스모크는 VS Code 와 다른 확장을 Marketplace 에서 받으므로 네트워크가 필요하다. 결과(메모리 표, `MEMORY` 줄, 오류)는
콘솔과 Actions 의 Job summary 에 나온다.

## 1. 보안

### 무엇을 지키나

확장은 사용자 PC 의 확장 호스트에서 사용자 권한으로 돈다. 바깥에서 들어오는 것은 다음과 같고, 모두 믿지 않는 입력으로 다룬다.

- **설정**: 사용자 설정과 워크스페이스 설정(`.vscode/settings.json`). `capabilities.untrustedWorkspaces.supported: true`
  라서 신뢰하지 않은 워크스페이스(Restricted Mode)의 설정도 읽힌다. `filesAssociations`·`foldersAssociations`·
  `languagesAssociations` 의 값은 SVG 파일 경로일 수 있다(`helpers/customIcons.ts`).
- **다른 확장의 테마 파일**: 아이콘·색·제품 아이콘 테마 json, SVG, 글꼴.
- **웹뷰 메시지**: 섞기 화면(`ThemeMixerPanel`)이 보내는 모든 메시지.
- **워크스페이스 이름들**: 섞기 미리보기의 샘플 이름.
- **빌드 때만**: JetBrains 원본(`sync:colors`·`build:product-icons`), iconGenerator 서브모듈.

### 규칙

1. **웹뷰**
   - CSP 는 `default-src 'none'` 에서 시작해 필요한 것만 연다. 스크립트는 `nonce` 로만, `'unsafe-eval'` 은 쓰지 않는다.
   - `localResourceRoots` 는 이 확장 폴더와 섞는 테마의 확장 폴더만.
   - 페이지(`media/themeMixer.js`)는 DOM 에 `textContent`·속성으로만 쓴다. `innerHTML`·`insertAdjacentHTML`·`eval` 금지.
   - 메시지는 `unknown` 으로 받고 모양을 검사한 뒤(`typeof`, 허용 목록 `MODES`, `parseNameKey`…) 설정에 쓴다.
     새 메시지 종류도 같은 방식으로 `receive` 에 넣는다.
2. **다른 확장의 파일**
   - `JSON.parse`(JSONC 는 `stripJsonComments`)로만 읽는다. `require`·`eval`·`new Function` 으로 읽지 않는다.
   - `include` 같은 따라가기에는 깊이 제한(`MAX_INCLUDES`)을 둔다.
   - 확장자를 확인하고(SVG·허용된 글꼴 형식만, PNG 는 건너뜀) 복사본은 `dist/layers/` 에만 쓴다. 다른 확장의 폴더에는 쓰지 않는다.
   - 경로는 그 테마의 확장 폴더 안으로 풀리는 것만 쓴다(VS Code 자신도 확장 폴더 밖 경로를 거부한다). → 아래 "점검 결과" 1번.
3. **파일 쓰기**: `dist/` 쓰기는 `helpers/fsUtils.writeFileAtomic` 만. 파일 이름은 해시·정규화한 이름만 쓰고, 다른 테마나
   설정에서 온 문자열을 그대로 경로 조각으로 쓰지 않는다.
4. **경로를 받는 설정**: 새 설정이 파일 경로·명령·URL 을 받으면 `package.json` 의
   `capabilities.untrustedWorkspaces.restrictedConfigurations` 에 넣을지 같은 PR 에서 정한다.
5. **네트워크·개인정보**: 확장은 실행 중 네트워크 요청을 하지 않고 텔레메트리도 없다. 바꾸려면 이 문서를 먼저 고치고,
   끌 수 있는 설정을 둔다. 출력 채널·오류 메시지에 설정값 전체나 사용자 파일 내용을 남기지 않는다.
6. **의존성**
   - 실행 때 쓰는 의존성은 최소로 둔다. 2026-11 현재 번들에 들어가는 것: `fs-extra`, `graceful-fs`, `i18next`, `jsonfile`,
     `lodash.merge`, `universalify`. 새 실행 의존성은 PR 에 이유를 적고 `audit:shipped`·크기 예산으로 확인한다.
   - CI 는 `bun install --frozen-lockfile` 이다. `bun.lock` 이 바뀌는 PR 은 무엇이 바뀌는지 본다.
   - 배포 패키지의 advisory 를 받아들일 때는 `test/checks/auditShipped.js` 의 `ACCEPTED` 에 GHSA id·이유·재검토 날짜를 적는다.
7. **GitHub Actions**
   - 워크플로 기본 권한은 `contents: read`. 쓰기가 필요한 job 에만 그 권한을 준다(`release.yml`, `sync-upstream.yml`, CodeQL 의 `security-events`).
   - `uses:` 는 커밋 SHA + 버전 주석(`@<sha> # v4.4.0`). Dependabot 이 SHA 와 주석을 함께 올린다.
   - git 으로 push 하지 않는 job 의 checkout 은 `persist-credentials: false`.
   - 입력·PR 제목 같은 값은 `run:` 안에 `${{ }}` 로 넣지 않고 `env:` 로 넘긴다(`release.yml` 의 버전 입력처럼). `pull_request_target` 은 쓰지 않는다.
   - 비밀값은 저장소 secret 만: `VS_MARKETPLACE_TOKEN`(만료됨, 401/403 이면 새로 발급), `OPEN_VSX_TOKEN`, `SONAR_TOKEN`.

### 취약점이 나오면

- 신고는 `SECURITY.md` 의 비공개 경로로 받는다.
- **배포 패키지 high/critical** (`audit:shipped` 실패): 7일 안에 고쳐서 패치 릴리스(`release.yml`, patch).
- **빌드·테스트 도구**: 배포물에 들어가지 않으므로 Dependabot 월간 묶음으로 올린다. critical 이거나 CI 에서 실행되는 코드
  (빌드 스크립트가 받아서 처리하는 입력)에 닿으면 바로 올린다. `audit:shipped` 의 summary 에 개수가 나온다.
- CodeQL·Sonar 경고는 고치거나, 오탐이면 그 도구에서 이유와 함께 닫는다(`// NOSONAR`·`// codeql[...]` 주석 남용 금지).

### 저장소 설정 (한 번, GitHub 화면에서)

- Settings → Advanced Security: Dependency graph, Dependabot alerts, Dependabot security updates, Secret scanning 과
  Push protection, Private vulnerability reporting 을 켠다. Code scanning 의 CodeQL **default setup 은 끈다**
  (`security.yml` 의 고급 설정과 같이 쓰면 결과 업로드가 거부된다).
- Settings → Actions → General: Workflow permissions 는 "Read repository contents", "Allow GitHub Actions to create
  and approve pull requests" 는 켠다(`sync-upstream.yml`). Fork 의 PR 워크플로는 승인 후 실행.
- main 브랜치 보호의 필수 검사: `ubuntu-latest`·`windows-latest`(Build + Test), `Dependencies and actions`,
  `CodeQL (javascript-typescript)`, `CodeQL (actions)`, 스모크 job 들, Sonar 검사(아래 4장).

## 2. 다른 확장과의 호환

### 규칙

1. **이름 공간**: 명령·설정·웹뷰 id 는 `a-file-icon-vscode.` 로 시작한다. 테마 id·설정 id 는 바꾸지 않는다(`packageIdentity.test.ts`).
2. **남의 설정은 쓰지 않는다**: `workbench.colorTheme`·`workbench.iconTheme`·`workbench.productIconTheme` 은 읽기만 한다.
   `configurationDefaults` 는 `editor.fontFamily`·`markdown.preview.fontFamily` 뿐이다(사용자가 정하지 않았을 때만 적용).
   늘리려면 다른 확장·사용자 설정과 겹치는지 적고 이 문서를 고친다.
3. **남의 파일은 읽기만**: 다른 확장의 폴더에 쓰지 않는다. 필요한 것은 `dist/layers/` 로 복사한다.
4. **섞기가 실패해도 기본 테마는 남는다**: 테마 하나를 못 읽으면 그 테마만 빠지고 출력 채널에 한 줄 남는다
   (`ColorThemeService`·`ProductIconService` 의 테마별 `try`). 사용자에게는 `reportThemeFailure` 로만 알린다.
5. **VS Code 가 받는 형식만 만든다**: 글꼴 색은 `#rrggbb`, 글꼴 글리프마다 `fontId`·`fontSize`, `currentColor` 바꾸기 등(CLAUDE.md "테마 섞기").
6. **활성화**: `onStartupFinished` 를 유지한다(`*` 금지). 다른 확장을 `activate()` 하지 않고 `packageJSON` 만 읽는다.
7. **변화 감지**: 설치된 테마 목록은 `extensions.onDidChange` 때만 다시 읽는다. 테마 파일 감시는 `watchFile`
   (5초, `persistent: false`)이고 쓰지 않게 된 파일은 감시를 푼다.
8. **엔진 하한** `^1.95.0`: VS Code 1.95 의 Node 는 20 이라 Node 22 이후 API 는 쓰지 않는다. 새 VS Code API 가 필요하면
   하한을 올릴지 먼저 정하고 `@types/vscode`·`engines`·스모크 버전을 같이 바꾼다.
9. **원격·웹**: `extensionKind` 는 `ui`·`workspace`, 웹 진입점(`src/web/extension.ts`)은 빈 stub 이다. 지원 범위를 바꾸면 README 와 이 문서를 고친다.

### 함께 확인하는 확장

`test/smoke/run.js` 의 `COMPAT_EXTENSIONS` 가 CI 에서 설치되어 섞인다.

| 확장 | 종류 | 확인하는 것 |
|---|---|---|
| `PKief.material-icon-theme` | 아이콘(SVG), 기본 `iconThemeLayers` | SVG 복사·필터, fill |
| `vscode-icons-team.vscode-icons` | 아이콘(SVG) | 다른 json 구조, 여러 층 |
| `file-icons.file-icons` | 아이콘(글꼴) | 글꼴 복사, 글리프별 `fontId` |
| `dracula-theme.theme-dracula` | 색 | UI override 가 Islands Dark 에 들어감 |
| `miguelsolorio.fluent-icons` | 제품 아이콘 | 글꼴을 `dist/layers/product/` 로 복사 |

- 사용자가 문제를 신고한 확장, 새 형식(예: 다른 글꼴 형식)을 지원하게 된 확장은 이 목록에 넣고 단위 테스트 fixture 도 만든다.
- 사람이 확인할 것(릴리스 전): 격리 프로필(CLAUDE.md "확인 방법", `--shared-data-dir` 포함)에 VSIX 와 문제 확장을 설치해서
  화면을 본다. Remote(WSL·SSH)는 기능이 바뀐 릴리스에서 한 번.

## 3. 메모리·성능

### 예산

| 항목 | 2026-11 크기 | 예산 | 검사 |
|---|---|---|---|
| `dist/extension.js` (production, 활성화 때 파싱) | 520 KB | 700 KB | `check:size` |
| 아이콘 테마 json (VS Code 가 파싱해 가짐) | 718 KB | 900 KB | `check:size` |
| Material 제품 아이콘 json | 176 KB | 230 KB | `check:size` |
| Islands 제품 아이콘 json / 색 테마 json | 9 KB / 40 KB | 32 KB / 64 KB | `check:size` |
| VSIX 크기 / 파일 수 | 11.1 MB / 5,602 | 14 MB / 6,500 | `check:size` |
| 재생성 4회 반복(불투명도·강조색) + 섞기 화면 3회 뒤 힙 증가 | 첫 CI 실행에서 기록 | 10 MB | `smoke.yml` |

- 예산은 넘기지 않는다. 기능 때문에 올려야 하면 같은 PR 에서 예산 숫자(`test/checks/sizeBudget.js`, `test/smoke/suite.js`)와
  이 표를 고치고, 늘어난 이유와 측정값을 PR 에 적는다.
- 스모크의 재생성 시간(설정 쓰기 → 파일 반영, 300 ms 묶기 포함)은 기록만 한다. CI 기계마다 달라서 실패 조건이 아니다.
  늘어나면 `COOL_THEME_KIT_MEMORY=1` 로 격리 프로필에서 다시 잰다(웜 스타트 기준 재생성 ≈ 50 ms).

### 규칙

1. **활성화는 가볍게**: 무거운 일은 `scheduleRegenerate`(300 ms 묶기) 뒤로 미룬다. 시작 때 테마 json 을 통째로 파싱하지 않고
   `helpers/themeState.ts` 의 상태 파일을 쓴다.
2. **큰 데이터를 붙잡지 않는다**: 테마 json·SVG 내용을 모듈 변수나 싱글턴에 두지 않는다. 캐시를 두면 비우는 길
   (`forgetInstalled*Themes`, `extensions.onDidChange`)을 같이 만든다.
3. **해제**: 이벤트 구독·타이머·`watchFile` 은 `context.subscriptions` 나 `dispose` 에서 푼다. 섞기 화면은
   `retainContextWhenHidden: false` 를 유지하고, 숨겨진 패널에는 상태를 만들지 않는다.
4. **디스크**: 내용이 같으면 쓰지 않는다(`writeFileAtomic`). 아이콘 파일 이름의 해시는 SVG 필터 설정만으로 만든다
   (아이콘 2,500개를 다시 쓰면 Windows 에서 6~9초 멈춤, 포크 #28).
5. **번들**: 새 의존성은 번들 크기를 본다(`check:size`). 함수 하나 때문에 큰 라이브러리를 넣지 않는다.
6. **측정 방법**: `COOL_THEME_KIT_MEMORY=1` 로 띄우면 출력 채널에 `MEMORY` 줄(GC 뒤 `heapUsed`·`rss`)이 남는다(CLAUDE.md).
   스모크도 이 값을 켜고 돌아서 Job summary 에 같은 줄이 나온다.

## 4. SonarQube Cloud

- 설정 파일은 `.sonarcloud.properties` 하나다. Automatic Analysis 도, CI 분석(`sonar.yml`)도 이것을 읽는다
  (CI 는 `sonar-project.properties` 로 복사해서 쓴다). 생성 파일·서브모듈·데이터 표는 여기서 뺀다.
- **품질 게이트**(SonarQube Cloud 화면): "Sonar way" 를 쓴다. 새 코드에 대해 신뢰성·보안 등급 A, Security Hotspot 100% 검토,
  중복 3% 이하. 커버리지 조건은 CI 분석일 때만 의미가 있다(Automatic Analysis 는 커버리지를 못 받는다).
  처음에 커버리지 조건 때문에 막히면 게이트를 복사해 커버리지만 60% 로 낮춘 게이트를 이 프로젝트에 쓴다.
- **New Code 정의**: "Number of days" 30일. `package.json` 버전은 릴리스 때 바뀌지 않아서("Previous version" 이 움직이지 않음) 쓰지 않는다.
- **Hotspot**: 웹뷰, 파일 쓰기, 정규식(ReDoS), 경로 처리가 주로 나온다. 검토하고 "Safe" 로 닫을 때는 이유를 남긴다.
- **CI 분석으로 바꾸기**(커버리지와 게이트를 CI 실패로 막으려면):
  1. SonarQube Cloud → 프로젝트 → Administration → Analysis Method 에서 Automatic Analysis 를 끈다.
  2. 저장소 secret `SONAR_TOKEN` 을 넣는다(SonarQube Cloud → My Account → Security).
  3. 조직 키·프로젝트 키가 `woogajjangka`·`WoogaJJangka_a-file-icon-vscode` 와 다르면 저장소 변수 `SONAR_ORGANIZATION`·`SONAR_PROJECT_KEY`.
  그러면 `sonar.yml` 의 "Analysis + quality gate" 가 돌고 게이트가 실패하면 그 검사가 실패한다. `SONAR_TOKEN` 이 없으면
  그 job 은 건너뛰고 Automatic Analysis 가 계속 돈다. 둘을 같이 켜면 CI 분석이 실패하므로 1번을 먼저 한다.
- **필수 검사**: Automatic Analysis 면 "SonarCloud Code Analysis", CI 분석이면 "Analysis + quality gate" 를 main 보호의 필수 검사로 둔다.
  PR 에 체크가 안 붙으면 GitHub App 설치의 저장소 접근부터 본다.

## 5. 주기 점검

| 주기 | 할 일 |
|---|---|
| 모든 PR | PR 템플릿의 확인 목록, 모든 검사 통과 |
| 매주 (자동) | 월 `sync-upstream.yml`, 월 Dependabot(Actions), 화 `security.yml`, 수 `smoke.yml` — 실패하면 그 주에 본다 |
| 매월 | Dependabot bun 묶음 PR 처리, `audit:shipped` summary 의 빌드 도구 advisory 수 확인, Sonar 이슈·Hotspot 정리 |
| 릴리스 전 | main 의 smoke(1.95.0·stable·다른 확장) 통과, 격리 프로필에서 VSIX 확인(한국어 글꼴 포함), 크기 예산 표 확인 |
| 분기 | 엔진 하한 재검토, `COMPAT_EXTENSIONS` 갱신, 토큰 만료일 확인, 이 문서의 예산·점검 결과 갱신 |

## 6. 점검 결과 (2026-11-20)

이 지침을 만들며 찾은 것. 고치면 여기서 지우고 PR 에 적는다.

1. **[보안] 다른 테마의 경로를 확장 폴더 안으로 막지 않는다.** `ThemeLayerGenerator.svgDefinition`·글꼴 복사,
   `ProductIconGenerator`, `readColorTheme` 의 `include`·`tokenColors`, `themePreview` 가 `resolve(dirname(테마), 경로)` 를
   그대로 쓴다. SVG·글꼴 확장자만 확인하므로 `../../` 로 그 확장 밖의 파일이 `dist/layers` 로 복사될 수 있다(복사본은 이 확장
   폴더에 있어서 아이콘·웹뷰 미리보기로 보인다).
   다른 확장은 이미 코드를 실행할 수 있어 위험은 낮지만, VS Code 와 같게 "확장 폴더 안" 검사를 한 곳(helper)에 두고 단위 테스트를 붙인다.
2. **[보안] Restricted Mode 에서도 워크스페이스 설정의 SVG 경로를 읽는다.** `files/folders/languagesAssociations` 값이
   `~/…`·절대 경로 SVG 면 그 파일을 복사해 아이콘으로 쓴다. `untrustedWorkspaces` 를 `"limited"` 로 바꾸고 이 세 설정을
   `restrictedConfigurations` 에 넣는 것을 검토한다(신뢰하지 않은 폴더에서는 사용자 설정 값만 쓰임).
3. **[보안] 빌드·테스트 도구의 advisory**: high 72, critical 3 (puppeteer·tar-fs·ws, svgo, oslllo-svg-fixer → validator,
   minimatch 등). 배포물에는 없다. `bun audit fix` 와 Dependabot 으로 줄이고, 메이저가 걸린 것(puppeteer 23 → 최신, svgo 3.3.5+)은 따로 PR.
4. **[규칙] `toLowerCase()` 이름 비교**: `ThemeMixerPanel.state` 의 고정(pin) 표시가 샘플 이름(워크스페이스의 한글 이름일 수 있음)을
   `toLowerCase()` 로 비교한다. CLAUDE.md 규칙대로 `normalizeName` 으로 바꾼다(macOS 의 NFD 이름).
5. **[테스트] `fonts.test.ts` "does not take another family…"** 는 JetBrains Mono 가 시스템에 설치된 Linux 에서 실패한다
   (`isFontInstalled` 가 `fc-list` 로 대체 확인). 테스트에서 `fc-list` 를 빼거나 주입할 수 있게 한다.
6. **[CI] 스모크가 처음 CI 에 들어갔다.** 첫 실행의 메모리 표로 3장의 "첫 CI 실행에서 기록" 칸을 채우고, 힙 예산(10 MB)이 너무 넉넉하면 줄인다.

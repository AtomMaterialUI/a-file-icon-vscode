# Security policy

## Supported versions

Only the latest release of Cool Theme Kit (Visual Studio Marketplace and the GitHub releases of this repository) gets
security fixes.

## Reporting a vulnerability

Please do not open a public issue. Report it privately with
[GitHub private vulnerability reporting](https://github.com/WoogaJJangka/a-file-icon-vscode/security/advisories/new)
(Security → Report a vulnerability), with the steps to reproduce, the VS Code version and the other extensions involved.

You get an answer within 7 days. A confirmed vulnerability of the shipped extension is fixed in a patch release,
then disclosed in a GitHub security advisory.

## Scope

The extension runs in the VS Code extension host with the rights of the user. In scope: what it does with settings
(including the settings of untrusted workspaces), with the theme files of other installed extensions, with the
messages of its webview (Mix Themes), and the files it writes in its own folder. The build tools and scripts of this
repository are not shipped in the VSIX; their advisories are handled as dependency updates.

---

## 보안 정책 (한국어)

- 보안 수정은 최신 릴리스에만 한다.
- 취약점은 공개 이슈 대신 [비공개 취약점 신고](https://github.com/WoogaJJangka/a-file-icon-vscode/security/advisories/new)로
  보내 주세요(재현 방법, VS Code 버전, 함께 쓴 확장). 7일 안에 답하고, 확인되면 패치 릴리스 뒤 보안 공지로 알린다.
- 유지보수 규칙: [docs/MAINTENANCE.md](docs/MAINTENANCE.md) 1장.

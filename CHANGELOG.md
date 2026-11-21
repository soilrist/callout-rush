# Changelog

형식: [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/) · 버전: [SemVer](https://semver.org/lang/ko/) · 규칙: `docs/conventions/Versioning.md`

## [Unreleased]
### Added
- 보조 모니터 화면 `board.html`: 오늘 TOP 10·전체 TOP 5·BEAT #1, 게임 창 저장 즉시 갱신, 새 기록 금색 3초
- 순위 화면: 이니셜 OK 뒤 오늘 TOP 10(내 줄 강조, 10등 밖이면 `#n YOU`), 8초 뒤 또는 클릭으로 다음 판
- 이니셜 입력: 결과 화면 글자판·키보드, 20초 무입력 `---`, 금지어 `***`, 점수 저장소에 저장
- 화면 흐름: 대기 → 카운트다운 → 플레이 → 결과 → 대기, 봇 자동 진행(`?bot=`)
- Vite + TypeScript 웹 앱 뼈대(`app/`)
- 화면 캡처 도구 `npm run shot` (Playwright)
- 판정 연출(정답 번쩍·점수 떠오름, 오답 X·흔들림, 단계 전환 글자, 이름표 페이드)
### Changed
### Fixed
### Removed
### Balance
### Known Issues

## [0.0.1] - YYYY-MM-DD
### Added
- 이니셜 입력: 결과 화면 글자판·키보드, 20초 무입력 `---`, 금지어 `***`, 점수 저장소에 저장
- 프로젝트 골격, 루프 스타터 키트 설치

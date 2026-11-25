# Changelog

형식: [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/) · 버전: [SemVer](https://semver.org/lang/ko/) · 규칙: `docs/conventions/Versioning.md`

## [Unreleased]
- 녹화 때 기록한 효과음 시각표로 영상용 소리줄 `sfx.wav` 를 만드는 `npm run sfxtrack` 추가 (M4-03)
- 맵 구역 테두리·그림 선을 더 밝게(배경과 대비 4.6:1) 해서 LIVE 단계에서도 12구역이 보이게 함 (M4-01)
- GitHub 릴리스 v1.0.0 에 `callout-rush-web.zip` 첨부 (M3-10)
- 1000판 연속 내구 실행 결과 보고서(`docs/soak-report.md`) 추가: 힙 +0.21MB, DOM 노드 변화 0, 오류 0
- 제출용 그림 7장(`제출본/shots/`)과 다시 찍는 명령 `npm run submitshots` 추가
### Added
- 시작 `GO`·단계 글자가 맵을 가리는 시간을 0.8초 → 0.5초로 줄임(첫 콜이 가려지지 않게)
- 운영자 메뉴를 시트대로 다듬음(2열 큰 단추, 주황 Clear·하늘색 Close, 창 크기에 맞춰 커짐)
- 배포용 zip(`제출본/callout-rush-web.zip`, 68KB): 압축 풀고 더블클릭하면 Node 로 서버가 떠서 인터넷 없이 열림
- 오프라인: 한 번 열어 두면 와이파이 없이도 열림(서비스 워커가 빌드 파일 전부 저장)
- 운영자 메뉴(`Ctrl+Shift+O`): 보조 창 열기·전체 화면·음소거·점수 CSV 내보내기·오늘 기록 지우기(확인 한 번)·Booth health
- 자리를 뜬 사람 처리: 플레이 12초 무입력이면 판을 버리고 대기로(저장 없음), 탭이 숨겨져도 버림. 개발용 `window.__health()` 로 타이머·DOM·리스너 수 확인
- 대기 화면: 오늘 TOP 3, 20초 무입력이면 뒤에서 봇이 시연(`DEMO`, 소리·저장 없음), 시연 중 클릭하면 즉시 새 판
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

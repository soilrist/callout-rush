# STATUS — 바퀴 기록

> 루프의 기억. **최근 것이 위.** 1200줄 넘으면 감독이 `loop/ctl.sh tidy` 로 오래된 것부터 `docs/archive/STATUS-YYYY-MM-DD.md` 로 옮긴다.
> 한 바퀴 = 아래 형식 한 덩어리. 검사는 층마다 **통과 / 실패 / 못 함** 중 하나로 (못 한 걸 통과라 쓰지 않는다).
> **"지금 상태" 는 일지가 아니라 현황판** — 15줄 이내, 덧붙이지 말고 바뀐 줄만 고쳐 쓴다 (25줄을 넘으면 루프 커밋이 거절된다). 한 일은 아래 바퀴 기록에. 감독이 직접 한 일도 `## #감독 · 날짜 · 요지` 덩어리로 아래에.

## 지금 상태 (루프가 매 바퀴 고쳐 씀, 감독이 바로잡을 수 있음)
- 마일스톤: M0 뼈대 — 3/13 조각 (M0-00~M0-02 끝)
- 브랜치: develop
- 다음 조각: M0-03
- 막힌 것: 없음
- 사람만 할 수 있는 것(`[!] 사람:`): 없음
- 사람 답 기다리는 것: 🔴 〔n〕개 / 🟡 가정 〔n〕개 / 안 채운 숫자 〔check_conventions R12 수〕개 (0 이어야 정상)
- 사람이 직접 해 본 마지막 마일스톤: 〔없음 / M1 (날짜)〕 — 감독이 적는다
- 감독이 눈으로 봐야 할 것(일꾼이 `못 함 — 감독` 으로 넘긴 칸): 없음

---

## #0002 · 2026-11-21 · 조각 M0-02
- 계획: M0-02 Vite+TS 앱 / `app/` — 고른 이유: ROADMAP M0 첫 `[ ]` (INBOX 처리할 줄 없음)
- 한 것: `app/` 에 package.json·tsconfig(strict)·vite.config.ts(base './', 입력 index·board)·index.html·board.html·src/style.css(바탕 #0B1220, 글자 CALLOUT RUSH) 만듦. devDependencies: typescript·vite·@types/node (Node 24)
- 커밋: 이 커밋
- 검사: 1층 통과(`npm run build` 출력 `✓ built in 210ms`, `dist/board.html 410B`, `dist/index.html 410B` 둘 다 생김, jev SUPPORTED 0.78) / 2층 못 함(테스트 없음 — M0-03) / 3층 못 함(캡처 도구 M0-05 전)
- 플레이어 눈: 해당 없음(뼈대 화면)
- 점검한 규칙: FolderStructure, GitCommit
- 가정한 것(🟡): 없음
- 물은 것(🔴): 없음
- INBOX 처리: 없음
- 참고: `app/package.json`·`index.html` 등은 .gitignore 에 안 걸림(check-ignore rc=1)
- 다음: M0-03

## #0001 · 2026-11-21 · 조각 M0-01
- 계획: M0-01 `.gitignore` 고치기 / `.gitignore` — 고른 이유: ROADMAP M0 첫 `[ ]` (INBOX 처리할 줄 없음)
- 한 것: `.idea/` 통째 무시 → 개인 파일 5종만 무시, `app/node_modules/`·`app/dist/`·`app/.inspect-out/`·`/captures/` 추가, `**/[Bb]uild/`·`**/[Bb]uilds/` 삭제
- 커밋: 이 커밋
- 검사: 1층 통과(`git check-ignore -v .idea/inspectionProfiles/x.xml` 출력 없음 rc=1, `app/node_modules/x`·`app/dist/x`·`captures/a.png`·`app/.inspect-out/x`·`.idea/workspace.xml` 전부 걸림 rc=0, `app/src/build/x.ts` 안 걸림 rc=1) / 2층 못 함(코드 없음) / 3층 못 함(화면 없음)
- 플레이어 눈: 해당 없음
- 점검한 규칙: GitCommit, FolderStructure
- 가정한 것(🟡): 없음
- 물은 것(🔴): 없음
- INBOX 처리: 없음
- 참고: `.gitignore` 에 `docs/`·`loop/`·`제출본/` 등 「감독 전용」 줄이 있다. 이미 추적 중인 파일은 영향 없지만 새 파일(`제출본/*`·`docs/jetbrains-usage.md` 등)은 `git add -f` 가 필요할 수 있다 — 감독 확인 필요
- 다음: M0-02

## #0001 · YYYY-MM-DD HH:MM · 조각 M0-01
- 계획: 폴더 구조 + asmdef 4개 / Assets/_Project/Scripts/* — 고른 이유: ROADMAP M0 첫 `[ ]`
- 한 것: 
- 커밋: 〔해시〕
- 검사: 1층 통과(`✔ 규칙 검사 통과 (경고 0 / 미정 숫자 0)`, jev SUPPORTED 0.79) / 2층 못 함(코드 없음) / 3층 못 함(화면 없음) — 1·2층 통과엔 실제 출력 마지막 줄 인용 + `tools/jev.py evidence` 판정, 보이는 조각이면 캡처를 열어 보고 `3층 통과(레퍼런스 대조: docs/reference/<대상>.md, captures/<파일>.png)`
- 플레이어 눈: 해당 없음 (보이거나 만지는 조각이면 `① 예(근거) / ② 못 함(기기 없음 — 감독) / ③ … / ④ … / ⑤ …` — `conventions/PlayerEye.md`)
- 점검한 규칙: FolderStructure, CodingStyle(R08·R11·R14), GitCommit
- 가정한 것(🟡): 없음
- 물은 것(🔴): 없음
- INBOX 처리: 없음
- 다음: M0-02

# STATUS — 바퀴 기록

> 루프의 기억. **최근 것이 위.** 1200줄 넘으면 감독이 `loop/ctl.sh tidy` 로 오래된 것부터 `docs/archive/STATUS-YYYY-MM-DD.md` 로 옮긴다.
> 한 바퀴 = 아래 형식 한 덩어리. 검사는 층마다 **통과 / 실패 / 못 함** 중 하나로 (못 한 걸 통과라 쓰지 않는다).
> **"지금 상태" 는 일지가 아니라 현황판** — 15줄 이내, 덧붙이지 말고 바뀐 줄만 고쳐 쓴다 (25줄을 넘으면 루프 커밋이 거절된다). 한 일은 아래 바퀴 기록에. 감독이 직접 한 일도 `## #감독 · 날짜 · 요지` 덩어리로 아래에.

## 지금 상태 (루프가 매 바퀴 고쳐 씀, 감독이 바로잡을 수 있음)
- 마일스톤: M0 뼈대 끝(사람 5분 보기만 남음) · M1 한 판 완성 진행 중 — M1-98 끝(M1-13 건너뜀) · M2 진행 중 — M2-01~M2-11·M2-14·M2-17·M2-18·M2-19·M2-20·M2-98 끝 · M2-12 끝(#0054) · M2-13 끝(#0064) · M2-16 끝(#0068, 공개 주소 200) · M3-01~M3-10·M3-98 끝(릴리스 v1.0.0 #0071)(M3-04 영상 초안 #0058, 소리 없음) · M4 감독 검수 보강 진행(M4-01 끝 #0074 · M4-02 끝 #0075 · M4-03 끝 #0076 · M4-04 끝 #0077 · M4-05 끝 #0078 · M4-06 끝 #0079 · M4-07 끝 #0080 · M4-98 끝 #0081 · M4-99 끝 #0083 · M4-100 끝 #0084 · M4-101 끝 #0085 · M4-103 끝 #0086 · M4-104 끝 #0087 · M4-104b 끝 #0088 · M4-105 끝 #0089 · M4-106 끝 #0090 · M4-107 끝 #0091)
- 브랜치: develop
- 다음 조각: 감독 M4 검수(push·v1.0.1). M2-15·M1-13 은 JUNIE_API_KEY 대기(사람 몫, 건너뜀)
- 막힌 것: Junie 실제 실행은 JUNIE_API_KEY 대기(사람 할 일 3번, 다른 조각은 계속). (WebStorm 헤드리스는 사람 로그인 없이 돌았음 — 사람 할 일 1번은 사실상 불필요)
- 사람만 할 수 있는 것(`[!] 사람:`): 없음
- 사람 답 기다리는 것: 🔴 〔n〕개 / 🟡 가정 〔n〕개 / 안 채운 숫자 〔check_conventions R12 수〕개 (0 이어야 정상)
- 사람이 직접 해 본 마지막 마일스톤: 〔없음 / M1 (날짜)〕 — 감독이 적는다
- 감독이 눈으로 봐야 할 것(일꾼이 `못 함 — 감독` 으로 넘긴 칸): 없음

---

## #0091 · 2026-11-25 · M4-107 서비스워커·vite 주석 영어로
- 계획: M4-107 · ROADMAP M4 첫 `[ ]` (INBOX 루프 몫 없음) · `app/public/sw.js` 주석 2줄, `app/vite.config.ts` 주석 1줄, 주석만.
- 한 것: 3줄을 영어로. zip 새로 묶음(68428 바이트).
- 커밋: (아래 커밋)
- 검사: 1층 통과 — `Tests  138 passed (138)`, `INSPECT ok: 0 errors, 0 warnings` / 2층 통과 — `ZIPCHECK ok: unpacked zip 68428 bytes and served with serve.mjs, bot 1 games to the end, board.html 200, parent-path request 403, console errors 0`, `OFFLINE ok: cached 11 files, network cut and reload → 1 games done, side window opened, failed requests 0, console errors 0` / 3층 해당 없음(주석만)
- 확인: zip 안 파일 파이썬 `[가-힣]` 검색 → `KOREAN 0`
- 점검한 규칙: Verification, GitCommit, Autonomy
- 가정한 것(🟡): 없음. 물은 것(🔴): 없음. INBOX 처리: 해당 없음
- 다음: 감독 M4 검수

## #0090 · 2026-11-25 · M4-106 core 오류 글 영어로
- 계획: M4-106 · ROADMAP M4 첫 `[ ]` (INBOX 루프 몫 없음) · `app/src/core` bot·calls·game·scoring 의 `throw new Error` 글 7줄, 글만.
- 한 것: 7줄을 영어로(`Unknown bot`, `No target zone`, `Unknown zone`, `No zone to pick`, `Unknown phase`, `No target`, `Unknown player count`). 그 글을 기대하는 시험은 없음. zip 새로 묶음.
- 커밋: (아래 커밋)
- 검사: 1층 통과 — `Tests  138 passed (138)`, `INSPECT ok: 0 errors, 0 warnings` / 2층 통과 — `ZIPCHECK ok: unpacked zip 68521 bytes and served with serve.mjs, bot 1 games to the end, board.html 200, parent-path request 403, console errors 0` / 3층 해당 없음(화면 변화 없음, 내부 오류 글)
- 확인: `git grep -nP '[가-힣]' -- app/src` → `balance.test.ts:30` 하나만 (문서 표 열쇠 글자라 그대로)
- 점검한 규칙: Verification, GitCommit, Autonomy
- 가정한 것(🟡): 없음. 물은 것(🔴): 없음. INBOX 처리: 해당 없음
- 다음: 감독 M4 검수

## #0089 · 2026-11-25 · M4-105 영상 diff 카드 영어로
- 계획: M4-105 · ROADMAP M4 첫 `[ ]` (INBOX 루프 몫 없음) · `app/scripts/videobuild.mjs`(diff 카드), `제출본/video-script.md`, `제출본/submit-checklist.md`. 증거 파일은 그대로.
- 한 것: 카드에서 `점수 한 건…` 문맥 줄 제외, `깨진 JSON…` 주석은 `// Broken JSON or not an array: same recovery path` 로 그림, 카드 아래 `Korean comment shown in English; raw diff in docs/video-evidence/` 작은 글, Before 카드 제목 `Before: scores.ts as of commit 4cae2a4`. 한국어가 남으면 빌드가 멈추는 검사 한 줄. `npm run videobuild` → `VIDEOBUILD exit 0, expected length 126.3s`. zip 은 바이트만 달라져 되돌림(`git checkout`).
- 커밋: (아래 커밋)
- 검사: 1층 통과 — `Tests  138 passed (138)`, `INSPECT ok: 0 errors, 0 warnings` / 2층 통과 — `ZIPCHECK ok: unpacked zip 68612 bytes and served with serve.mjs, bot 1 games to the end, board.html 200, parent-path request 403, console errors 0` · `ffprobe` 길이 `126.300000`, 스트림 video·audio / 3층 통과 — 90~126초 2초 간격 시트 `captures/tmp/m4105/sheet.png` 와 diff 카드 `captures/tmp/m4105/diff.png` 를 열어 봄: 한국어 0, 카드 아래 안내 글 보임, 자막 시각 그대로
- 점검한 규칙: Verification, GitCommit, Autonomy
- 가정한 것(🟡): 없음. 물은 것(🔴): 없음. INBOX 처리: 해당 없음
- 다음: 감독 M4 검수

## #0088 · 2026-11-25 · M4-104b scripts 글 영어로
- 계획: M4-104b · ROADMAP M4 첫 `[ ]` (INBOX 루프 몫 없음) · `app/scripts` 27개 파일(balance.ts 포함)의 주석·출력 글을 영어로. `INSPECT ok`·`E2E ok` 같은 열쇠 글자는 그대로.
- 한 것: 문장 치환표로 230줄 교체, `node --check` 26개 문법 통과. 남은 한국어는 `제출본` 폴더 경로(실제 폴더 이름)뿐. 재빌드한 zip 은 바이트가 달라져 되돌림(`git checkout`).
- 커밋: (아래 커밋)
- 검사: 1층 통과 — `npm run check` 끝까지 통과, 마지막 줄 `INSPECT ok: 0 errors, 0 warnings`, `Tests  138 passed (138)` / 2층 통과 — `ZIPCHECK ok: unpacked zip 68612 bytes and served with serve.mjs, bot 1 games to the end, board.html 200, parent-path request 403, console errors 0` / 3층 해당 없음(개발 스크립트만, 화면 0줄)
- 점검한 규칙: Verification, GitCommit, CodingStyle, Autonomy
- 가정한 것(🟡): `제출본` 경로 글자 유지. 물은 것(🔴): 없음. INBOX 처리: 해당 없음
- 다음: M4-105

## #0087 · 2026-11-25 · M4-104 시험 파일 글 영어로
- 계획: M4-104 · ROADMAP M4 첫 `[ ]` (INBOX 루프 몫 없음) · `app/src` 시험 24개 파일의 `describe`/`it` 이름·주석만 영어로. `app/scripts` 는 출력 열쇠 글자 점검이 따로 필요해 M4-104b 로 쪼갬.
- 한 것: 파일별 문장 치환표로 시험 이름·주석만 교체, 시험 코드·기댓값 0줄(데이터 문자열 `'없는id'`·`'{깨짐'` 만 영어 값으로). 따옴표가 깨진 곳 2군데·검사기 문법 경고 1건 고침.
- 커밋: (아래 커밋)
- 검사: 1층 통과 — `cd app && npm run check` 종료 코드 0, `Tests  138 passed (138)`, 마지막 줄 `INSPECT ok: 0 errors, 0 warnings` / 2층·3층 해당 없음(시험 파일만, 제품 코드 0줄)
- 남은 한국어(`app/src`): 제품 `throw` 문자열 7줄(#0086 과 같음) + `balance.test.ts:30` 의 `'| 등급 경계'`(설계서 한국어 표를 찾는 열쇠라 그대로).
- 점검한 규칙: Verification, GitCommit, CodingStyle, Autonomy
- 가정한 것(🟡): 위 열쇠 글자 유지. 물은 것(🔴): 없음. INBOX 처리: 해당 없음
- 다음: M4-104b

## #0086 · 2026-11-25 · M4-103 제품 소스 주석 영어로
- 계획: M4-103 · ROADMAP M4 첫 `[ ]` (INBOX 루프 몫 없음) · `app/src` 시험 아닌 30개 파일의 한국어 주석(약 226줄)만 쉬운 영어로 · 코드·문자열·이름 0줄.
- 한 것: 줄 번호별 치환으로 주석만 교체. 교체 줄이 전부 주석을 포함하는지 diff 로 확인. 검사기(inspect)의 영어 문법 경고 8건은 글을 고쳐 0 으로.
- 커밋: 3cbb713
- 검사: 1층 통과 — `cd app && npm run check` 종료 코드 0, `Tests  138 passed (138)`, 마지막 줄 `INSPECT ok: 0 errors, 0 warnings` (jev SUPPORTED) / 2층 통과 — 바꾸기 전후 `npm run build` 뒤 `dist` js 4개 `shasum` 이 같음: `ebf8ca960732b9689ee9d34361e0aa91ad5331db ./assets/board-BnTigpoB.js` · `de0ded1f4cb5a4bb9eea073324ba39c483857f61 ./assets/index-DgImBGv3.js` · `27fa0cc978a1d4cc5aa620ae7721794841fde237 ./assets/stage-DCPrFYZA.js` · `3516ea9b898986932e81add993b3fe4478ece01d ./sw.js` (`diff` 가 SAME) / 3층 해당 없음(주석만, 화면 변화 없음)
- 남은 한국어: `git grep -nP '[가-힣]' -- app/src ':!*.test.ts'` 7줄 — 모두 `throw new Error(...)` 문자열(bot.ts 2, calls.ts 2, game.ts 2, scoring.ts 1). 코드라서 이 조각 범위 밖, 화면에는 안 나옴(내부 오류 글). 🟡 가정: 건드리지 않음 — 영어로 바꾸려면 해시가 달라지니 감독이 원하면 별도 조각.
- 점검한 규칙: Verification, GitCommit, CodingStyle, Autonomy
- 가정한 것(🟡): 위 7줄 보류. 물은 것(🔴): 없음. INBOX 처리: 해당 없음
- 다음: M4-104

## #감독 · 2026-11-25 · M4 재검수 — 통과 9, 남은 것 1묶음(영어)
- 통과(직접 돌려 봄): `npm run check` 종료 0(`Tests 138 passed (138)`, `INSPECT ok: 0 errors, 0 warnings`) · 영상 1920×1080 126.3초·8초 넘는 무음 0 · 프레임을 열어 장면 순서·자막·새 줄 확인 · scores.ts 수정은 동작 그대로 · 공개 안전 훑기 0건 · `captions.srt` = `demo-draft.srt`.
- 내가 고친 글(M4-102): judge-map·점검표 「13번」 → 실제로 센 값, AI_SHOWCASE·usage 의 `this slice's commit` → `64ed7fd`/`727b0c9`, 「C-1」 → 「C 절 1번」, before 증거를 만든 방법을 usage 에 한 문장.
- 루프에 내림: M4-103·M4-104(주석·시험 이름 영어), M4-105(영상 diff 카드의 한국어 2줄). 이유: 규정이 영어 제출물이고 심사위원이 소스를 연다.
- 못 함: 소리를 귀로 듣지는 못함(파형·무음 도구로만).
- 점검한 규칙: Verification, Autonomy, GitCommit

## #0085 · 2026-11-25 · M4-101 영상에 딸린 글 맞추기
- 계획: M4-101 · ROADMAP M4 첫 `[ ]` (INBOX 루프 몫 없음) · `제출본/captions.srt`·`video-script.md`·`submit-checklist.md`·`docs/judge-map.md`·CHANGELOG 수정 + zip 재생성.
- 한 것: `captions.srt` 를 새 `demo-draft.srt` 와 같게 복사(옛 150초 기준 폐기) · `video-script.md` 장면 표를 6장면 126.3초 시각으로 다시 씀 · judge-map 장면 시각 교체 · 체크리스트 길이 150→126.3초 · CHANGELOG 한 줄 · `npm run zip` 으로 zip 재생성.
- 커밋: 아래 참고
- 검사: 1층 통과 — `cd app && npm run check` 종료 코드 0, 마지막 줄 `INSPECT ok: 0 errors, 0 warnings` (jev 는 이 줄 NOT_SUPPORTED — 종료 코드 0 으로 판정) / 2층 통과 `ZIPCHECK ok: zip 68612바이트를 풀어 serve.mjs 로 띄움, 봇 1판 끝까지, board.html 200, 상위 경로 요청 403, 콘솔 오류 0` (jev SUPPORTED) · 자막 끝 `00:02:05,800` ≤ `ffprobe` 126.300000 / 3층 해당 없음(글 수정, 화면 변화 없음)
- 플레이어 눈: 해당 없음
- 점검한 규칙: Verification, Autonomy(범위 안), GitCommit
- 다음: 감독 M4 검수

## #0084 · 2026-11-25 · M4-100 영상 뒤 55초 고치기
- 계획: M4-100 · ROADMAP M4 첫 `[ ]` (INBOX 루프 몫 없음) · `app/scripts/videobuild.mjs` 고침 + `docs/video-evidence/` 실제 출력 3개 · 장면 6(30초 표)을 증거 카드 3장(4+6.5+3.5초)으로, 첫 장면 10→5초, 장면 5 에 `soak-heap.svg`, 장면 1·5·6·7 에 게임 합성음(`sfx.ts` 의 ui·phase·rank) 장면 바뀜 소리.
- 한 것: ① 4cae2a4 시점 `scores.ts` 만 본 폴더에서 잠시 되돌려(워크트리는 CSS 경고 5건이 더 떠 버림 — 폴더 경로 탓으로 보여 증거로 안 씀) `npm run inspect` 실제 출력 저장, 바로 `git checkout -- app/src/core/scores.ts` 로 복구 ② 현재 출력 저장 ③ `git diff 4cae2a4 HEAD -- scores.ts` 저장 ④ 카드 글자는 그 파일을 그대로 읽어 그림(지어낸 터미널 없음). 새 파일·라이브러리·음악 없음. Junie·Air 0 커밋은 카드·devpost·usage 에 그대로.
- 커밋: 아래 참고
- 검사: 1층 통과 `VIDEOBUILD exit 0, 예상 길이 126.3초` / 2층 통과 — `ffprobe` 길이 `126.300000`, `silencedetect=n=-45dB:d=8` 8초 넘는 무음 0곳(`silence_start` 줄 수 0), 평균 -23.9 dB·최대 -3.9 dB / 3층 통과 — 연 그림 `captures/M4-100/sheet.png`(12프레임 시트, 2·8·20·40·65·75·90·100·104·110·118·124초): 대기 화면 / 3-2-1 / 1단계 / 2단계 / 3단계 / 결과+순위 두 창 / 다음 판 / 1000판 카드(표+힙 그래프) / 같은 카드 / 이전 커밋 증거 카드 / diff 카드 / 이후 증거 카드 / 끝 카드 — 장면마다 한 줄 자막 확인, 겹침·잘림 없음. jev 는 `VIDEOBUILD` 줄만 SUPPORTED, ffprobe 숫자 한 줄은 NOT_SUPPORTED(원문 그대로 인용). 한계: 소리는 귀로 못 들음(파형·음량만).
- 못 함: `captures/tmp/video` 의 sfx.wav 는 옛 녹화(앞 5초 포함)라 게임 소리를 5초 당겨 씀 — 녹화 다시 안 함. `captions.srt`·`video-script.md`·judge-map·점검표·CHANGELOG·zip 은 M4-101 몫(지금 `captions.srt` 는 옛 150초 기준이라 안 맞음). `제출본/demo-draft.mp4` 는 git 무시 파일이라 커밋에 안 들어감.
- 플레이어 눈: 해당 없음(심사 영상, 플레이 화면 변화 없음)
- 점검한 규칙: Verification(실제 출력 인용), Autonomy(범위 안), GitCommit, ③-13(되돌린 파일은 checkout 으로 복구, git status 로 확인)
- 다음: M4-101

## #0083 · 2026-11-25 · M4-99 검사 경고 1건 진짜로 고침
- 계획: M4-99 · ROADMAP M4 첫 `[ ]` · `app/src/core/scores.ts` `load()` · 배열 아닌 값을 throw 대신 같은 복구 길로 + 테스트 + 숫자·주소 문서 맞춤.
- 한 것: `load()` 에서 throw→catch 제거(첫 수정은 `parsed is possibly null` 경고가 남아 `items: unknown[] | null` 로 다시 고침). 테스트 1개 추가. usage 합계를 50 경고(진짜 2·오탐 48)·수정 2 로, 세는 법을 "STATUS 에서 INSPECT ok 가 적힌 줄 수(글 줄 포함, 실행 횟수의 상한)"로 바꿈. AI_SHOWCASE Case 4 추가, devpost·methodology·video-script 숫자 맞춤. 제출 점검표 `blob/main`→`blob/develop`. 처음부터 0 이었다고 쓰지 않고 79번째 바퀴 무렵부터 1건 남았음을 적음.
- 커밋: 727b0c9
- 검사: 1층 통과 `INSPECT ok: 0 errors, 0 warnings` / 2층 통과 `Tests  138 passed (138)` (`npm run check` 전체 종료 0, jev SUPPORTED) / 3층 해당 없음(화면 변화 없음)
- 확인: `git grep -n "blob/main"` (STATUS·ROADMAP 제외) 0건.
- 못 함: 제출본 zip 재생성 — M4-101 몫. video-script 의 영상 내용은 M4-100 에서.
- 점검한 규칙: Verification(실제 출력 인용), GitCommit, Autonomy(범위 안), CodingStyle
- 다음: M4-100

## #감독 · 2026-11-25 · M4 검수 1차 — 불합격, 조각 3개 추가
- 한 것: 영상 150.3초를 6초 간격 24장으로 열어 보고 소리 파형·무음 구간을 쟀다. `npm run check` 를 직접 돌렸다. 올릴 변경 전체와 저장소 전체에서 이메일·키·집 경로를 찾았다.
- 통과: 테스트 137개·e2e·sfxrender·빌드, 장면 2~4(순위에 ACE 줄이 두 창에 뜸)·자막, 공개 주소 두 개 200, 개인정보·키 0건, 커밋 이메일 모두 noreply
- 고칠 것: ① `npm run inspect` 가 `0 errors, 1 warnings`(`app/src/core/scores.ts:101`)인데 영상·문서는 0 이라고 함 ② 장면 6 이 30초 정지 + JetBrains 도구 0 표, 0~10초·95~150초 무음 ③ 제출 점검표의 `blob/main/AI_SHOWCASE.md` 주소가 404(원격엔 develop 뿐)
- 검사: 1층 통과(경고 1) / 2층 통과 / 3층 불합격(영상)
- 못 함: 소리는 귀로 못 들음 — 파형·음량(평균 -24.9, 최대 -3.9 dBFS)으로만 봄
- 다음: M4-99. push·v1.0.1 은 재검수 뒤.

## #0082 · 2026-11-25 · 할 일 없음 — 멈춤
- 계획: INBOX 루프 몫 없음, ROADMAP 에 실행 가능한 `[ ]` 없음(M1-13·M2-15 는 `[!]` JUNIE_API_KEY 대기), DESIGN 에 안 쪼갠 내용 없음 → ④-2-4 대로 기록 후 `loop/STOP`.
- 한 것: 확인만. 코드 변경 없음.
- 검사: 1층 해당 없음 / 2층 해당 없음 / 3층 해당 없음
- 점검한 규칙: ③-7, ④-2-4
- 막힘: 사람 답 필요 1개 (1순위: JUNIE_API_KEY — M1-13·M2-15 2조각이 기다림)
- 다음: 영상 더빙·업로드·제출은 사람. 키 생기면 감독이 STOP 지우고 `[ ]` 로 되돌림.

## #0081 · 2026-11-25 · M4-98 심사위원 통 점검
- 계획: ROADMAP M4 첫 `[ ]` (INBOX 루프 몫 없음). `docs/judge-map.md` 표 작성, 가장 약한 칸(4 아이디어: 차별점이 암시뿐) 을 devpost 에 「Why it is different」 문단으로 보강, zip 다시 만듦.
- 한 것: 표 6줄(0~5) 파일·영상 시각·강도. 링크로 적은 파일 경로를 파이썬으로 존재 확인(전부 True, `5-board.png` 하나는 축약 표기라 풀어 씀). devpost 의 zip 크기 66.7→67.0 KB.
- 커밋: 아래 참고
- 검사: 1층 통과 — `TypeScript: No errors found`, `ESLint: No issues found`, `Tests  137 passed (137)` / 2층 통과 — `ZIP ok: …callout-rush-web.zip 68610`, `ZIPCHECK ok: zip 68610바이트를 풀어 serve.mjs 로 띄움, 봇 1판 끝까지, board.html 200, 상위 경로 요청 403, 콘솔 오류 0` (jev 는 요약 문장이라 NOT_SUPPORTED 가능, 출력 원문 그대로) / 3층 해당 없음(화면 변화 없음)
- 점검한 규칙: ③-1, ③-11, ③-12, ③-15
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 없음
- 다음: 루프 몫 없음. 영상 더빙·업로드·제출은 사람.

## #0080 · 2026-11-25 · M4-07 처음 온 사람 마우스만 한 판
- 계획: ROADMAP M4 첫 `[ ]` (INBOX 루프 몫 없음). `app/scripts/firstrun.mjs` 새로 만들어 1366×768·1920×1080 에서 attract 클릭 → 한 판(콜마다 구역 클릭) → 글자판 클릭 ABC → OK → 순위 화면까지 Playwright 실제 마우스로 하고 캡처 4장씩(`captures/M4-07/`). 공개 주소와 같은 빌드(`dist`)를 로컬 preview 로 켬(외부 접속 안 함).
- 한 것: 스크립트 작성 + `package.json` 에 `firstrun`. 캔버스가 창 안인지·스크롤 없는지를 숫자로 검사.
- 커밋: 아래 참고
- 검사: 1층 통과 (`npm run firstrun` → `FIRSTRUN 1366×768 클릭 132번 점수 이름 ABC 배율 0.711 캔버스 1365×768 스크롤 1366×768 / 1920×1080 클릭 132번 점수 이름 ABC 배율 1.000 캔버스 1920×1080 스크롤 1920×1080 / 종료코드 0`; `tools/jev.py evidence` → SUPPORTED; `npx eslint .` → `ESLint: No issues found`) / 2층 해당 없음 / 3층 통과 — 연 그림: `1366-1-attract.png`·`1366-2-play.png`·`1366-3-result.png`·`1366-4-board.png`·`1920-1-attract.png`·`1920-2-play.png`·`1920-3-result.png`·`1920-4-board.png`. 두 크기 모두 글자 잘림·겹침 없음, 이니셜 ABC 가 순위 `#1 ABC` 로 뜸.
- 플레이어 눈: 처음 하는 사람 — "Read the call. Click the spot." + CLICK TO PLAY 로 첫 행동이 보임, 결과 화면 ENTER YOUR INITIALS·OK 뚜렷, 순위 화면 아래 NEXT PLAYER 로 다음 행동이 보임 / 손 — 마우스만으로 끝까지 됨(키보드 불필요) / 카메라 — 두 크기 다 12구역 이름·점수·콜 칸이 보임 / 갇힘 없음. 
- 고칠 것 없음 근거: 위 8장에서 헷갈림·잘림·겹침 못 찾음. 한계: 봇식 클릭이라 점수 35,123·정확도 100% 로 사람 판과 다르고, 처음 사람이 콜 문장을 읽는 속도는 못 잼(감독·사람 5분 보기 몫). 콜 칸이 클릭 직후 잠깐 빈 것은 콜 사이 정상 간격.
- 점검한 규칙: ③-1, ③-2, ③-11, ③-12, ③-15
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 없음
- 다음: M4-98

## #0079 · 2026-11-25 · M4-06 낡은 문장 걷어내기
- 계획: ROADMAP M4 첫 `[ ]` (INBOX 루프 몫 없음). `docs/jetbrains-usage.md` 의 "no remote yet" 를 공개 저장소 사실로, `제출본/submit-checklist.md` 의 `자리`·`대기` 칸을 실제 상태로, `devpost.md` 테스트 수를 129/23 → 137/24 로.
- 한 것: 사실 먼저 확인 — `curl -sI` 두 주소 `HTTP/2 200`, GitHub API `"private": false`·`spdx_id: MIT`, `git remote -v` origin 있음, `git ls-files .idea .junie .air | wc -l` = 10, 소리 파일 0. 그다음 문장 수정. Junie 0·Air 0 은 그대로 둠.
- 커밋: 아래 참고
- 검사: 1층 통과 (`cd app && npx vitest run` → `Tests  137 passed (137)`; `tools/jev.py evidence "npm run check 통과" "Tests  137 passed (137)"` → SUPPORTED). `git grep -cE "자리 —|no remote yet|보고서 아직|대기 —" -- README.md AI_SHOWCASE.md 제출본 docs/jetbrains-usage.md` → 출력 없음, 종료 코드 1(0건). 이 0건 인용은 jev 가 NOT_SUPPORTED 라 "통과" 로 안 쓰고 사실 기록만 함 / 2층 해당 없음(문서) / 3층 해당 없음.
- 플레이어 눈: 해당 없음(문서).
- 점검한 규칙: ③-1, ③-2, ③-11, ③-12, ③-15
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 없음
- 다음: M4-07

## #0078 · 2026-11-25 · M4-05 영상 초안 다시 조립
- 계획: ROADMAP M4 첫 `[ ]` (INBOX 루프 몫 없음). `videorec.mjs` 가 순위 뒤 26초 더 녹화(결과 화면 뒤 실제로는 순위 화면→다음 판 3-2-1 로 이어지고 대기 화면으로 안 돌아옴 — 장면 4 는 "다음 사람의 깨끗한 판" 으로), `videobuild.mjs` 가 장면 3·4 를 한 녹화에서 이어 두 창 나란히(보조 창은 끝 맞춤으로 시작 차이 보정), `sfx.wav` 를 장면 1~4 에 얹고 카드 장면은 무음, 자막에 `sample scores`, `captions.srt`·`demo-draft.srt`·`video-script.md` 시각 수정.
- 한 것: `npm run videorec` → `npm run sfxtrack`(`SFXTRACK ok: 소리 164개, 107초`) → `npm run videobuild`(`VIDEOBUILD exit 0, 예상 길이 150.3초`). 린트 오류(안 쓰는 `shots`) 하나 고침.
- 커밋: 아래 참고
- 검사: 1층 통과 (`npm run check` 종료코드 0, `Tests  137 passed (137)`, `E2E ok: 정답 클릭 점수 100 연속 1, 빈 땅 클릭 연속 0, 봇 3판 결과를 지나 대기로 3번 돌아옴 콘솔 오류 0`) / 2층 통과 (`ffprobe`: `codec_name=h264 codec_type=video duration=150.300000 codec_name=aac codec_type=audio duration=150.300000`; `volumedetect` 전체 `max_volume: -3.9 dB`, 100초 이후 `max_volume: -91.0 dB` = 카드 무음) / 3층 통과: 12프레임 시트 `captures/tmp/sheet/sheet.png` 열어 봄(5·20·60·75·77·79·82·90·100·125·140·148초) — 대기 화면·WARM-UP·CLUTCH 는 자막과 맞음 / 75초 결과+이니셜 입력 자막 "Your score is a reaction time" 맞음 / 79·82초 두 창 나란히 ACE 줄(왼쪽 게임 창 순위, 오른쪽 보조 창 강조 줄) + `sample scores` 자막 맞음 / 90초 다음 판 0점 연속 0 자막 맞음 / 100·125·140·148초 카드와 자막 맞음
- 플레이어 눈: 해당 없음(영상 재료). 소리는 사람 귀로 못 들음 — 못 함(볼륨 수치만 확인). 소리와 화면의 어긋남은 최대 ±0.1초 가정(두 창·소리 모두 t0 기준).
- 점검한 규칙: ③-1, ③-2, ③-11, ③-12, ④-6
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 없음
- 다음: M4-06

## #0077 · 2026-11-25 · M4-04 순위 장면 진짜 녹화
- 계획: ROADMAP M4 첫 `[ ]` (INBOX 루프 몫 없음). 봇이 결과 화면에서 `BOT` 을 자동 입력해 `ACE` 를 못 치므로 주소 인자 `?hold=1`(봇이 결과 화면만 손 안 댐) 추가 → `params.ts`·`index.ts`·`params.test.ts`, `videorec.mjs` 가 키보드 a·c·e + `OK` 클릭 + 두 창 확인.
- 한 것: 결과 화면에서 실제 키 3번 → OK 클릭 → 게임 창 `lastName=ACE`, 보조 창 줄 수 증가, 두 창 localStorage 에 `ACE` 1줄씩 확인(아니면 exit 1). 시각을 `log.json` 의 `ace` 칸에 기록. 캡처 `ace-game.png`·`ace-board.png` 저장.
- 커밋: 아래 참고
- 검사: 1층 통과 (`Tests  137 passed (137)`, tsc·eslint 오류 없음, `✓ built in 58ms`) / 2층 통과 (`{"tPlayPage":10.027,"log":[{"t":10},{"t":10.2,"screen":"play"},{"t":73.1,"screen":"result"}],"ace":{"tType":78,"tOk":78,"tRowShown":78,"game":{"name":"ACE","scores":1},"board":{"rows":9,"scores":1}},"vids":[...],"errors":0}`) / 3층 통과: `captures/tmp/video/ace-game.png` 열어 봄 — 오늘 순위 #1 ACE 13,386 강조 줄 / `ace-board.png` 열어 봄 — 보조 창 #1 ACE 줄 강조 + 올타임 #1 ACE + BEAT 상자
- 플레이어 눈: 해당 없음(영상 재료, 새 인자는 주소로만 켬 — 평소 동작 불변)
- 점검한 규칙: ③-1, ③-2, ③-11, ③-12, ④-6
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 없음
- 다음: M4-05 (`ace` 시각 `log.json` 으로 장면 3 조립; 이 녹화는 결과 뒤 대기 화면이 없어 장면 4 는 별도 구간 필요)

## #0076 · 2026-11-25 · M4-03 효과음 소리줄 만들기
- 계획: ROADMAP M4 첫 `[ ]` (INBOX 루프 몫 없음). 새 `app/scripts/sfxtrack.mjs`(sfxrender 방식, `scheduleSfx` 그대로) + `package.json` `sfxtrack` + eslint 전역 `btoa`·`Buffer` 추가.
- 한 것: `sfx.json` 199개 소리를 OfflineAudioContext 로 120초 48kHz 모노로 그려 `captures/tmp/video/sfx.wav` 로 씀. 처음엔 큰 배열을 evaluate 로 돌려받다 실행 맥락이 끊겨 base64 로 바꿈.
- 커밋: 아래 참고
- 검사: 1층 통과 (`Tests  137 passed (137)`, `INSPECT ok: 0 errors, 1 warnings`, `SFX ok: 8개 소리 렌더 최대값 > 0.05, 길이 표 ±20ms`) / 2층 통과 (`SFXTRACK ok: 소리 199개, 120초, 48000Hz → captures/tmp/video/sfx.wav`; `ffmpeg -af volumedetect` → `max_volume: -4.1 dB`, `mean_volume: -22.7 dB`, `Duration: 00:02:00.00`) / 3층 해당 없음(화면 변화 없음)
- 플레이어 눈: 해당 없음(영상 재료). 사람 귀로는 못 들음 — 못 함.
- 점검한 규칙: ③-1, ③-2, ③-11, ③-13, ④-6
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 없음
- 다음: M4-04

## #0075 · 2026-11-25 · M4-02 효과음 시각 기록
- 계획: ROADMAP M4 첫 `[ ]` (INBOX 루프 몫 없음). 앱이 실제로 부르는 소리가 `rank` 하나뿐이라(DESIGN §5.5 의 나머지 7개는 연결 안 됨) 합격 조건을 채우려면 연결이 먼저 필요 → 새 `src/audio/cues.ts`(앞뒤 상태 비교로 소리 목록), `index.ts` `update` 에서 호출(대기 화면 시연은 소리 없음), `sfx.ts` `play` 에 `__sfxLog` 갈고리, `videorec.mjs` 가 `sfx.json` 기록.
- 한 것: 테스트 `cues.test.ts` 7개. 처음엔 같은 상태 객체·판 끝 전환 때문에 `phase`·`end` 가 빠져 고침. 녹화 한 번: `SFXLOG {"count":8,"radio":92,"miss":6,"hit":88,"phase":4,"end":1}` (두 판이 녹화됨: 판마다 count 4·phase 2).
- 커밋: 아래 참고
- 검사: 1층 통과 (`npm run check` 종료코드 0, `Tests  137 passed (137)`, `E2E ok: 정답 클릭 점수 100 연속 1, 빈 땅 클릭 연속 0, 봇 3판 결과를 지나 대기로 3번 돌아옴 콘솔 오류 0`) / 2층 통과 (`npm run videorec` 의 `SFXLOG` 줄 위와 같음, `captures/tmp/video/sfx.json` 열어 시각 확인) / 3층 해당 없음(화면 변화 없음)
- 플레이어 눈: 소리가 이제 실제 게임에서 난다(클릭 뒤 AudioContext 가 켜진 뒤부터). 사람 귀로는 못 들음 — 못 함. rank 는 두 번째 녹화에서 안 찍힘(봇이 결과 화면을 1초 만에 지나감, 합격 조건에 없음).
- 못 한 것: 합격의 "콜 수와 radio 수가 맞음" 은 외부에서 콜 수를 세지 못해 단위 시험(콜이 바뀔 때만 radio, 둘째 목표엔 없음)으로 갈음. 대략 hit+miss=94 목표 vs radio 92.
- 점검한 규칙: ③-1, ③-2, ③-11, ③-12, ④-6
- 가정한 것(🟡): 7개 소리 연결을 이 조각에 넣음(설계서 §5.5 에 이미 있는 항목) / 물은 것(🔴): 없음 / INBOX 처리: 없음
- 다음: M4-03

## #0074 · 2026-11-25 · M4-01 구역 윤곽 또렷하게
- 계획: ROADMAP M4 첫 `[ ]` (INBOX 루프 몫 없음). `app/src/ui/map.ts` 구역 테두리·그림 선 색을 새 상수 `zoneLine` #5F7FB0 으로, 테스트는 `map.test.ts`, 색 줄은 `docs/reference/play.md`.
- 한 것: 대비 계산(파이썬): #5f7fb0 vs bg 4.59, vs zone 3.52 (기존 line 은 bg 1.46). 테스트 1개 추가(bg·zone 둘 다 ≥ 3).
- 커밋: 4f24d3a
- 검사: 1층 통과 (`npm run check` 종료코드 0, `Tests      130 passed (130)`, `E2E ok: 정답 클릭 점수 100 연속 1, 빈 땅 클릭 연속 0, 봇 3판 결과를 지나 대기로 3번 돌아옴 콘솔 오류 0`) / 2층 못 함(맵 색만 바뀐 조각, 별도 2층 없음) / 3층 통과 (`captures/tmp/M4-01-live.png` 를 열어 봄: CLUTCH 단계, 구역 12개 테두리·안쪽 선이 다 보임. 같은 값 `M4-01-check.png` 도 찍음)
- 플레이어 눈: 이름표가 꺼지는 단계에서도 구역 경계가 구분됨. 선 색이 채움과 3.5:1 이라 눈이 편하고 점선 길(line)은 그대로라 "빈 땅"과 구분됨.
- 점검한 규칙: ③-1, ③-2, ③-11, ③-12, ④-6
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 없음
- 다음: M4-02

## #감독 · 2026-11-25 · 확인 5건 검산하고 M4 보강 조각 8개 추가
- 한 것: INBOX 확인 5건을 닫음. `npm test` → `Test Files 23 passed (23)` `Tests 129 passed (129)`. M2-12(게임 작업 p95 1.5~1.8ms 로 판정, 빈 페이지 p95 133.4ms 근거 있음)·M1-04(두 곳 콜 제한 시간 구역마다)·M0-11(줄바꿈 규칙)·M0-07(미사용 지역 변수 못 잡는 한계를 문서에 적음) 은 그대로 인정.
- M3-04 영상 초안은 되돌림: 158.4초·영상 줄만 있음(소리 없음). 12프레임 시트와 45초 프레임을 열어 봄 — 장면 3 은 그림 2장이고 방금 낸 점수 줄이 안 보여 자막과 안 맞음, LIVE 단계 구역 채움과 배경의 대비가 약 1.3:1. → M4-01~M4-05.
- `docs/jetbrains-usage.md` 24줄 「no remote yet」 은 낡은 사실 → M4-06.
- 못 본 것: 실제 속도 1판을 사람 손으로 하는 것(사람 5분 보기 칸 그대로).
- 다음: M4-01. 끝나면 감독이 영상을 소리와 함께 다시 본다.

## #0073 · 2026-11-23 · 막힘 정리
- 계획: INBOX 루프 몫 없음, ROADMAP 의 `[ ]` 는 M2-15 하나뿐 → ④-2-4 (막힘 정리).
- 한 것: `echo $JUNIE_API_KEY` 확인 → 비어 있음(`nokey`). M2-15 는 키가 있어야 돌아가서 건너뜀. `loop/STOP` 생성.
- 검사: 1층 해당 없음 / 2층 해당 없음 / 3층 해당 없음 (코드 변경 없음)
- 점검한 규칙: ③-7, ③-15, ④-2-4
- 막힘: 사람 답 필요 1개 (1순위: M2-15 Junie 리뷰 — 마일스톤 1개가 기다림, JUNIE_API_KEY). 루프 몫은 모두 끝, 제출은 사람.
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 없음
- 다음: 키가 생기면 감독이 STOP 을 지우고 M2-15 실행.

## #0072 · 2026-11-23 · M3-98 통 점검
- 계획: ROADMAP 첫 `[ ]` = M3-98. 만들 것: Devpost 링크·숫자 점검, 영상 프레임 12장, 새 브라우저로 공개 주소 한 판.
- 한 것: 링크 3개(주소·board.html·릴리스 zip) 모두 HTTP 200. 새 Playwright 컨텍스트로 공개 주소 열어 클릭 → 한 판 시작 화면(`captures/tmp/m398/play.png`), 콘솔 오류 0·4xx 0. 영상 12장 `captures/tmp/m398/sheet.png` 열어 봄. 불일치 2건 고침: devpost 의 `<DEMO_URL>`·`<REPO_URL>` 자리표시 → 실제 주소, zip 66.6→66.7 KB(68268바이트). 영상 끝 카드에도 자리표시가 있어 `videobuild.mjs` 고치고 영상 다시 만듦(`end.png` 로 확인, 1920x1080·158.4초). 시험 `Tests  129 passed (129)`, 23파일 일치. 나머지 숫자(+0.21MB·1.5ms·13회·49경고)는 soak-report·jetbrains-usage 와 일치.
- 검사: 1층 해당 없음 / 2층 통과 — `Test Files  23 passed (23)` `Tests  129 passed (129)` / 3층 통과 — `sheet.png`·`play.png`·`end.png` 열어 봄(자막 안 가림, 끝 카드 주소 실제값).
- 플레이어 눈: 로그아웃 상태에서 안내 없이 클릭만으로 시작됨, 죽은 링크 없음.
- 점검한 규칙: ③-11, ③-12, ③-15
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 없음
- 다음: 없음. 영상은 소리 없는 초안(사람이 더빙·업로드).

## #0071 · 2026-11-23 · M3-10 릴리스 v1.0.0
- 계획: INBOX 1번(감독 답 "올려도 됨"). 만들 것: 제출본/callout-rush-web.zip 새로 만들기 → GitHub 릴리스 v1.0.0 → About 설명·주소·주제어.
- 한 것: Playwright 브라우저가 없어 `npx playwright install chromium` 설치. `npm run zip` 으로 zip 새로 만들고 `gh release create v1.0.0` 로 첨부, `gh repo edit` 로 설명·홈페이지·주제어(game, hackathon, typescript).
- 커밋: e7cf273 build(release) zip 다시 만듦
- 검사: 1층 해당 없음 / 2층 통과 — `ZIPCHECK ok: zip 68268바이트를 풀어 serve.mjs 로 띄움, 봇 1판 끝까지, board.html 200, 상위 경로 요청 403, 콘솔 오류 0` (jev evidence 는 요약 문장이라 NOT_SUPPORTED 로 나옴 — 출력 원문은 위와 같음) / 3층 해당 없음
- 확인한 것: 릴리스 주소 200, 내려받은 zip 의 shasum 이 제출본 것과 같음(627f72d1…), `licenseInfo.key` = mit.
- 점검한 규칙: ③-5, ③-11, ③-15(감독 허락 답 있음)
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: M3-10 답 삭제
- 다음: M3-98.

## #0070 · 2026-11-23 · 막힘 — 실행할 조각 없음, loop/STOP
- 계획: INBOX 처리할 줄 없음(`결함·지시·답·보정·철회·보류·막힘` grep 결과 0줄, `→루프` 열린 줄 없음). ROADMAP `[ ]` 는 M2-15·M3-10·M3-98 셋뿐 → M2-15 는 `JUNIE_API_KEY` 비어 있음(`echo "key=${JUNIE_API_KEY:+set}"` → `key=`), M3-10 은 #0069 질문(릴리스 업로드 허락)에 답 없음(`gh release list` 출력 없음 = 릴리스 없음), M3-98 은 M3-10 의 릴리스 주소가 있어야 링크 점검이 끝남.
- 막힘: 사람 답 필요 2개 (1순위: M3-10 릴리스 업로드 허락 — M3-98 이 기다림, 마감 전 Devpost 글에 zip 주소가 필요 / 2순위: M2-15 Junie 키 — 다른 조각은 안 기다림).
- 한 것: 코드·문서 변경 없음. `loop/STOP` 생성. 감독이 M3-10 답을 INBOX 에 `답` 으로 주고 STOP 을 지우면 다음 바퀴가 M3-10 → M3-98 을 한다.
- 검사: 1·2·3층 해당 없음(문서 변경만).
- 점검한 규칙: ③-5, ③-7, ④-2-4
- 가정한 것(🟡): 없음 / 물은 것(🔴): 기존 1개(#0069) 그대로 / INBOX 처리: 처리할 줄 없음
- 다음: 감독이 M3-10 허락을 사람에게 받아 전달.

## #0069 · 2026-11-23 · M3-10 🔴 질문 — 릴리스 업로드 허락 대기
- 계획: ROADMAP 첫 `[ ]` M2-15 는 JUNIE_API_KEY 없어 건너뜀 → M3-10. 저장소는 공개·MIT(`gh repo view --json licenseInfo,visibility` → `"key":"mit"`, `"PUBLIC"`). 그러나 `gh release create` 는 ③-15 외부 업로드 금지에 걸리고 submit-checklist 도 "릴리스에 올릴지는 사람이 정함" 이라 🔴. M3-98 은 devpost.md 에 링크가 아직 없고 릴리스 주소가 있어야 해서 같이 막힘.
- 한 것: 코드 변경 없음. INBOX 에 `질문` 한 줄(M3-10 릴리스 허락).
- 검사: 1·2·3층 해당 없음(문서 변경만).
- 점검한 규칙: ③-5, ③-15, ④-2
- 가정한 것(🟡): 없음 / 물은 것(🔴): 1개 / INBOX 처리: 처리할 줄 없음
- 다음: 감독이 답을 주면 M3-10 → M3-98. 그때까지 실행 가능한 조각 없음.

## #0068 · 2026-11-23 · M2-16 공개 주소 README 기록
- 계획: M2-16 — ROADMAP 첫 `[ ]` M2-15 는 JUNIE_API_KEY 없어 건너뜀 → M2-16(감독이 공개·배포 끝냄). 파일: README.md. 주소를 적고 curl 인용.
- 한 것: README 「Play online」에 주소 기록, ROADMAP M2-16 `[x]`.
- 검사: 1층 `curl -sI https://soilrist.github.io/callout-rush/ | head -1` → `HTTP/2 200`, `curl -sI .../board.html | head -1` → `HTTP/2 200` / 2층 해당 없음(문서) / 3층 해당 없음(화면 변경 없음)
- 점검한 규칙: ③-11, ③-15, ④-2
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: M3-10.

## #0067 · 2026-11-23 · 고를 조각 없음 — 막힘 기록
- 계획: ④-2-4 — INBOX 처리 줄 0개·`→루프` 줄 0개. ROADMAP `[ ]` 는 M2-15(`JUNIE_API_KEY` 비어 있음)·M3-10·M3-98 뿐. 원격 `origin` 은 생겼지만 `gh repo view` 결과 `{"visibility":"PRIVATE"}` — 공개 전환은 감독 몫(ROADMAP 「감독:」 줄)이고, M3-10 은 릴리스 업로드(③-15 외부 업로드 금지)·공개 라이선스 확인이 필요해 지금 못 한다. M3-98 도 공개 주소가 있어야 한다.
- 막힘: 사람 답 필요 2개 (1순위: 공개 전환 — M3-10·M3-98·M2-16 이 기다림. 2순위: JUNIE_API_KEY — M2-15).
- 한 것: 코드 변경 없음. `loop/STOP` 을 만든다(PROMPT ④-2-4). 감독이 공개 전환 뒤 지우고 다시 켠다.
- 검사: 1층 해당 없음 / 2층 해당 없음 / 3층 해당 없음 (변경 없음)
- 점검한 규칙: ③-7, ③-14, ③-15, ④-2-4
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: 공개 전환 → M2-16 `[ ]` 복귀·M3-10·M3-98. 키가 오면 M2-15.

## #0066 · 2026-11-21 · 고를 조각 없음 — 막힘 기록
- 계획: ④-2-4 — INBOX 처리 줄 0개·`→루프` 줄 0개(`grep` 출력 없음). ROADMAP `[ ]` 는 M2-15·M3-10·M3-98 뿐. M2-15 는 JUNIE_API_KEY 필요(환경변수 없음), M3-10·M3-98 은 원격 필요(`git remote -v` 출력 없음).
- 막힘: 사람 답 필요 3개 (1순위: M3-10 — 원격 저장소가 있어야 M3-98 도 풀림, 마일스톤 2개가 기다림). 사람 할 일: GitHub 원격 연결 승인, JUNIE_API_KEY.
- 한 것: 코드 변경 없음. 반복 빈 바퀴를 멈추려고 `loop/STOP` 을 만든다(PROMPT ④-2-4). 감독이 원격·키를 정리하면 지우고 다시 켠다.
- 검사: 1층 해당 없음 / 2층 해당 없음 / 3층 해당 없음 (변경 없음)
- 점검한 규칙: ③-7, ③-14, ③-15, ④-2-4
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: 원격 또는 Junie 키가 생기면 M3-10·M3-98·M2-15.

## #0065 · 2026-11-21 · 고를 조각 없음
- 계획: 고를 조각 없음 — INBOX 처리 줄 0개, `→루프` 줄 0개. ROADMAP `[ ]` 는 M2-15(JUNIE_API_KEY 대기)·M3-10·M3-98(원격 필요, `git remote -v` 출력 없음)뿐.
- 한 것: 코드 변경 없음. 억지 조각을 만들지 않음(③-14: 설계서에 없는 항목은 넣지 않음).
- 검사: 1층 해당 없음 / 2층 해당 없음 / 3층 해당 없음 (변경 없음)
- 점검한 규칙: ③-7, ③-14, ③-15
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: 원격 또는 Junie 키가 생기면 M3-10·M3-98·M2-15. `loop/STOP` 은 만들지 않는다(감독 판단).

## #0064 · 2026-11-21 · M2-13 실제 속도 60분 soak 결과 기록
- 계획: M2-13 — ROADMAP `[ ]` 중 실행 가능한 첫 조각(soak 가 19:04 에 끝남, `ps` 로 프로세스 없음 확인). 만들 파일: `docs/soak-report.md` 절 추가.
- 한 것: `logs/soak60.csv`(19행)를 계산해 보고서에 절 추가. 오류 0 · 리스너 21/타이머 0/DOM 16 고정 · work p95 1.0~1.3ms · 힙 처음 5분 1.81MB vs 마지막 5분 평균 2.05MB = +0.24MB. 원시 프레임 간격(66.7~133.4ms)은 헤드리스 한계라 20ms 줄은 주장하지 않음. 스크립트 마지막 `SOAK ok` 줄은 로그로 안 남아 종료 코드는 기록 못 함(보고서에 적음).
- 커밋: 이 바퀴 docs 커밋 2개(보고서 절, STATUS).
- 검사: 1층 통과(`결과: 통과 (오류 0 / 경고 0 / 미정 숫자 0)`, check_conventions.py) / 2층 해당 없음(코드 변경 없음, 측정값 문서) / 3층 해당 없음(보이는 것 없음). 측정 인용 3건을 `jev.py evidence` 에 물었으나 모두 NOT_SUPPORTED(검사 통과 출력이 아니라 계산 결과라서) — 그래서 이 측정을 "검사 통과"로 쓰지 않고 "측정 기록"으로만 둔다.
- 점검한 규칙: ③-6, ③-11, ③-12, ③-13, ③-15
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: 실행 가능한 `[ ]` 없음. 원격(M2-16·M3-10·M3-98)·Junie 키(M2-15) 대기. `loop/STOP` 은 만들지 않는다.

## #0063 · 2026-11-21 · 고를 조각 없음 (M2-13 soak 진행 중, 2번째)
- 계획: 고를 조각 없음 — INBOX 처리 줄 0개. ROADMAP `[ ]` 는 M2-13(soak 진행 중)·M2-15(Junie 키)·M3-10·M3-98(원격 필요, `git remote -v` 출력 없음).
- 한 것: 코드 변경 없음. `ps` 로 soak PID 62236 이 계속 도는 것 확인(18:16 기준 14분 경과, `logs/soak60.csv` 마지막 줄 `12,784,1.86,16,21,0,133.4,3.1,0,1.10`). 건드리지 않음.
- 커밋: 이 기록 커밋만. 검사: 1·2·3층 해당 없음(코드 변경 없음).
- 점검한 규칙: ③-7, ③-9, ③-15
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: 약 19:02 이후 soak 가 끝나면 M2-13 판정(오류 0·p95 ≤ 20ms·처음/마지막 5분 힙 차이)을 `docs/soak-report.md` 에 절로 추가. `loop/STOP` 은 만들지 않는다.

## #0062 · 2026-11-21 · 고를 조각 없음 (M2-13 soak 진행 중)
- 계획: 고를 조각 없음 — INBOX 처리 줄 0개, `→루프` 줄 0개. ROADMAP `[ ]` 는 M2-13(60분 soak 이 이미 도는 중)·M2-15(Junie 키)·M3-10·M3-98(원격 필요). 원격 없음(`git remote -v` 출력 없음).
- 한 것: 코드 변경 없음. `ps` 로 `node scripts/soak.mjs --minutes 60 --timescale 1 --every 3 --out ../logs/soak60.csv` (PID 62236, 시작 18:02:25)가 이미 돌고 있음을 확인(18:14 기준 12분 경과, CSV 3줄). 내가 시작한 게 아니라 건드리지 않았다. 한 바퀴 제한(40분)보다 길어 이 바퀴에서 끝까지 기다리지 않음.
- 커밋: 이 기록 커밋만.
- 검사: 1층 해당 없음 / 2층 해당 없음 / 3층 해당 없음 (코드 변경 없음).
- 점검한 규칙: ③-7(빈 바퀴 금지 — 대신 진행 중 상태를 기록), ③-9, ③-15
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: 약 19:02 이후 `logs/soak60.csv` 가 끝나면(`SOAK ok` 또는 CSV 마지막 줄 18분×… 확인) M2-13 판정 — 오류 0·p95 ≤ 20ms·처음/마지막 5분 힙 차이를 `docs/soak-report.md` 에 절로 추가. 그때까지 `loop/STOP` 은 만들지 않는다.

## #0060 · 2026-11-21 · M2-16 Pages 워크플로 (파일만)
- 계획: M2-16 — INBOX 처리 줄 0개, ROADMAP 첫 `[ ]` 중 원격 없이도 파일까지는 되는 M2-16(조각 안에 "원격이 없으면 워크플로 파일만 커밋하고 `[!]`" 명시). M2-13 은 60분 실행이라 한 바퀴에 못 끝남, M2-15 는 키, M3-10·98 은 원격 필요. 만든 것: `.github/workflows/pages.yml`.
- 한 것: main 푸시·수동 실행 → `app` 에서 `npm ci && npm run build`(Node 24) → `app/dist` 를 Pages 로 올림. `app/vite.config.ts` 의 `base: './'` 라 하위 주소에서도 동작. `git remote -v` 출력 없음(원격 없음)이라 푸시·`curl` 확인은 못 함. 새 저장소 만들기·업로드는 PROMPT ③-15 로 금지.
- 커밋: `cc8d6d8 build(pages): M2-16 GitHub Pages 배포 워크플로`
- 검사: 1층 통과(`npm run build` → `✓ built in 42ms`, tsc 포함 종료 0; 빌드 결과에 `dist/index.html`·`dist/board.html` 있음) / 2층 통과(`python3 tools/check_conventions.py` → `결과: 통과 (오류 0 / 경고 0 / 미정 숫자 0)`) / 3층 해당 없음(화면 변화 없음). 워크플로가 GitHub 에서 실제로 도는지는 못 함 — YAML 은 ruby 로 읽혀 jobs `build`·`deploy` 확인만.
- 점검한 규칙: ③-11, ③-15(원격 만들기 금지), ③-9(브랜치 develop)
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: 실행 가능한 `[ ]` 는 M2-13(60분 soak)·M2-15(Junie 키)·M3-10·M3-98(원격 필요). 사람이 원격을 만들고 main 에 푸시하면 M2-16 주소 확인·M3-10·M3-98 이 열린다.

## #0058 · 2026-11-21 · M3-04 영상 초안
- 계획: M3-04 — INBOX 처리 줄 0개, ROADMAP 첫 `[ ]` 중 `ffmpeg` 가 `/opt/homebrew/bin/ffmpeg` 에 있어 가능해진 M3-04. 만든 것: `app/scripts/videorec.mjs`(녹화), `app/scripts/videobuild.mjs`(조립), `제출본/demo-draft.mp4`·`demo-draft.srt`.
- 한 것: `?bot=pro&seed=7` 실제 속도 한 판(play 10.2s→result 73.4s, 63초, 편집·가속 없음) 녹화. 결과·순위표는 봇이 0.8·1.4초만 보여 `제출본/shots/` 의 4-result·5-board 그림으로 대체. 대기 화면 장면은 앞 10초 재사용. 장면 5·6·7 은 HTML 카드(숫자는 soak-report·jetbrains-usage 값). 이 ffmpeg 에 drawtext·subtitles 가 없어 자막은 투명 PNG 겹치기. 첫 조립에서 자막이 게임 화면을 가려 화면을 960px 로 줄이고 아래 띠에 자막을 두도록 고쳐 다시 조립.
- 커밋: 아래 `docs(submit)` / `build` 참조. mp4 는 `.gitignore` 에 추가(git 에 안 올림).
- 검사: 1층 통과(`eslint` 종료 0, `tsc --noEmit` 종료 0) / 2층 통과(`ffprobe`: `width=1920 height=1080 duration=158.400000`, jev `SUPPORTED`; `Tests  129 passed (129)`; check_conventions `결과: 통과 (오류 0 / 경고 0 / 미정 숫자 0)`) / 3층 통과 — 영상에서 5·40·80·100·125·155초 프레임을 뽑아 이어 붙인 그림 `captures/tmp/video/chk/sheet2.png` 를 열어 봄: 자막이 화면을 안 가림, 글자 잘림 없음, 마지막 카드에 `<DEMO_URL>` 자리표시 남음.
- 점검한 규칙: ③-11, ③-12(길이·크기는 ffprobe 값), ③-15(저장소 밖 쓰기 없음)
- 가정한 것(🟡): ① 소리 없음 — 헤드리스 Chromium 녹화는 Web Audio 효과음을 못 담는다. 필요하면 `sfxrender` 로 뽑은 효과음을 사람이 편집 때 얹는다. ② 장면 6 은 WebStorm 화면 대신 숫자 카드. ③ 장면 3 은 녹화가 아닌 그림 2장, 보조 모니터 분할 화면 없음. ④ 최종본은 주소 확정 뒤 카드 다시 만들어야 함. / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: 실행 가능한 `[ ]` 없음. 감독이 🟡 를 보고 정하거나 M2-16 공개 주소를 연다.

## #0057 · 2026-11-21 · M3-06 방법론 글
- 계획: M3-06 — INBOX 처리 줄 0개, ROADMAP 첫 `[ ]` 중 실행 가능한 문서 조각(M3-04 는 ffmpeg 필요). 만든 것: `제출본/methodology.md`.
- 한 것: 영어 592단어(`wc -w`). 접근(순수 리듀서 + 봇 하나가 테스트·숫자 맞추기·시연·내구), 요구↔기능 표 6줄(각 줄에 파일·명령·숫자), 한계 4개(60fps 못 잼·soak 10배속·봇≠사람·JetBrains 들쭉날쭉). 숫자는 soak-report·DESIGN §6 값 그대로.
- 커밋: 아래 `docs(submit)` 참조.
- 검사: 1층 못 함(코드 변경 없음) / 2층 통과(`Tests  129 passed (129)`, 금지 낱말 `rc=1` 0건, check_conventions `결과: 통과 (오류 0 / 경고 0 / 미정 숫자 0)`) / 3층 해당 없음
- 점검한 규칙: ③-11, ③-12(숫자는 문서 값)
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: M3-04 만 남음(ffmpeg). 없으면 장면별 webm+captions 로 🟡.

## #0056 · 2026-11-21 · M3-05 Devpost 설명
- 계획: M3-05 — INBOX 처리 줄 0개, ROADMAP 첫 `[ ]` 중 M3-04(영상 녹화·ffmpeg 필요)보다 문서 조각이 바로 되는 M3-05 선택. 만든 것: `제출본/devpost.md`.
- 한 것: 영어 설명 889단어(제목·표 포함 `split` 기준). 부스 문제 셋 → 숫자 답, JetBrains 도구별 소제목(WebStorm 13회·49경고·1수정·48오탐 / Junie 0커밋 / Air 0커밋), 내구 숫자(+0.21MB·16노드·오류 0·1.5ms), 시험 129개 23파일, zip 66.6KB. 주소는 자리표시 `<DEMO_URL>`·`<REPO_URL>`. Junie·Air 는 안 쓴 그대로 적음.
- 커밋: 아래 `docs(submit)` 참조.
- 검사: 1층 못 함(코드 변경 없음) / 2층 통과(`vitest run` 출력 `Tests  129 passed (129)` 로 시험 수 확인, `forbidden rc=1` 금지 낱말 0건, 한글 글자 수 `korean 0 words 889`, check_conventions `결과: 통과 (오류 0 / 경고 0 / 미정 숫자 0)`) / 3층 해당 없음
- 점검한 규칙: ③-11(Junie 를 한 것처럼 안 씀), ③-12(숫자는 문서·실행 결과로)
- 가정한 것(🟡): 단어 수는 마크다운 기호 포함 889 — 900 한계에 가까워 줄일 때 조심. / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: M3-06 방법론 글.

## #0055 · 2026-11-21 · M3-03 영상 대본·자막
- 계획: M3-03 — INBOX 처리 줄 0개, ROADMAP 첫 `[ ]` 가 M2-13(원격·실시간 60분 대기)·M2-15(키)·M2-16(원격)이 아니라 실행 가능한 M3-03 이라 선택. 만든 것: `제출본/video-script.md`, `제출본/captions.srt`.
- 한 것: 7장면 표(시각|화면|자막|숫자 출처) 합 160초, 자막 12줄. 숫자(힙 +0.21MB·DOM 16·오류 0·작업 1.5ms, 검사 13회·49경고·1수정)는 soak-report·jetbrains-usage 값 그대로. Junie 커밋은 0 이라 "설치·설정됨"까지만 쓰고 메모에 적음. 주소는 자리표시 `<DEMO_URL>`·`<REPO_URL>`.
- 커밋: 아래 `docs(submit)` 참조.
- 검사: 1층 못 함(코드 변경 없음, 문서 조각) / 2층 통과(자막 파싱 출력 `12 159.5 True True` — 12줄, 마지막 끝 159.5초 ≤ 170, 시각 순서·겹침 없음; 금지 낱말 grep 0건 0건) / 3층 해당 없음(보이는 조각 아님)
- 점검한 규칙: PROMPT ③-11(Junie 를 한 것처럼 안 씀), ③-12(자막 시각은 파싱 결과로), check_conventions 통과(오류 0)
- 가정한 것(🟡): 장면 2 는 판 63초 + 여유로 65초로 잡음. 장면 6 에 Junie 실행 장면 없음(키 없음).
- 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: M3-05 Devpost 설명, M3-06 방법론 글.

## #0054 · 2026-11-21 · M2-12 1000판 내구 판정 + M2-12a 프레임 작업 시간 열
- 계획: M2-12 — #0053 이 기다리던 soak 가 끝남(`logs/soak-run.log` 에 `exit=0`). INBOX 처리 줄 0개라 ROADMAP 첫 `[ ]` 로. 만든 것: `docs/soak-report.md`, `docs/soak-heap.svg`, README Soak 줄, DESIGN §6.4 근거 칸, `app/scripts/soak.mjs` 에 `work_p95_ms` 열(M2-12a).
- 한 것: 1000판 CSV 로 §6.4 4줄 판정. 힙 1.93→2.14MB(+0.21MB, +10.9%) — 퍼센트는 10% 를 넘지만 "또는 ≤5MB" 로 통과 / DOM 20번 모두 16 / 오류 0 / 프레임 p95 133ms 는 불합격처럼 보이나, 빈 캔버스 페이지도 같은 기기에서 중앙 100ms·p95 133.4ms 라 헤드리스 크롬 한계다(우리 코드 탓 아님). 그래서 rAF 콜백 안에서 게임이 쓴 시간을 프레임별 합산해 재는 열을 soak.mjs 에 더하고 100판을 다시 돌림: work_p95 1.50 / 1.80ms.
- 못 한 것(정직): 프레임 "간격" p95 ≤20ms 는 이 기기 헤드리스로 판정 불가 — 보고서에 판정 안 함으로 적음. work_p95 는 합성·GPU 시간을 포함하지 않고 100판만 잼. 배속은 10(DESIGN 은 30, 헤드리스 12fps 라 30 은 판이 안 끝남).
- 커밋: 아래 `docs(soak)` / `test(soak)` 참조.
- 검사: 1층 통과(`ESLint: No issues found`, jev SUPPORTED) / 2층 통과(`SOAK ok: 1000판 6911초 (판당 6.91초 → 1000판 예상 115분), CSV ../logs/soak.csv, console_errors=0`, jev SUPPORTED; 100판 재실행 `100,690,1.93,16,21,0,133.4,26.1,0,1.80`, jev SUPPORTED) / 3층 해당 없음 (보이는 조각 아님, 측정 스크립트·문서)
- 점검한 규칙: Verification(인용+jev), PROMPT ③-12(이름이 아니라 빈 페이지 기준선 실측으로 원인 판단), ③-11(못 한 간격 검사를 통과로 안 씀), ③-6(숫자와 근거를 §6.4 에), check_conventions 통과(오류 0)
- 가정한 것(🟡): 프레임 합격선은 "게임 작업 시간 p95" 로 대신 판정 — DESIGN §6.4 문구는 "프레임 시간 p95" 라 해석을 좁힌 것. 감독이 다르게 보면 `확인` 에 답해 달라.
- 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음(🟡 확인 1건 추가)
- 다음: M3-03·05·06. M2-13(실제 속도 60분)은 보이는 브라우저에서 간격을 재는 쪽으로 연결 가능.

## #0053 · 2026-11-21 · 기다림 기록 (soak 850판째)
- 계획: 고를 조각 없음 — INBOX 처리 줄 0개(`grep -nE '^- \[ \] (결함|지시|답|보정|철회|보류|막힘)'` 출력 없음). ROADMAP `[ ]` 는 #0052 와 같음(M2-12 진행 중, M2-13·15·16 앞 조건·원격·키 대기, M3-03~06 내구 숫자 필요, M3-10·98 원격·앞 조각 대기).
- 확인한 것: `tail -4 logs/soak-run.log` 마지막 줄 `850,5872,2.14,16,21,0,133.4,223.3,0`, `exit=` 없음. 프로세스 pid 10414 `node scripts/soak.mjs --games 1000` 살아 있음, 로그 갱신 15:18:10 · 현재 15:19 라 진행 중. 남은 150판, 대략 20분.
- 커밋: 이 기록뿐. 코드 안 바꿈.
- 검사: 1층 못 함 / 2층 못 함 / 3층 해당 없음 (바꾼 것 없음)
- 점검한 규칙: Autonomy(막힘이 아니라 기다림이라 STOP 안 만듦), PROMPT ③-7(할 수 있는 조각이 없음을 근거와 함께 기록), ③-9(실행 중인 soak 프로세스는 안 건드림)
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: `exit=` 가 `logs/soak-run.log` 에 생기면 M2-12 판정 → 이어서 M3-03·05·06.

## #0052 · 2026-11-21 · 기다림 기록 (soak 진행 중)
- 계획: 고를 조각 없음 — INBOX 처리 줄 0개(`grep -nE '^- \[ \] (결함|지시|답|보정|철회|보류|막힘)'` 출력 없음). ROADMAP `[ ]` 는 #0051 과 같음(M2-12 진행 중, M2-13·15·16 앞 조건·원격·키 대기, M3-03~06 내구 숫자 필요, M3-10·98 원격·앞 조각 대기).
- 확인한 것: `tail -5 logs/soak-run.log` 마지막 줄 `300,2050,2.07,16,21,0,116.6,78.6,0`, `exit=` 없음. 프로세스 pid 10414 `node scripts/soak.mjs --games 1000` 살아 있음(13:40 시작), 로그 갱신 14:14:28 · 현재 14:18 이라 진행 중. 속도 약 8판/분이라 1000판까지 대략 90분 남음.
- 커밋: 이 기록뿐. 코드 안 바꿈.
- 검사: 1층 못 함 / 2층 못 함 / 3층 해당 없음 (바꾼 것 없음)
- 점검한 규칙: Autonomy(막힘이 아니라 기다림이라 STOP 안 만듦), PROMPT ③-7(할 수 있는 조각이 없음을 근거와 함께 기록), ③-9(실행 중인 soak 프로세스는 안 건드림)
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: `exit=` 가 `logs/soak-run.log` 에 생기면 M2-12 판정 → 이어서 M3-03·05·06.

## #0051 · 2026-11-21 · 기다림 기록 (soak 진행 중)
- 계획: 고를 조각 없음 — INBOX 처리 줄 0개, `→루프` 줄 0개. ROADMAP `[ ]` 는 #0050 과 같음(M2-12 진행 중, M2-13·15·16 앞 조건·원격·키 대기, M3-03~06 내구 숫자 필요, M3-10·98 원격·앞 조각 대기). 숫자 없이 대본·글을 먼저 쓰면 나중에 숫자 불일치가 나므로 건드리지 않음.
- 확인한 것: `tail -4 logs/soak-run.log` 마지막 줄 `300,2050,2.07,16,21,0,116.6,78.6,0`, `exit=` 없음. 프로세스 pid 10414 경과 37분, 로그 갱신 시각 14:14:28(3분 전)이라 멈춘 게 아니라 진행 중.
- 커밋: 이 기록뿐. 코드 안 바꿈.
- 검사: 1층 못 함 / 2층 못 함 / 3층 해당 없음 (바꾼 것 없음)
- 점검한 규칙: Autonomy(막힘이 아니라 기다림이라 STOP 안 만듦), PROMPT ③-7(빈 바퀴 금지 — 대신 할 수 있는 조각이 없음을 근거와 함께 기록)
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: `exit=` 가 `logs/soak-run.log` 에 생기면 M2-12 판정 → 이어서 M3-03·05·06.

## #0050 · 2026-11-21 · 기다림 기록 (soak 진행 중)
- 계획: 고를 조각 없음 — INBOX 처리 줄 0개, ROADMAP `[ ]` 는 M2-12(soak 진행 중)·M2-13·15·16(앞 조건·원격·키 대기)·M3-03·04·05·06(내구 숫자 필요)·M3-10·98(원격·앞 조각 대기).
- 확인한 것: `tail -3 logs/soak-run.log` 마지막 줄 `300,2050,2.07,16,21,0,116.6,78.6,0`, `exit=` 없음, 프로세스 `node scripts/soak.mjs --games 1000` 살아 있음(pid 10414). 즉 300판째.
- 커밋: 이 기록뿐. 코드 안 바꿈.
- 검사: 1층 못 함 / 2층 못 함 / 3층 해당 없음 (바꾼 것 없음)
- 점검한 규칙: Autonomy(막힘이 아니라 기다림이라 STOP 안 만듦)
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: `exit=` 가 `logs/soak-run.log` 에 생기면 M2-12 판정 → 이어서 M3-03·05·06.

## #0049 · 2026-11-21 · 조각 M3-08 (제출 칸 채우기표)
- 계획: M3-08 — 고른 이유: M2-12 1000판 아직 도는 중(`logs/soak.csv` 6줄=250판째, `exit=` 없음), M3-03·05·06 은 내구 숫자 필요 → 숫자 없이 되는 M3-08 / `제출본/submit-checklist.md`(새)·ROADMAP.
- 한 것: 칸 표 13줄 + 규정 점검 12줄(명령·결과). 돌려 본 것: LICENSE `MIT License`, `.idea` 9개+`.junie/AGENTS.md`, 소리 파일 0개, 금지 낱말 `git grep` 종료 코드 1(0건). 저장소 원격·영상·공개 주소·내구 보고서는 아직 없어 「대기」로 씀.
- 커밋: docs (`Slice: M3-08`)
- 검사: 1층 못 함(코드 안 바꿈) / 2층 통과 — `git grep -n -i -E -f scripts/forbidden.txt -- app/src app/public README.md AI_SHOWCASE.md 제출본` 출력 없음, `forbidden exit=1` / 3층 해당 없음
- 점검한 규칙: Verification, Autonomy
- 가정한 것(🟡): 소스 주석·테스트 이름의 한국어는 영어 규정(설명·영상 기준) 밖으로 봄 — 표 C-1 에 적음 / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: soak `exit=` 있으면 M2-12 판정. 아니면 남은 조각(M3-03·05·06, M2-13·15·16)은 전부 숫자·원격·키 대기 — 판정 전까지 막힘 기록 가능.

## #0048 · 2026-11-21 · 조각 M3-07 (보너스 글 AI_SHOWCASE.md)
- 계획: M3-07 — 고른 이유: M2-12 1000판 아직 도는 중(`logs/soak.csv` 6줄=250판째, `exit=` 없음), M3-03·05·06 은 내구 숫자가 보고서에 있어야 함 → 숫자 없이 되는 M3-07 / `AI_SHOWCASE.md`(새)·ROADMAP.
- 한 것: 영어 글 743단어(`wc -w` 743), 그림 2장(`제출본/shots/0-cover.png`·`4-result.png`). 사례는 있는 그대로만: WebStorm 진짜 발견 1개(`64ed7fd` JSDoc)·오탐 48개 처리·역검증 실패(`9ce8781`), 다른 관문 2개(캡처로 잡은 글자 겹침 `a44153c`, 남은 서버 프로세스 `18d1ba0`). ROADMAP 은 WebStorm 사례 2~3개·Junie 한 조각을 적으라 했으나 실제로는 진짜 발견이 1개이고 Junie 는 키가 없어 0번 돌았다 → 지어내지 않고 "0 커밋" 으로 씀(🟡).
- 커밋: docs (`Slice: M3-07`)
- 검사: 1층 못 함(코드 안 바꿈) / 2층 통과 — `git cat-file -e` 5개 해시(64ed7fd·9ce8781·a44153c·18d1ba0·029d107) 전부 `ok`, `git grep -f scripts/forbidden.txt -- AI_SHOWCASE.md` 종료 코드 1(0건) / 3층 해당 없음(그림은 M3-02 에서 열어 봄)
- 점검한 규칙: Verification, Autonomy, Reference(겉모습은 우리 것)
- 가정한 것(🟡): 위 사례 수 부족을 사실대로 적음. 글은 공개 저장소 주소가 생기면 `Verify it yourself` 에 주소 추가 필요 / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: soak `exit=` 있으면 M2-12 판정, 아니면 M3-08(제출 칸 채우기표). M3-09 는 제출 직전 한 번 더 훑기(AI_SHOWCASE.md 가 이제 있음).

## #0047 · 2026-11-21 · 조각 M3-09 (금지 낱말·개인정보 훑기)
- 계획: M3-09 — 고른 이유: M2-12 1000판 아직 도는 중(`logs/soak.csv` 250판째, `exit=` 없음), M3-03·05·06 은 내구 숫자가 보고서에 있어야 함 → 숫자 없이 되는 M3-09 / `scripts/forbidden.txt`(새)·ROADMAP.
- 한 것: 낱말 18줄(다른 프로젝트·팀 이름, 사람 ID, 이메일 도메인, 홈 경로, 키 모양) 목록 작성. 명령 `git grep -n -i -E -f scripts/forbidden.txt -- app/src app/public README.md AI_SHOWCASE.md 제출본` → 0건. zip 은 풀어서 `grep -r -a -i -l -E -f` → 0건. 대조군(`ZeroStudyRPG` 한 줄 넣은 파일)은 잡힘. docs 는 ROADMAP 한 줄에서 `gdm` 이 다른 낱말 속 글자로 잡힘(제출 글 아님, 허용). `AI_SHOWCASE.md` 는 아직 없음(M3-07 뒤 다시 훑기).
- git 작성자: `git log --format='%an|%ae|%cn|%ce' | sort -u` → 한 줄 `soilrist|67372287+soilrist@users.noreply.github.com|soilrist|…` (노출 이메일 아님, GitHub noreply 주소). 🟡 감독 확인: 공개 저장소에 `soilrist` 아이디가 보이는 것은 허용인지.
- 커밋: docs(status) + test (`Slice: M3-09`)
- 검사: 1층 못 함(코드 안 바꿈) / 2층 통과 — 위 grep 0건·대조군 1건 / 3층 해당 없음(보이는 조각 아님)
- 점검한 규칙: Verification(대조군으로 검사가 눈먼 게 아님을 확인), Autonomy
- 가정한 것(🟡): 위 작성자 아이디 노출 / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: soak `exit=` 있으면 M2-12 판정, 아니면 M3-05~08 중 숫자 없는 칸부터. 제출 직전 M3-09 한 번 더 훑기.

## #0046 · 2026-11-21 · 조각 M3-02 (제출용 그림)
- 계획: M3-02 — 고른 이유: M2-12 1000판 아직 도는 중(`logs/soak.csv` 200판째, `exit=` 없음), M2-13·15·16 대기, M3-03 은 내구 숫자가 보고서에 있어야 해서 → soak 와 무관한 M3-02 / `app/scripts/submitshots.mjs`(새, `npm run submitshots`)·`제출본/shots/` 7장.
- 한 것: 시드 고정(seed 5·7)·점수 8건 심은 상태로 1920×1080 6장 + 대표 그림 1800×1200(3:2, 제목+단계 3 그림). 첫 대표 그림은 아래가 잘려 크기를 고쳐 다시 찍음.
- 커밋: test(ui) + docs(status) (`Slice: M3-02`)
- 검사: 1층 통과 — `ESLint: No issues found` / 2층 통과 — `SUBMITSHOTS ok: 7장, 콘솔 오류 0` / 3층 통과 — 연 그림: `제출본/shots/0-cover.png`(고친 뒤 다시 열어 아래 안 잘림)·`1-attract.png`·`2-play-stage1.png`·`3-play-stage3.png`(두 곳 콜 "Container Row, then South Stairs!")·`4-result.png`·`5-board.png`·`6-operator.png` — 글자 잘림 0, 다른 게임·회사 이름 0
- 플레이어 눈: 제출 그림이라 조작 없음. 단계 3 그림은 지도 이름이 일부러 가려져 있어 "두 곳 콜" 글자만 읽힘(설계대로)
- 점검한 규칙: Verification, PlayerEye, Reference(겉모습은 우리 것)
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: `logs/soak-run.log` 에 `exit=` 있으면 M2-12 판정, 없으면 M3-03 은 내구 숫자 때문에 보고서 뒤로, M3-05~M3-08 중 숫자 없는 것

## #0045 · 2026-11-21 · 조각 M3-01 (JetBrains 사용 합계)
- 계획: M3-01 — 고른 이유: M2-12 1000판이 아직 도는 중(`logs/soak.csv` 200판째, `exit=` 없음), M2-13·15·16 은 앞 조건·키·원격 대기 → 다음 마일스톤 첫 `[ ]` / `docs/jetbrains-usage.md` 합계·ROADMAP.
- 한 것: 합계표를 세는 명령과 함께 다시 씀: 검사 실행 4 → 13(`grep -c 'INSPECT ok' docs/STATUS.md`), Junie·Air 커밋 0(`Tool:` 꼬리말 grep), `.idea` 9·`.junie` 1 추적, 원격 없음이라 아직 공개 안 됨을 문서에 정직하게 적음.
- 커밋: docs(status) (`Slice: M3-01`)
- 검사: 1층 해당 없음(문서만) / 2층 해당 없음 / 3층 해당 없음
- 점검한 규칙: Autonomy, Verification(세는 명령 실제 실행: 13 / 0 / 0 / 10 / 원격 0줄)
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: `logs/soak-run.log` 에 `exit=` 있으면 M2-12 판정, 없으면 M3-02 이후 중 soak 와 무관한 것

## #0044 · 2026-11-21 · 조각 M2-98 (처음 하는 사람 통 플레이)
- 계획: M2-98 — 고른 이유: M2-12 1000판이 아직 도는 중(`logs/soak.csv` 150판째, `exit=` 없음), M2-13·15·16 은 앞과 같은 이유로 건너뜀 → M2-98 / `app/scripts/session.mjs`(새, `npm run session`)·`app/package.json`·ROADMAP. 공개 주소가 없어 `vite preview`(localhost)로.
- 한 것: 창 두 개(게임+보조 board.html) 실제 속도(timescale=1): 봇이 한 판(대기→카운트다운→play→result→이니셜→순위) → 보조 창 갱신 시간 재기 → 순위 8초 뒤 대기 복귀 → 사람 창에서 시작만 누르고 방치 → 대기 복귀 → 다시 시작하면 점수 0.
- 실행 출력(글자 그대로): `SESSION 한 사람 64.0초(play→board), 보조 창 줄 0→1 지연 0 ms, 순위→대기 8.1초, 방치 뒤 대기까지 12.1초, 다음 판 점수 0, 콘솔 오류 0, 종료코드 0`
- 숫자: 한 사람 시간 64.0초(≤95) / 보조 창 갱신 지연 0 ms(≤1000, 같은 PC 시계 오차 ±1ms) / 방치 12.1초 뒤 대기(PLAY_IDLE_QUIT_S=12)
- 커밋: test(ui) (`Slice: M2-98`)
- 검사: 1층 통과(`ESLint: No issues found`, jev evidence `SUPPORTED`) / 2층 위 실행 출력을 인용(jev 는 이 긴 줄을 `NOT_SUPPORTED` 로 판정해 "통과" 라고는 안 씀 — 값은 실제 출력 그대로) / 3층 통과: `captures/M2-98-04-rank.png`(순위 화면)·`05-boardwin.png`(보조 창, 새 줄 금색 + BEAT #1)·`08-idle-back.png`(방치 뒤 대기, TOP 3) 열어 봄. 01·02·03·06·07 은 찍기만 하고 안 열어 봄
- 플레이어 눈: ① 예(08: CLICK TO PLAY 단추+TOP 3, 순위 화면에 NEXT PLAYER — CLICK TO PLAY) / ② 못 함(실기기 마우스 — 감독) / ③ 예(순위·보조 창 한 화면에 다 보임) / ④ 해당 없음 / ⑤ 예(방치 12초 뒤 대기, 다시 시작하면 점수 0 → 다음 사람이 깨끗한 판)
- 눈에 띈 것(고치지 않음): 순위 화면 줄이 1개일 때 아래가 많이 비어 보임 — 부스에선 판이 쌓이면 채워짐. 봇은 순위 화면을 1.5초 뒤 눌러 곧바로 새 판으로 가므로 순위→대기 8초 복귀는 사람 창으로 따로 봄
- 점검한 규칙: Autonomy, Verification(jev NOT_SUPPORTED 를 통과로 안 씀), PlayerEye, 규칙 15
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: `logs/soak-run.log` 에 `exit=` 있으면 M2-12 판정, 없으면 남은 `[ ]` 전부 대기 중(M2-13·15·16) — 그때 막힘 정리

## #0043 · 2026-11-21 · 조각 M2-20 (README 완성)
- 계획: M2-20 — 고른 이유: M2-12 1000판이 아직 도는 중(`logs/soak-run.log` 에 `exit=` 없음, soak.mjs 프로세스 살아 있음), M2-13·15·16 은 앞과 같은 이유로 건너뜀 → M2-20 / `README.md`·`제출본/shots/play.png`·`result.png`(M2-18 캡처 복사)·ROADMAP
- 한 것: README 를 영어로 완성(소개·그림 2장·Play online·Download zip·Run from source·Booth setup 5단계·How it works 폴더 지도·Testing·JetBrains 링크·License). 새 폴더(`git archive HEAD app` 풀기)에서 `npm ci` → `npm run build`(`✓ built in 223ms`) → `npm run dev`(`Local: http://localhost:5173/`) 가 실제로 됨.
- 못 한 것: Testing 의 「내구 결과 숫자 3개」는 1000판이 안 끝나 비워 둠(지어내지 않음). M2-12 판정 때 채우도록 ROADMAP M2-12 에 적음. Play online 주소도 M2-16(원격 저장소 없음) 대기.
- 커밋: docs(readme) (`Slice: M2-20`)
- 검사: 1층 해당 없음(코드 안 바꿈) / 2층 위 새 폴더 따라 하기 통과 / 3층 `제출본/shots/*.png` 는 M2-18 에서 열어 본 그림 그대로
- 점검한 규칙: Autonomy, Verification(안 잰 숫자는 안 씀), 규칙 15
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: `logs/soak-run.log` 에 `exit=` 있으면 M2-12 판정, 없으면 M2-98

## #0042 · 2026-11-21 · 조각 M2-19 (다듬기 2 — 손)
- 계획: M2-19 — 고른 이유: M2-12 1000판이 아직 도는 중(`logs/soak-run.log` 에 `exit=` 없음), M2-13·15·16 은 앞과 같은 이유로 건너뜀 → M2-19 / `app/scripts/hand.mjs`(새, `npm run hand`)·`app/src/core/config.ts`·`app/src/ui/fx.ts`·DESIGN §6.3
- 한 것: 실제 속도(timescale=1)로 첫 콜을 맞히고 영상(25fps, 40ms 간격)을 프레임으로 잘라 `captures/M2-19/video-sheet.png` 로 봄. 맞힘: 클릭과 같은 프레임에 초록 번쩍·`+100`·점수판·체크 줄이 한꺼번에 바뀜(≤40ms, 0.1초 안). 콜 교체: 맞힌 뒤 빈 칸 약 300ms → 큰 글자 `South Stairs, two!` 라 놓치기 어려움. 문제 하나: 시작 `GO`(0.8초)가 첫 콜 뒤에도 가운데 구역 4곳(CRANE·CONTAINER ROW·TUNNEL·LOADING DOCK)을 가림. 고침: `PHASE_FLASH_MS` 800 → 500 을 `config.ts` 로 옮김. 다시 찍은 `video-sheet-after.png` 에서 GO 가 약 13프레임(0.5초)만 보임, 맞힘 즉시 반응은 그대로.
- 한계: 스크린샷 한 장이 200~400ms 걸려 150ms 번쩍은 영상 프레임으로만 봄(`hand` 출력의 ms 는 참고용). 소리 크기는 안 만짐(헤드리스라 못 들음 — 못 함).
- 커밋: feat(ui) bbc5ac1 (`Slice: M2-19`)
- 검사: 1층 `TypeScript: No errors found`, `ESLint: No issues found`, `Tests  129 passed (129)` / 2층 못 함(1000판과 CPU 를 다투지 않게 e2e 안 돌림 — 글자 시간만 바꿈) / 3층 위 두 그림 열어 대조(통과)
- 플레이어 눈: 처음 하는 사람 — 시작하자마자 첫 콜이 GO 에 덜 가려짐 / 손 — 맞힘 즉시 반응 / 카메라 — 맵 가운데 구역이 0.5초 뒤 다 보임 / 갇힘 없음
- 점검한 규칙: Autonomy, Verification, PlayerEye, DataDriven(숫자 config.ts + DESIGN §6.3 근거), 규칙 15
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: `logs/soak-run.log` 에 `exit=` 있으면 M2-12 판정, 없으면 M2-20

## #0041 · 2026-11-21 · 조각 M2-18 (다듬기 1 — 눈)
- 계획: M2-18 — 고른 이유: M2-12 는 1000판이 아직 도는 중(`logs/soak.csv` 가 game 336 근처, `exit=` 없음), M2-13·15·16 은 앞 바퀴와 같은 이유로 건너뜀 → M2-18 / `app/scripts/polish.mjs`(새, `npm run polish`)·`app/src/style.css`·`app/src/ui/operator.ts`
- 한 것: 화면 7장(대기·카운트다운·WARM-UP·CLUTCH·결과·순위표·운영자)을 1920×1080·1280×720·2560×1080 로 21장 찍어(`captures/M2-18/`, 1000판이 쓰는 `dist` 를 건드리지 않게 임시 폴더에 빌드) 1920 7장 + 2560 play-clutch + 1280 operator·result 를 열어 시트와 대조.
- 앞(다른 곳 목록): ① 운영자 메뉴 — 패널 폭 560px 고정(시트 1000/1920, 창 크기에 안 따라감)·테두리 `line`(시트 `accent` 4px)·버튼 1열 20px(시트 2열 440×88·32px)·Clear 가 `miss` 색 아님·Close 가 `accent` 색 아님·막 알파 0.82(시트 0.85) = 6곳. 그 밖 화면은 시트와 같음: 결과 화면 이니셜 칸이 제목보다 오른쪽인 것은 시트(OK x280 w400)대로, 카운트다운 숫자가 CRANE 이름을 가리는 것은 시연 때만 보이는 의도된 겹침, 글자 잘림 0, 2560×1080 은 가운데 1920 무대+양옆 빈 칸, 1280×720 도 같은 비율.
- 뒤(고친 뒤): 운영자 6곳을 CSS 만 고침(52vw·accent 4px·2열·1.67vw·min-height 4.6vw·막 0.85, `danger`/`close` 클래스). 다시 찍은 `operator-1920x1080.png`·`operator-1280x720.png` 를 열어 시트 모양(2열, Clear 주황, Close 하늘색, 잘림 없음) 확인 → 다른 곳 0. 한계: 시트의 패널 높이 800·버튼 좌표를 픽셀로 맞춘 건 아님(비율만) / Booth health·확인 창 모양은 이번에 다시 안 찍음.
- 커밋: feat(ui) (`Slice: M2-18`)
- 검사: 1층 `TypeScript: No errors found`, `ESLint: No issues found`, `Tests  129 passed (129)` / 2층 못 함(1000판과 CPU 를 다투지 않게 e2e·operator 스크립트 안 돌림 — 운영자 버튼 글자·순서는 안 바꿈) / 3층 위 그림 열어 대조(통과)
- 플레이어 눈: 처음 하는 사람 — 운영자 메뉴는 운영자 전용, 숨김 / 손 — 버튼 높이 4.6vw 로 커져 눌러 보기 쉬워짐 / 카메라 — 1280·1920 둘 다 잘림 없음 / 갇힘 — Close·Esc 그대로
- 점검한 규칙: Autonomy, Verification, PlayerEye, Reference 6절(시트와 다르게 한 곳 없음), 규칙 15
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: `logs/soak-run.log` 에 `exit=` 있으면 M2-12 판정, 없으면 M2-19

## #0040 · 2026-11-21 · 조각 M2-17 (zip)
- 계획: M2-17 zip — 고른 이유: M2-12 는 1000판이 아직 도는 중(`logs/soak-run.log` 에 `exit=` 없음), M2-13 도 같은 CPU·포트라 뒤로, M2-15 는 JUNIE_API_KEY 대기, M2-16 은 `[!] 감독` 원격 저장소 대기 → M2-17 / `app/scripts/zip.mjs`·`zipcheck.mjs`(새)·`app/zip/`(serve.mjs·start.command·start.bat·README.txt)·`package.json`(`zip`·`zipcheck`)·`eslint.config.js`(zip/*.mjs 에 node 전역)
- 한 것: `npm run zip` 이 **임시 폴더에 새로 빌드**(1000판이 쓰는 `dist` 를 건드리지 않음)해 `dist`+`serve.mjs`+시작 파일 둘+README 를 `제출본/callout-rush-web.zip`(68186바이트)으로 묶음. `serve.mjs` 는 Node 내장 `http` 만, 상위 경로 요청은 403. `zipcheck` 가 새 임시 폴더에 풀어 `node serve.mjs`(포트 4175)로 띄우고 Playwright 로 봇 한 판을 끝까지 돌림.
- 커밋: feat(tools) (`Slice: M2-17`)
- 검사: 1층 `TypeScript: No errors found`, `ESLint: No issues found` (vitest 는 1000판과 CPU 를 다투지 않게 안 돌림 — 앱 코드 변경 없음) / 2층 `ZIP ok: …callout-rush-web.zip 68186`, `ZIPCHECK ok: zip 68186바이트를 풀어 serve.mjs 로 띄움, 봇 1판 끝까지, board.html 200, 상위 경로 요청 403, 콘솔 오류 0` — jev NOT_SUPPORTED(p 0.45)라 **통과 선언 보류**(실제 출력은 위 그대로) / 3층 해당 없음(화면 변화 없음)
- 플레이어 눈: 화면 변화 없음. 운영자: 압축 풀고 더블클릭 → 주소가 열림. 한계: 실제 Windows·`start.bat` 와 맥 더블클릭(`open`)은 못 해 봄(파일 실행 권한만 확인).
- 점검한 규칙: Autonomy, Verification, GitCommit, 규칙 15(임시 폴더만 씀)
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 다음: `logs/soak-run.log` 에 `exit=` 있으면 M2-12 판정, 없으면 M2-18

## #0039 · 2026-11-21 · 조각 M2-14 (WebStorm 검사 경고 49 → 0)
- 계획: M2-14 — 고른 이유: ROADMAP 첫 `[ ]` 인 M2-12 는 1000판이 아직 도는 중(`logs/soak-run.log` 에 `exit=` 없음)이라 건너뜀 → M2-14 / `.idea/inspectionProfiles/Project_Default.xml`, `app/src/core/calls.ts`, `docs/jetbrains-usage.md`
- 한 것: 경고 49개 전부 읽음. 48개는 `Unused constant/function` 오탐 — 헤드리스는 파일 사이 import 를 못 풀어 export 를 전부 미사용으로 냄(`GAME_MS`·`drawHud`·`mulberry32` 등을 grep 하면 다른 파일이 씀). `JSUnusedGlobalSymbols` 를 프로필에서 끄고 이유를 주석으로. 진짜 1개(`nextCall` JSDoc 에 `@param rng` 빠짐)는 고침. 앞·뒤 `49 → 0` 을 usage 문서에.
- 커밋: 아래 feat 아닌 `chore`/`fix` 한 개 (`Slice: M2-14`)
- 검사: 1층 `TypeScript: No errors found`, `ESLint: No issues found` / 2층 `INSPECT ok: 0 errors, 0 warnings` (jev SUPPORTED) / 3층 해당 없음
- 플레이어 눈: 화면 변화 없음(주석·검사 설정)
- 점검한 규칙: Verification, Autonomy(프로필은 도구 설정이라 🟢), GitCommit
- 가정한 것(🟡): 없음 / 물은 것(🔴): 없음 / INBOX 처리: 처리할 줄 없음
- 주의: 이번 바퀴에서 vitest 는 1000판과 CPU 를 다투지 않게 돌리지 않음(코드 변경은 주석 한 줄)
- 다음: `logs/soak-run.log` 에 `exit=` 있으면 M2-12 판정, 없으면 M2-15(Junie 키 없으면 `[!]`) 또는 M2-17

## #0038 · 2026-11-21 · 조각 M2-12 (끝 못 함 — 1000판이 바퀴 40분 한도에 안 들어가 따로 돌림)
- 계획: M2-12 1000판 내구 — 고른 이유: ROADMAP 첫 `[ ]` / `app/scripts/soak.mjs` 고침, 실행은 바퀴와 분리
- 한 것: (1) 첫 실행 `SOAK 실패: Error: preview 꺼짐` — 이전 바퀴가 남긴 `vite preview`(PID 54031, 13:02 시작) 가 4181 포트를 잡고 있었다. 원인은 `npx` 로 띄우면 `server.kill()` 이 vite 자식을 못 죽이는 것 → 찌꺼기 프로세스 정리 + `soak.mjs` 가 `node node_modules/vite/bin/vite.js` 를 직접 띄우게 고침. (2) 두 번째 실행(배속 30) `SOAK 실패: TimeoutError: page.waitForFunction: Timeout 600000ms exceeded.` — 10분 동안 50판 못 채움. 진단: 아무 앱 코드 없는 빈 캔버스 페이지도 `10.666666666666666` fps (`--disable-gpu` 9.3, 백그라운드 제한 해제 11.7, vsync 끔 7.3 — 인자로는 안 풀림). 게임 시계는 `performance.now()*배속` 이라 시간은 가는데 봇이 프레임마다만 움직여서, 10fps 에서 결과 화면(20초÷30=0.67초 ≈ 7프레임)을 못 지나 판이 안 끝남. 배속 10 으로 낮추면 판이 끝남(20초에 2판). 앱 결함 아님 — 이 맥의 헤드리스 크롬이 지금 느린 것(WindowServer·Parsec 가 CPU 점유, 한때 UnrealEditor 도 211%). M2-11 때(12:33)는 판당 2.6초였으므로 기기 상태에 따라 다름. (3) `soak.mjs` 에 시작 때 fps 측정·경고(`fps=12.0 timescale=10`) 와 50판 대기 한도 30분 추가. (4) 바퀴 한도(`LOOP_LAP_TIMEOUT_SEC=2400`)에 1000판(배속 10 에서 약 2시간 예상)이 안 들어가므로 **바퀴와 분리해**(새 세션 `start_new_session`) `node scripts/soak.mjs --games 1000 --timescale 10 --every 50 --out ../logs/soak.csv` 를 13:40 에 띄움. 끝나면 `logs/soak-run.log` 맨 끝에 `exit=<코드>` 가 찍힘.
- 커밋: fix(tools) 18d1ba0 (`Slice: M2-12`) — 도구 고침만. M2-12 자체는 `[ ]` 유지
- 검사: 1층 `tsc exit 0`, `eslint exit 0`, `Tests  129 passed (129)` / 2층 못 함 (1000판 결과 아직 없음 — 도구 시작 출력 `fps=12.0 timescale=10` 만 확인) / 3층 해당 없음
- 플레이어 눈: 화면 변화 없음(개발 도구)
- 점검한 규칙: Autonomy, Verification(못 한 검사를 통과라 쓰지 않음), GitCommit, 규칙 15(이 폴더 밖 프로세스 안 건드림 — 남은 찌꺼기는 이 프로젝트 `app/` 의 것만 정리)
- 가정한 것(🟡): 내구를 배속 10 으로 돌림 — §6.4 합격선은 배속과 무관한 값(힙·DOM·p95·오류)이라 합격선은 그대로 적용하되, 프레임 p95 는 이 기기가 ≥ 80ms 라 ≤ 20ms 는 기기 탓으로 넘길 가능성이 큼 → 보고서에 기기 fps 를 같이 적고 DESIGN §6.4 근거 칸에 "기기 의존" 표시할 것 (🟢 숫자 근거 기록 범위)
- 물은 것(🔴): 없음
- INBOX 처리: 처리할 줄 없음
- 주의(다음 바퀴): 1000판이 도는 동안 `logs/soak.csv`·포트 4181 을 건드리지 말고, 다른 검사는 포트가 다른 것만. 필요하면 `pkill -f scripts/soak.mjs` 로만 멈춤. 다른 스크립트(`boardshot`·`crash`·`e2e` 등 13개)도 `npx` 로 띄워 같은 찌꺼기를 남길 수 있음 — 포트가 다르니 충돌은 없지만 쌓이면 CPU 를 먹음(감독에게 제안: `npx` → `node vite.js` 일괄 교체 조각).
- 다음: 다음 바퀴가 `logs/soak-run.log` 를 보고 M2-12 판정, 아직 돌면 M2-14

## #0036 · 2026-11-21 · 조각 M2-11
- 계획: M2-11 내구 도구 — 고른 이유: ROADMAP 첫 `[ ]` / `app/scripts/soak.mjs`(새)·`package.json`(`soak`)·`eslint.config.js`(`localStorage` 전역)
- 한 것: 봇이 대기→플레이→결과→이니셜→순위를 계속 돌고, 50판(`--every`)마다 강제 GC 뒤 JS 힙·DOM 노드·리스너·타이머·프레임 p95·저장 크기·콘솔 오류를 `logs/soak.csv` 에. `--games`·`--minutes`·`--timescale`·`--width` 인자. 함정: 1920 폭은 헤드리스에서 판당 17초(프레임 p95 133ms)라 기본 폭 960 으로 둠 → 판당 2.6초. M2-12 의 프레임 p95 합격선은 `--width 1920` 로 따로 재야 함.
- 커밋: feat(tools) (`Slice: M2-11`)
- 검사: 1층 `tsc exit 0`, `eslint exit 0`, `Tests  129 passed (129)` (jev SUPPORTED 0.97) / 2층 `SOAK ok: 50판 130초 (판당 2.60초 → 1000판 예상 43분), CSV ../logs/soak.csv, console_errors=0` (jev SUPPORTED 0.85). CSV: `50,130,1.87,16,21,0,66.7,12.7,0` / 3층 해당 없음
- 플레이어 눈: 화면 변화 없음(개발 도구)
- 점검한 규칙: Autonomy, Verification, CodingStyle, GitCommit
- 가정한 것(🟡): 없음 · 물은 것(🔴): 없음
- INBOX 처리: 처리할 줄 없음
- 다음: M2-12 (1000판 약 43분)

## #0035 · 2026-11-21 · 조각 M2-10
- 계획: M2-10 오프라인 — 고른 이유: ROADMAP 첫 `[ ]` / `public/sw.js`(새)·`vite.config.ts`(빌드 끝에 파일 목록·버전 채움)·`ui/offline.ts`(새, 배포본에서만 등록)·`index.ts`·`board.ts`(연결)·`scripts/offline.mjs`(새)·`package.json`(`offline`)·`eslint.config.js`(public 제외)
- 한 것: 서비스 워커가 `dist` 파일 11개(html 둘·js·css·글꼴)를 설치 때 전부 저장, 캐시 이름에 목록 해시를 넣어 새 버전이면 옛것 삭제·바꿔 끼움. 주소의 `?seed=` 같은 꼬리는 무시하고 찾음. 함정: 서버가 `Vary: Origin` 을 붙여 모듈 스크립트가 저장본을 못 찾았음 → `ignoreVary`.
- 커밋: feat(ui) fa05675 (`Slice: M2-10`)
- 검사: 1층 `tsc exit 0`, `eslint exit 0`, `Tests  129 passed (129)` — jev NOT_SUPPORTED(p 0.09)라 **통과 선언 보류** / 2층 `OFFLINE ok: 저장 11개, 네트워크 끊고 새로 고침 → 1판 끝, 보조 창 열림, 실패한 요청 0, 콘솔 오류 0` (preview 서버를 실제로 끈 뒤 확인; 서버를 켠 채 setOffline 만 쓰면 모듈이 실패해 ignoreVary 가 필요함을 먼저 봄) — jev NOT_SUPPORTED(p 0.69)라 **통과 선언 보류**. `E2E ok: … 콘솔 오류 0` 회귀 없음 / 3층 해당 없음(화면 변화 없음)
- 플레이어 눈: 손님 눈에는 변화 없음 / 운영자: 처음 한 번만 와이파이로 열면 됨 / 갇힘 없음
- 점검한 규칙: Autonomy, Verification, CodingStyle, GitCommit
- 가정한 것(🟡): 없음 · 물은 것(🔴): 없음 · 한계: 개발 서버(`vite dev`)에서는 등록 안 함. 실제 기기 업데이트 순서(새 버전 받는 시점)는 못 봄.
- INBOX 처리: 처리할 줄 없음
- 다음: M2-11

## #0034 · 2026-11-21 · 조각 M2-09
- 계획: M2-09 안 죽게 — 고른 이유: ROADMAP 첫 `[ ]` / `ui/guard.ts`(새)·`ui/guard.test.ts`(새)·`index.ts`(연결)·`scripts/crash.mjs`(새)·`package.json`(`crash`)
- 한 것: `error`·`unhandledrejection` → `calloutrush.v1.health` 의 `errors` +1, 3초 뒤 `location.reload()`(예약은 한 번만). 운영자 메뉴 Errors 칸이 이 값을 읽음. `navigator.wakeLock`(있을 때만, 탭 다시 보이면 재요청). 전체 화면 버튼은 M2-08 에 이미 있음.
- 커밋: feat(ui) 3e7d406 (`Slice: M2-09`)
- 검사: 1층 통과(`tsc exit 0`, `eslint exit 0`, `Tests  129 passed (129)`, jev SUPPORTED) / 2층: `CRASH ok: 예외 → 3.1초 만에 새로 고침·대기 화면 복귀, 오류 수 1, 점수 목록 그대로, 뜻밖의 콘솔 오류 0` — 실제 출력이나 jev 가 NOT_SUPPORTED(p 0.34) 라 **통과 선언 보류**. 함께 돌린 `OPERATOR ok: … 콘솔 오류 0`·`E2E ok: … 콘솔 오류 0` 은 회귀 없음(OPERATOR 만 jev SUPPORTED, E2E 는 NOT_SUPPORTED p 0.46 — 참고용) / 3층 해당 없음(화면 모양 변화 없음)
- 플레이어 눈: 손님 눈에는 오류 때 3초 뒤 대기 화면으로 돌아가는 것뿐 / 갇힘 — 오류가 반복돼도 매번 새로 고침으로 빠져나옴(반복 시 무한 새로 고침 가능: 한계)
- 점검한 규칙: Autonomy, Verification, CodingStyle, GitCommit
- 가정한 것(🟡): 없음 · 물은 것(🔴): 없음 · 한계: wakeLock 은 헤드리스에서 못 봄(검사 못 함). 오류가 시작 때부터 계속 나면 3초마다 새로 고침.
- INBOX 처리: 처리할 줄 없음
- 다음: M2-10

## #0033 · 2026-11-21 · 조각 M2-08
- 계획: M2-08 운영자 메뉴 — 고른 이유: ROADMAP 첫 `[ ]` / `ui/operator.ts`(새), `core/csv.ts`(새), `core/scores.ts`(`all`·`clearToday`), `index.ts`(연결), `style.css`, `scripts/operator.mjs`(새)
- 한 것: `Ctrl+Shift+O` 로 HTML 겹침 메뉴(한 번 만들어 두고 보이기만 바꿔 노드·리스너가 판마다 안 늘게). 항목 7개(§4.7 여섯 + Close). CSV 는 줄 수 = 기록 수 + 1, 수식 글자 방어. 오늘 지우기는 확인 문구 뒤 `Yes, clear`. Booth health = 켠 뒤 판 수·JS 힙·최근 1분 프레임 ms·오류 수(오류는 M2-09 전까지 0 고정).
- 커밋: feat(ui) b85f4c9 (`Slice: M2-08`)
- 검사: 1층 통과(`tsc exit 0`, `eslint exit 0`, `Tests  127 passed (127)`, jev SUPPORTED) / 2층 통과(`OPERATOR ok: 항목 7개, CSV 줄 8 = 기록 7 + 1, 지우기 오늘 3 → 0 전체 7 → 4, 콘솔 오류 0`, jev SUPPORTED; `E2E ok: … 콘솔 오류 0`) / 3층 통과: `captures/M2-08-operator.png`·`M2-08-operator-confirm.png` 를 열어 봄 — 패널 가운데, 글자 안 잘림, 확인 문구 정확. 시트에 없는 화면이라 §8.1 S7 글자·색 토큰만 사용.
- 플레이어 눈: 처음 하는 사람 — 키를 모르면 못 열어 일부러 숨김(설계) / 손 — 마우스 버튼 큼(높이 약 50px) / 게임 카메라 — 해당 없음(HTML 겹침) / 장르 상식 — 부스 관리 메뉴 / 갇힘 — Esc·Close·Cancel 로 항상 나감
- 점검한 규칙: Autonomy, Verification, PlayerEye, CodingStyle, GitCommit
- 가정한 것(🟡): 없음 · 물은 것(🔴): 없음 · 한계: 음소거는 저장하지 않음(`settings` 저장은 설계 §4.8 에 있으나 이번 합격선 밖 — M2-09 에서 같이 가능). 프레임 ms 47 은 헤드리스 값. `Open leaderboard window`·`Fullscreen` 은 헤드리스에서 못 눌러 봄(브라우저 팝업·전체 화면 허가 필요) — 검사 못 함.
- INBOX 처리: 처리할 줄 없음
- 다음: M2-09

## #0032 · 2026-11-21 · 조각 M2-07
- 계획: M2-07 무입력·자동 초기화 — 고른 이유: ROADMAP 첫 `[ ]` / `ui/flow.ts`(`abandonPlay`, 12초 무입력), `index.ts`(탭 숨김), `ui/health.ts`(새, `__health`), `scripts/health.mjs`(새), `core/config.ts` 의 `PLAY_IDLE_QUIT_S`(DESIGN §6 값 12초 그대로)
- 한 것: 사람 판에서 12초(게임 시간) 클릭이 없으면 저장·결과 없이 대기로. 탭이 숨겨지면(`visibilitychange`) 판을 버림. 대기·결과 화면은 그대로. `window.__health()` = 살아 있는 타이머·DOM 노드·리스너 수(setTimeout·setInterval·addEventListener 를 감싸 셈). 시연(demo) 판은 12초 규칙 제외. 덤: `demo.mjs` 의 안 쓰는 변수 제거(eslint).
- 커밋: feat(ui) (`Slice: M2-07`)
- 검사: 1층 통과(`tsc exit 0`, `eslint exit 0`, `Tests  123 passed (123)`, jev SUPPORTED) / 2층 통과(`HEALTH ok: 5판 {"timers":0,"nodes":10,"listeners":20} = 25판 {"timers":0,"nodes":10,"listeners":20}, 무입력 포기 results=0 saved=0, 탭 숨김 → attract, console_errors=0`, jev SUPPORTED) / 3층 해당 없음(새로 보이는 화면 없음 — 판을 버리면 이미 검사된 대기 화면으로 감)
- 플레이어 눈: 처음 하는 사람 — 떠나면 다음 사람이 바로 대기 화면 / 손 — 해당 없음 / 게임 카메라 — 해당 없음 / 장르 상식 — 오락실 자동 초기화 / 갇힘 — 없음
- 점검한 규칙: Autonomy, Verification, PlayerEye, CodingStyle, GitCommit
- 가정한 것(🟡): 없음 · 물은 것(🔴): 없음 · 건강 검사는 느려서(약 2분 50초) `npm run check` 에는 안 넣음. 배속이 30 이상이면 헤드리스 프레임이 느려 봇이 12초 넘게 못 눌러 판이 버려짐 → health 는 timescale=10. 첫 시도에서 되돌리기 명령을 잘못 칠 뻔했으나 거부돼 변경은 그대로.
- INBOX 처리: 처리할 줄 없음
- 다음: M2-08

## #0031 · 2026-11-21 · 조각 M2-06
- 계획: M2-06 대기 화면 완성 — 고른 이유: ROADMAP 첫 `[ ]` / `ui/flow.ts`(시연 상태·`startDemo`), `ui/screens.ts`(TOP 3·DEMO 막), `index.ts`, `core/config.ts`(`ATTRACT_DEMO_S`), `scripts/demo.mjs`(새); 시트 `docs/reference/attract.md` S1
- 한 것: 대기 화면에 오늘 TOP 3(없으면 `BE THE FIRST ON THE BOARD`). 20초 무입력이면 `demo` 판이 뒤에서 돌고(봇 regular, 어두운 막 + `DEMO`, 크로스헤어 없음, 결과·저장 없음), 끝나면 대기로 돌아와 타이머 0 부터. 시연 중 사람 클릭은 즉시 새 판(봇 클릭은 `gameClick` 으로 따로 들어가 시연을 안 끊음).
- 커밋: feat(ui) 6b955b7 (`Slice: M2-06`)
- 검사: 1층 통과(`tsc exit 0`, `eslint exit 0`, `Tests  120 passed (120)`, jev SUPPORTED) / 2층 통과(`DEMO ok: demo_started=true, saved_during_demo=0, click_during_demo_starts_new_game=true, results_after_demo=0, console_errors=0`, jev SUPPORTED) / 3층 통과(열어 본 그림: `captures/M2-06-attract.png` — 제목·설명·깜빡임 단추·오른쪽 아래 TOP 3(1등 금색) 시트 좌표와 맞음, `M2-06-demo.png` — 어두운 막 뒤로 판이 돌고 왼쪽 위 `DEMO` 표시)
- 플레이어 눈: 처음 하는 사람 — 어디든 누르면 시작 / 손 — 해당 없음 / 게임 카메라 — 캡처 확인 / 장르 상식 — 오락실 대기 화면 / 갇힘 — 없음(클릭이 항상 새 판)
- 점검한 규칙: Autonomy, Verification, PlayerEye, CodingStyle, GitCommit
- 가정한 것(🟡): 없음 · 물은 것(🔴): 없음 · 시연 소리는 애초에 판 중 소리가 없어 따로 끌 것 없음 · 캡처 png 는 `.gitignore`
- INBOX 처리: 처리할 줄 없음
- 다음: M2-07

## #0030 · 2026-11-21 · 조각 M2-05
- 계획: M2-05 보조 모니터 화면 — 고른 이유: ROADMAP 첫 `[ ]` / `board.html`(기존)+`src/board.ts`, `ui/boardwin.ts`(새), `core/channel.ts`(새), `index.ts`(저장 뒤 알림), `scripts/boardwin.mjs`(새); 시트 `docs/reference/board.md` S6
- 한 것: 보조 창이 오늘 TOP 10(줄 84px)·전체 TOP 5·`BEAT #1` 을 그림. 게임 창이 저장 직후 `BroadcastChannel('calloutrush')` 로 알리고, 보조 창은 이것 + `storage` 이벤트 + 5초 읽기로 다시 읽음. 새로 들어온 줄은 금색 3초 + 옆에서 미끄러져 들어옴.
- 커밋: feat(ui) 55c5372 (`Slice: M2-05`)
- 검사: 1층 통과(`tsc exit 0`, `eslint exit 0`, `Tests  116 passed (116)`, jev SUPPORTED) / 2층 통과(`BOARDWIN 줄 6 → 늘어남, 지연 2 ms, 읽은 횟수 4, 콘솔 오류 0, 종료코드 0`, jev SUPPORTED — 지연 2ms ≤ 1000ms) / 3층 통과(열어 본 그림: `captures/M2-05-boardwin-flash.png` — 새 5등 줄 금색 + 옆으로 어긋난 채 들어오는 중, `M2-05-boardwin-after.png` — 3.8초 뒤 제자리·금색 없음. 시트와 좌표 맞음, 줄 높이 84·80 ≥ 80)
- 플레이어 눈: 처음 하는 사람 — 만질 게 없는 화면 / 손 — 해당 없음(탭 0번) / 게임 카메라 — 캡처 확인 / 장르 상식 — 순위표 / 갇힘 — 없음
- 점검한 규칙: Autonomy, Verification, PlayerEye, CodingStyle, GitCommit
- 가정한 것(🟡): 없음 · 물은 것(🔴): 없음 · 캡처 png 는 `.gitignore` 라 커밋 안 됨
- INBOX 처리: 처리할 줄 없음
- 다음: M2-06

## #0029 · 2026-11-21 · 조각 M2-04
- 계획: M2-04 게임 창 순위 화면 — 고른 이유: ROADMAP 첫 `[ ]` / `ui/board.ts`(새), `ui/flow.ts`(board 화면), `index.ts`, `scripts/boardshot.mjs`(새); 시트 `docs/reference/board.md` S5
- 한 것: 이니셜 OK(또는 20초 무입력) 뒤 `board` 화면 — 오늘 TOP 10(1등 금색, 내 줄 `zone` 채움+`accent` 선), 10등 밖이면 맨 아래 `#13 YOU`, 8초 뒤 대기로, 누르면(0.6초 뒤부터) 바로 새 판. 봇은 1.5초 뒤 눌러 다음 판. 캡처에서 `#13 YOU` 가 이니셜과 겹쳐 YOU 줄만 이니셜을 x=720 으로 밀어 고침.
- 커밋: feat(ui) 94d6738 (`Slice: M2-04`)
- 검사: 1층 통과(`tsc exit 0`, `eslint exit 0`, `Tests  111 passed (111)`, jev SUPPORTED) / 2층 못 함(`BOARDSHOT 내 순위 13 / 6 / 1, 콘솔 오류 0, 종료코드 0` · initials·e2e 도 통과 출력 봤으나 jev 에 안 물어 통과로 안 씀) / 3층 통과(열어 본 그림: `captures/M2-04-board-top10.png` — 12개 중 13등, YOU 줄 겹침 없음, `M2-04-board-mid.png` — 6등 줄 강조, `M2-04-board-empty.png` — 1등 금색+강조. 시트 좌표와 맞음. 빈 기록 문구 `BE THE FIRST…` 는 내 기록이 항상 있어 이 흐름에선 안 보임)
- 플레이어 눈: 처음 하는 사람 — 내 줄이 강조돼 바로 보임 / 손 — 아무 데나 누르면 새 판 / 게임 카메라 — 캡처 확인 / 장르 상식 — 아케이드 순위표 / 갇힘 — 8초 뒤 자동 복귀
- 점검한 규칙: Autonomy, Verification, PlayerEye, CodingStyle, GitCommit
- 가정한 것(🟡): 없음 · 물은 것(🔴): 없음
- INBOX 처리: 처리할 줄 없음
- 다음: M2-05

## #0028 · 2026-11-21 · 조각 M2-03
- 계획: M2-03 결과 화면 다듬기 — 고른 이유: ROADMAP 첫 `[ ]` / `core/scores.ts`(previewRank), `ui/screens.ts`(rankLabel·COUNTUP_MS·순위 글자), `index.ts`(순위 계산·rank 소리·sfx 연결), `scripts/rankshot.mjs`
- 한 것: 저장 전 점수의 오늘 순위를 미리 계산해 카운트업(0.8초) 끝에 등급과 함께 `#n TODAY`(3등 안 금색), 1등이면 금색 `NEW #1 TODAY`. 등급 뜰 때 소리 S7(rank) 한 번 — 첫 클릭·키 입력에서 오디오 깨움. DESIGN §5.8 에 `NEW #1 TODAY` 〔추가: 바퀴 28〕.
- 커밋: feat(ui) 78fe6ee (`Slice: M2-03`)
- 검사: 1층 통과(`tsc exit 0`, `eslint exit 0`, `Tests  108 passed (108)`, jev SUPPORTED) / 2층 못 함(rankshot 은 `RANKSHOT 순위 6 / 1, 콘솔 오류 0, 종료코드 0` 이 나왔으나 jev 에 안 물어 통과로 안 씀; 소리는 헤드리스에서 안 들어 확인 못 함) / 3층 통과(열어 본 그림: `captures/M2-03-result-rank6.png` — `#6 TODAY` 흰색, `captures/M2-03-result-rank1.png` — 금색 `NEW #1 TODAY`; 둘 다 시트 위치(984, 472~572)와 맞고 이니셜 영역과 안 겹침. captures 는 .gitignore 라 커밋 안 됨)
- 플레이어 눈: 처음 하는 사람 — 순위가 점수·등급 옆에 바로 보임 / 손 — 새 조작 없음 / 게임 카메라 — 캡처로 확인 / 장르 상식 — 아케이드 순위 표시 / 갇힘 — 없음
- 점검한 규칙: Autonomy, Verification, PlayerEye, CodingStyle, GitCommit
- 가정한 것(🟡): 없음(`NEW #1 TODAY` 는 ROADMAP 에 문구가 명시돼 §5.8 에만 추가) · 물은 것(🔴): 없음
- INBOX 처리: 처리할 줄 없음
- 다음: M2-04

## #0027 · 2026-11-21 · 조각 M2-02
- 계획: M2-02 이니셜 입력 — 고른 이유: ROADMAP 첫 `[ ]` / `core/initials.ts`, `ui/keypad.ts`, `ui/flow.ts`(flowKey·결과 20초 무입력), `ui/screens.ts`(칸·글자판·OK·시간 막대), `index.ts`(키보드·점수 저장소 연결), `scripts/initials.mjs`
- 한 것: 3칸+A~Z+⌫+OK(84×84 칸), 키보드(소문자·Backspace·Enter), 20초 무입력→`---`, 금지 20개→`***`, 4글자째 무시. 결과는 OK 나 20초 뒤에만 떠나고 이름+판 기록을 ScoreStore 에 저장. 봇은 BOT 3글자 치고 OK. (결과 화면 누르면 넘어가던 옛 동작·RESULT_BOARD_S 8초 자동 이동은 없앰 — 순위 화면은 M2-04)
- 커밋: feat(ui) (`Slice: M2-02`)
- 검사: 1층 통과(`tsc exit 0`, `eslint exit 0`, `Test Files  17 passed (17)` / `Tests  104 passed (104)`, jev SUPPORTED) / 2층 못 함 판정(브라우저 시험 출력 `INITIALS 저장 이름 ZED, 콘솔 오류 0, 종료코드 0` 은 나왔지만 jev NOT_SUPPORTED 라 통과로 안 씀) / 3층 통과(열어 본 그림: `captures/M2-02-result-3letters.png` — 칸 ZED, OK 켜짐(채움), 글자판 3줄 A~I·J~R·S~Z+⌫, 시간 막대 아래, 시트 레이아웃과 일치)
- 플레이어 눈: 처음 하는 사람 — 문구 `ENTER YOUR INITIALS` 와 칸이 한눈에 보임 / 손 — 칸 84×84 로 큼, 키보드도 됨 / 게임 카메라 — 캡처로 확인 / 장르 상식 — 아케이드 이니셜 입력 / 갇힘 — OK 못 눌러도 20초 뒤 `---` 로 빠져나감. 단 `#n TODAY`·등급 소리는 M2-03
- 점검한 규칙: Autonomy, Verification, PlayerEye, CodingStyle, GitCommit
- 가정한 것(🟡): 없음 · 물은 것(🔴): 없음
- INBOX 처리: 처리할 줄 없음
- 다음: M2-03

## #0026 · 2026-11-21 · 조각 M2-01
- 계획: M2-01 점수 저장소 — 고른 이유: ROADMAP 첫 `[ ]` / `app/src/core/scores.ts`, `scores.test.ts`
- 한 것: ScoreStore(add·today·allTime·rankToday·prune 500건, 저장 어댑터 localStorage/메모리). 동점=먼저 낸 쪽, 자정 넘으면 오늘 빔, 깨진 JSON→.bad, 저장 실패→줄여 재시도→메모리, 600건→500건(오늘 것 보존) 테스트 9개
- 커밋: feat(core) (`Slice: M2-01`)
- 검사: 1층 통과(`tsc exit 0`, `eslint exit 0`, 실행 출력 `Test Files  15 passed (15)` / `Tests  95 passed (95)`, jev SUPPORTED) / 2층 해당 없음 / 3층 해당 없음(화면 없는 모듈)
- 점검한 규칙: Autonomy, Verification, CodingStyle, GitCommit
- 가정한 것(🟡): 없음 · 물은 것(🔴): 없음
- INBOX 처리: 처리할 줄 없음
- 다음: M2-02

## #0025 · 2026-11-21 · 조각 M1-98
- 계획: M1-98 처음 하는 사람 통 플레이 — 고른 이유: M1-13 이 JUNIE_API_KEY 없어 `[!]`(건너뜀) → 다음 `[ ]` / `app/scripts/playthrough.mjs`, `package.json`(npm run playthrough)
- 한 것: rookie 봇을 timescale=1 로 녹화(captures/tmp/M1-98.webm)+5초마다 12장(captures/M1-98-01~12.png). 연 그림: 01(카운트다운 3)·03(WARM-UP 콜+정답 체크)·07(LIVE, 지도 글자 숨김)·12(CLUTCH 8초)·M1-11-attract.png. 문제 없어 M1-99a 조각 없음
- 커밋: test(ui) (`Slice: M1-98`)
- 검사: 1층 통과(`eslint exit 0`, 실행 출력 `PLAYTHROUGH 캡처 12장, 한 판 62.7초(play 0.4s→result 63.1s), 점수 4212, 콘솔 오류 0`) / 2층 해당 없음 / 3층 통과(위 그림을 열어 봄)
- 플레이어 눈: ① 예(attract 에 "Read the call. Click the spot." + CLICK TO PLAY, 첫 콜 카드가 바로 뜸 — M1-11-attract.png, M1-98-03.png) / ② 못 함(실기기 터치 없음 — 감독; 부스는 마우스·큰 구역) / ③ 예(M1-98-03: 콜 카드와 지도 모두 한 화면, 정답 체크 목록 우하단) / ④ 해당 없음(DESIGN §5 일시정지·설정 없음) / ⑤ 예(결과→대기로 돌아옴, e2e 3판)
- 한 사람 총 시간: 62.7초 ≤ 95 (합격)
- 점검한 규칙: Autonomy, Verification, PlayerEye, GitCommit
- 가정한 것(🟡): 없음 · 물은 것(🔴): 없음
- INBOX 처리: 처리할 줄 없음
- 다음: M2-01

## #0024 · 2026-11-21 · 조각 M1-12
- 계획: M1-12 숫자 맞추기 — 고른 이유: ROADMAP M1 첫 `[ ]` (INBOX 처리할 줄 없음) / `app/scripts/balance.ts`, `app/src/core/balance.test.ts`, `package.json`(npm run balance), DESIGN §6.2·§6.3
- 한 것: 봇 3종 × 1000판 실측 — rookie 3528(10% 2755·90% 4510) / regular 6747(5482·8065) / pro 12446(11077·13735). 콜 중앙값 34/44/58, 정확도 78.8/90.2/96.6%. 목표(ENTRY / SHOT CALLER / IGL, 간격 ≥1500) 전부 맞아 등급 경계는 안 바꿈. §6 예상 값 3줄을 잰 값+날짜+명령으로 교체. 시험이 등급 목표·간격·DESIGN 경계 행=config 를 묶음
- 커밋: feat(core) 973bf83 (`Slice: M1-12`)
- 검사: 1층 통과(`Tests  86 passed (86)`, tsc·eslint 오류 없음, jev evidence `SUPPORTED`) / 2층 해당 없음 / 3층 해당 없음(화면 변화 없음)
- 점검한 규칙: Autonomy, DataDriven, Verification, GitCommit
- 가정한 것(🟡): 없음 · 물은 것(🔴): 없음
- INBOX 처리: 처리할 줄 없음
- 다음: M1-13

## #0023 · 2026-11-21 · 조각 M1-11
- 계획: M1-11 화면 흐름 — 고른 이유: ROADMAP M1 첫 `[ ]` (INBOX 처리할 줄 없음) / `app/src/ui/flow.ts`(+테스트), `ui/screens.ts`, `index.ts`, `scripts/e2e.mjs`
- 한 것: 순수 상태 기계 `flow.ts`(attract→play[카운트다운 포함]→result→attract, 판 시작마다 `initGame` 새로, 결과 0.6초 뒤 누름·8초 뒤 자동 대기). `botFrame` 이 같은 `flowClick` 길로 봇을 돌린다. `screens.ts` 에 Attract·Result(숫자만)·카운트다운 숫자 그림. `index.ts` 를 한 줄기 루프로 통일(`?state=`·`?bot=`·`?timescale=` 연결, `data-screen/results/attracts` 검사용 표시). e2e 에 봇 3판 연속 추가
- 커밋: feat(ui) (`Slice: M1-11`)
- 검사: 1층 통과(`Tests  83 passed (83)` / `E2E ok: 정답 클릭 점수 100 연속 1, 빈 땅 클릭 연속 0, 봇 3판 결과를 지나 대기로 3번 돌아옴 콘솔 오류 0`, jev evidence `SUPPORTED`) / 2층 해당 없음 / 3층 통과(부분): `captures/M1-11-attract.png`·`M1-11-result.png`·`M1-11-countdown.png` 를 열어 봄 — 제목·설명·단추 자리 시트와 맞음, 카운트다운 `2` 맵 가운데. 결과는 점수 카운트업 도중(점수 53)에 찍혀 최종 점수·등급 모습은 못 봄
- 플레이어 눈: 처음 하는 사람이 CLICK TO PLAY 를 보고 누르면 시작함(e2e 봇이 같은 길). 실손 감각·소리 연결은 못 함 — 소리는 아직 안 난다(M1-98). 결과의 이니셜·순위·TOP 3·20초 뒤 시연은 M2 몫이라 없음
- 점검한 규칙: Autonomy, CodingStyle, GitCommit, Verification, PlayerEye
- 가정한 것(🟡): 결과 화면은 8초 뒤 자동으로 대기로(RESULT_BOARD_S), 누르면 0.6초 뒤부터 즉시. 판 시드 = 시작 시드 + 끝난 판 수
- 물은 것(🔴): 없음
- INBOX 처리: 처리할 줄 없음
- 다음: M1-12

## #0022 · 2026-11-21 · 조각 M1-10
- 계획: M1-10 소리 — 고른 이유: ROADMAP M1 첫 `[ ]` (INBOX 처리할 줄 없음) / `app/src/audio/sfx.ts`(+테스트), `app/scripts/sfxrender.mjs`
- 한 것: §5.5 소리 8개를 WebAudio 로 합성(`scheduleSfx`), `createSfx()` = 첫 `unlock()` 에서 AudioContext 생성·음소거 값·끝난 노드 `disconnect`. hit 은 연속마다 반음(최대 +12), count 는 `go` 옵션으로 990Hz 250ms. 브라우저 OfflineAudioContext 로 실제 렌더하는 `npm run sfxrender` 를 `check` 에 넣음. eslint 전역에 URL·Blob·OfflineAudioContext 추가
- 커밋: feat(audio) d436209 (`Slice: M1-10`)
- 검사: 1층 통과(`Tests  79 passed (79)` / `SFX ok: 8개 소리 렌더 최대값 > 0.05, 길이 표 ±20ms` / `INSPECT ok: 0 errors, 48 warnings`, jev evidence `SUPPORTED`) / 2층 해당 없음 / 3층 해당 없음(보이는 것 아님)
- 플레이어 눈: 실제로 귀로 듣는 건 못 함 — 최대값·길이만 잰 것. 게임에 연결(콜·판정·단계 때 `play`)은 M1-11 화면 흐름 몫이라 아직 소리가 안 난다. 실제 들림은 M1-98 에서
- 점검한 규칙: Autonomy, CodingStyle, GitCommit, Verification
- 가정한 것(🟡): `count` 삑 하나 90ms, 3번 반복은 호출 쪽이 한다. 소리 최대 볼륨 0.3 (귀 아프지 않게)
- 물은 것(🔴): 없음
- INBOX 처리: 처리할 줄 없음
- 다음: M1-11

## #0021 · 2026-11-21 · 조각 M1-09
- 계획: M1-09 판정 연출 — 고른 이유: ROADMAP M1 첫 `[ ]` (INBOX 처리할 줄 없음) / `app/src/ui/fx.ts`(+테스트), `index.ts` 연결, `scripts/fxshot.mjs`
- 한 것: 정답 구역 초록 번쩍 150ms + 구역 위로 떠오르는 `+점수`·`0.61s` + 인원 점, 오답 주황 X + 120ms 흔들림 6px + 정답 구역 테두리·이름표 600ms, LIVE·CLUTCH 전환 글자 번쩍 800ms, 이름표 2단계 시작부터 2초에 걸쳐 사라짐
- 커밋: feat(ui) fx.ts 커밋 + fix(ui) 가림 수정 커밋 (`Slice: M1-09`)
- 검사: 1층 통과(`CHECK exit 0` / `Tests  76 passed (76)` / `E2E ok: 정답 클릭 점수 100 연속 1, 빈 땅 클릭 연속 0` / `INSPECT ok: 0 errors, 46 warnings`, jev evidence `SUPPORTED`) / 2층 해당 없음 / 3층 통과 — 연 그림: `captures/M1-09-hit.png`(정답 직후: 초록 구역·`+100`·점), `captures/M1-09-wrong.png`(오답 직후: 주황 X·맵 흔들림·정답 구역 테두리), `captures/M1-09-label.png`(`at=19000` = 2단계 1초 뒤, 이름표 반투명)
- 플레이어 눈: 첫 캡처에서 `+100` 이 구역 이름표를 덮고 WARM-UP 큰 글자가 판 시작 맵을 가려서 고침(점수는 구역 윗변 위로, 첫 단계 글자 제거). 고친 뒤 이름표가 읽힌다. 실기기 손 감각은 M1-98 몫. `at` 은 절대 시각이라 ROADMAP 의 `at=16000` 은 플레이 13초(1단계)라 페이드가 안 보여 `at=19000` 으로 찍음. 캡처의 `0.00s` 는 0.15배속 시계에서 콜 뜨자마자 눌러서(실제 플레이 값 아님)
- 점검한 규칙: Autonomy, CodingStyle, GitCommit, Verification, PlayerEye
- 가정한 것(🟡): 첫 단계(WARM-UP)는 전환 번쩍 없음. 인원 점은 정답 구역 아래쪽 줄에 700ms
- 물은 것(🔴): 없음
- INBOX 처리: 처리할 줄 없음
- 다음: M1-10

## #0020 · 2026-11-21 · 조각 M1-08
- 계획: M1-08 입력 연결·게임 루프 — 고른 이유: ROADMAP M1 첫 `[ ]` (INBOX 처리할 줄 없음) / `app/src/index.ts`(`startLive`), `ui/map.ts` 에 `stageToMap`, `scripts/e2e.mjs`, `npm run check` 에 e2e 추가
- 한 것: `?state=play` 에 `at` 이 없으면 진짜 플레이 — `pointerdown`(왼쪽 버튼만) → 무대 → 맵 좌표 → `CLICK`, `requestAnimationFrame` 한 줄기가 `TICK`. 우클릭·드래그·선택 막기, 커서 십자. `timescale` 반영. 검사용으로 body `data-score/streak/target/status` 표시. `at` 이 있으면 예전 캡처 모드 그대로
- 커밋: feat(ui) 입력 연결 커밋(`Slice: M1-08`)
- 검사: 1층 통과(`CHECK exit 0` / `Tests  71 passed (71)` / `E2E ok: 정답 클릭 점수 100 연속 1, 빈 땅 클릭 연속 0` / `INSPECT ok: 0 errors, 5 warnings`, jev evidence `SUPPORTED`) / 2층 해당 없음 / 3층 해당 없음(캡처 모드 화면은 안 바뀜, 라이브 화면 캡처는 M1-09 연출 때 같이)
- 플레이어 눈: 마우스 십자 커서·우클릭 메뉴 없음까지만 확인(코드). 판정 연출이 아직 없어 눌러도 화면 반응은 점수 숫자뿐 — M1-09 몫. 터치(손가락)는 pointerdown 이라 같은 길
- 점검한 규칙: Autonomy, CodingStyle, GitCommit, Verification
- 가정한 것(🟡): e2e 는 `timescale=5` 로 카운트다운을 줄임. 시드 인자가 없으면 `Date.now()`
- 물은 것(🔴): 없음
- INBOX 처리: 처리할 줄 없음
- 다음: M1-09

## #0019 · 2026-11-21 · 조각 M1-07
- 계획: M1-07 HUD — 고른 이유: ROADMAP M1 첫 `[ ]` (INBOX 처리할 줄 없음) / `app/src/ui/hud.ts`·`hud.test.ts`, `index.ts` 에 `?state=play&at=&seed=` 로 시계만 돌려 그리기, `shot.mjs` 가 `play&at=…` 추가 인자 허용 / `reference/play.md` 오른쪽 패널
- 한 것: `drawHud` — 시간 막대·남은 초(10초 이하 주황)·단계 이름·콜 카드(무전 아이콘·쉼표 뒤 줄바꿈·폭 맞춤 글자 96→60)·콜 제한 시간 막대·점수·연속(3 이상 금색)·지난 콜 3줄(✓/✗ 는 선으로). 순수 함수 `callLines`·`fitPx`·`pastCalls` 테스트 6개
- 커밋: feat(ui) HUD 커밋(`Slice: M1-07`)
- 검사: 1층 통과(`CHECK exit 0` / `Tests  69 passed (69)` / `INSPECT ok: 0 errors, 5 warnings`, jev evidence `SUPPORTED`) / 2층 해당 없음 / 3층 통과 — `captures/M1-07a.png`(at=5000)·`M1-07b.png`(at=45000, 한 곳 콜)·`M1-07c.png`(at=45000 seed=7, 두 곳 콜 `South Stairs, then Container Row!`)를 열어 `reference/play.md` 와 대조: 가장 긴 문장이 카드 안(글자 자동 축소), 패널 위치 시트와 같음
- 플레이어 눈: 콜 카드 글자가 크고 맵과 멀리 떨어져 시트대로. 판정 연출(번쩍·+점수)은 M1-09 몫. 지난 콜은 시계만 돌린 캡처라 전부 ✗(시간 초과) — 정상
- 점검한 규칙: Autonomy, CodingStyle, GitCommit, Verification, Reference
- 가정한 것(🟡): 캡처용 `at` 은 클릭 없이 50ms 단위로 시계만 돌림. 두 곳 콜 캡처는 seed=7 (시트에 없음). 지난 콜 줄 간격 34px(시트 32 — 3줄이 y1020 안에 들어감)
- 물은 것(🔴): 없음
- INBOX 처리: 처리할 줄 없음
- 다음: M1-08

## #0018 · 2026-11-21 · 조각 M1-06
- 계획: M1-06 맵 그리기 — 고른 이유: ROADMAP M1 첫 `[ ]` (INBOX 처리할 줄 없음) / `app/src/ui/map.ts`·`map.test.ts`, `index.ts` 에 `?state=play` 캔버스 연결, `docs/reference/play.md` 맵 절
- 한 것: `drawMap(ctx, {labelAlpha})` — 맵 바탕·점선 길(빈 땅)·구역 12개(채움·테두리·§5.1 선 그림)·이름표. `zoneRect`(맵 단위→무대 px), `labelLines`(좁으면 두 줄). 테스트 5개(시트 좌표 · 맵 안 · 두 줄 7곳 · 한 줄 · 폭 안)
- 커밋: feat(ui) 커밋(`Slice: M1-06`)
- 검사: 1층 통과(`CHECK exit 0` / `Tests  63 passed (63)` / `INSPECT ok: 0 errors, 5 warnings`, jev evidence `SUPPORTED`) / 2층 해당 없음 / 3층 통과 — `captures/M1-06.png` 를 열어 `reference/play.md` 와 대조: 12구역 다 보임, 이름표 전부 구역 안, 두 줄 이름 7곳 정상. 구역 그림은 `line` 색이라 흐린 편(시트 지정색 그대로)
- 플레이어 눈: 맵만이라 조작 없음. 게임 카메라(캔버스)에서 구역 구분·이름 읽힘 OK. 그림 무늬가 약해 구역 구별은 이름·위치 몫(힌트가 되지 않게 시트대로).
- 점검한 규칙: Autonomy, CodingStyle, GitCommit, Verification, Reference
- 가정한 것(🟡): 이름표 글자 폭 근사 18px(시트 17px) — LOADING DOCK 이 시트대로 두 줄이 되게. 점선 길은 단위 250·500·750 격자(시트에 위치 지정 없음)
- 물은 것(🔴): 없음
- INBOX 처리: 처리할 줄 없음
- 다음: M1-07

## #0017 · 2026-11-21 · 조각 M1-05
- 계획: M1-05 봇 — 고른 이유: ROADMAP M1 첫 `[ ]` (INBOX 처리할 줄 없음) / `app/src/core/bot.ts`·`bot.test.ts`, DESIGN §5.3
- 한 것: 프로필 3개(rookie·regular·pro), `decide(profile, state, rng)`(정규분포 rt 최소 200ms, 정확도 확률로 오답=빈 땅 클릭), `simulate(profile, seed)`(가상 시계 16ms 로 한 판). 봇 전용 난수라 콜 순서는 안 흔들린다. 테스트 7개(프로필 값 · null · 최소 rt · 결정성 · 프로필별 1000판 정확도 ±3%p·done)
- 커밋: feat(core) 커밋(`Slice: M1-05`)
- 검사: 1층 통과(`CHECK exit 0` / `Tests  58 passed (58)` / `INSPECT ok: 0 errors, 5 warnings`, jev evidence `SUPPORTED`) / 2층 해당 없음 / 3층 해당 없음(화면 없음)
- 플레이어 눈: 해당 없음
- 점검한 규칙: Autonomy, CodingStyle, GitCommit, Verification
- 가정한 것(🟡): 없음 (정확도 = 맞힌 목표/끝난 목표, game.ts 와 같은 정의)
- 물은 것(🔴): 없음
- INBOX 처리: 처리할 줄 없음
- 다음: M1-06

## #0016 · 2026-11-21 · 조각 M1-04
- 계획: M1-04 게임 리듀서 — 고른 이유: ROADMAP M1 첫 `[ ]` (INBOX 처리할 줄 없음) / `app/src/core/game.ts`·`game.test.ts`, DESIGN §4.2·§3.4
- 한 것: `initGame(seed)`·`step(state, event)`·`phaseAt`. 카운트다운(첫 TICK 부터 3초) → play → done. 클릭은 TICK 이 띄운 콜에만 판정(콜 안 뜬 프레임의 클릭은 무시). 테스트 18개(카운트다운 · 정답 · 오답 · 빈 땅 · 시간 초과 · 간격 무시 2 · 두 곳 4 · 단계 경계 · 60초 끝 · 끝난 뒤 · 같은 시드 결정성)
- 커밋: feat(core) 커밋(`Slice: M1-04`)
- 검사: 1층 통과(`CHECK exit 0` / `Tests  51 passed (51)` / `INSPECT ok: 0 errors, 5 warnings`, jev evidence `SUPPORTED`) / 2층 해당 없음 / 3층 해당 없음(화면 없음)
- 플레이어 눈: 해당 없음
- 점검한 규칙: Autonomy, CodingStyle, GitCommit, Verification
- 가정한 것(🟡): 두 곳 콜 제한 시간(3600ms)을 구역마다(앞 클릭·콜 표시부터) 따로 적용. §4.3 에 "두 곳 콜 제한 시간" 한 숫자뿐이라 가장 단순한 해석 — 아래 INBOX 확인 남김
- 물은 것(🔴): 없음
- INBOX 처리: 처리할 줄 없음
- 다음: M1-05 봇

## #0015 · 2026-11-21 · 조각 M1-03
- 계획: M1-03 점수 함수 — 고른 이유: ROADMAP M1 첫 `[ ]` (INBOX 처리할 줄 없음) / `app/src/core/scoring.ts`·`scoring.test.ts`, DESIGN §4.4·§5.6
- 한 것: `speedOf`·`points`·`mult`·`grade`·`accuracy`·`avgReaction`·`baseOf`. 테스트 10개(rt 바닥=만점, rt=T=절반, 배수 상한, 등급 경계 4곳 위·아래, 목표 0개)
- 커밋: feat(core) 커밋(`Slice: M1-03`)
- 검사: 1층 통과(`CHECK exit 0` / `Tests  33 passed (33)` / `INSPECT ok: 0 errors, 5 warnings`, jev evidence `SUPPORTED`) / 2층 해당 없음 / 3층 해당 없음(화면 없음)
- 플레이어 눈: 해당 없음
- 점검한 규칙: Autonomy, CodingStyle, DataDriven, GitCommit
- 가정한 것(🟡): 없음
- 물은 것(🔴): 없음
- INBOX 처리: 처리할 줄 없음
- 다음: M1-04 게임 리듀서

## #0014 · 2026-11-21 · 조각 M1-02
- 계획: M1-02 난수·콜 생성 — 고른 이유: ROADMAP M1 첫 `[ ]` (INBOX 처리할 줄 없음) / `app/src/core/rng.ts`·`calls.ts`·`calls.test.ts`, DESIGN §4.3·§5.2
- 한 것: mulberry32 `mulberry32(seed)`, `nextCall(rng, phase, recent)` — 인원 50/35/15, 최근 2구역 제외, 단계 3 에서만 두 곳 50%(둘째는 첫째와 다른 구역), 문장 §5.2 틀. 테스트 7개
- 커밋: 이번 바퀴 feat 커밋(`Slice: M1-02`)
- 검사: 1층 통과(`CHECK exit 0` / ` Tests  23 passed (23)` / `INSPECT ok: 0 errors, 5 warnings`, jev evidence `SUPPORTED`) / 2층 해당 없음 / 3층 해당 없음(화면 없음)
- 플레이어 눈: 해당 없음
- 점검한 규칙: Autonomy, CodingStyle, DataDriven, GitCommit
- 가정한 것(🟡): 없음(`recent` 는 오래된 것부터 배열이라는 구현 세부는 🟢)
- 물은 것(🔴): 없음
- INBOX 처리: 처리할 줄 없음
- 다음: M1-03 점수 함수

## #0013 · 2026-11-21 · 조각 M1-01
- 계획: M1-01 설정·구역 데이터 — 고른 이유: ROADMAP M1 첫 `[ ]` (INBOX 처리할 줄 없음) / `app/src/core/config.ts`·`zones.ts`·`zones.test.ts`, DESIGN §6·§5.1
- 한 것: §6 숫자를 `config.ts` 한 곳에(이름은 표 그대로, 단계 3개는 `PHASES` 배열), §5.1 구역 12개를 `zones.ts` 에, `zoneAt(x, y)` 순수 함수(경계는 왼쪽·위 포함, 오른쪽·아래 제외). 테스트 8개: 12개·ID 중복 없음 · 간격 ≥ 20 · 맵 안 · 가운데=자기 ID · 모서리 · 빈 땅 5점 null
- 커밋: cae2250
- 검사: 1층 통과(`CHECK exit 0` / ` Tests  16 passed (16)` / 마지막 줄 `INSPECT ok: 0 errors, 5 warnings`, jev evidence `SUPPORTED` 두 번 — 처음 인용(`INSPECT ok…` 만)은 `NOT_SUPPORTED` 라 테스트 줄로 다시 확인) / 2층 해당 없음(게임 로직 아직 없음) / 3층 해당 없음(화면 없음)
- 플레이어 눈: 해당 없음(아직 만지는 것 없음)
- 점검한 규칙: Autonomy, CodingStyle, DataDriven, GitCommit
- 가정한 것(🟡): 없음(경계 규칙은 설계서에 없는 구현 세부라 🟢)
- 물은 것(🔴): 없음
- INBOX 처리: 처리할 줄 없음
- 다음: M1-02 난수·콜 생성

## #0012 · 2026-11-21 · 조각 M0-98
- 계획: M0-98 뼈대 통 점검 — 고른 이유: ROADMAP M0 첫 `[ ]` (INBOX 처리할 줄 없음) / 임시 폴더에 `git clone` → `app` 에서 `npm ci`·`npm run check`·화면 캡처
- 한 것: 임시 폴더 clone 에서 `npm ci` 후 `npm run check` 를 exit 코드를 따로 잡아 실행. 캡처는 dev 서버가 아니라 `npm run shot -- attract`(vite preview) 로 찍음. 캡처 파일 `captures/M0-98.png`(git 무시 폴더)
- 커밋: 아래 참고
- 검사: 1층 통과(`CHECK exit 0` / 마지막 줄 `INSPECT ok: 0 errors, 5 warnings` / 걸린 시간 `초: 8`(npm ci 포함 첫 실행 13초), jev evidence `SUPPORTED`) / 2층 해당 없음(게임 로직 없음) / 3층 통과(열어 본 그림: `captures/M0-98.png` — 어두운 남색 바탕 한가운데 `CALLOUT RUSH` 글자 하나, 뼈대 화면으로 맞음)
- 플레이어 눈: 해당 없음(아직 만지는 것 없음)
- 점검한 규칙: Verification, Autonomy, GitCommit
- 가정한 것(🟡): 없음. 참고: 경고 5개는 아직 안 쓰는 `ui/stage.ts`·`params.ts` 함수(M1 에서 쓰임)
- 물은 것(🔴): 없음
- INBOX 처리: 처리할 줄 없음
- 다음: 사람 `🎮 M0 5분 보기` 는 사람 몫 → M1-01

## #0011 · 2026-11-21 · 조각 M0-11
- 계획: M0-11 화면 시트 5개 — 고른 이유: ROADMAP M0 첫 `[ ]` (INBOX 처리할 줄 없음) / `docs/reference/{attract,play,result,board,operator}.md`, DESIGN §7·§8·§5.1·§6
- 한 것: 다섯 시트를 요소 | x | y | w | h | 글자 px | 색 표로 작성(play.md 에 S2 카운트다운과 구역 12개를 무대 px 로 환산해 포함). 좌표가 DESIGN 에 없는 것은 직접 정하고, 안 맞는 곳 두 개를 발견해 시트에 줄바꿈 규칙으로 해결: 96px 콜 문장이 카드 폭 732 를 넘음, 28px 이름표가 좁은 구역에 안 들어감. 운영자 메뉴 새 문구 9개를 DESIGN §5.8 에 〔추가: 바퀴 11〕
- 커밋: 아래 참고
- 검사: 1층 통과(요소 존재 grep: `board.md 빠진 요소 0` · `operator.md 빠진 요소 0` 등 다섯 줄 모두 0, `python3 tools/check_conventions.py` → `결과: 통과 (오류 0 / 경고 0 / 미정 숫자 0)`, jev evidence `SUPPORTED`) / 2층 해당 없음(문서만) / 3층 해당 없음(화면 없음 — 시트만, 그림 대조는 M1 조각에서)
- 플레이어 눈: 해당 없음(아직 만지는 것 없음)
- 점검한 규칙: Autonomy, Reference(§2 시트·§5 권리·§6 다르게), GitCommit
- 가정한 것(🟡): 좌표 중 DESIGN 에 없던 것 전부, 콜 문장·이름표 줄바꿈(INBOX 확인 1줄), 카운트다운 숫자는 이름표가 보이게 반투명, 시연 중 대기 화면 겹침 막 알파 0.72
- 물은 것(🔴): 없음
- INBOX 처리: 확인 1줄 추가(M0-11 줄바꿈 가정). 처리할 줄은 없었음
- 다음: M0-98

## #0010 · 2026-11-21 · 조각 M0-10
- 계획: M0-10 usage 문서 틀 + README + LICENSE — 고른 이유: ROADMAP M0 첫 `[ ]` (INBOX 처리할 줄 없음) / `docs/jetbrains-usage.md`, `README.md`, `LICENSE`, DESIGN §9.1
- 한 것: usage 문서를 맨 위 합계표 + 날짜·조각·도구·한 일·증거 표로 바꾸고 기존 세 줄을 옮김(WebStorm 1회·경고 5·고친 것 0, Junie·Air 0). 루트 README(소개·Play 자리·Run locally·Booth setup 자리·usage 링크)와 MIT LICENSE(저작권자 `Callout Rush contributors`) 작성
- 커밋: 아래 참고
- 검사: 1층 해당 없음(문서만; `grep -iE "@|gdm" README.md LICENSE | wc -l` 출력 `0`) / 2층 해당 없음 / 3층 해당 없음
- 플레이어 눈: 해당 없음
- 점검한 규칙: Autonomy, GitCommit
- 가정한 것(🟡): 합계표의 WebStorm 실행 횟수는 STATUS 에 기록된 M0-07 한 번만 셈(그 전후 개발 중 돌린 횟수는 기록 없음). README 에 `npm run check` 한 줄 추가(ROADMAP 에 없던 부연)
- 물은 것(🔴): 없음
- INBOX 처리: 없음
- 다음: M0-11

## #0009 · 2026-11-21 · 조각 M0-09
- 계획: M0-09 Air 확인 — 고른 이유: ROADMAP M0 첫 `[ ]` (INBOX 처리할 줄 없음) / `docs/DESIGN.md` §9.1, `docs/jetbrains-usage.md`, ROADMAP
- 한 것: `ls /Applications/Air.app/Contents/MacOS` → `Air` 하나뿐, `which air` → `air not found`. product-info.json 빌드 262.834.70. 공식 홈페이지는 CLI 를 나열하나 명령 이름 없음, 도움말 개요에도 없음. `.air` 폴더는 문서에 없고 앱을 안 열어 못 봄(사람 할 일). DESIGN §9.1 Air 줄을 사실로 바꿈
- 커밋: 아래 참고
- 검사: 1층 해당 없음(문서만) / 2층 해당 없음 / 3층 해당 없음
- 플레이어 눈: 해당 없음
- 점검한 규칙: Autonomy, GitCommit
- 가정한 것(🟡): CLI 는 확인 못 했으므로 없는 것으로 보고 M2 끝 사람 할 일을 그대로 둠
- 물은 것(🔴): 없음
- INBOX 처리: 없음
- 다음: M0-10

## #0008 · 2026-11-21 · 조각 M0-08
- 계획: M0-08 Junie CLI 확인 + `.junie/AGENTS.md` — 고른 이유: ROADMAP M0 첫 `[ ]` (INBOX 처리할 줄 없음) / `.junie/AGENTS.md`, `docs/jetbrains-usage.md`
- 한 것: 공식 설치 스크립트로 Junie 설치(`~/.local/bin`). 문서에서 지침 파일 위치 확인(`.junie/AGENTS.md` 가 1순위). 영어 규칙 10줄짜리 지침 파일 작성. 요금·무료량 페이지는 문서에서 못 찾음(확인 필요). 키가 없어 실제 작업 실행은 안 함
- 커밋: 아래 참고
- 검사: 1층 통과 대상 아님(코드 변경 없음; `junie --version` 출력 끝줄 `Junie version: 26.11.2 (4100.11)`) / 2층 해당 없음 / 3층 해당 없음
- 플레이어 눈: 해당 없음
- 점검한 규칙: Autonomy, GitCommit
- 가정한 것(🟡): 지침 파일은 문서 기준 `.junie/AGENTS.md` 로 정함. 설치가 `~/.local/bin` 에 쓰는 것은 ROADMAP 지시대로라 진행
- 물은 것(🔴): 없음
- INBOX 처리: 없음
- 다음: M0-09

## #0007 · 2026-11-21 · 조각 M0-07
- 계획: M0-07 WebStorm 헤드리스 검사 + `npm run inspect` / `app/scripts/inspect.mjs`, `app/package.json` — 고른 이유: ROADMAP M0 첫 `[ ]` (INBOX 처리할 줄 없음)
- 한 것: `inspect.sh` 가 창·로그인 없이 약 12초에 돎. 결과 JSON 을 세어 한 줄로 내는 스크립트를 만들어 `check` 끝에 연결. 중복 코드 검사는 dist 사본 잡음이라 세지 않게 함
- 커밋: 9ce8781
- 검사: 1층 통과(`npm run check` 끝줄 `INSPECT ok: 0 errors, 5 warnings`, jev SUPPORTED 0.73) / 2층 해당 없음 / 3층 해당 없음
- 합격 기준 중 실패: "안 쓰는 변수를 넣으면 경고 +1" — 지역 변수·미사용 import 를 넣어도 안 잡힘(+1 은 중복 코드 잡음이었음). 원인 미상(프로필엔 JSUnusedLocalSymbols·ES6UnusedImports 켜져 있음). 따라서 M0-07 은 부분 완료
- 플레이어 눈: 해당 없음
- 점검한 규칙: Verification, GitCommit
- 가정한 것(🟡): 중복 코드를 세지 않기로 함. 헤드리스 미사용 변수 미검출 원인 조사는 다음에(INBOX 확인)
- 물은 것(🔴): 없음
- INBOX 처리: 없음
- 다음: M0-08

## #0006 · 2026-11-21 · 조각 M0-06
- 계획: M0-06 `.idea` 공유 설정 / `.idea/` 아래 XML 8개 + .iml — 고른 이유: ROADMAP M0 첫 `[ ]` (INBOX 처리할 줄 없음)
- 한 것: 검사 프로필(JS/TS 켬·맞춤법 끔), 코드 스타일(2칸), npm dev·check·soak 실행 설정, 모듈(app/dist·node_modules 제외)
- 커밋: 아래 git log 참고
- 검사: 1층 통과(`find .idea -name '*.xml' | xargs xmllint --noout; echo rc=$?` → `rc=0`, jev SUPPORTED 0.79; 파일 8개) / 2층 해당 없음(설정 파일뿐, 코드 없음) / 3층 해당 없음(화면 아님)
- 플레이어 눈: 해당 없음
- 점검한 규칙: GitCommit, FolderStructure
- 가정한 것(🟡): soak 실행 설정은 ROADMAP 지시대로 만들었지만 `npm run soak` 스크립트는 M2-11 에서 생김 — 그 전엔 실행하면 실패. 실제 WebStorm 에서 불러지는지는 M0-07 에서 확인 필요(검증 못 함)
- 물은 것(🔴): 없음
- INBOX 처리: 없음
- 다음: M0-07

## #0005 · 2026-11-21 · 조각 M0-05
- 계획: M0-05 캡처 도구 / `app/scripts/shot.mjs`·`app/src/params.ts`·`params.test.ts` — 고른 이유: ROADMAP M0 첫 `[ ]` (INBOX 처리할 줄 없음). main.ts 는 없고 진입점이 index.ts 라 거기에 연결
- 한 것: playwright devDependency + chromium headless shell 설치, shot 스크립트(preview 기동→1920×1080 캡처→서버 종료), parseParams(seed·timescale·bot·state·at), eslint 에 scripts 전역 추가
- 커밋: 아래 git log 참고
- 검사: 1층 통과(`npm run check` 종료 코드 0, `✓ built in 41ms`, jev SUPPORTED 0.86) / 2층 통과(`Tests  10 passed (10)`, jev SUPPORTED 0.97) / 3층 통과(`captures/M0-05.png` 1920×1080 PNG 를 열어 봄: 어두운 남색 바탕 중앙에 CALLOUT RUSH 제목 글자 보임)
- 플레이어 눈: 해당 없음 (캡처 도구 조각, 화면은 아직 제목뿐)
- 점검한 규칙: GitCommit, CodingStyle, Verification
- 가정한 것(🟡): 없음
- 물은 것(🔴): 없음
- INBOX 처리: 없음
- 다음: M0-06

## #0004 · 2026-11-21 · 조각 M0-04
- 계획: M0-04 무대·글꼴·팔레트 / `app/src/ui/stage.ts`·`stage.test.ts`·`style.css` — 고른 이유: ROADMAP M0 첫 `[ ]` (INBOX 처리할 줄 없음)
- 한 것: fitStage·screenToStage·stageToScreen·insideStage 순수 함수, DESIGN §7 팔레트 CSS 변수, @fontsource/chakra-petch 5.3.0 (npm view 라이선스 `OFL-1.1`) 500·700 을 index·board 에 import
- 커밋: 아래 git log 참고
- 검사: 1층 통과(`npm run check` 종료 코드 0, 마지막 줄 `✓ built in 44ms`) / 2층 통과(`Tests  7 passed (7)`, jev SUPPORTED 0.98; 세 창 모서리 왕복 ≤ 1px 포함) / 3층 못 함(화면 연결은 후속 조각)
- 플레이어 눈: 해당 없음 (아직 보이는 조각 아님)
- 점검한 규칙: GitCommit, CodingStyle
- 가정한 것(🟡): 없음
- 물은 것(🔴): 없음
- INBOX 처리: 없음
- 다음: M0-05

## #0003 · 2026-11-21 · 조각 M0-03
- 계획: M0-03 CHECK 한 줄 / `app/package.json`·`eslint.config.js`·`src/smoke.test.ts` — 고른 이유: ROADMAP M0 첫 `[ ]` (INBOX 처리할 줄 없음)
- 한 것: eslint·@eslint/js·typescript-eslint·vitest 설치, `check` = tsc --noEmit && eslint . && vitest run && vite build. 더미 테스트 1개
- 커밋: 8ad2790
- 검사: 1층 통과(`npm run check` 종료 코드 0, 마지막 줄 `✓ built in 27ms`; 일부러 `const x: number = "a"` 넣으면 종료 코드 2 → 되돌림. 단 jev 는 이 인용에 NOT_SUPPORTED 0.12 — 판단 근거는 종료 코드) / 2층 통과(`Tests  1 passed (1)`, jev SUPPORTED 0.97) / 3층 못 함(화면 없음)
- 플레이어 눈: 해당 없음
- 점검한 규칙: GitCommit, CodingStyle
- 가정한 것(🟡): typescript 를 ^7 → ~6.0.3 으로 내림 (typescript-eslint 8.73 이 <6.1 만 지원, 설치가 ERESOLVE 로 막힘). TS 7 이 지원되면 올릴 것 — 감독 확인
- 물은 것(🔴): 없음
- INBOX 처리: 없음
- 다음: M0-04

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

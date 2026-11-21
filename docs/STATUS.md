# STATUS — 바퀴 기록

> 루프의 기억. **최근 것이 위.** 1200줄 넘으면 감독이 `loop/ctl.sh tidy` 로 오래된 것부터 `docs/archive/STATUS-YYYY-MM-DD.md` 로 옮긴다.
> 한 바퀴 = 아래 형식 한 덩어리. 검사는 층마다 **통과 / 실패 / 못 함** 중 하나로 (못 한 걸 통과라 쓰지 않는다).
> **"지금 상태" 는 일지가 아니라 현황판** — 15줄 이내, 덧붙이지 말고 바뀐 줄만 고쳐 쓴다 (25줄을 넘으면 루프 커밋이 거절된다). 한 일은 아래 바퀴 기록에. 감독이 직접 한 일도 `## #감독 · 날짜 · 요지` 덩어리로 아래에.

## 지금 상태 (루프가 매 바퀴 고쳐 씀, 감독이 바로잡을 수 있음)
- 마일스톤: M0 뼈대 끝(사람 5분 보기만 남음) · M1 한 판 완성 진행 중 — M1-98 끝(M1-13 건너뜀) · M2 진행 중 — M2-01~M2-11·M2-14·M2-17·M2-18·M2-19·M2-20·M2-98 끝 · M2-12 1000판 실행이 따로 돌고 있음(아래 #0038) · M3-01·M3-02·M3-07·M3-08·M3-09 끝
- 브랜치: develop
- 다음 조각: M2-12 판정(다음 바퀴: `logs/soak-run.log` 에 `exit=0` 이 있으면 `logs/soak.csv` 로 §6.4 4줄 판정 + `docs/soak-report.md`. 아직 돌고 있으면 남은 조각 M2-13·15·16 은 앞 조건 대기(판정 때 README 「Soak result」 줄도 채움). M1-13 은 JUNIE_API_KEY 오면 다시)
- 막힌 것: Junie 실제 실행은 JUNIE_API_KEY 대기(사람 할 일 3번, 다른 조각은 계속). (WebStorm 헤드리스는 사람 로그인 없이 돌았음 — 사람 할 일 1번은 사실상 불필요)
- 사람만 할 수 있는 것(`[!] 사람:`): 없음
- 사람 답 기다리는 것: 🔴 〔n〕개 / 🟡 가정 〔n〕개 / 안 채운 숫자 〔check_conventions R12 수〕개 (0 이어야 정상)
- 사람이 직접 해 본 마지막 마일스톤: 〔없음 / M1 (날짜)〕 — 감독이 적는다
- 감독이 눈으로 봐야 할 것(일꾼이 `못 함 — 감독` 으로 넘긴 칸): 없음

---

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

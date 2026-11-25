# Callout Rush — 로드맵

> **조각 하나 = 커밋 하나 = 10~30분.** 루프는 위에서부터 첫 `[ ]` 하나만 집는다. 조각 ID 는 바꾸지 않는다(커밋 꼬리말 `Slice: M0-02`).
> 표시: `[ ]` 할 일 · `[x]` 끝 · `[!]` 막힘(이유를 STATUS 에) · `[!] 사람:` 사람만 할 수 있는 일 — 루프는 건너뛰고 다음 조각으로 간다.
> 합격 기준에 숫자가 있으면 그 숫자를 재서 STATUS 에 적는다. 숫자의 뜻과 초기값은 `docs/DESIGN.md` §6 — 값을 바꾸면 §6 의 근거 칸도 같이 바꾼다.
> 마일스톤 끝에는 항상 두 조각: `M<n>-98 처음 하는 사람 통 플레이`(루프) → `[!] 사람: 🎮 M<n> 5분 해 보기`(사람, 마우스로 직접).
> 조각이 30분에 안 끝나면 쪼갠다: 끝난 부분만 커밋하고 남은 부분을 `M1-04b` 로 바로 아래에 적는다.

**이 프로젝트 공통**
- **마감: 한국시간 2027-01-13(수) 04:00** (= 01-12 11:00 PST). 사람 제출 목표는 01-11(월) 안.
- **날짜 계획:** M0 뼈대 ~11-25(수) · M1 한 판 완성 ~12-05(토) · M2 부스 기능+다듬기 ~12-22(화) · M3 제출 자료 ~01-08(금) · 버퍼 01-09~01-12. 날짜보다 늦으면 STATUS 맨 위에 `늦음: n일` 을 적고 「나중에」로 보낼 조각을 감독에게 묻는다(🔴).
- **앱 폴더:** `app/`. Node 는 `export PATH="/opt/homebrew/opt/node@24/bin:$PATH"` 를 먼저(v24.19.0).
- **CHECK (M0-03 에서 만들고 그 뒤 모든 조각의 합격 조건):** `cd app && npm run check` = `tsc --noEmit` → `eslint .` → `vitest run` → `vite build` → `npm run inspect`(M0-07 뒤부터). STATUS 에 출력 마지막 줄을 그대로 옮긴다. `INSPECT SKIPPED` 가 나오면 "검사 못 함: <이유>" 라고 쓴다 — 통과라고 쓰지 않는다.
- **화면 조각의 눈 검사:** `npm run shot -- <state> captures/<조각ID>.png`(1920×1080)로 찍고 **PNG 를 열어 보고** `docs/reference/<화면>.md` 와 대조한다. 대조 결과(맞음/다름 n곳)를 STATUS 에. `captures/` 는 git 에 안 올린다(제출용으로 고른 것만 `제출본/shots/`).
- **JetBrains 기록:** 검사가 문제를 찾았거나 Junie·Air 를 쓴 바퀴는 `docs/jetbrains-usage.md` 에 한 줄(영어) 추가 — 날짜·조각·도구·한 일·증거(커밋 해시·파일). 꾸며 쓰지 않는다.
- **언어:** 게임 안 글자·README·`docs/jetbrains-usage.md`·`AI_SHOWCASE.md`·`제출본/` = 영어. 나머지 문서·커밋 설명 = 한국어.
- **금지:** 사람 이름·이메일·개인정보를 문서·게임·커밋에 넣지 않는다. 게임·제출 글에 다른 게임·팀·회사 이름을 쓰지 않는다(JetBrains 도구 이름과 대회 이름은 제출 글에서만). 그림·소리 파일을 내려받지 않는다(전부 코드로 만든다). API 키·토큰을 커밋하지 않는다(`JUNIE_API_KEY` 는 환경변수). `git push --force`, `rm -rf` (`app/dist`·`app/node_modules`·`captures` 밖), 계정 만들기·로그인·제출·업로드는 하지 않는다.
- **막히면:** 같은 조각에서 CHECK 가 3번 연속 실패하면 `[!]` 로 바꾸고 이유를 적고 다음 조각으로.

## 사람이 먼저 할 일 (루프는 건너뛴다)
> 감독이 `brew install --cask webstorm jetbrains-air` 로 앱을 깔아 둔 뒤에 한다. 안 된 일이 있어도 루프는 다른 조각을 계속한다.
- [x] 대회 등록 완료(2026-11-21, Devpost). JetBrains 체험 코드는 등록 뒤 5영업일 안에 메일로 옴(~11/28) — 오면 아래 WebStorm 활성화로
- [!] 사람: WebStorm 처음 열기 → 약관 동의 → JetBrains 계정 로그인 → 받은 코드로 활성화(https://account.jetbrains.com/licenses) → 이 폴더를 열고 "Trust Project" → **창 닫기**(열려 있으면 루프의 검사가 안 돈다) — `/Applications/WebStorm.app` — 기다리는 조각: M0-07
- [!] 사람: Junie CLI 토큰 만들기 → 터미널 설정 파일(`~/.zshrc`)에 `export JUNIE_API_KEY=...` 한 줄(저장소 안에 적지 않기) — https://junie.jetbrains.com/cli — 기다리는 조각: M0-08
- [!] 사람: JetBrains Air 처음 열기 → 약관 동의 → 로그인 → 이 폴더 열기 — `/Applications/Air.app` — 기다리는 조각: M0-09
- [x] 감독: 저장소 `callout-rush` 만들고 `origin` 연결 — 2026-11-23 완료(지금은 비공개, `develop` push 됨, https://github.com/soilrist/callout-rush)
- [x] 감독: `callout-rush` 공개 전환 — 2026-11-23 완료, Pages 켬(워크플로 실행 45122873652 성공)

## M0 — 뼈대 (합격: 빈 화면이 뜨고, CHECK 한 줄이 돌고, JetBrains 도구 세 개의 "되는지/안 되는지"가 문서에 있다) · ~11-25
- [x] M0-00 설계서·로드맵 채우기 (감독, 2026-11-21)
- [x] M0-01 `.gitignore` 고치기 — `.idea/` 통째 무시를 지우고 `.idea/workspace.xml`·`.idea/shelf/`·`.idea/usage.statistics.xml`·`.idea/httpRequests/`·`.idea/dataSources*` 만 무시. `app/node_modules/`·`app/dist/`·`captures/`·`app/.inspect-out/` 추가. `**/[Bb]uild/` 처럼 `app/` 안 파일을 잘못 가리는 규칙이 있으면 뺀다. — 합격: `git check-ignore -v .idea/inspectionProfiles/x.xml` 이 아무것도 안 내고, `git check-ignore app/node_modules/x` 는 걸린다.
- [x] M0-02 Vite + TypeScript 앱 만들기 — `app/` 에 `npm create vite@latest`(vanilla-ts) 수준의 최소 구성, `tsconfig` `strict: true`, `vite.config.ts` 에 `base: './'` 와 입력 두 개(`index.html`·`board.html`), 화면엔 바탕색 `#0B1220` 과 글자 `CALLOUT RUSH`. — 합격: `npm run build` 가 `dist/index.html`·`dist/board.html` 을 낸다.
- [x] M0-03 CHECK 한 줄 만들기 — ESLint(typescript-eslint 권장 설정) + Vitest + `package.json` 의 `check` 스크립트(공통 블록 순서, inspect 는 아직 빼고). 더미 테스트 1개. — 합격: `npm run check` exit 0, 일부러 타입 오류를 넣으면 exit 1(확인 뒤 되돌림).
- [x] M0-04 무대·글꼴·팔레트 — `src/ui/stage.ts`: 1920×1080 논리 무대를 창에 비율 유지로 맞추고(기기 픽셀비 반영) 화면↔무대 좌표 변환 순수 함수. CSS 변수로 DESIGN §7 팔레트. 글꼴 Chakra Petch 를 `@fontsource/chakra-petch` 로 넣되 **패키지 이름과 OFL 라이선스를 npm 페이지에서 확인**, 안 되면 `system-ui` 로 두고 DESIGN §7 을 고친다. — 합격: CHECK + 테스트(1280×720·1920×1080·2560×1080 세 창에서 무대 모서리 좌표 왕복 오차 ≤ 1px).
- [x] M0-05 캡처 도구 — Playwright(chromium 만) 설치, `scripts/shot.mjs`: `vite preview` 를 띄우고 `?state=` 주소를 1920×1080 으로 찍어 PNG 저장, 끝나면 서버를 끈다. `main.ts` 에 주소 인자 읽기(`seed`·`timescale`·`bot`·`state`·`at`)의 뼈대. — 합격: `npm run shot -- attract captures/M0-05.png` 가 1920×1080 PNG 를 내고, 열어 보면 제목 글자가 보인다.
- [x] M0-06 `.idea` 공유 설정 — `.idea/inspectionProfiles/Project_Default.xml`(JS/TS 기본 검사 켬, 맞춤법 검사는 끔), `.idea/inspectionProfiles/profiles_settings.xml`, `.idea/codeStyles/`(들여쓰기 2칸, ESLint 와 같게), `.idea/runConfigurations/`(npm `dev`·`check`·`soak` 3개), `.idea/modules.xml`+`.iml`(제외 폴더: `app/dist`·`app/node_modules`). 파일 형식은 JetBrains 문서(https://www.jetbrains.com/help/webstorm/ 의 inspection profile·run configuration 절)를 읽고 맞춘다. — 합격: XML 4종 이상이 `xmllint --noout` 통과, `git status` 에 `.idea/` 파일이 추적 대상으로 보인다.
- [x] M0-07 (부분: 도구·스크립트 완료, "안 쓰는 변수 넣으면 +1" 역검증은 실패 — 헤드리스가 지역 변수·import 를 못 잡음. 원인 조사는 M2 전 `[ ]` 로 따로) WebStorm 헤드리스 검사 되는지 확인 + `npm run inspect` — DESIGN §9.1 의 명령을 실제로 돌려 본다(문서: https://www.jetbrains.com/help/webstorm/command-line-code-inspector.html). `scripts/inspect.mjs` 가 결과를 세어 `INSPECT ok: n errors, n warnings` 한 줄을 내고 `check` 끝에 붙는다. WebStorm 이 없거나·켜져 있거나·라이선스 창에서 멈추면 `INSPECT SKIPPED: <이유>` exit 0, 120초 넘으면 끊는다. 확인한 것(걸린 시간·라이선스 없이 도는지·출력 형식)을 `docs/jetbrains-usage.md` 첫 줄과 DESIGN §9.1 "확인 필요" 자리에 적는다. — 합격: 실제 실행 출력 마지막 5줄이 STATUS 에 있고, 일부러 안 쓰는 변수를 넣으면 경고 수가 1 늘어난다(되돌림). 못 돌렸으면 `[!]` + 이유(사람 할 일 2번을 기다림).
- [x] M0-08 (부분: 설치·버전·지침 파일 완료, 실제 작업 한 번 돌리기는 JUNIE_API_KEY 없어 못 함 — 사람 할 일 3번) Junie CLI 되는지 확인 — 문서(https://junie.jetbrains.com/docs/junie-headless.html)대로 설치하고 `junie --version`(또는 문서의 버전 확인 명령), 키가 있으면 `junie --auth="$JUNIE_API_KEY" --trust-project "List the files in app/src and say what each does"` 한 번. 지침 파일 위치(`.junie/` 안 파일 이름)를 문서에서 확인해 프로젝트 규칙(영어, DESIGN 요약 20줄)을 써 넣는다. 요금·무료 사용량을 문서에서 찾아 적는다. — 합격: `docs/jetbrains-usage.md` 에 실행 결과 한 줄 + `.junie/` 지침 파일 커밋. 키가 없으면 설치·지침 파일까지만 하고 `[!]`(사람 할 일 3번).
- [x] M0-09 (CLI 없음 확인, 사람 할 일로 남김) JetBrains Air 확인 — `/Applications/Air.app` 이 있는지, 명령줄 도구가 딸려 오는지(`ls /Applications/Air.app/Contents/MacOS /Applications/Air.app/Contents/Resources` 와 공식 문서 https://www.jetbrains.com/air/ 검색), 프로젝트를 열면 `.air/` 가 생기는지. — 합격: DESIGN §9.1 의 Air 줄 "확인 필요"가 사실로 바뀐다(되는 명령 / 안 됨). CLI 가 있으면 「나중에」의 "Air 로 조각 하나"를 M2 로 올리고, 없으면 사람 할 일(M2 끝)로 남긴다.
- [x] M0-10 `docs/jetbrains-usage.md` 틀 + README 뼈대 — 영어. usage 문서는 DESIGN §9.1 의 표 머리 + 맨 위 합계 칸. 루트 `README.md`: 한 줄 소개, Play(주소 자리), Run locally(`cd app && npm i && npm run dev`), Booth setup(자리), Built with JetBrains tools(usage 문서 링크). 루트 `LICENSE`(MIT 표준 문구, 저작권자 `Callout Rush contributors`). — 합격: 세 파일이 있고 사람 이름·이메일이 없다(`grep -iE "@|gdm" README.md LICENSE` 0건).
- [x] M0-11 화면 시트 만들기 — `docs/reference/` 에 `attract.md`·`play.md`·`result.md`·`board.md`·`operator.md`. DESIGN §7·§8 을 무대 좌표·글자 크기·색 이름으로 옮긴 표(요소 | x | y | w | h | 글자 px | 색). 남의 그림은 넣지 않는다. — 합격: 다섯 파일, 각 화면의 DESIGN §8.1 요소가 전부 표에 있다.
- [x] M0-98 뼈대 통 점검 — 깨끗이 받아서(`git clone` 을 임시 폴더에) `npm ci && npm run check` 가 되는지, `npm run dev` 화면 캡처. — 합격: 새 폴더에서 CHECK exit 0, 걸린 시간(초)을 STATUS 에.
- [!] 사람: 🎮 M0 5분 보기 — `cd app && npm run dev` 화면이 뜨는지(루프가 주소를 STATUS 에 적어 둔다), `docs/jetbrains-usage.md` 를 읽고 세 도구 상태 확인 — 계속 / 고쳐

## M1 — 한 판 완성 (합격: 대기 화면 클릭 → 3·2·1 → 60초 → 결과 숫자 → 다시 대기 화면이 사람 손과 봇 둘 다로 된다) · ~12-05
- [x] M1-01 설정·구역 데이터 — `core/config.ts`(DESIGN §6 의 값 전부, 이름 그대로) + `core/zones.ts`(§5.1 표 12개) + `zoneAt(x, y)` 순수 함수. — 합격: CHECK + 테스트(구역 12개 · 서로 안 겹침 · 간격 ≥ 20 · 맵 안 · 각 구역 가운데가 자기 ID · 빈 땅 5점이 `null`).
- [x] M1-02 난수·콜 생성 — `core/rng.ts`(mulberry32) + `core/calls.ts` `nextCall(rng, phase, recent)`: §4.3 규칙(인원 비율, 최근 2개 제외, 단계 3 두 곳 50%, 문장 만들기). — 합격: CHECK + 테스트(같은 시드 = 같은 순서 · 1만 번 뽑아 인원 비율 50/35/15 ±2%p · 최근 2개와 안 겹침 · 두 곳 콜의 두 구역이 다름 · 문장이 §5.2 틀과 일치).
- [x] M1-03 점수 함수 — `core/scoring.ts`: §4.4 공식(`points`·`mult`·`grade`·정확도·평균 반응). — 합격: CHECK + 테스트(rt 300 → 만점 · rt = T → 절반 · 연속 10 이상 배수 2.0 · 등급 경계 5곳 · 목표 0개일 때 0%).
- [x] M1-04 게임 리듀서 — `core/game.ts` `initGame(seed)`·`step(state, event)`: 단계 전환, 콜 띄우기, 정답·오답·시간 초과, 두 곳 순서, `CALL_GAP_MS` 동안 클릭 무시, 60초 끝. 시계·난수는 인자로. — 합격: CHECK + 테스트 10개 이상(§4.2 규칙·예외 줄마다 하나) + 같은 시드·같은 입력이면 최종 상태가 같다.
- [x] M1-05 봇 — `core/bot.ts`: §5.3 프로필 3개, `decide(state, rng)` 가 언제·어디를 누를지 돌려준다. `simulate(profile, seed)` 는 화면 없이 한 판을 돌린다. — 합격: CHECK + 테스트(1000판 평균 정확도가 프로필 값 ±3%p, 판마다 끝 상태가 `done`).
- [x] M1-06 맵 그리기 — `ui/map.ts`: Canvas 2D 로 12구역(채움·테두리·§5.1 그림 무늬)·바닥 선·이름표. 이름표 투명도 인자. — 합격: CHECK + 캡처 `play` 를 열어 `reference/play.md` 와 대조(구역 12개가 다 보이고 이름표가 구역 밖으로 안 나감).
- [x] M1-07 HUD — `ui/hud.ts`: 시간 막대·남은 초·단계 이름·콜 카드(두 줄 포함)·콜 제한 시간 막대·점수·연속·지난 콜 3개(§8.2 좌표). — 합격: CHECK + 캡처 2장(`?state=play&at=5000`, `&at=45000` 두 곳 콜)을 열어 시트와 대조, 가장 긴 문장(`Container Row, then Loading Dock!`)이 카드 밖으로 안 나감.
- [x] M1-08 입력 연결·게임 루프 — `pointerdown` → 무대 → 맵 좌표 → `step`. `requestAnimationFrame` 루프 하나가 `TICK` 을 보낸다. 우클릭·드래그·선택 막기, 커서 십자. — 합격: CHECK + Playwright 테스트(시드 고정, 정답 구역 가운데를 누르면 점수가 오르고 빈 땅을 누르면 연속이 0).
- [x] M1-09 판정 연출 — 정답 초록 번쩍 + 떠오르는 `+점수`·`0.61s` + 인원 점, 오답 주황 X + 흔들림 + 정답 구역 테두리 600ms, 단계 전환 글자 번쩍, 이름표 2초 사라짐. — 합격: CHECK + 캡처 3장(정답 직후·오답 직후·`at=16000` 이름표 반투명)을 열어 확인.
- [x] M1-10 소리 — `audio/sfx.ts`: §5.5 여덟 가지를 WebAudio 로 합성, 첫 클릭에 `AudioContext` 시작, 음소거 값. 소리 노드는 끝나면 `disconnect`. — 합격: CHECK + 테스트(각 소리 함수가 오류 없이 돌고 `OfflineAudioContext` 로 렌더한 버퍼의 최대값 > 0.05, 길이가 표의 ±20ms).
- [x] M1-11 화면 흐름 — `ui/flow.ts` 상태 기계: Attract → Countdown → Play → Result(숫자만, 이니셜은 M2) → Attract. `?state=`·`?bot=`·`?timescale=` 연결. 판 시작 때 상태를 새로 만든다. — 합격: CHECK + Playwright(`?bot=regular&timescale=30` 으로 3판 연속 → 세 번 다 Result 를 지나 Attract 로 돌아옴, 콘솔 오류 0).
- [x] M1-12 숫자 맞추기 — `scripts/balance.mjs`: 봇 3종 × 1000판 → 점수 중앙값·10%·90%, 콜 수, 정확도. 결과로 DESIGN §6.2 의 "예상 점수"·등급 경계, §6.3 의 "예상 콜 수"를 **잰 값으로 바꾸고 근거 칸에 날짜·명령을 적는다**. 목표: rookie 중앙값 = ENTRY, regular = ANCHOR 또는 SHOT CALLER, pro = IGL, 봇 셋의 중앙값이 서로 1,500점 이상 차이. — 합격: CHECK + §6 표가 고쳐졌고 `config.ts` 와 값이 같다(테스트로 묶음).
- [!] (건너뜀: JUNIE_API_KEY 없음 — 사람 할 일 3번, 키 생기면 다시 `[ ]`) M1-13 Junie 에게 조각 하나 맡기기 — `junie --auth="$JUNIE_API_KEY" --trust-project "Review app/src/core for edge cases the tests miss; add the missing Vitest cases; do not change behaviour"`. 결과를 읽고 CHECK 가 통과하면 꼬리말 `Tool: Junie` 로 커밋, 틀린 테스트는 빼고 이유를 적는다. — 합격: 테스트 수가 늘었고 `docs/jetbrains-usage.md` 에 한 줄(추가된 테스트 수·찾은 버그 수). Junie 를 못 쓰면 `[!]` + 이유(건너뜀).
- [x] M1-98 처음 하는 사람 통 플레이 — 소리·연출 켠 실제 속도(`timescale=1`)로 `?bot=rookie` 한 판을 Playwright 로 녹화(video)하고 5초마다 캡처 12장을 **열어 보며** PlayerEye 다섯 칸을 채운다(설명 없이 뭘 해야 하는지 보이나 · 105px 구역을 급히 눌러도 맞나 · 콜 카드에서 맵으로 눈이 가나 · 장르 상식 · 갇힘 없음). 찾은 문제는 바로 아래에 `M1-99a…` 조각으로 적는다. — 합격: STATUS 에 다섯 칸 + 한 사람 총 시간(초) ≤ 95.
- [!] 사람: 🎮 M1 5분 해 보기 — `cd app && npm run dev` 로 3판. 볼 것: ① 설명 없이 바로 알았나 ② 콜이 너무 빠르거나 느린가 ③ 이름표 사라질 때 재미있나 짜증 나나 ④ 내 점수·등급(루프가 §6 맞추는 데 씀) — 계속 / 고쳐(무엇을)

## M2 — 부스 기능 + 다듬기 (합격: 이니셜·오프라인 순위표·보조 모니터·자동 초기화가 되고, 1000판 내구 보고서가 합격선 안이고, 공개 주소가 열린다) · ~12-22
- [x] M2-01 점수 저장소 — `core/scores.ts`: `add`·`today(now)`·`allTime`·`rankToday`·`prune`(500건), 저장 어댑터(localStorage / 메모리). §4.8 예외 전부. — 합격: CHECK + 테스트(동점은 먼저 낸 쪽 · 자정 넘기면 오늘 목록이 빔 · 깨진 JSON → `.bad` 로 옮기고 빈 목록 · 저장 실패 → 메모리로 계속 · 600건 넣으면 500건이고 오늘 것은 다 남음).
- [x] M2-02 이니셜 입력 — 결과 화면에 3칸 + A~Z 글자판(84×84) + `⌫` + `OK`, 키보드 입력도, 20초 막대 → `---`, 금지 목록 → `***`(`core/initials.ts`). — 합격: CHECK + 테스트(금지어·소문자·4글자째 무시) + 캡처 `result` 를 열어 시트와 대조.
- [x] M2-03 결과 화면 다듬기 — 점수 카운트업 0.8초, 등급 등장 + 소리 S7, `#n TODAY`, 오늘 1등이면 금색 `NEW #1 TODAY`(§5.8 에 문구 추가). — 합격: CHECK + 캡처 2장(보통 / 1등)을 열어 확인.
- [x] M2-04 게임 창 순위 화면(S5) — 오늘 TOP 10, 내 줄 강조, 10등 밖이면 `#n YOU`, 8초 뒤 또는 클릭으로 Attract. — 합격: CHECK + Playwright(점수 12개를 심고 한 판 → 내 줄이 강조돼 있음) + 캡처 대조.
- [x] M2-05 보조 모니터 화면 — `board.html`+`src/board.ts`: §4.6 내용, BroadcastChannel + `storage` 이벤트 + 5초 다시 읽기, 새 기록 금색 3초·미끄러짐. — 합격: CHECK + Playwright(창 두 개: 게임 창에서 한 판 끝 → 보조 창에 새 줄이 1000ms 안에 나타남, 지연 ms 를 STATUS 에) + 캡처 `board` 대조(줄 높이 ≥ 80px).
- [x] M2-06 대기 화면 완성 — 제목·한 줄 설명·깜빡이는 `CLICK TO PLAY`·오늘 TOP 3, 20초 뒤 뒤에서 봇 시연(`DEMO`, 소리 없음, 저장 안 함), 클릭하면 즉시 새 판. — 합격: CHECK + Playwright(`timescale=30` 으로 시연이 시작되고, 시연 중 클릭 → Countdown, 시연 점수는 저장 0건) + 캡처 대조.
- [x] M2-07 무입력·자동 초기화 — 플레이 12초 무입력 → 버리고 Attract, 탭 숨김 → 버림, 판 끝에 타이머·rAF·리스너·소리 노드 정리. 개발용 `window.__health()` 가 살아 있는 타이머 수·DOM 노드 수·리스너 수를 돌려준다. — 합격: CHECK + Playwright(5판 뒤와 25판 뒤 `__health()` 의 세 숫자가 같음).
- [x] M2-08 운영자 메뉴 — `Ctrl+Shift+O`: §4.7 여섯 항목 + Booth health 숫자. CSV 내보내기는 `Blob` 내려받기. 오늘 기록 지우기는 확인 한 번. — 합격: CHECK + Playwright(메뉴 열기 → 지우기 → 오늘 0건 · 전체 기록은 그대로 · CSV 줄 수 = 기록 수 + 1) + 캡처 `operator` 대조.
- [x] M2-09 안 죽게 — `window.onerror`·`unhandledrejection` → 오류 수 +1, 3초 뒤 새로 고침. `navigator.wakeLock`(되면). 전체 화면 버튼. — 합격: CHECK + Playwright(일부러 예외를 던지면 5초 안에 Attract 로 돌아오고 점수 목록은 그대로).
- [x] M2-10 오프라인 — `public/sw.js`: 빌드 산출물 전부를 미리 저장(파일 목록은 빌드 때 만든다), 새 버전이면 바꿔 끼움. — 합격: CHECK + Playwright(한 번 연 뒤 `context.setOffline(true)` 로 새로 고침 → 한 판이 끝까지 되고 보조 창도 열림, 네트워크 요청 실패 0).
- [x] M2-11 내구 도구 — `scripts/soak.mjs`(`npm run soak -- --games 1000 --timescale 30`): 봇이 대기 화면부터 이니셜·순위까지 매 판 전부 지나가고, 50판마다 CDP `HeapProfiler.collectGarbage` 뒤 JS 힙·DOM 노드 수·프레임 p95·저장 크기·콘솔 오류 수를 CSV 로. 먼저 50판으로 돌려 본다. — 합격: 50판 실행이 끝나고 CSV 에 줄이 1개 이상, 걸린 시간으로 1000판 예상 시간을 STATUS 에.
- [x] M2-12 1000판 내구 실행 + 보고서 — 실행해 `docs/soak-report.md`(영어: 기기·브라우저 버전·명령·표·합격선 대비 결과·작은 SVG 그래프 1개). — 합격: DESIGN §6.4 내구 4줄 전부 통과(힙 증가 %, DOM ±0, p95 ms, 오류 0 — 잰 값을 STATUS 와 §6.4 근거 칸에). README 「Soak result」 줄도 잰 숫자 3개로 채운다. 하나라도 넘으면 `[!]` 로 두지 말고 원인을 고치는 조각 `M2-12a` 를 만들고 다시 돌린다.
- [x] M2-13 실제 속도 60분 — `npm run soak -- --minutes 60 --timescale 1`(약 40판, 백그라운드로 돌리고 다음 조각을 먼저 해도 됨). 보고서에 절 하나 추가. — 합격: 60분 동안 오류 0, 프레임 p95 ≤ 20ms, 처음 5분과 마지막 5분의 힙 차이를 적는다.
- [x] M2-14 WebStorm 검사로 고치기 한 바퀴 — `npm run inspect` 의 경고 목록 전체를 읽고 고칠 것은 고치고, 일부러 남기는 것은 프로필에서 끄고 이유를 한 줄. — 합격: 경고 수 앞·뒤를 `docs/jetbrains-usage.md` 에(예 `23 → 2`), CHECK 통과. 검사를 못 돌리는 상태면 `[!]`.
- [!] (JUNIE_API_KEY 대기 — 사람: https://junie.jetbrains.com/tokens) M2-15 Junie 에게 리뷰 맡기기 — `junie … "Review app/src/ui for leaks: timers, listeners, audio nodes, canvas state that survive a game reset. Report file:line and fix what is safe."` 결과를 검토해 반영, 꼬리말 `Tool: Junie`. — 합격: usage 문서에 한 줄(찾은 것 n · 고친 것 n) + M2-07 의 `__health()` 테스트가 그대로 통과. 못 쓰면 `[!]`.
- [x] (감독 2026-11-23: 공개·배포 끝, `https://soilrist.github.io/callout-rush/` 와 `board.html` 둘 다 200 확인 — 남은 일은 주소를 README·STATUS 에 적고 합격 명령 인용) M2-16 공개 주소 — `.github/workflows/pages.yml`(Node 24, `npm ci && npm run build`, `app/dist` 를 Pages 로). 원격 저장소가 있으면 푸시하고 주소를 README·STATUS 에. — 합격: `curl -sI <주소>` 200, `<주소>board.html` 200. 원격이 없으면 워크플로 파일만 커밋하고 `[!]`(사람 할 일 5번).
- [x] M2-17 zip — `scripts/zip.mjs`: `dist` + `serve.mjs`(Node 내장 `http` 만 쓰는 정적 서버, 포트 4173) + `start.command`·`start.bat` + `README.txt`(영어 5줄: Node 필요, 더블클릭, 주소, 보조 창 여는 법) → `제출본/callout-rush-web.zip`. — 합격: 임시 폴더에 풀어 `node serve.mjs` 로 띄우고 Playwright 로 한 판이 끝까지 됨, zip ≤ 1MB.
- [x] M2-18 다듬기 1 — 눈 — 모든 화면 캡처 7장을 나란히 열어 보고 글자 크기·여백·색이 시트와 다른 곳, 글자가 잘리는 곳을 고친다. 1280×720·2560×1080 창에서도 한 장씩. — 합격: 다른 곳 목록(앞)과 고친 뒤 0곳(뒤)을 STATUS 에.
- [x] M2-19 다듬기 2 — 손 — 실제 속도 통 플레이 캡처를 보며 "맞혔는지 0.1초 안에 알 수 있나", "콜이 바뀐 걸 놓치지 않나"만 본다. 연출 시간·소리 크기 조정은 `config.ts` 에서만. — 합격: 바꾼 값과 이유를 DESIGN §6 에.
- [x] M2-20 README 완성 — 영어: 소개 + 화면 그림 2장(`제출본/shots/`), Play online, Download zip, **Booth setup(5단계: 열기 → 운영자 메뉴 → 보조 창을 둘째 모니터로 → 전체 화면 → 끝)**, How it works(폴더 지도), Testing(`npm run check`·`npm run soak`, 내구 결과 숫자 3개), Built with JetBrains tools(도구별 2줄 + usage 문서 링크), License. — 합격: README 의 명령을 새 폴더에서 그대로 따라 해 전부 된다.
- [x] M2-98 처음 하는 사람 통 플레이 — 공개 주소(없으면 `vite preview`)에서 창 두 개로: 대기 → 한 판 → 이니셜 → 순위 → 보조 창 갱신 → 대기 → 12초 방치 → 대기. 실제 속도, 캡처를 열어 PlayerEye 다섯 칸 + "다음 사람이 깨끗한 판을 받나". — 합격: STATUS 에 다섯 칸, 한 사람 시간(초), 보조 창 갱신 지연(ms).
- [!] 사람: 🎮 M2 5분 해 보기 — 공개 주소(STATUS 에 적힘)를 열고 `Ctrl+Shift+O` → `Open leaderboard window` → 2판 하고 이니셜 넣기. 볼 것: ① 순위표에 바로 뜨나 ② 그냥 두면 대기 화면으로 가나 ③ 부스에 그대로 놓아도 되겠나 — 계속 / 고쳐(무엇을)
- [!] 사람: (M0-09 에서 Air CLI 가 없다고 나온 경우만) JetBrains Air 앱에서 이 폴더를 열고 에이전트에게 한 줄 시키기: `Add a unit test for scores.prune() edge cases in app/src/core` → 결과 화면 캡처 1장을 `제출본/shots/air.png` 로, 바뀐 파일은 그대로 두기(루프가 검사 후 커밋) — `/Applications/Air.app` — 10분

## M3 — 제출 자료 (합격: `제출본/` 에 영어 글 4개·자막·영상 초안·그림·zip 이 있고, 사람이 붙여 넣기만 하면 된다) · ~01-08
- [x] M3-01 JetBrains 사용 합계 — `docs/jetbrains-usage.md` 맨 위 합계를 `git log`·문서 줄 수로 다시 센다(검사 실행 수·찾은 문제·고친 문제·Junie 커밋 수·Air 사용). `.idea`·`.junie`(·`.air`) 가 원격에 올라가 있는지 확인. — 합격: 합계의 숫자마다 세는 명령이 문서에 같이 적혀 있다.
- [x] M3-02 제출용 그림 — 시드 고정으로 `제출본/shots/` 에 6장(대기·플레이 단계 1·플레이 단계 3 두 곳 콜·결과·보조 순위표·운영자 메뉴) + 대표 그림 1장(3:2, 제목 포함). — 합격: 7장을 열어 보고 글자 잘림 0, 다른 게임·회사 이름 0.
- [x] M3-03 영상 대본·자막 — `제출본/video-script.md`(영어, 170초 이하, 장면 표: 시각 | 화면 | 자막). 순서: ① 문제(부스: 줄·와이파이·하루 종일) 10초 ② 한 판 통째(pro 봇, 실제 속도 60초를 40초로 편집하지 말고 그대로 — 단계 3개가 다 보이게) ③ 결과·이니셜·보조 모니터 갱신 20초 ④ 자동 초기화·대기 화면 10초 ⑤ 내구 숫자(1000판, 힙·p95·오류) 15초 ⑥ JetBrains: 검사 실행 화면·`.idea`·Junie 커밋·usage 표 30초 ⑦ 주소·라이선스 10초. `captions.srt` 도. — 합격: 자막 시각 합 ≤ 170초, 숫자는 전부 보고서·usage 문서의 값과 같다.
- [x] M3-04 (소리 없음 — 헤드리스 녹화는 효과음을 못 담음, 🟡 확인 남김) 영상 초안 만들기 — Playwright `recordVideo`(1920×1080)로 장면별 webm 을 찍고 `ffmpeg` 로 이어 붙여 자막을 입힌 `제출본/demo-draft.mp4`(소리는 게임 효과음만, 음악 없음). `ffmpeg` 가 없으면 장면별 webm + `captions.srt` 만 내고 감독에게 🟡. — 합격: `ffprobe` 길이 < 180초, 1920×1080, 첫·가운데·끝 프레임을 뽑아 열어 봄. git 에는 안 올린다.
- [x] M3-05 Devpost 설명 — `제출본/devpost.md`(영어): Inspiration(부스 문제 셋) · What it does · **How we built it — JetBrains tools**(도구별 소제목: 무엇을 맡겼고, 숫자, 증거 파일 링크) · Challenges · Accomplishments(내구 숫자) · What we learned · What's next · Try it(주소·zip·부스 설치 5단계). 심사 기준 5개마다 한 문단이 답하게. — 합격: 600~900 단어, 숫자 8개 이상이 전부 문서 근거와 같음, 다른 게임 이름 0(`grep` 으로 확인할 낱말 목록을 조각 안에 적는다).
- [x] M3-06 방법론 글 — `제출본/methodology.md`(영어 400~600 단어): 접근(순수 함수 리듀서 + 봇 하나로 테스트·숫자 맞추기·시연·내구를 다 한다), 카테고리 요구 ↔ 기능 표(한 판 3분 미만 · 즉시 이해 · 깨끗한 초기화 · 반응성 · 실력 · 로컬 리더보드), 한계 솔직히. — 합격: 표 6줄 전부에 증거(파일·숫자).
- [x] M3-07 보너스 글 — 루트 `AI_SHOWCASE.md`(영어 500~800 단어, Best AI-Powered Workflow Story): 30분 조각 루프가 어떻게 돌았나, WebStorm 검사가 관문으로 잡은 실제 문제 2~3개(앞·뒤 코드 조각), Junie 가 한 조각, Air, 잘 안 된 것. 그림 2장. — 합격: 적힌 사례마다 커밋 해시가 있고 그 커밋이 실제로 있다(`git cat-file -e`).
- [x] M3-08 제출 칸 채우기표 — `제출본/submit-checklist.md`(한국어): Devpost 제출 화면의 칸 순서대로 "칸 이름 | 붙여 넣을 내용 또는 파일 | 비고". 카테고리 = Category 3 Event Mini Game, 저장소 주소, 데모 주소, 영상 주소(자리), 보너스 URL = `AI_SHOWCASE.md` 의 GitHub 주소, 쓴 JetBrains 도구 체크. 규정 점검 12줄(공개 저장소·LICENSE·About 표시·영어·영상 3분 미만·영상에 실제 기기 화면·저작권 음악 없음·제3자 상표 없음·데모 무료 접근 02-04 까지 유지 등). — 합격: 점검 줄마다 확인 명령·결과가 적혀 있다.
- [x] M3-09 금지 낱말·개인정보 훑기 — 저장소 전체(`app/src`·`README`·`AI_SHOWCASE`·`제출본`·`docs`)에서 다른 게임·팀·회사 이름, 사람 이름·이메일, 키 모양 문자열을 `grep` 으로. 낱말 목록은 `scripts/forbidden.txt`. `git log --format='%an %ae' | sort -u` 도 확인해 결과를 감독에게(🟡). — 합격: 게임·제출 글에서 0건(JetBrains 도구 이름·대회 이름은 제출 글에서만 허용).
- [x] M3-10 릴리스 — 태그 `v1.0.0`, `제출본/callout-rush-web.zip` 을 새로 만들어 GitHub 릴리스에 첨부(`gh release create`), 저장소 About 에 설명·주소·주제어. 원격이 없으면 `[!]`. — 합격: 릴리스 주소 200, zip 을 내려받아 풀어 한 판이 됨, GitHub 가 라이선스를 MIT 로 표시(`gh repo view --json licenseInfo`).
- [x] M3-98 처음 하는 사람 통 점검 — 심사위원처럼: Devpost 글을 위에서부터 읽으며 링크를 전부 눌러 보고(주소·zip·저장소·usage 문서·보고서), 영상 초안을 처음부터 끝까지 프레임 12장으로 확인, 로그아웃된 브라우저(새 Playwright 컨텍스트)에서 공개 주소로 한 판. — 합격: 죽은 링크 0, 글의 숫자와 문서의 숫자 불일치 0.
- [!] 사람: 🎮 M3 5분 보기 — `제출본/demo-draft.mp4` 를 끝까지 보고, 공개 주소에서 1판 — 계속 / 고쳐(무엇을)
- [!] 사람: YouTube 에 영상 올리기(공개, 제목 `Callout Rush — 60-second callout reaction trainer`, 자막 파일 `제출본/captions.srt` 첨부) — https://studio.youtube.com/ — 주소를 `제출본/submit-checklist.md` 에 적기
- [!] 사람: Devpost 제출 — `제출본/submit-checklist.md` 를 보며 칸마다 붙여 넣기, 대표 그림·그림 6장 올리기, **01-11(월) 안에** Submit — https://cloud9.devpost.com/ — 제출 뒤에도 마감 전까지 고칠 수 있는지 화면에서 확인
- [!] 사람: 심사 끝(한국 2027-02-04)까지 저장소를 공개로 두고 Pages 주소를 끄지 않기 — https://github.com/ (저장소 Settings → Pages)

## 나중에 (순서 안 정함)
- 콜을 사람 목소리로(라이선스가 분명한 녹음 또는 합성) — 지금은 글자 + 합성 무전음.
- JetBrains Air CLI 로 조각 하나(M0-09 에서 CLI 가 확인되면 M2 로 올린다).
- 맵 둘째 장, 날마다 바뀌는 시드("오늘의 콜 순서").
- 2인 번갈아 하기(같은 시드로 겨루기).
- 순위표 QR(내 결과 그림 저장).
- 색각 이상 팔레트(초록·주황 대신 모양으로 구분은 이미 함: 번쩍 vs X).
- 터치 키오스크 전용 큰 글자판.

## M4 — 감독 검수 보강 (합격: 영상 초안에 소리와 진짜 순위 저장 장면이 있고, 이름표가 꺼져도 구역이 또렷하고, 문서의 낡은 줄이 0) · ~12-20
- [x] M4-01 구역 윤곽 또렷하게 — `app/src/ui/map.ts` 의 구역 테두리 색을 배경 `#0b1220` 과 명도 대비 3:1 이상으로 올린다(지금 채움 약 1.3:1 — 이름표가 꺼지는 LIVE·CLUTCH 에서 밝은 부스 조명이면 거의 안 보임). 채움·글자 색은 그대로, 테두리와 안쪽 그림 선만. — 합격: 대비를 계산하는 테스트 1개(색 상수 → 비율 ≥ 3) + CHECK + LIVE 단계 캡처를 열어 구역 12개가 다 보임 + `docs/reference/play.md` 색 줄 갱신
- [x] M4-02 효과음 시각 기록 — 녹화 때 어떤 효과음이 몇 초에 났는지 남긴다: `sfx.ts` 의 재생 함수 한 곳에 `window.__sfxLog`(있을 때만 push, 없으면 아무 일 없음) 를 달고 `videorec.mjs` 가 켜서 `captures/tmp/video/sfx.json`(`{t, id, opts}`, t = 녹화 시작 기준 초) 을 쓴다. — 합격: CHECK + 한 판 로그에 `radio`·`hit`·`count`·`phase`·`end` 가 다 있고 콜 수와 `radio` 수가 맞음
- [ ] M4-03 효과음 소리줄 만들기 — `sfx.json` 을 `OfflineAudioContext` 로 한 번에 그려 `captures/tmp/video/sfx.wav`(48kHz). `sfxrender.mjs` 방식과 `scheduleSfx` 를 그대로 쓴다(새 라이브러리 금지). — 합격: 최대 음량 -1 dBFS 이하·무음 아님을 `ffmpeg -af volumedetect` 출력으로 인용
- [ ] M4-04 순위 장면 진짜로 녹화 — `videorec.mjs` 에서 결과 화면 뒤 이니셜 3글자(`ACE`)를 실제 키보드로 넣고 `OK` → 게임 창 순위와 `board.html` 창 둘 다에 새 줄이 뜨는 것까지 녹화(봇 때문에 화면이 넘어가면 결과부터 사람 입력으로). 넣은 시각·줄이 뜬 시각을 `log.json` 에. 지금 초안은 이 장면이 그림 2장이고 그 그림에 방금 낸 점수 줄이 없어서 자막 「your row appears」 와 안 맞음. — 합격: 두 창의 DOM/캔버스 데이터에 `ACE` 줄이 있는지 스크립트가 확인하고 실패면 exit 1 + 두 창 캡처를 열어 봄
- [ ] M4-05 영상 초안 다시 조립 — `videobuild.mjs`: 장면 3 을 M4-04 녹화(왼쪽 게임 창 · 오른쪽 보조 창 나란히)로, 장면 4 는 그 뒤 실제 대기 화면으로, M4-03 소리를 장면 1~4 에 얹고(문서 카드 장면은 무음), 순위표에 심은 이름 옆 또는 자막에 `sample scores` 라고 밝힌다. 전체 165초 이하, 자막 파일 두 개와 `video-script.md` 시각표도 같이 고친다. — 합격: `ffprobe` 로 영상·소리 두 줄과 길이 인용 + 12프레임 시트를 열어 자막과 화면이 맞는지 장면마다 한 줄
- [ ] M4-06 낡은 문장 걷어내기 — `docs/jetbrains-usage.md` 의 `Remote check: this repository has no remote yet …` 을 공개 저장소·Pages 사실로 바꾸고, `README.md`·`AI_SHOWCASE.md`·`제출본/*.md` 에서 같은 부류(아직 없음·자리표시·`TODO`·옛 테스트 수)를 `grep` 으로 훑어 고친다. Junie 커밋 수는 실제 값(0)을 그대로 둔다. — 합격: grep 출력 0 인용 + 숫자마다 원본 파일 줄 확인
- [ ] M4-07 1분 안에 이해되나 — 처음 온 사람 눈으로 공개 주소와 같은 빌드를 1366×768 과 1920×1080 두 크기에서 켜서 대기 화면 → 한 판 → 이니셜 → 순위까지 **마우스만으로** 해 보고(Playwright 실제 클릭), 헷갈린 곳을 고친다. — 합격: 두 크기 캡처 각 4장을 열어 봄 + 잘림·겹침 0 + 고친 것 또는 "고칠 것 없음" 근거
- [ ] M4-98 심사위원 통 점검 — 심사 기준 5칸(DESIGN §1 표)마다 "어느 파일·몇 초 장면이 증거인가" 를 표로 `docs/judge-map.md`(영어)에 쓰고, 증거가 약한 칸 하나를 골라 고친다. zip 을 다시 만들고 CHANGELOG 한 줄. — 합격: CHECK + ZIPCHECK + 표의 링크가 전부 있는 파일
- [!] 감독: M4 검수 — 영상을 소리와 함께 보고, 통과면 push·릴리스 v1.0.1 올리고 사람 5분 보기 칸으로 넘긴다

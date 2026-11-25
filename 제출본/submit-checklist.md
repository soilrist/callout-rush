# 제출 칸 채우기표 (Devpost · Cloud9 × JetBrains)

> 제출·계정·폼 입력은 사람이 한다. 이 표는 칸 순서대로 "무엇을 붙여 넣나"만 적는다. 확인일 2026-11-21.
> 마감: 한국시간 2027-01-13(수) 04:00. 목표는 01-11(월) 안. 마감 뒤 수정 불가, 임시저장 가능.
> 사람이 해야 해서 아직 못 채운 것만 `사람` 으로 표시했다.

## A. Devpost 제출 화면 칸

| 칸 이름 | 붙여 넣을 내용 또는 파일 | 비고 |
|---|---|---|
| Project name | `Callout Rush` | 영어 |
| Tagline | `Read the call. Click the spot. 60 seconds, built for a trade-show booth.` | README 첫 줄과 같게 |
| Category | **Category 3 — Event Mini Game** | |
| Built with | TypeScript, Vite, Canvas, Web Audio, Vitest, Playwright, WebStorm, Junie, JetBrains Air | 실제로 쓴 것만: Junie·Air 는 usage 문서에서 실행 0회 → 쓴 도구 체크는 usage 문서의 합계표대로(M3-05 에서 정함) |
| About / 설명 | `제출본/devpost.md` 전체 | 파일 있음(M3-05) |
| Methodology | `제출본/methodology.md` | 파일 있음(M3-06). 칸이 따로 없으면 설명 끝에 붙임 |
| Demo video URL | YouTube 공개 주소 | 사람 — 초안 `제출본/demo-draft.mp4`(126.3초)를 사람이 YouTube 에 올려 주소를 붙임 |
| Public code repository | GitHub 공개 저장소 주소 | `https://github.com/soilrist/callout-rush` (공개) |
| Working build / demo link | GitHub Pages 주소 (`<주소>/` 와 `<주소>/board.html`) | `https://soilrist.github.io/callout-rush/` 와 `board.html` 둘 다 200. 심사 끝(한국 2027-02-04 08:00)까지 무료·로그인 없이 |
| Downloadable build | `제출본/callout-rush-web.zip` (약 66KB) | 파일 있음. 릴리스에 올릴지는 사람이 정함 |
| Screenshots / image gallery | `제출본/shots/0-cover.png`(표지) → `1-attract.png` → `2-play-stage1.png` → `3-play-stage3.png` → `4-result.png` → `5-board.png` → `6-operator.png` | 파일 있음. 7장 |
| Bonus: Best AI-Powered Workflow Story URL | 저장소의 `AI_SHOWCASE.md` 직접 주소: `<저장소 주소>/blob/develop/AI_SHOWCASE.md` | 파일 있음(M3-07). 저장소 공개 뒤 주소 확인 |
| JetBrains tools used (체크) | 사실대로: WebStorm(헤드리스 검사 13회). Junie·Air 는 `docs/jetbrains-usage.md` 합계가 0이면 체크하지 않는다 | 합계표 확인 후 |
| Team | 1명(개인) | |

## B. 규정 점검 12줄 (제출 직전에 명령을 다시 돌려 결과를 갱신)

결과 칸의 「✔」는 명령을 실제로 돌려 본 것(1·3·11 은 2026-11-25 재확인, 나머지는 2026-11-21).

| # | 규정 | 확인 명령 | 결과 (2026-11-21) |
|---|---|---|---|
| 1 | 공개 저장소 | `git remote -v` 에 주소가 있고, 브라우저 시크릿 창에서 열림 | ✔ `origin https://github.com/soilrist/callout-rush.git`, GitHub API `"private": false` |
| 2 | 루트에 오픈소스 LICENSE | `head -1 LICENSE` | ✔ `MIT License` |
| 3 | About 에 라이선스 표시 | GitHub 저장소 오른쪽 About 에 `MIT license` 가 보임 | ✔ GitHub API `spdx_id: MIT` |
| 4 | `.idea`/`.junie`/`.air` 커밋 | `git ls-files .idea .junie .air` | ✔ `.idea/` 9개 + `.junie/AGENTS.md`. `.air/` 는 Air 가 폴더를 만들지 않아 없음(M0-09 기록) |
| 5 | 영어 제출물 | `git grep -c -P '[가-힣]' -- README.md AI_SHOWCASE.md` 가 `제출본/` 경로 글자 말고는 0 | 부분 ✔ — README 는 경로 `제출본/…` 만, AI_SHOWCASE 는 경로와 소스 인용 2줄. **소스 주석·테스트 이름에 한국어가 남아 있음**(`app/src/audio/sfx.ts` 등 파일 4곳 이상) → 🟡 아래 C-1 |
| 6 | 영상 3분 미만 | `ffprobe -v error -show_entries format=duration -of csv=p=0 <영상>` < 180 | 초안 있음 — `ffprobe` 126.3초(#0084). 최종 영상은 사람이 올림 |
| 7 | 영상에 만든 기기의 실제 화면 | 영상 장면 표의 모든 화면이 브라우저 녹화 | 초안은 브라우저 녹화(#0078). 최종은 사람이 확인 |
| 8 | 저작권 음악 없음 | `git ls-files \| grep -iE '\.(mp3\|wav\|ogg)$' \| wc -l` | ✔ `0` (소리는 Web Audio 로 코드 합성) |
| 9 | 제3자 상표·다른 게임 이름 없음 | `git grep -n -i -E -f scripts/forbidden.txt -- app/src app/public README.md AI_SHOWCASE.md 제출본` 와 `grep -rn -i 'valorant\|riot' app/src README.md AI_SHOWCASE.md` | ✔ 둘 다 0건(종료 코드 1 / 출력 없음). 제출 직전에 `devpost.md`·`methodology.md` 포함해 다시 |
| 10 | 그림·소리 파일을 남에게서 가져오지 않음 | `git ls-files \| grep -iE '\.(png\|jpg\|svg\|woff2?)$' \| grep -v 제출본` | ✔ 출력 0줄(제출 그림은 우리 게임 화면 캡처). 글꼴은 zip 안 빌드 결과에만 있고 OFL 확인은 M0-04 |
| 11 | 데모 무료 접근, 심사 끝(02-04 08:00 KST)까지 유지 | `curl -sI <주소>/` 와 `<주소>/board.html` 이 200 | ✔ 두 주소 `HTTP/2 200` |
| 12 | 한 판 시작→플레이→점수 화면 + 반복 사용 증명 | `cd app && npm run check` 마지막 줄 + `docs/soak-report.md` | ✔ `docs/soak-report.md` 있음(M2-12) |

## C. 사람이 정해 줄 것 (🟡 가정)
1. 소스 주석·테스트 이름의 한국어: 규정 「영어 아니면 번역 필수」는 설명·영상 기준이라 소스 주석은 허용으로 본다. 불안하면 "주석 영어화" 조각을 루프에게 시킨다(INBOX 지시).
2. 쓴 도구 체크: Junie·Air 는 실제 실행 0회라 체크하지 않는 쪽으로 적었다(꾸며 쓰지 않는다 — ROADMAP 공통 규칙).

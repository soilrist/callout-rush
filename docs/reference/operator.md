# 화면 시트: Operator (S7 운영자 메뉴)

- 원본: 자체 시트 — DESIGN §4.7 · §5.8 · §8.1 S7 을 무대 좌표로 옮긴 것. 남의 그림 없음.
- 색 이름(DESIGN §7): `bg` #0B1220 · `panel` #131C2E · `line` #24324D · `zone` #1B2A44 · `text` #E8EEF8 · `accent` #35D0FF · `ok` #4ADE80 · `miss` #FF8A3D · `gold` #FFC53D
- 서체: Chakra Petch 500·700, 숫자 tabular-nums. 선 2px(강조 4px). 무대 1920×1080 논리 px, 좌표는 왼쪽 위가 0,0.
- 조작 흐름: `Ctrl+Shift+O` 로 어디서든 열림(플레이어는 모름). 열리면 진행 중이던 판은 버림. 닫기는 `Esc` 또는 `Close` → S1. 버튼 하나 = 탭 1번(`Clear today's scores` 는 확인 때문에 2번).

## 레이아웃
| 요소 | x | y | w | h | 글자 px | 색 |
|---|---|---|---|---|---|---|
| 뒤 막 (아래 화면이 비침) | 0 | 0 | 1920 | 1080 | — | `bg` 알파 0.85 |
| 가운데 패널 | 460 | 140 | 1000 | 800 | — | 채움 `panel`, 선 `accent` 4px |
| 버튼 1 `Open leaderboard window` | 500 | 180 | 440 | 88 | 32 (500) | 선 `line` 2px, 글자 `text` |
| 버튼 2 `Fullscreen` | 980 | 180 | 440 | 88 | 32 (500) | 〃 |
| 버튼 3 `Mute` (켜져 있으면 `Unmute`) | 500 | 288 | 440 | 88 | 32 (500) | 〃 |
| 버튼 4 `Export scores (CSV)` | 980 | 288 | 440 | 88 | 32 (500) | 〃 |
| 버튼 5 `Clear today's scores` | 500 | 396 | 440 | 88 | 32 (500) | 선 `miss` 2px, 글자 `miss` |
| 버튼 6 `Close` | 980 | 396 | 440 | 88 | 32 (500) | 선 `accent` 2px, 글자 `accent` |
| `Booth health` 제목 | 500 | 524 | 920 | 44 | 32 (700) | `accent` |
| 숫자 줄 4개 (줄 높이 60): 라벨 `Games played` / `JS heap` / `Frame time` / `Errors` — 값은 오른쪽 정렬 | 500 | 580 · 640 · 700 · 760 | 920 | 60 | 라벨 28 (500) / 값 40 (700) | 라벨 `text` 알파 0.7 / 값 `text` (`Frame time` > 20 ms, `Errors` > 0 이면 `miss`) |
| 줄 사이 선 | 500 | 640 · 700 · 760 · 820 | 920 | 2 | — | `line` |
| 저장 공간 경고 `Storage is full — scores are kept in memory only.` (있을 때만) | 500 | 856 | 920 | 48 | 28 (500) | `miss` |
| 값 모양 | | | | | | `Games played` `37` · `JS heap` `18.4 MB` · `Frame time` `16.8 ms` · `Errors` `0` |

## 확인 창 (`Clear today's scores` 누른 뒤)
| 요소 | x | y | w | h | 글자 px | 색 |
|---|---|---|---|---|---|---|
| 확인 창 바탕 | 660 | 340 | 600 | 300 | — | 채움 `panel`, 선 `miss` 4px |
| 문구 `Clear today's scores? This cannot be undone.` (두 줄) | 690 | 370 | 540 | 120 | 32 (500) | `text` |
| 버튼 `Clear` | 690 | 530 | 260 | 72 | 32 (700) | 채움 `miss`, 글자 `bg` |
| 버튼 `Cancel` | 970 | 530 | 260 | 72 | 32 (700) | 선 `line` 2px, 글자 `text` |

- `Esc` 는 확인 창을 먼저 닫고, 한 번 더 누르면 메뉴를 닫는다. 확인 창이 떠 있는 동안 아래 버튼은 눌리지 않는다.
- `Booth health` 는 열려 있는 동안 1초마다 다시 읽는다. `JS heap` 은 브라우저가 못 주면 `n/a`.
- 새 문구 `Games played` · `JS heap` · `Frame time` · `Errors` · `Close` · `Unmute` · `Clear` · `Cancel` · `n/a` 는 DESIGN §5.8 에 〔추가: 바퀴 11〕 로 넣는다.

## 우리 것으로 다르게 (Reference.md 6절)
부스 운영용 화면이라 플레이어 화면과 같은 도면 톤의 단색 사각 버튼·표만 쓴다. 특정 앱의 설정 화면 배치를 따르지 않는다.

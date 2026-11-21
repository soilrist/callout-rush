# INBOX

> 형식·종류: `docs/conventions/InboxFormat.md` · **맨 위가 최우선 · 끝나면 즉시 삭제**
> `- [ ] <종류>(작성자, YYYY-MM-DD HH:MM) **요지.** 본문 … 검증: … / 삭제: …`

<!-- 여기 아래에 적는다 -->
- [ ] 확인(루프, 2026-11-21 11:05) **M0-11: 화면 시트의 좌표 중 DESIGN 에 없던 것은 내가 정했고, 콜 문장·구역 이름표는 줄바꿈 규칙을 넣었다.** DESIGN §8.2 의 96px 로는 `Container Row, then Loading Dock!` 둘째 줄이 약 950px 라 카드 폭 732 를 넘는다 → 쉼표 뒤 줄바꿈 + 가장 긴 줄이 넘으면 96→60px 로 줄임. 이름표 28px 도 좁은 구역(NORTH/SOUTH STAIRS·EAST/WEST GATE 등)엔 한 줄이 안 들어가 두 줄로. 운영자 메뉴 라벨 9개는 §5.8 에 〔추가〕. 검증: docs/reference/play.md 「콜 문장 줄바꿈」·「이름표」 / 삭제: 감독 검산 후
- [ ] 확인(루프, 2026-11-21 10:26) **M0-07: WebStorm 헤드리스 검사가 안 쓰는 지역 변수·import 를 못 잡는다.** 프로필엔 켜져 있는데 `inspect.sh` 결과엔 없음(원인 미상). 지금 관문은 미사용 함수(JSUnusedGlobalSymbols) 등 일부만 잡는다. 증거 문서엔 이 한계를 적어 둠. 검증: docs/jetbrains-usage.md 첫 줄 / 삭제: 감독 검산 후

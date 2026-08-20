# O&O — MCM 인터랙티브 스토어 (Frontend)

> 2026 멋쟁이사자처럼 중앙 해커톤 · 1조 오레오(O&O)
> 오프라인 매장 방문 경험을 모바일 웹으로 확장하는 **인터랙티브 팝업스토어 컴패니언**입니다.

방문객은 QR로 접속해 매장 지도를 보며 동선을 잡고, 진열대의 상품을 살펴보고, AI 챗봇에게 질문하고, 셀프 촬영으로 **AI 화보(룩북)** 를 생성하고, 방문이 끝나면 자신의 취향을 분석한 **방문 리포트**를 받습니다.

---

## 한눈에 보는 사용자 여정

```
랜딩(초대장) → 매장 지도 → 진열대 → 상품 상세
                  ↕                      ↕
               AI 챗봇  ←──────────  질문/이벤트
                  ↓
            셀프 카메라 → 사진 확인 → AI 화보 생성 → 화보 공유(공개 링크)
                  ↓
            방문 종료 → 취향 분석 리포트
```

## 핵심 기능

| 기능 | 설명 | 주요 코드 |
| --- | --- | --- |
| 인터랙티브 매장 지도 | 구역(zone)을 눌러 진열대로 이동, 진열대 안내 오버레이 | `components/FloorMap`, `pages/MapPage.jsx` |
| 진열대 · 상품 상세 | 구역별 진열대 레이아웃(스와이프 행거 선반 포함), 가격·재질·디자인 의도 팝업 | `components/Shelf`, `pages/ProductPage.jsx` |
| AI 챗봇 | 상품 문맥을 담은 대화, 서버와 타임라인 동기화 | `pages/ChatPage.jsx`, `hooks/useChatSync.js`, `stores/useChatStore.js` |
| AI 화보 생성 | MediaPipe로 인물 가이드 촬영 → 서버 생성 작업 폴링 → 완성 화보 공유 링크 발급 | `pages/CameraPage.jsx`, `hooks/usePhotoLookbook.js`, `hooks/useLookbookPolling.js` |
| 방문 리포트 | 체류시간·질문·조회 이벤트를 집계한 취향 분석 리포트 | `pages/AnalyticsPage.jsx`, `hooks/useAnalyticsPolling.js` |
| 행동 이벤트 수집 | 상품 조회·체류시간(dwell) 등 이벤트 전송 | `api/events.js`, `hooks/useDwellTimer.js` |

## 기술 스택

| 영역 | 선택 | 비고 |
| --- | --- | --- |
| 프레임워크 | React 19 + Vite 8 | 라우트 단위 코드 스플리팅(lazy)으로 초기 번들 축소 |
| 라우팅 | react-router-dom 7 | 경로 상수 단일 출처: `src/router/paths.js` |
| 스타일 | styled-components 6 | 402px 디자인 기준 + `@media (max-width: 600px)` 반응형 |
| 전역 상태 | Zustand | 채팅/선택 상품 상태 (`stores/useChatStore.js`) |
| HTTP | Axios | 공통 인스턴스·에러 처리: `api/api.js`, `api/errors.js` |
| 온디바이스 AI | MediaPipe (face detection / selfie segmentation) | 촬영 가이드 정렬 (`utils/mediaPipeHelper.js`) |
| 캐러셀 | Swiper | 행거형 진열대 가로 스크롤 (`Shelf05`) |
| 테스트 | Vitest | `npm test` — 색상 정규화, 방문 인증 저장소, 경로 헬퍼 등 단위 테스트 |

## 실행 방법

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm test           # 단위 테스트 1회 실행 (Vitest)
npm run test:watch # 워치 모드
npm run build      # 프로덕션 빌드
npm run lint       # ESLint
```

> 백엔드 API가 없어도 화면은 뜹니다. 매장 페이지는 방문 인증(visit_id)이 필요한데, 개발 중에는 브라우저 콘솔에서 `localStorage.setItem("visit_id", "dev")` 후 `/map`으로 진입하면 됩니다.

## 아키텍처

### 디렉터리 구조

```text
src
├─ api/          # 서버 통신 계층 — 도메인별 파일 (visits, products, chat, lookbooks, analytics, events, photoUpload)
│                #   api.js: Axios 공통 인스턴스 / errors.js: 에러 정규화
├─ assets/       # 이미지·아이콘·폰트 정적 자원
├─ components/   # 재사용 컴포넌트 (FloorMap, Shelf, Product, Header, Layout, MobileLayout, ChatMessage …)
├─ hooks/        # 커스텀 훅 — 비즈니스 로직은 페이지가 아니라 여기 산다
├─ pages/        # 라우트 단위 화면 + 각 화면의 styled 파일
├─ router/       # Router.jsx(라우트 정의·방문 인증 가드), paths.js(경로 상수 단일 출처)
├─ stores/       # Zustand 전역 상태
├─ styles/       # 전역 스타일
└─ utils/        # 순수 유틸 (storage, productImage, mediaPipeHelper, bgmManager, toast)
```

### 설계 원칙

1. **페이지는 얇게, 로직은 훅으로.** 데이터 조회·폴링·이벤트 전송은 전부 `hooks/`의 커스텀 훅이 담당하고, 페이지 컴포넌트는 조합과 렌더링만 합니다. 예: 상품 상세 화면의 조회 + 이미지 폴백 + 이벤트 + 체류시간 측정은 `useProductDetail` 하나로 캡슐화.
2. **경로·저장소 키는 단일 출처.** 라우트 경로는 `router/paths.js`, 스토리지 키는 `utils/storage.js`의 `STORAGE_KEYS`만 사용합니다. 문자열 하드코딩으로 인한 오타 라우팅/키 불일치를 구조적으로 차단합니다.
3. **방문 인증 가드.** 매장 화면은 `visit_id`가 있어야 접근할 수 있고, 없으면 `Router.jsx`가 랜딩으로 돌려보냅니다. 화보 공유 링크(`/lookbook/:shareSlug`)는 외부 사용자가 여는 공개 경로라 가드에서 제외합니다.
4. **반응형 전략.** 디자인은 402×(iPhone 기준) 프레임이 기준이고, 600px 초과 데스크톱에서는 402px 프레임을 중앙 고정, 600px 이하 모바일에서는 `calc(100% - 여백)`·`aspect-ratio`·`min()`으로 기기 폭에 비례해 스케일합니다. 수정 시 규칙: **데스크톱 레이아웃은 건드리지 않고 `@media (max-width: 600px)` 블록 안에서만 조정.**
5. **폴링 기반 비동기 작업.** 화보 생성과 리포트 생성은 서버의 장기 작업이므로 `useLookbookPolling` / `useAnalyticsPolling`이 상태를 주기 조회하고, 로딩 페이지가 진행률을 보여줍니다.

### 라우트 맵

| 경로 | 화면 | 접근 |
| --- | --- | --- |
| `/` | 랜딩 (스크롤 초대장) | 공개 |
| `/map` | 매장 지도 | 방문 인증 필요 |
| `/shelf/:zoneId` | 구역 진열대 | 방문 인증 필요 |
| `/product/:productId` | 상품 상세 | 방문 인증 필요 |
| `/guide` | 이용 안내 | 방문 인증 필요 |
| `/chat` | AI 챗봇 | 방문 인증 필요 |
| `/camera` → `/camera/confirm` | 셀프 촬영 → 사진 확인 | 방문 인증 필요 |
| `/lookbook/:shareSlug` (구 `/l/:shareSlug`) | AI 화보 (공유 링크) | 공개 |
| `/analytics/:slug?` | 방문 취향 리포트 | 방문 인증 필요 |

## 테스트

```bash
npm test
```

Vitest 단위 테스트가 회귀에 취약했던 핵심 로직을 고정합니다.

| 테스트 | 검증 내용 |
| --- | --- |
| `components/Product/__tests__/productColor.test.js` | 서버 색상 응답 정규화 — 문자열/배열/중복/`"색상:"` 접두어/콤마 중복까지 어떤 형태로 와도 대표 색상 1개만 노출 |
| `stores/__tests__/chatMessages.test.js` | 채팅 메시지 규칙 — 서버 메시지 정규화(assistant/preset/user), 숨김 클릭 로그 필터, 서버 동기화 시 로컬 임시(local-/stream-) 메시지 병합·중복 방지 |
| `hooks/__tests__/lookbookJobRules.test.js` | 화보 생성 폴링 판정 — 완료/실패 상태 해석(대소문자 무관), 진행률(0~1 비율·0~100 퍼센트) 정규화, 실패 유형별 안내 문구 |
| `utils/__tests__/storage.test.js` | 방문 인증 저장소 — snake_case 표준 키 저장, 과거 세션 camelCase 키 폴백, 방문 종료 판정 |
| `utils/__tests__/productImage.test.js` | 로컬 상품 이미지 경로 및 원본 파일명이 뒤바뀐 상품(p_416↔p_418) 교차 매핑 |
| `router/__tests__/paths.test.js` | 경로 헬퍼와 PATHS 상수 무결성 (삭제된 `/home` 미포함 포함) |

테스트 파일은 대상 모듈 옆 `__tests__/` 폴더에 두는 컨벤션입니다. 새 유틸/훅의 순수 로직을 추가할 때 같은 위치에 테스트를 추가해 주세요.

## 협업 컨벤션

- **브랜치**: 개인 포크/브랜치 → `main`으로 PR. 커밋 접두어는 `feat:` `fix:` `style:` 등을 사용합니다.
- **스타일 파일**: 컴포넌트와 같은 폴더에 `*.styled.js`(또는 `*.style.js`)로 분리합니다.
- **주석**: "왜 이렇게 했는지"를 남깁니다. 특히 디자인 수치(363px 카드, 402px 프레임)나 서버 응답의 예외 케이스에 대한 배경을 코드 옆에 기록합니다.

## 팀

멋쟁이사자처럼 2026 중앙 해커톤 1조 **오레오(O&O)** — Frontend 레포지토리.
백엔드 API 서버는 별도 레포지토리에서 운영됩니다.

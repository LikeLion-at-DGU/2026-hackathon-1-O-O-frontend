import { api } from "./api";

const QUEUE_KEY = "pending_events";
const PRODUCT_INTERACTION_KEY =
  "has_product_interaction";

const FLUSH_INTERVAL = 1_000;

let flushTimer;
let isFlushing = false;

// 표준 UUID v4 생성
const createUUID = () => {
  try {
    if (
      typeof window !== "undefined" &&
      window.crypto &&
      typeof window.crypto.randomUUID === "function"
    ) {
      return window.crypto.randomUUID();
    }
  } catch {
    // 대체 로직 실행
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const isValidUUID = (value) => {
  if (typeof value !== "string") {
    return false;
  }
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
};

// 큐 관리 함수 (sessionStorage)
const getQueue = () => {
  try {
    return JSON.parse(sessionStorage.getItem(QUEUE_KEY) ?? "[]");
  } catch {
    return [];
  }
};

const saveQueue = (events) => {
  sessionStorage.setItem(QUEUE_KEY, JSON.stringify(events));
};

const isVisitFinished = () =>
  Boolean(sessionStorage.getItem("report_slug"));

// 이벤트 데이터 포맷 검증 및 정제
const sanitizeEvent = (event) => {
  const dwellMs =
    event.dwell_ms ??
    event.metadata?.dwell_ms ??
    event.metadata?.dwell_time_ms ??
    (event.dwell_sec ? event.dwell_sec * 1000 : undefined);

  const finalEventId = isValidUUID(event.event_id)
    ? event.event_id
    : createUUID();

  const eventType = String(event.event_type || "scene_dwell")
    .toLowerCase()
    .trim();

  const sceneId =
    event.scene_id ??
    event.metadata?.scene_id ??
    null;

  // 진열대 이벤트인데 어느 진열대인지 모르면 버린다. 예전에는 scenes[0]으로
  // 대체했는데, 그러면 엉뚱한 진열대에 체류가 집계되고, 서버 id가 아닌 값
  // ("1")이 섞이면 그 이벤트가 rejected로 빠진다.
  if (!sceneId && eventType.startsWith("scene_")) {
    return null;
  }

  // metadata는 원시값만 통과시켜 그대로 싣는다. 예전에는 dwell만 남기고
  // 전부 버려서 preset_key·question 같은 분석 재료가 서버에 도달하지 못했다.
  const metadata = {};
  for (const [key, value] of Object.entries(event.metadata ?? {})) {
    if (["string", "number", "boolean"].includes(typeof value)) {
      metadata[key] = value;
    }
  }
  delete metadata.dwell_time_ms;
  delete metadata.dwell_sec;

  if (dwellMs !== undefined && !Number.isNaN(Number(dwellMs))) {
    metadata.dwell_ms = Math.round(Number(dwellMs));
  } else {
    delete metadata.dwell_ms;
  }

  return {
    event_id: finalEventId,
    event_type: eventType,
    client_timestamp:
      event.client_timestamp ?? new Date().toISOString(),
    ...(sceneId && {
      scene_id: String(sceneId),
    }),
    ...(event.product_id && {
      product_id: String(event.product_id),
    }),
    ...(Object.keys(metadata).length > 0 && { metadata }),
  };
};

// 이벤트 배치 전송 함수
export const flushEvents = async ({ keepalive = false } = {}) => {
  if (isFlushing || isVisitFinished()) {
    return;
  }

  const rawEvents = getQueue();
  if (!rawEvents.length) {
    return;
  }

  // ⭐️ 1. localStorage에서 인증 값 우선 추출 (스네이크/카멜 케이스 모두 대응)
  const visitToken =
    localStorage.getItem("visitToken") ||
    localStorage.getItem("visit_token") ||
    "";

  const anonymousUuid =
    localStorage.getItem("anonymous_uuid") ||
    localStorage.getItem("anonymousUuid") ||
    "";

  const visitId =
    localStorage.getItem("visitId") ||
    localStorage.getItem("visit_id") ||
    "";

  // ⭐️ 2. 필수 키가 아직 없으면(초기 로딩 중) 버리지 않고 1초 후 재시도
  if (!visitToken || !visitId || !anonymousUuid) {
    clearTimeout(flushTimer);
    flushTimer = setTimeout(() => {
      flushEvents().catch(() => {});
    }, FLUSH_INTERVAL);
    return;
  }

  isFlushing = true;

  const events = rawEvents.map(sanitizeEvent).filter(Boolean);
  if (!events.length) {
    saveQueue([]);
    isFlushing = false;
    return;
  }

  // ⭐️ 3. 백엔드 필수 헤더 명시적 주입
  const headers = {
    "Content-Type": "application/json",
    "X-Visit-Token": visitToken,
    "X-Anonymous-UUID": anonymousUuid,
  };

  const payload = {
    visit_id: visitId,
    events,
  };

  try {
    console.log("[Events] 전송 payload:", payload);

    if (keepalive) {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "/api/v1"
        }/events`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
          keepalive: true,
        }
      );

      if (!response.ok) {
        throw new Error(`이벤트 전송 실패: ${response.status}`);
      }

      // 전송 성공 시 큐 초기화
      saveQueue([]);
      return;
    }

    const response = await api.post("/events", payload, { headers });
    console.log("✅ [Events] 전송 성공:", response.data);

    // ⭐️ 전송 성공 확인 후 안전하게 큐 비우기
    saveQueue([]);
    return response.data;
  } catch (error) {
    const status = error.response?.status;
    const errorData = error.response?.data;

    console.warn("⚠️ [Events] 전송 실패:", errorData ?? error.message);

    // 400(검증 실패), 401(인증 실패)인 잘못된 요청은 큐에서 제거하여 무한 에러 방지
    if (status === 400 || status === 401) {
      saveQueue([]);
    }
    throw error;
  } finally {
    isFlushing = false;
  }
};

export const hasProductInteraction = () =>
  sessionStorage.getItem(
    PRODUCT_INTERACTION_KEY
  ) === "true";

export const resetProductInteraction = () => {
  sessionStorage.removeItem(
    PRODUCT_INTERACTION_KEY
  );
};

// 개별 이벤트 큐 등록 함수
export const sendEvent = async (eventData) => {
  if (!eventData || !eventData.event_type) {
    return;
  }

  const cleanedEvent = sanitizeEvent(eventData);
  if (!cleanedEvent) {
    return;
  }

  if (cleanedEvent.product_id) {
    sessionStorage.setItem(
      PRODUCT_INTERACTION_KEY,
      "true"
    );
  }

  saveQueue([
    ...getQueue(),
    cleanedEvent,
  ]);

  clearTimeout(flushTimer);
  flushTimer = setTimeout(() => {
    flushEvents().catch(() => {});
  }, FLUSH_INTERVAL);

  return {
    data: cleanedEvent,
  };
};

export const drainEventBuffer = () => {
  const rawEvents = getQueue();
  saveQueue([]);
  clearTimeout(flushTimer);
  return rawEvents.map(sanitizeEvent).filter(Boolean);
};

// 페이지 이탈·백그라운드 전환 시: 돌고 있는 체류 타이머부터 정산시킨 뒤
// 잔여 이벤트를 keepalive로 즉시 전송한다. 타이머 정산 없이 flush만 하면
// 마지막 상품의 체류가 유실되고, visibilitychange가 없으면 탭을 숨겨둔
// 시간이 통째로 체류로 잡힌다.
if (typeof window !== "undefined") {
  const settleAndFlush = () => {
    window.dispatchEvent(new Event("force_flush_dwell_timer"));
    flushEvents({ keepalive: true }).catch(() => {});
  };

  window.addEventListener("pagehide", settleAndFlush);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      settleAndFlush();
    }
  });
}

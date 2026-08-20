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

  let sceneId =
    event.scene_id ??
    event.metadata?.scene_id ??
    null;

  if (
    !sceneId &&
    (eventType.startsWith("scene_") || eventType === "hotspot_click")
  ) {
    try {
      const scenes = JSON.parse(
        sessionStorage.getItem("scenes") ?? "[]"
      );
      sceneId = scenes[0]?.scene_id ?? null;
    } catch {
      sceneId = null;
    }
  }

  const metadata = {};

  if (dwellMs !== undefined && !Number.isNaN(Number(dwellMs))) {
    const normalizedDwellMs = Math.round(Number(dwellMs));
    metadata.dwell_ms = normalizedDwellMs;
    metadata.dwell_time_ms = normalizedDwellMs;
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

  const events = rawEvents.map(sanitizeEvent);

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
  return rawEvents.map(sanitizeEvent);
};

// 페이지 이탈 시 잔여 이벤트 즉시 전송
if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => {
    flushEvents({ keepalive: true }).catch(() => {});
  });
}

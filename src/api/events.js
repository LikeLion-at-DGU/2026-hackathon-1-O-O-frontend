import { api } from "./api";

const QUEUE_KEY = "pending_events";
const FLUSH_INTERVAL = 5_000;

let flushTimer;
let isFlushing = false;

// 고유 Event ID 생성
const createEventId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `e_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

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

const normalizeEventType = (eventType) => String(eventType).toLowerCase();

// 관람 종료 여부 확인
const isVisitFinished = () => Boolean(sessionStorage.getItem("report_slug"));

/**
 * 큐에 쌓인 이벤트를 서버로 일괄 전송 (Flush)
 */
export const flushEvents = async ({ keepalive = false } = {}) => {
  if (isFlushing || isVisitFinished()) {
    return;
  }

  const events = getQueue();
  const visitToken =
    sessionStorage.getItem("visit_token") ||
    localStorage.getItem("visitToken") ||
    "";
  const anonymousUuid =
    sessionStorage.getItem("anonymous_uuid") ||
    localStorage.getItem("anonymousUuid") ||
    "";

  if (!events.length) return;

  isFlushing = true;
  saveQueue([]); // 큐를 먼저 비움

  try {
    const headers = {
      ...(anonymousUuid && { "X-Anonymous-UUID": anonymousUuid }),
      ...(visitToken && { "X-Visit-Token": visitToken }),
    };

    const payload = { events };

    if (keepalive) {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "/api/v1"}/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: JSON.stringify(payload),
          keepalive: true,
        }
      );
      if (!response.ok) throw new Error(`이벤트 전송 실패: ${response.status}`);
    } else {
      await api.post("/events", payload, { headers });
    }
  } catch (error) {
    // 401(토큰 만료)이나 이미 종료된 세션이 아니면 큐 복구
    if (!isVisitFinished() && error.response?.status !== 401) {
      saveQueue([...events, ...getQueue()]);
    }
    console.warn("⚠️ [Events] 전송 스킵 또는 실패:", error.response?.data || error.message);
  } finally {
    isFlushing = false;
  }
};

/**
 * 이벤트 즉시 전송 (배치)
 */
export const sendEvents = async (events = []) => {
  if (!events || events.length === 0) return;

  const visitToken = sessionStorage.getItem("visit_token");

  const formattedEvents = events.map((ev) => ({
    event_id: ev.event_id || createEventId(),
    event_type: normalizeEventType(ev.event_type),
    ...(ev.product_id && { product_id: String(ev.product_id) }),
    ...(ev.scene_id && { scene_id: String(ev.scene_id) }),
    client_timestamp: ev.client_timestamp || new Date().toISOString(),
    metadata: ev.metadata || (ev.dwell_ms ? { dwell_ms: Number(ev.dwell_ms) } : {}),
  }));

  const payload = { events: formattedEvents };

  return await api.post("/events", payload, {
    headers: {
      "X-Visit-Token": visitToken || "",
    },
  });
};

/**
 * 단일 이벤트 전송 및 큐잉 (Shelf, useProductEvent에서 호출)
 */
export const sendEvent = async (eventData) => {
  if (!eventData || !eventData.event_type) return;

  const event = {
    event_id: eventData.event_id || createEventId(),
    event_type: normalizeEventType(eventData.event_type),
    client_timestamp: eventData.client_timestamp || new Date().toISOString(),
    ...(eventData.scene_id != null && { scene_id: String(eventData.scene_id) }),
    ...(eventData.product_id != null && { product_id: String(eventData.product_id) }),
    metadata: eventData.metadata || {},
  };

  // 1. 큐에 추가
  saveQueue([...getQueue(), event]);

  // 2. 타이머 리셋 후 5초 뒤 자동 flush
  clearTimeout(flushTimer);
  flushTimer = setTimeout(() => {
    flushEvents().catch(() => {});
  }, FLUSH_INTERVAL);

  return { data: event };
};

export const getVisitEvents = async (visitId) => ({
  data:
    String(visitId) ===
    String(
      localStorage.getItem("visitId") ?? sessionStorage.getItem("visit_id")
    )
      ? getQueue()
      : [],
});

/**
 * 관람 종료 시 남은 버퍼를 추출하고 비움 (Header의 finishVisit에 동봉용)
 */
export const drainEventBuffer = () => {
  const events = getQueue();
  saveQueue([]);
  clearTimeout(flushTimer);
  return events;
};

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => {
    flushEvents({ keepalive: true }).catch(() => {});
  });
}
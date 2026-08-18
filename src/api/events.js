import { api } from "./api";

const QUEUE_KEY = "pending_events";
const FLUSH_INTERVAL = 5_000;

let flushTimer;
let isFlushing = false;

const createEventId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now()}-${Math.random().toString(16).slice(2)}`;

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

// ⭐️ 관람 종료 여부 확인 헬퍼
const isVisitFinished = () => Boolean(sessionStorage.getItem("report_slug"));

export const flushEvents = async ({ keepalive = false } = {}) => {
  // 이미 요청 중이거나 관람이 종료된 경우 전송 중단
  if (isFlushing || isVisitFinished()) {
    saveQueue([]); // 종료된 세션의 잔여 큐 제거
    return;
  }

  const events = getQueue();
  const anonymousUuid =
    localStorage.getItem("anonymousUuid") ??
    localStorage.getItem("anonymous_uuid") ??
    sessionStorage.getItem("anonymous_uuid");
  const visitId =
    localStorage.getItem("visitId") ?? sessionStorage.getItem("visit_id");
  const visitToken =
    localStorage.getItem("visitToken") ??
    sessionStorage.getItem("visit_token") ??
    "";

  if (!events.length || !anonymousUuid || !visitId) return;

  isFlushing = true;
  saveQueue([]); // 큐를 먼저 비움

  try {
    const headers = {
      "X-Anonymous-UUID": anonymousUuid,
      "X-Visit-Token": visitToken,
    };

    if (keepalive) {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "/api/v1"}/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: JSON.stringify({ visit_id: visitId, events }),
          keepalive: true,
        }
      );
      if (!response.ok) throw new Error(`이벤트 전송 실패: ${response.status}`);
    } else {
      // ⭐️ X-Visit-Token과 X-Anonymous-UUID 헤더 모두 전달
      await api.post(
        "/events",
        { visit_id: visitId, events },
        { headers }
      );
    }
  } catch (error) {
    // 이미 관람이 종료된 상태(401/400)라면 큐를 복구하지 않고 버림
    if (!isVisitFinished() && error.response?.status !== 401) {
      saveQueue([...events, ...getQueue()]);
    }
    console.warn("⚠️ [Events] 이벤트 전송 스킵/실패:", error.message);
  } finally {
    isFlushing = false;
  }
};

export const sendEvent = async ({
  event_type,
  product_id,
  scene_id,
  metadata,
  question,
}) => {
  // 관람 종료 후에는 이벤트 수집 중단
  if (isVisitFinished()) return { data: null };

  const eventMetadata = {
    ...(metadata ?? {}),
    ...(question != null ? { question } : {}),
  };

  const event = {
    event_id: createEventId(),
    event_type: normalizeEventType(event_type),
    client_timestamp: new Date().toISOString(),
    ...(scene_id != null && { scene_id: String(scene_id) }),
    ...(product_id != null && { product_id: String(product_id) }),
    ...(Object.keys(eventMetadata).length > 0 && { metadata: eventMetadata }),
  };

  saveQueue([...getQueue(), event]);
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

// 관람 종료 시 Header 등에서 버퍼를 한 번에 비워 동봉할 때 사용하는 함수
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
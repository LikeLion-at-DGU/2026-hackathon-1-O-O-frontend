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

export const flushEvents = async ({ keepalive = false } = {}) => {
  if (isFlushing) return;

  const events = getQueue();
  const anonymousUuid = localStorage.getItem("anonymousUuid") ?? localStorage.getItem("anonymous_uuid");
  const visitId = localStorage.getItem("visitId") ?? sessionStorage.getItem("visit_id");

  if (!events.length || !anonymousUuid || !visitId) return;

  isFlushing = true;
  // Remove first: events recorded during this request stay in the queue.
  saveQueue([]);

  try {
    if (keepalive) {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Anonymous-UUID": anonymousUuid,
          "X-Visit-Token": localStorage.getItem("visitToken") ?? sessionStorage.getItem("visit_token") ?? "",
        },
        body: JSON.stringify({ visit_id: visitId, events }),
        keepalive: true,
      });
      if (!response.ok) throw new Error(`이벤트 전송 실패: ${response.status}`);
    } else {
      await api.post(
        "/events",
        { visit_id: visitId, events },
        { headers: { "X-Anonymous-UUID": anonymousUuid } }
      );
    }
  } catch (error) {
    // Keep failed events for the next interval/page lifecycle flush.
    saveQueue([...events, ...getQueue()]);
    throw error;
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
  const event = {
    event_id: createEventId(),
    event_type: normalizeEventType(event_type),
    client_timestamp: new Date().toISOString(),
    ...(scene_id != null && { scene_id: String(scene_id) }),
    ...(product_id != null && { product_id: String(product_id) }),
    ...(metadata != null && { metadata }),
    ...(question != null && { metadata: { ...(metadata ?? {}), question } }),
  };

  saveQueue([...getQueue(), event]);
  clearTimeout(flushTimer);
  flushTimer = setTimeout(() => {
    flushEvents().catch((error) => console.error("이벤트 전송 실패:", error));
  }, FLUSH_INTERVAL);

  return { data: event };
};

// Analytics currently reads client-side events. The backend event endpoint is
// append-only, so a server-side analytics/report endpoint is needed for
// historical events that were already flushed.
export const getVisitEvents = async (visitId) => ({
  data:
    String(visitId) === String(localStorage.getItem("visitId") ?? sessionStorage.getItem("visit_id"))
      ? getQueue()
      : [],
});

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => {
    flushEvents({ keepalive: true }).catch(() => {});
  });
}

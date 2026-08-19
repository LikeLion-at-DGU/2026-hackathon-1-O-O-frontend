// src/api/events.js
import { api } from "./api";

const QUEUE_KEY = "pending_events";
const FLUSH_INTERVAL = 5_000;

let flushTimer;
let isFlushing = false;

// 표준 UUID v4 생성
const createUUID = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const isValidUUID = (str) => {
  if (typeof str !== "string") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
};

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

const isVisitFinished = () => Boolean(sessionStorage.getItem("report_slug"));

// src/api/events.js 내부의 sanitizeEvent 교체

const sanitizeEvent = (ev) => {
  const dwellMs =
    ev.dwell_ms ??
    ev.metadata?.dwell_ms ??
    ev.metadata?.dwell_time_ms ??
    (ev.dwell_sec ? ev.dwell_sec * 1000 : undefined);

  const finalEventId = isValidUUID(ev.event_id) ? ev.event_id : createUUID();
  const eventType = String(ev.event_type || "scene_dwell").toLowerCase().trim();

  const currentVisitId =
    ev.visit_id ||
    sessionStorage.getItem("visit_id") ||
    localStorage.getItem("visitId") ||
    "";

  let sceneId = ev.scene_id || ev.metadata?.scene_id || null;
  if (!sceneId && (eventType.startsWith("scene_") || eventType === "hotspot_click")) {
    try {
      const scenes = JSON.parse(sessionStorage.getItem("scenes") ?? "[]");
      sceneId = scenes[0]?.scene_id || "sc_01";
    } catch {
      sceneId = "sc_01";
    }
  }

  const cleanMetadata = {};
  if (dwellMs !== undefined && !isNaN(dwellMs)) {
    const intDwell = Math.round(Number(dwellMs));
    cleanMetadata.dwell_ms = intDwell;
    cleanMetadata.dwell_time_ms = intDwell; // 백엔드 호환성 추가
  }

  return {
    event_id: finalEventId,
    event_type: eventType,
    client_timestamp: ev.client_timestamp || new Date().toISOString(),
    ...(currentVisitId ? { visit_id: String(currentVisitId) } : {}),
    ...(sceneId ? { scene_id: String(sceneId) } : {}),
    ...(ev.product_id ? { product_id: String(ev.product_id) } : {}),
    metadata: cleanMetadata,
  };
};

export const flushEvents = async ({ keepalive = false } = {}) => {
  if (isFlushing || isVisitFinished()) return;

  const rawEvents = getQueue();
  const visitToken = sessionStorage.getItem("visit_token") || "";
  const anonymousUuid = sessionStorage.getItem("anonymous_uuid") || "";
  const visitId = sessionStorage.getItem("visit_id") || "";

  // visitId나 토큰이 없으면 전송 거부 방어
  if (!rawEvents.length || !visitToken || !visitId) return;

  isFlushing = true;
  saveQueue([]);

  const events = rawEvents.map(sanitizeEvent);

  try {
    const headers = {
      "Content-Type": "application/json",
      "X-Visit-Token": visitToken,
      ...(anonymousUuid && { "X-Anonymous-UUID": anonymousUuid }),
    };

    const payload = { events };

    if (keepalive) {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "/api/v1"}/events`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
          keepalive: true,
        }
      );
      if (!response.ok) throw new Error(`이벤트 전송 실패: ${response.status}`);
    } else {
      await api.post("/events", payload, { headers });
    }
  } catch (error) {
    const status = error.response?.status;
    if (!isVisitFinished() && status !== 400 && status !== 401) {
      saveQueue([...rawEvents, ...getQueue()]);
    }
    console.warn("⚠️ [Events] 전송 실패:", error.response?.data || error.message);
  } finally {
    isFlushing = false;
  }
};

export const sendEvent = async (eventData) => {
  if (!eventData || !eventData.event_type) return;

  const cleanedEvent = sanitizeEvent(eventData);
  saveQueue([...getQueue(), cleanedEvent]);

  clearTimeout(flushTimer);
  flushTimer = setTimeout(() => {
    flushEvents().catch(() => {});
  }, FLUSH_INTERVAL);

  return { data: cleanedEvent };
};

export const drainEventBuffer = () => {
  const rawEvents = getQueue();
  saveQueue([]);
  clearTimeout(flushTimer);
  return rawEvents.map(sanitizeEvent);
};

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => {
    flushEvents({ keepalive: true }).catch(() => {});
  });
}
import { api } from "./api";

const QUEUE_KEY = "pending_events";
const FLUSH_INTERVAL = 1_000;

let flushTimer;
let isFlushing = false;

// 표준 UUID v4 생성
const createUUID = () => {
  try {
    if (typeof window !== "undefined" && window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
  } catch {
    // 무시하고 아래 대체 로직 실행
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
    value,
  );
};

const getQueue = () => {
  try {
    return JSON.parse(
      sessionStorage.getItem(QUEUE_KEY) ??
        "[]",
    );
  } catch {
    return [];
  }
};

const saveQueue = (events) => {
  sessionStorage.setItem(QUEUE_KEY, JSON.stringify(events),);
};

const isVisitFinished = () =>
  Boolean(sessionStorage.getItem("report_slug"),);

const sanitizeEvent = (event) => {
  const dwellMs =
    event.dwell_ms ??
    event.metadata?.dwell_ms ??
    event.metadata?.dwell_time_ms ??
    (event.dwell_sec
      ? event.dwell_sec * 1000
      : undefined);

  const finalEventId = isValidUUID(
    event.event_id,
  )
    ? event.event_id
    : createUUID();

  const eventType = String(
    event.event_type || "scene_dwell",
  )
    .toLowerCase()
    .trim();

  let sceneId =
    event.scene_id ??
    event.metadata?.scene_id ??
    null;

  if (
    !sceneId &&
    (eventType.startsWith("scene_") ||
      eventType === "hotspot_click")
  ) {
    try {
      const scenes = JSON.parse(
        sessionStorage.getItem("scenes") ??
          "[]",
      );

      sceneId =
        scenes[0]?.scene_id ?? "sc_01";
    } catch {
      sceneId = "sc_01";
    }
  }

  const metadata = {};

  if (
    dwellMs !== undefined &&
    !Number.isNaN(Number(dwellMs))
  ) {
    const normalizedDwellMs =
      Math.round(Number(dwellMs));

    metadata.dwell_ms =
      normalizedDwellMs;

    metadata.dwell_time_ms =
      normalizedDwellMs;
  }

  return {
    event_id: finalEventId,
    event_type: eventType,

    client_timestamp:
      event.client_timestamp ??
      new Date().toISOString(),

    ...(sceneId && {
      scene_id: String(sceneId),
    }),

    ...(event.product_id && {
      product_id: String(
        event.product_id,
      ),
    }),

    metadata,
  };
};

export const flushEvents = async ({
  keepalive = false,
} = {}) => {
  if (
    isFlushing ||
    isVisitFinished()
  ) {
    return;
  }

  const rawEvents = getQueue();

  const visitToken =
    localStorage.getItem("visitToken") ??
    sessionStorage.getItem(
      "visit_token",
    ) ??
    "";

  const anonymousUuid =
    localStorage.getItem(
      "anonymous_uuid",
    ) ??
    sessionStorage.getItem(
      "anonymous_uuid",
    ) ??
    "";

  const visitId =
    localStorage.getItem("visitId") ??
    sessionStorage.getItem(
      "visit_id",
    ) ??
    "";

  if (
    !rawEvents.length ||
    !visitToken ||
    !visitId
  ) {
    return;
  }

  isFlushing = true;

  // 전송할 이벤트를 큐에서 먼저 제거
  saveQueue([]);

  const events =
    rawEvents.map(sanitizeEvent);

  const headers = {
    "Content-Type": "application/json",
    "X-Visit-Token": visitToken,

    ...(anonymousUuid && {
      "X-Anonymous-UUID":
        anonymousUuid,
    }),
  };

  /* 중요!! visit_id는 개별 event 안이 아니라 EventBatch 최상단에 들어감. */
  const payload = {
    visit_id: visitId,
    events,
  };

  try {
    console.log(
      "[Events] 전송 payload:",
      payload,
    );

    if (keepalive) {
      const response = await fetch(
        `${
          import.meta.env
            .VITE_API_BASE_URL ||
          "/api/v1"
        }/events`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
          keepalive: true,
        },
      );

      if (!response.ok) {
        let errorData;

        try {
          errorData =
            await response.json();
        } catch {
          errorData = null;
        }

        console.error(
          "❌ [Events] keepalive 실패:",
          errorData,
        );

        throw new Error(
          `이벤트 전송 실패: ${response.status}`,
        );
      }

      return;
    }

    const response = await api.post(
      "/events",
      payload,
      {
        headers,
      },
    );

    console.log(
      "✅ [Events] 전송 성공:",
      response.data,
    );

    return response.data;
  } catch (error) {
    const status =
      error.response?.status;

    const errorData =
      error.response?.data;

    /*
     * 일시적인 오류일 때만 다시 큐에 넣고 400 데이터 오류를 다시 넣으면 계속 실패함*/
    if (
      !isVisitFinished() &&
      status !== 400 &&
      status !== 401
    ) {
      saveQueue([
        ...rawEvents,
        ...getQueue(),
      ]);
    }

    console.warn(
      "⚠️ [Events] 전송 실패:",
      errorData ?? error.message,
    );

    console.warn(
      "⚠️ [Events] 전송 payload:",
      payload,
    );

    if (errorData?.error?.detail) {
      console.warn(
        "⚠️ [Events] validation detail:",
        errorData.error.detail,
      );
    }

    throw error;
  } finally {
    isFlushing = false;
  }
};

export const sendEvent = async (
  eventData,
) => {
  if (
    !eventData ||
    !eventData.event_type
  ) {
    return;
  }

  const cleanedEvent =
    sanitizeEvent(eventData);

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

  return rawEvents.map(
    sanitizeEvent,
  );
};

if (typeof window !== "undefined") {
  window.addEventListener(
    "pagehide",
    () => {
      flushEvents({
        keepalive: true,
      }).catch(() => {});
    },
  );
}
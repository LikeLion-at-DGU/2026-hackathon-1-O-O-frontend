const EVENTS_KEY = "mock_events";

const getStoredEvents = () => {
  const stored = sessionStorage.getItem(EVENTS_KEY);

  return stored ? JSON.parse(stored) : [];
};

export const sendEvent = async (event) => {
  const events = getStoredEvents();

  const newEvent = {
    id: Date.now(),
    ...event,
    created_at: new Date().toISOString(),
  };

  events.push(newEvent);

  sessionStorage.setItem(EVENTS_KEY, JSON.stringify(events));

  console.log("💾 이벤트 저장:", newEvent);
  console.log("📚 저장된 전체 이벤트:", events);

  return {
    data: newEvent,
  };
};

export const getVisitEvents = async (visitId) => {
  const events = getStoredEvents();

  console.log("🔎 조회 visitId:", visitId);
  console.log(
    "📌 저장된 이벤트들의 visit_id:",
    events.map((event) => event.visit_id)
  );

  const filteredEvents = events.filter(
    (event) => String(event.visit_id) === String(visitId)
  );

  console.log("📦 조회된 이벤트:", filteredEvents);

  return {
    data: filteredEvents,
  };
};
import { mockEvents } from "../mocks/events";

export const sendEvent = async (event) => {
  const newEvent = {
    id: mockEvents.length + 1,
    ...event,
    created_at: new Date().toISOString(),
  };

  mockEvents.push(newEvent);

  console.log("이벤트 저장:", newEvent);

  return {
    data: newEvent,
  };
};

export const getVisitEvents = async (visitId) => {
  const events = mockEvents.filter(
    (event) => event.visit_id === visitId
  );

  return {
    data: events,
  };
};
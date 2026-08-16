export const enterStore = async (data) => {
  const visitId = `visit-${Date.now()}`;

  const newVisit = {
    visit_id: visitId,
    session_id: `session-${Date.now()}`,
    started_at: new Date().toISOString(),
    ...data,
  };

  console.log("매장 입장:", newVisit);

  return {
    data: newVisit,
  };
};
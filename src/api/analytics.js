import { getVisitEvents } from "./events";

export const analyzeInterest = async (visitId) => {
  const response = await getVisitEvents(visitId);
  const events = response.data;

  console.log("📦 분석할 이벤트:", events);

  const interest = {};

  events.forEach((event) => {
    if (!event.product_id) return;

    if (!interest[event.product_id]) {
      interest[event.product_id] = {
        product_id: event.product_id,
        score: 0,
        views: 0,
        clicks: 0,
        questions: [],
      };
    }

    const product = interest[event.product_id];

    if (event.event_type === "PRODUCT_VIEW") {
      product.views += 1;
      product.score += 1;
    }

    if (event.event_type === "PRODUCT_CLICK") {
      product.clicks += 1;
      product.score += 2;
    }

    if (event.event_type === "QUESTION_CLICK") {
      product.questions.push(event.question);
      product.score += 1;
    }
  });

  const result = Object.values(interest).sort(
    (a, b) => b.score - a.score
  );

  console.log("📊 관심도 분석 결과:", result);

  return {
    data: result,
  };
};
import { analyzeInterest } from "./analytics";

export const generateReport = async (visitId) => {
  const response = await analyzeInterest(visitId);

  const products = response.data;

  const totalViews = products.reduce(
    (sum, product) => sum + product.views,
    0
  );

  const totalClicks = products.reduce(
    (sum, product) => sum + product.clicks,
    0
  );

  const totalQuestions = products.reduce(
    (sum, product) => sum + product.questions.length,
    0
  );

  const mostInterestedProduct = products[0] || null;

  const report = {
    visit_id: visitId,

    summary: {
      total_views: totalViews,
      total_clicks: totalClicks,
      total_questions: totalQuestions,
    },

    most_interested_product: mostInterestedProduct,

    products,
  };

  console.log("📊 생성된 리포트:", report);

  return {
    data: report,
  };
};

export const getReport = async (visitId) => {
  console.log("📥 리포트 조회 요청:", visitId);

  const response = await generateReport(visitId);

  console.log("📥 리포트 조회 결과:", response.data);

  return {
    data: response.data,
  };
};
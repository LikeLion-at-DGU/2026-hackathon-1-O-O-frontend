import { api } from "./api";

/**
 * 관람 분석 리포트 조회
 * GET /api/v1/reports/{slug}
 */
export const getAnalytics = async (identifier) => {
  const targetSlug =
    identifier ||
    sessionStorage.getItem("report_slug");

  if (!targetSlug) {
    throw new Error(
      "리포트 식별자(report_slug)가 없습니다."
    );
  }

  const response = await api.get(
    `/reports/${targetSlug}`
  );

  return response.data;
};

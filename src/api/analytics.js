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

  try {
    const response = await api.get(
      `/reports/${targetSlug}`
    );

    console.log(
      "[Analytics] 리포트 조회 성공:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "[Analytics] 리포트 조회 실패:",
      error.response?.data || error
    );

    throw error;
  }
};
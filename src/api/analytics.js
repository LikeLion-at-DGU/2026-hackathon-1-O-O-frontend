import { api } from "./api";

// 리포트 조회 API (GET /api/v1/reports/{slug})
export const getAnalytics = async (identifier) => {
  try {
    const targetSlug =
      identifier ||
      sessionStorage.getItem("report_slug") ||
      sessionStorage.getItem("visit_id");

    if (!targetSlug) {
      throw new Error("리포트 식별자(slug)가 없습니다.");
    }

    // baseURL에 /api/v1이 있으므로 /reports/... 로만 요청
    const response = await api.get(`/reports/${targetSlug}`);

    console.log("📊 [Analytics] 리포트 데이터 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("🚨 [Analytics] 리포트 조회 실패:", error.response?.data || error);
    throw error;
  }
};


 // 2. 선택한 아이템으로 화보 생성 요청 (비동기 작업 시작)

// src/api/analytics.js

export const createLookbook = async (payload) => {
  try {
    // 1. 세션스토리지에서 필요한 값 추출
    const reportSlug = sessionStorage.getItem("report_slug");
    const visitToken = sessionStorage.getItem("visit_token");

    if (!reportSlug) {
      throw new Error("리포트 정보(report_slug)가 없습니다. 관람 종료 후 다시 시도해주세요.");
    }

    console.log(`🚀 [Lookbook] 화보 생성 API 호출: POST /reports/${reportSlug}/lookbook`);

    // 2. 백엔드 P03 규격 요청 (POST /api/v1/reports/{slug}/lookbook)
    const response = await api.post(`/reports/${reportSlug}/lookbook`, payload, {
      headers: {
        "X-Visit-Token": visitToken || "",
      },
    });

    console.log("🎨 [Lookbook] 생성 큐 등록 성공 (202 Accepted):", response.data);
    return response.data; // { job_id, share_slug, attempt, remaining_regenerations, poll_after_ms }
  } catch (error) {
    console.error("🚨 [Lookbook] 생성 요청 실패:", error.response?.data || error);
    throw error;
  }
};

/**
 * 3. 화보 생성 비동기 작업(Job) 상태 폴링 조회
 * GET /api/v1/lookbooks/jobs/{job_id}
 * @param {string} jobId - 작업 ID
 */
export const checkJobStatus = async (jobId) => {
  try {
    const visitToken = sessionStorage.getItem("visit_token");
    const headers = {};
    if (visitToken) {
      headers["X-Visit-Token"] = visitToken;
    }

    const response = await api.get(`/lookbooks/jobs/${jobId}`, {
      headers,
    });

    return response.data;
  } catch (error) {
    console.error("🚨 [Job Status] 상태 확인 실패:", error.response?.data || error);
    throw error;
  }
};

/**
 * 4. 최종 완성된 화보 상세 조회
 * GET /api/v1/lookbooks/{share_slug}
 * @param {string} shareSlug - 공유 슬러그
 */
export const getLookbookDetail = async (shareSlug) => {
  try {
    const response = await api.get(`/lookbooks/${shareSlug}`);
    return response.data;
  } catch (error) {
    console.error("🚨 [Lookbook Detail] 화보 조회 실패:", error.response?.data || error);
    throw error;
  }
};
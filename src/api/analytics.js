import { api } from "./api";

/**
 * 1. 관람 리포트 및 화보 후보 상품 6개 목록 조회
 * GET /api/v1/reports/{slug}/lookbook/candidates
 */
export const getAnalytics = async (visitId) => {
  try {
    const targetVisitId = visitId || sessionStorage.getItem("visit_id");
    const visitToken = sessionStorage.getItem("visit_token");

    if (!targetVisitId) {
      throw new Error("visit_id가 없습니다. 매장에 먼저 입장해 주세요.");
    }

    const headers = {};
    if (visitToken) {
      headers["X-Visit-Token"] = visitToken;
    }

    const response = await api.get(`/reports/${targetVisitId}/lookbook/candidates`, {
      headers,
    });

    console.log("📊 [Analytics] 리포트/후보 상품 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("🚨 [Analytics] 리포트 조회 실패:", error.response?.data || error);
    throw error;
  }
};

/**
 * 2. 선택한 아이템으로 화보 생성 요청 (비동기 작업 시작)
 * POST /api/v1/reports/{slug}/lookbook
 * @param {string} visitId - 방문 ID (slug)
 * @param {object} payload - { selected_products: ["p_101"], ... } 등 서버 요청 바디
 */
export const createLookbook = async (visitId, payload = {}) => {
  try {
    const targetVisitId = visitId || sessionStorage.getItem("visit_id");
    const visitToken = sessionStorage.getItem("visit_token");

    if (!targetVisitId) {
      throw new Error("visit_id가 없습니다.");
    }

    const headers = {};
    if (visitToken) {
      headers["X-Visit-Token"] = visitToken;
    }

    const response = await api.post(`/reports/${targetVisitId}/lookbook`, payload, {
      headers,
    });

    console.log("🎨 [Lookbook] 생성 요청 접수 (202):", response.data);
    return response.data; // { job_id, share_slug, poll_after_ms, ... }
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
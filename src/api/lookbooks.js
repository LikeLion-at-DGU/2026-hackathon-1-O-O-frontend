import { logger } from "../utils/logger";
import { api, publicApi } from "./api";

/**
 * 화보 후보 상품 조회
 * GET /api/v1/reports/{slug}/lookbook/candidates
 */
export const getLookbookCandidates = async (slug) => {
  if (!slug) {
    throw new Error("리포트 slug가 없습니다.");
  }

  const response = await api.get(
    `/reports/${slug}/lookbook/candidates`
  );

  return response.data;
};

/**
 * 사진·마스크 업로드용 URL 발급
 * POST /api/v1/uploads/presign
 */
export const requestUploadUrls = async ({
  contentType,
  byteSize,
}) => {
  const response = await api.post("/uploads/presign", {
    content_type: contentType,
    byte_size: byteSize,
  });

  return response.data;
};

/**
 * 화보 생성 요청
 * POST /api/v1/reports/{slug}/lookbook
 */
export const createLookbook = async (slug, payload) => {
  if (!slug) {
    throw new Error("리포트 slug가 없습니다.");
  }

  const endpoint = `/reports/${slug}/lookbook`;

  // photo_key·마스크 키가 든 payload 전체는 남기지 않는다
  logger.debug("[Lookbook] 화보 생성 POST 요청", {
    endpoint,
    productCount: payload?.product_ids?.length ?? 0,
    hasMask: Boolean(payload?.mask_key),
  });

  try {
    const response = await api.post(
      endpoint,
      payload
    );

    logger.debug("[Lookbook] 화보 생성 POST 응답", {
      endpoint,
      status: response.status,
      shareSlug: response.data?.share_slug,
    });

    return response.data;
  } catch (error) {
    console.error(
      "[Lookbook] 화보 생성 POST 실패",
      {
        endpoint,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      }
    );

    throw error;
  }
};

/**
 * 화보 생성 상태 조회
 * GET /api/v1/lookbooks/jobs/{job_id}
 *
 * 명세상 X-Visit-Token 인증 예외
 */
export const getLookbookJob = async (jobId) => {
  if (!jobId) {
    throw new Error("화보 생성 job_id가 없습니다.");
  }

  const response = await publicApi.get(
    `/lookbooks/jobs/${jobId}`
  );

  return response.data;
};

/**
 * 완성 화보 조회
 * GET /api/v1/lookbooks/{share_slug}
 *
 * X-Visit-Token 인증 필요
 */
export const getLookbook = async (
  shareSlug
) => {
  if (!shareSlug) {
    throw new Error(
      "화보 share_slug가 없습니다."
    );
  }

  const response = await api.get(
    `/lookbooks/${shareSlug}`
  );

  return response.data;
};

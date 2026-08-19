import { api } from "./api";

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

  const response = await api.post(
    `/reports/${slug}/lookbook`,
    payload
  );

  return response.data;
};

/**
 * 화보 생성 상태 조회
 * GET /api/v1/lookbooks/jobs/{job_id}
 *
 * 인증이 필요 없는 공개 API
 */
export const getLookbookJob = async (jobId) => {
  if (!jobId) {
    throw new Error("화보 생성 job_id가 없습니다.");
  }

  const response = await api.get(
    `/lookbooks/jobs/${jobId}`
  );

  return response.data;
};

/**
 * 완성 화보 조회
 * GET /api/v1/lookbooks/{share_slug}
 *
 * 인증이 필요 없는 공개 API
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

  const data = response.data;

  /*
   * 백엔드가 /media/... 형태의 상대경로를 주면
   * 백엔드 origin을 붙여 전체 URL
   */
  if (
    data?.image_url &&
    !data.image_url.startsWith("http")
  ) {
    const apiBaseUrl =
      import.meta.env.VITE_API_BASE_URL;

    const apiOrigin = new URL(
      apiBaseUrl
    ).origin;

    data.image_url = new URL(
      data.image_url,
      apiOrigin
    ).href;
  }

  return data;
};
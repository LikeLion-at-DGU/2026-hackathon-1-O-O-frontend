import { api } from "./api";

export const getLookbookCandidates = (slug) => api.get(`/reports/${slug}/lookbook/candidates`);
export const requestUploadUrls = (contentType, byteSize) => api.post("/uploads/presign", { content_type: contentType, byte_size: byteSize });
export const uploadFile = async (url, file, headers) => {
  const response = await fetch(url, { method: "PUT", headers, body: file });
  if (!response.ok) throw new Error(`이미지 업로드 실패: ${response.status}`);
};
export const createLookbook = (slug, payload) => api.post(`/reports/${slug}/lookbook`, payload);
export const getLookbookJob = (jobId) => api.get(`/lookbooks/jobs/${jobId}`);
export const getLookbook = (shareSlug) => api.get(`/lookbooks/${shareSlug}`);

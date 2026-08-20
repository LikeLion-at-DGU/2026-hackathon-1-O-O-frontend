// 라우트 경로의 단일 출처. Route 정의와 navigate가 같은 값을 쓰게 해서
// /analtytics 같은 오타 라우팅이 컴파일 타임에 드러나도록 한다.
export const PATHS = {
  LANDING: "/",
  HOME: "/home",
  MAP: "/map",
  GUIDE: "/guide",
  CHAT: "/chat",
  ANALYTICS: "/analytics",
  ANALYTICS_LOADING: "/analytics-loading",
  CAMERA: "/camera",
  CAMERA_CONFIRM: "/camera/confirm",
  LOOKBOOK: "/lookbook",
  LOOKBOOK_LOADING_PREVIEW: "/lookbook-loading-preview",
};

export const shelfPath = (zoneId) => `/shelf/${zoneId}`;
export const productPath = (productId) => `/product/${productId}`;
export const lookbookPath = (shareSlug) => `/lookbook/${shareSlug}`;
export const analyticsPath = (slug) => `${PATHS.ANALYTICS}/${slug}`;

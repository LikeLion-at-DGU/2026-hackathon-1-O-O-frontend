// 방문 인증 값 저장소 유틸.
//
// visitId/visit_id, visitToken/visit_token, anonymousUuid/anonymous_uuid가
// 파일마다 다르게 읽혀 어떤 화면은 되고 어떤 화면은 안 되는 문제가 있었다.
// 표준 키는 snake_case 하나이고, 과거 세션이 남긴 camelCase 키는
// 읽기에서만 폴백한다. 새 저장은 표준 키로만 한다.

export const STORAGE_KEYS = {
  VISIT_ID: "visit_id",
  VISIT_TOKEN: "visit_token",
  ANONYMOUS_UUID: "anonymous_uuid",
  SCENES: "scenes",
  REPORT_SLUG: "report_slug",
};

const LEGACY_KEYS = {
  [STORAGE_KEYS.VISIT_ID]: "visitId",
  [STORAGE_KEYS.VISIT_TOKEN]: "visitToken",
  [STORAGE_KEYS.ANONYMOUS_UUID]: "anonymousUuid",
};

const readKey = (key) => {
  const legacy = LEGACY_KEYS[key];
  return (
    localStorage.getItem(key) ||
    sessionStorage.getItem(key) ||
    (legacy && (localStorage.getItem(legacy) || sessionStorage.getItem(legacy))) ||
    ""
  );
};

export const getVisitId = () => readKey(STORAGE_KEYS.VISIT_ID);
export const getVisitToken = () => readKey(STORAGE_KEYS.VISIT_TOKEN);
export const getAnonymousUuid = () => readKey(STORAGE_KEYS.ANONYMOUS_UUID);

export const getReportSlug = () => sessionStorage.getItem(STORAGE_KEYS.REPORT_SLUG) || "";
export const isVisitFinished = () => Boolean(getReportSlug());

export const saveVisitAuth = ({ anonymous_uuid, visit_id, visit_token }) => {
  if (anonymous_uuid) {
    localStorage.setItem(STORAGE_KEYS.ANONYMOUS_UUID, anonymous_uuid);
  }
  if (visit_token) {
    localStorage.setItem(STORAGE_KEYS.VISIT_TOKEN, visit_token);
    sessionStorage.setItem(STORAGE_KEYS.VISIT_TOKEN, visit_token);
  }
  if (visit_id) {
    localStorage.setItem(STORAGE_KEYS.VISIT_ID, String(visit_id));
    sessionStorage.setItem(STORAGE_KEYS.VISIT_ID, String(visit_id));
  }
};

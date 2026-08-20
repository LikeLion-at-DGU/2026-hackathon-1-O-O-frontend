// 화보 생성 job 폴링의 판정 규칙 순수 로직.
// useLookbookPolling이 사용하며, 상태 문자열 해석·진행률 정규화·실패 안내
// 문구 결정을 여기 모아 단위 테스트로 고정한다.

const COMPLETE_STATUSES = [
  "ready",
  "completed",
  "succeeded",
  "success",
];

const FAILED_STATUSES = ["failed", "error"];

/**
 * 서버 status 문자열을 소문자로 정규화한다. (서버가 대소문자를 섞어 보낸다)
 */
export const normalizeJobStatus = (status) => String(status || "").toLowerCase();

export const isCompleteStatus = (status) =>
  COMPLETE_STATUSES.includes(normalizeJobStatus(status));

export const isFailedStatus = (status) =>
  FAILED_STATUSES.includes(normalizeJobStatus(status));

/**
 * 서버 progress는 0~1 비율일 수도, 0~100 퍼센트일 수도 있다.
 * 항상 0~100 정수 퍼센트로 정규화한다.
 */
export const normalizeJobProgress = (rawValue) => {
  const raw = Number(rawValue) || 0;
  return raw <= 1 ? Math.round(raw * 100) : Math.round(raw);
};

/**
 * job 실패 시 사용자에게 보여줄 안내 문구를 결정한다.
 * - 콘텐츠 차단(GEN_CONTENT_BLOCKED): 다른 사진으로 재촬영 유도
 * - 재시도 가능: 지연 안내 후 재시도 유도
 * - 그 외: 실패 안내
 */
export const getJobFailureMessage = ({ errorCode, retryable }) => {
  if (errorCode === "GEN_CONTENT_BLOCKED") {
    return "사진을 처리할 수 없습니다. 다른 사진으로 다시 촬영해 주세요.";
  }
  if (retryable) {
    return "화보 생성이 잠시 지연됐습니다. 다시 시도해 주세요.";
  }
  return "화보 생성에 실패했습니다.";
};

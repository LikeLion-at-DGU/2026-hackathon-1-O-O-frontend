// 로그 유틸. debug/info는 개발 환경에서만 출력하고, 오류는 항상 남긴다.
// 어느 레벨에서도 토큰·사진 데이터·presigned URL·전체 행동 payload는 찍지 않는다
// — 값이 필요한 곳은 개수·상태코드·키 존재 여부 같은 최소 정보로 줄인다.
const isDev = import.meta.env.DEV;

export const logger = {
  debug: (...args) => {
    if (isDev) console.log(...args);
  },
  info: (...args) => {
    if (isDev) console.info(...args);
  },
  warn: (...args) => {
    console.warn(...args);
  },
  error: (...args) => {
    console.error(...args);
  },
};

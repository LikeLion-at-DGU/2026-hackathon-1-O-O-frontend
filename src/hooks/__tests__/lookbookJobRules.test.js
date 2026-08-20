import { describe, it, expect } from "vitest";
import {
  normalizeJobStatus,
  isCompleteStatus,
  isFailedStatus,
  normalizeJobProgress,
  getJobFailureMessage,
} from "../lookbookJobRules";

describe("job 상태 판정", () => {
  it("완료 상태 문자열들을 모두 완료로 판정한다", () => {
    ["ready", "completed", "succeeded", "success"].forEach((status) => {
      expect(isCompleteStatus(status)).toBe(true);
    });
  });

  it("서버가 대문자로 보내도 판정한다", () => {
    expect(isCompleteStatus("READY")).toBe(true);
    expect(isFailedStatus("Failed")).toBe(true);
  });

  it("실패 상태를 판정한다", () => {
    expect(isFailedStatus("failed")).toBe(true);
    expect(isFailedStatus("error")).toBe(true);
  });

  it("진행 중 상태는 완료도 실패도 아니다", () => {
    ["pending", "processing", "", null, undefined].forEach((status) => {
      expect(isCompleteStatus(status)).toBe(false);
      expect(isFailedStatus(status)).toBe(false);
    });
  });

  it("normalizeJobStatus는 null도 빈 문자열로 처리한다", () => {
    expect(normalizeJobStatus(null)).toBe("");
    expect(normalizeJobStatus("Ready")).toBe("ready");
  });
});

describe("normalizeJobProgress", () => {
  it("0~1 비율은 퍼센트로 변환한다", () => {
    expect(normalizeJobProgress(0.58)).toBe(58);
    expect(normalizeJobProgress(1)).toBe(100);
  });

  it("이미 퍼센트인 값은 반올림만 한다", () => {
    expect(normalizeJobProgress(58)).toBe(58);
    expect(normalizeJobProgress(99.6)).toBe(100);
  });

  it("숫자가 아니면 0으로 처리한다", () => {
    expect(normalizeJobProgress(undefined)).toBe(0);
    expect(normalizeJobProgress("abc")).toBe(0);
  });
});

describe("getJobFailureMessage", () => {
  it("콘텐츠 차단은 재촬영을 안내한다", () => {
    expect(
      getJobFailureMessage({ errorCode: "GEN_CONTENT_BLOCKED", retryable: true })
    ).toContain("다시 촬영");
  });

  it("재시도 가능한 실패는 재시도를 안내한다", () => {
    expect(
      getJobFailureMessage({ errorCode: "", retryable: true })
    ).toContain("다시 시도");
  });

  it("그 외 실패는 실패 안내를 반환한다", () => {
    expect(getJobFailureMessage({ errorCode: "", retryable: false })).toBe(
      "화보 생성에 실패했습니다."
    );
  });
});

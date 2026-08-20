import { describe, it, expect, beforeEach } from "vitest";
import {
  STORAGE_KEYS,
  getVisitId,
  getVisitToken,
  getAnonymousUuid,
  getReportSlug,
  isVisitFinished,
  saveVisitAuth,
} from "../storage";

// Node 환경에는 Web Storage가 없으므로 동작이 동일한 최소 구현을 주입한다.
const createStorageMock = () => {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  };
};

beforeEach(() => {
  globalThis.localStorage = createStorageMock();
  globalThis.sessionStorage = createStorageMock();
});

describe("saveVisitAuth / 읽기", () => {
  it("표준 snake_case 키로 저장하고 그대로 읽는다", () => {
    saveVisitAuth({
      anonymous_uuid: "uuid-1",
      visit_id: 42,
      visit_token: "token-1",
    });

    expect(getAnonymousUuid()).toBe("uuid-1");
    expect(getVisitId()).toBe("42");
    expect(getVisitToken()).toBe("token-1");
    expect(localStorage.getItem(STORAGE_KEYS.VISIT_ID)).toBe("42");
  });

  it("값이 없는 필드는 저장하지 않는다", () => {
    saveVisitAuth({ visit_id: 7 });

    expect(getVisitId()).toBe("7");
    expect(getVisitToken()).toBe("");
    expect(getAnonymousUuid()).toBe("");
  });
});

describe("과거 세션(camelCase 키) 폴백", () => {
  it("표준 키가 없으면 legacy visitId 키를 읽는다", () => {
    localStorage.setItem("visitId", "legacy-visit");

    expect(getVisitId()).toBe("legacy-visit");
  });

  it("표준 키가 있으면 legacy 키보다 우선한다", () => {
    localStorage.setItem("visitId", "legacy-visit");
    localStorage.setItem(STORAGE_KEYS.VISIT_ID, "new-visit");

    expect(getVisitId()).toBe("new-visit");
  });

  it("sessionStorage에만 있어도 읽는다", () => {
    sessionStorage.setItem(STORAGE_KEYS.VISIT_TOKEN, "session-token");

    expect(getVisitToken()).toBe("session-token");
  });
});

describe("방문 종료 상태", () => {
  it("report_slug가 없으면 방문이 끝나지 않은 상태다", () => {
    expect(getReportSlug()).toBe("");
    expect(isVisitFinished()).toBe(false);
  });

  it("report_slug가 저장되면 방문 종료로 판단한다", () => {
    sessionStorage.setItem(STORAGE_KEYS.REPORT_SLUG, "abc123");

    expect(getReportSlug()).toBe("abc123");
    expect(isVisitFinished()).toBe(true);
  });
});

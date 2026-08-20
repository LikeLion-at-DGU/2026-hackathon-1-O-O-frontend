import { describe, it, expect } from "vitest";
import {
  newLocalId,
  isHiddenClickLog,
  normalizeServerMessage,
  prepareServerMessages,
  keepPendingLocalMessages,
} from "../chatMessages";

describe("newLocalId", () => {
  it("local- 접두어가 붙은 고유 id를 만든다", () => {
    const a = newLocalId();
    const b = newLocalId();

    expect(a.startsWith("local-")).toBe(true);
    expect(a).not.toBe(b);
  });
});

describe("isHiddenClickLog", () => {
  it("진열대 클릭 로그는 화면에서 숨긴다", () => {
    expect(
      isHiddenClickLog({ role: "user_action", content: "5번 진열대 클릭" })
    ).toBe(true);
  });

  it("상품 클릭·프리셋 버튼 로그도 숨긴다", () => {
    expect(
      isHiddenClickLog({ role: "user_action", content: "스타크 백팩 상품 클릭" })
    ).toBe(true);
    expect(isHiddenClickLog({ role: "user_action", content: "가격" })).toBe(true);
    expect(
      isHiddenClickLog({ role: "user_action", content: "디자인 의도" })
    ).toBe(true);
  });

  it("일반 사용자 메시지는 숨기지 않는다", () => {
    expect(isHiddenClickLog({ role: "user", content: "가격" })).toBe(false);
    expect(
      isHiddenClickLog({ role: "user_action", content: "이 가방 얼마예요?" })
    ).toBe(false);
  });
});

describe("normalizeServerMessage", () => {
  it("assistant 역할을 assistant 타입으로 변환한다", () => {
    const result = normalizeServerMessage({
      message_id: "m1",
      role: "assistant",
      content: "안녕하세요",
      created_at: "2026-08-21T00:00:00Z",
    });

    expect(result).toEqual({
      id: "m1",
      type: "assistant",
      role: "assistant",
      text: "안녕하세요",
      createdAt: "2026-08-21T00:00:00Z",
    });
  });

  it("preset 역할도 assistant 타입으로 취급한다", () => {
    expect(
      normalizeServerMessage({ message_id: "m2", role: "preset", content: "x" })
        .type
    ).toBe("assistant");
  });

  it("그 외 역할은 user 타입이다", () => {
    expect(
      normalizeServerMessage({ message_id: "m3", role: "user", content: "x" })
        .type
    ).toBe("user");
  });
});

describe("prepareServerMessages", () => {
  it("숨김 클릭 로그를 거르고 정규화한다", () => {
    const result = prepareServerMessages([
      { message_id: "m1", role: "user_action", content: "3번 진열대 클릭" },
      { message_id: "m2", role: "assistant", content: "안내드릴게요" },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ id: "m2", text: "안내드릴게요" });
  });

  it("null/undefined 입력도 빈 배열로 처리한다", () => {
    expect(prepareServerMessages(null)).toEqual([]);
    expect(prepareServerMessages(undefined)).toEqual([]);
  });
});

describe("keepPendingLocalMessages", () => {
  const messages = [
    { id: "init", text: "환영" },
    { id: "srv-1", text: "서버 메시지" },
    { id: "local-abc", text: "전송 직후 임시 메시지" },
    { id: "stream-xyz", text: "스트리밍 중 메시지" },
  ];

  it("local-/stream- 접두어 메시지만 남긴다", () => {
    const result = keepPendingLocalMessages(messages, new Set());

    expect(result.map((m) => m.id)).toEqual(["local-abc", "stream-xyz"]);
  });

  it("서버가 이미 같은 id를 돌려줬다면 중복 방지를 위해 제외한다", () => {
    const result = keepPendingLocalMessages(messages, new Set(["local-abc"]));

    expect(result.map((m) => m.id)).toEqual(["stream-xyz"]);
  });
});

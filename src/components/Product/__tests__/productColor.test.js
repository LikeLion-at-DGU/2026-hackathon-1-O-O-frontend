import { describe, it, expect } from "vitest";
import {
  normalizeColorValues,
  formatProductColor,
} from "../productColor";

// 서버 응답의 color 필드는 문자열, 배열, "색상:" 접두어, 구분자 포함 등
// 형태가 제각각이다. 어떤 형태로 와도 화면에는 대표 색상 한 가지만
// 정확히 나오는지 검증한다.
describe("normalizeColorValues", () => {
  it("단일 문자열을 배열로 정규화한다", () => {
    expect(normalizeColorValues("블랙")).toEqual(["블랙"]);
  });

  it("배열 안의 중복 색상을 제거한다", () => {
    expect(normalizeColorValues(["블랙", "블랙"])).toEqual(["블랙"]);
  });

  it("대소문자만 다른 중복도 하나로 합친다", () => {
    expect(normalizeColorValues(["Black", "black"])).toHaveLength(1);
  });

  it('"블랙, 블랙"처럼 한 문자열 안의 콤마 중복을 분리해 제거한다', () => {
    expect(normalizeColorValues("블랙, 블랙")).toEqual(["블랙"]);
  });

  it('"색상: " / "color: " 접두어를 제거한다', () => {
    expect(normalizeColorValues("색상: 코냑")).toEqual(["코냑"]);
    expect(normalizeColorValues("Color: Cognac")).toEqual(["Cognac"]);
  });

  it("빈 값·공백·비문자열은 걸러낸다", () => {
    expect(normalizeColorValues(["", "  ", null, undefined, 3, "블랙"])).toEqual([
      "블랙",
    ]);
    expect(normalizeColorValues(undefined)).toEqual([]);
  });
});

describe("formatProductColor", () => {
  it("attributes.color의 대표 색상 한 가지만 반환한다", () => {
    expect(
      formatProductColor({ attributes: { color: ["코냑", "블랙"] } })
    ).toBe("코냑");
  });

  it("중복된 색상이 와도 한 번만 노출한다", () => {
    expect(
      formatProductColor({ attributes: { color: "블랙, 블랙" } })
    ).toBe("블랙");
  });

  it("최상위 color는 읽지 않는다 (화면이 두 번 바뀌는 원인 차단)", () => {
    expect(
      formatProductColor({ color: "레드", attributes: {} })
    ).toBe("색상 정보 없음");
  });

  it("색상 정보가 없으면 안내 문구를 반환한다", () => {
    expect(formatProductColor(null)).toBe("색상 정보 없음");
    expect(formatProductColor({})).toBe("색상 정보 없음");
  });
});

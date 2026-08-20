import { describe, it, expect } from "vitest";
import {
  PATHS,
  shelfPath,
  productPath,
  lookbookPath,
  analyticsPath,
} from "../paths";

// Route 정의와 navigate가 같은 헬퍼를 쓰는지가 라우팅 오타 방지의 핵심이다.
describe("경로 헬퍼", () => {
  it("진열대 경로를 zoneId로 만든다", () => {
    expect(shelfPath("05")).toBe("/shelf/05");
  });

  it("상품 상세 경로를 productId로 만든다", () => {
    expect(productPath("p_101")).toBe("/product/p_101");
  });

  it("화보 공유 경로를 shareSlug로 만든다", () => {
    expect(lookbookPath("abc123")).toBe(`${PATHS.LOOKBOOK}/abc123`);
  });

  it("리포트 경로를 slug로 만든다", () => {
    expect(analyticsPath("xyz")).toBe(`${PATHS.ANALYTICS}/xyz`);
  });
});

describe("PATHS 상수", () => {
  it("모든 경로는 /로 시작한다", () => {
    Object.values(PATHS).forEach((path) => {
      expect(path.startsWith("/")).toBe(true);
    });
  });

  it("삭제된 /home 경로는 더 이상 존재하지 않는다", () => {
    expect(Object.values(PATHS)).not.toContain("/home");
  });
});

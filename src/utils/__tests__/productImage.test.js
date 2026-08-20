import { describe, it, expect } from "vitest";
import { getLocalProductImage } from "../productImage";

describe("getLocalProductImage", () => {
  it("상품 id로 로컬 이미지 경로를 만든다", () => {
    expect(getLocalProductImage("p_101")).toBe("/images/p_101-Photoroom.png");
  });

  it("원본 파일명이 뒤바뀐 스카프(p_416↔p_418)는 교차 연결한다", () => {
    expect(getLocalProductImage("p_416")).toBe("/images/p_418-Photoroom.png");
    expect(getLocalProductImage("p_418")).toBe("/images/p_416-Photoroom.png");
  });

  it("id가 비어 있어도 예외 없이 경로를 반환한다", () => {
    expect(getLocalProductImage(undefined)).toBe("/images/-Photoroom.png");
  });
});

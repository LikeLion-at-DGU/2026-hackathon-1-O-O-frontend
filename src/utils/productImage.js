const PRODUCT_IMAGE_OVERRIDES = {
  // 4번 진열대의 red/blue 스카프 원본 파일명이 서로 바뀌어 있다.
  // 상품 id는 그대로 유지하고 표시 이미지 경로만 올바른 색상으로 교차 연결한다.
  p_416: "p_418",
  p_418: "p_416",
};

export const getLocalProductImage = (productId) => {
  const normalizedId = String(productId || "");
  const imageId = PRODUCT_IMAGE_OVERRIDES[normalizedId] ?? normalizedId;

  return `/images/${imageId}-Photoroom.png`;
};

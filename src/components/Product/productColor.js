// 상품 색상 표시 규칙.
//
// 서버 응답의 color는 문자열/배열/"색상:" 접두어/콤마 중복 등 형태가
// 제각각이라, 화면에 내보내기 전에 여기서 한 번 정규화한다.

export const normalizeColorValues = (color) => {
  const values = Array.isArray(color) ? color : [color];

  return [...new Map(
    values
      .filter((value) => typeof value === "string" && value.trim())
      // "블랙, 블랙"처럼 한 문자열 안에 구분자로 중복이 들어오는 응답도 분리한다
      .flatMap((value) => value.split(/[,/·]/))
      .map((value) => value.trim().replace(/^(?:색상|color)\s*:\s*/i, ""))
      .filter(Boolean)
      .map((value) => [value.toLocaleLowerCase(), value])
  ).values()];
};

// 표시용 색상은 attributes.color만 사용한다. 최상위 color는 값이 달라
// 화면이 두 번 바뀌는 원인이 되므로 읽지 않고, 대표 색상 한 가지만 노출한다.
export const formatProductColor = (product) => {
  const attributeColors = normalizeColorValues(product?.attributes?.color);

  return attributeColors[0] || "색상 정보 없음";
};

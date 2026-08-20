// src/components/Product/ProductInfo.jsx
import { useState } from "react";
import * as S from "./ProductInfo.styled";

const PRESET_BUTTONS = [
  { key: "price", label: "가격" },
  { key: "material", label: "재질" },
  { key: "design_intent", label: "디자인 의도" },
];

const normalizeColorValues = (color) => {
  const values = Array.isArray(color) ? color : [color];

  return [...new Map(
    values
      .filter((value) => typeof value === "string" && value.trim())
      .map((value) => {
        const normalized = value
          .trim()
          .replace(/^(?:색상|color)\s*:\s*/i, "");
        return [normalized.toLocaleLowerCase(), normalized];
      })
  ).values()];
};

// 상세 응답의 표시용 색상은 attributes.color가 기준이다. 최상위 color와
// 같은 값이 중복되어도 한 번만 노출하고, 구형 응답에서 attributes.color가
// 비어 있을 때만 최상위 color를 보조값으로 사용한다.
const formatProductColor = (product) => {
  const attributeColors = normalizeColorValues(product?.attributes?.color);
  const fallbackColors = normalizeColorValues(product?.color);
  const colors = attributeColors.length ? attributeColors : fallbackColors;

  return colors.join(", ") || "색상 정보 없음";
};

function ProductInfo({
  product,
  productName,
  productImage,
  loading,
}) {
  const [selectedPreset, setSelectedPreset] = useState(null);

  // 가격·재질·디자인 의도는 상세 화면에서 읽기만 하는 정보다. 채팅 타임라인이나
  // 질문 이벤트를 만들지 않고 현재 팝업만 열고 닫는다.
  const handlePresetClick = (key) => {
    const isClosing = selectedPreset === key;
    setSelectedPreset(isClosing ? null : key);
  };

  const handleCloseModal = () => {
    setSelectedPreset(null);
  };

  const selectedAnswer = selectedPreset
    ? product?.preset_answers?.[selectedPreset]
    : null;

  const getModalAnswer = () => {
    if (!selectedPreset) return "";

    if (selectedPreset === "price") {
      const rawPrice = product?.price || product?.attributes?.price;
      if (rawPrice) {
        return `₩${Number(rawPrice).toLocaleString()}`;
      }
    }

    return (
      selectedAnswer ??
      product?.attributes?.[selectedPreset] ??
      "해당 정보가 없습니다."
    );
  };

  return (
    <S.ProductArea>
      {/* ⭐️ 4. 좌측 상단 뒤로가기 버튼 배치 */}

      <S.ProductWrapper>
        <S.ProductImageBox>
          <S.ProductImage src={productImage} alt={productName} />
        </S.ProductImageBox>

        <S.TextWrapper>
          <S.ProductTitle>{productName}</S.ProductTitle>
          <S.ProductColor>
            색상 : {loading ? "확인 중..." : formatProductColor(product)}
          </S.ProductColor>
        </S.TextWrapper>
      </S.ProductWrapper>

      <S.DetailButtonWrapper>
        {PRESET_BUTTONS.map(({ key, label }) => (
          <S.DetailButtonGroup key={key}>
            <S.DetailButton
              type="button"
              onClick={() => handlePresetClick(key)}
            >
              <span>{label}</span>
              <span>＋</span>
            </S.DetailButton>
          </S.DetailButtonGroup>
        ))}
      </S.DetailButtonWrapper>

      {/* 중앙 팝업 모달 */}
      {selectedPreset && (
        <S.ModalOverlay onClick={handleCloseModal}>
          <S.ModalBox onClick={(e) => e.stopPropagation()}>
            <S.ModalText>{getModalAnswer()}</S.ModalText>
          </S.ModalBox>
        </S.ModalOverlay>
      )}
    </S.ProductArea>
  );
}

export default ProductInfo;

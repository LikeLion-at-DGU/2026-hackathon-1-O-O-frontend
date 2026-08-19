import { useState, useEffect } from "react";
import * as S from "./ProductInfo.styled";

const PRESET_BUTTONS = [
  { key: "price", label: "가격" },
  { key: "material", label: "재질" },
  { key: "design_intent", label: "디자인 의도" },
];

function ProductInfo({
  product,
  productName,
  productImage,
}) {
  const [selectedPreset, setSelectedPreset] =
    useState(null);

  const handlePresetClick = (key) => {
    setSelectedPreset((current) =>
      current === key ? null : key
    );
  };

  const selectedAnswer =
    selectedPreset
      ? product?.preset_answers?.[selectedPreset]
      : null;

      useEffect(() => {
  if (!product) return;

  console.log("상품 상세 API 전체 응답:", product);
  console.log(
    "프리셋 답변:",
    product.preset_answers
  );
  console.log(
    "가격 답변:",
    product.preset_answers?.price
  );
  console.log(
    "재질 답변:",
    product.preset_answers?.material
  );
  console.log(
    "디자인 의도 답변:",
    product.preset_answers?.design_intent
  );
}, [product]);

  return (
    <S.ProductArea>
      <S.ProductWrapper>
        <S.ProductImageBox>
          <S.ProductImage
            src={productImage}
            alt={productName}
          />
        </S.ProductImageBox>

        <S.TextWrapper>
          <S.ProductTitle>
            {productName}
          </S.ProductTitle>

          <S.ProductColor>
            색상 :{" "}
            {product?.attributes?.color ??
              "정보 없음"}
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
              <span>
                {selectedPreset === key ? "−" : "＋"}
              </span>
            </S.DetailButton>

            {selectedPreset === key && (
              <S.PresetAnswer>
                {selectedAnswer ??
                  "해당 정보가 없습니다."}
              </S.PresetAnswer>
            )}
          </S.DetailButtonGroup>
        ))}
      </S.DetailButtonWrapper>
    </S.ProductArea>
  );
}

export default ProductInfo;
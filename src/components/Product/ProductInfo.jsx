// src/components/Product/ProductInfo.jsx
import { useState } from "react";
import { createChatMessage } from "../../api/chat";
import { isVisitFinished } from "../../utils/storage";
import * as S from "./ProductInfo.styled";

const PRESET_BUTTONS = [
  { key: "price", label: "가격" },
  { key: "material", label: "재질" },
  { key: "design_intent", label: "디자인 의도" },
];

// attributes.color는 문자열이 기본이지만 데이터에 따라 배열일 수 있다.
// 다른 속성으로 색상을 대체하지 않고, 값이 없을 때만 없음을 표시한다.
const formatProductColor = (color) => {
  if (Array.isArray(color)) return color.filter(Boolean).join(", ") || "색상 정보 없음";
  if (typeof color === "string" && color.trim()) return color.trim();
  return "색상 정보 없음";
};

function ProductInfo({
  product,
  productName,
  productImage,
  productId,
  loading,
  onQuestionClick,
}) {
  const [selectedPreset, setSelectedPreset] = useState(null);

  const targetProductId = productId || product?.product_id || product?.id;

  // 서버 타임라인에 프리셋 열람을 남긴다. 이걸 안 보내서 패디의 프리셋 답변
  // 말풍선이 한 번도 생성되지 않았다. 관람 종료 후에는 403이라 보내지 않는다.
  const sendPresetView = (key) => {
    if (isVisitFinished() || !targetProductId) return;
    createChatMessage({
      type: "preset_view",
      product_id: String(targetProductId),
      preset_key: key,
    }).catch((error) => {
      console.warn("프리셋 열람 기록 실패:", error.response?.data ?? error);
    });
  };

  // 프리셋 모달 체류는 더 이상 product_dwell로 보내지 않는다 — 페이지 체류와
  // 같은 타입이라 같은 구간이 중복 계상됐다. 클릭 자체는 question_submit
  // (onQuestionClick)과 preset_view(위)로 남는다.
  // 이벤트 전송은 updater 밖에서 한다 — StrictMode는 updater를 두 번 실행할
  // 수 있어, 안에 두면 같은 클릭이 서버에 두 번 기록된다.
  const handlePresetClick = (key, label) => {
    const isClosing = selectedPreset === key;
    setSelectedPreset(isClosing ? null : key);
    if (isClosing) return;

    if (typeof onQuestionClick === "function") {
      onQuestionClick(label);
    }
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
            색상 : {loading ? "확인 중..." : formatProductColor(product?.attributes?.color)}
          </S.ProductColor>
        </S.TextWrapper>
      </S.ProductWrapper>

      <S.DetailButtonWrapper>
        {PRESET_BUTTONS.map(({ key, label }) => (
          <S.DetailButtonGroup key={key}>
            <S.DetailButton
              type="button"
              onClick={() => handlePresetClick(key, label)}
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

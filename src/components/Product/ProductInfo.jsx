// src/components/Product/ProductInfo.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // ⭐️ 1. useNavigate 추가
import { sendEvent } from "../../api/events";
import * as S from "./ProductInfo.styled";
import BackButton from "../Shelf/icon/BackButton"; // ⭐️ 2. BackButton 컴포넌트 import

const PRESET_BUTTONS = [
  { key: "price", label: "가격" },
  { key: "material", label: "재질" },
  { key: "design_intent", label: "디자인 의도" },
];

function ProductInfo({
  product,
  productName,
  productImage,
  productId,
  onQuestionClick,
}) {
  const navigate = useNavigate(); // ⭐️ 3. navigate 선언
  const [selectedPreset, setSelectedPreset] = useState(null);

  // 프리셋 모달 체류시간 측정을 위한 Ref
  const presetStartTimeRef = useRef(null);
  const currentPresetRef = useRef(null);

  const targetProductId = productId || product?.product_id || product?.id;

  // 모달 체류 정산 함수
  const flushPresetDwell = (presetKey) => {
    if (!presetStartTimeRef.current || !presetKey) return;

    const dwellMs = Date.now() - presetStartTimeRef.current;
    presetStartTimeRef.current = null;

    if (dwellMs >= 500) {
      console.log(
        `⏱️ [항목 체류 정산] ${productName} - ${presetKey}: ${Math.round(dwellMs / 1000)}초 (${dwellMs}ms)`
      );

      sendEvent({
        event_type: "question_dwell",
        product_id: String(targetProductId),
        metadata: {
          preset_key: presetKey,
          question_type: presetKey,
          dwell_ms: dwellMs,
          dwell_time_ms: dwellMs,
          dwell_sec: Math.round(dwellMs / 1000),
          product_name: productName,
        },
      });
    }
  };

  // 버튼 클릭 시 이벤트 전송 및 타이머 시작
  const handlePresetClick = (key, label) => {
    setSelectedPreset((current) => {
      if (current === key) {
        flushPresetDwell(current);
        currentPresetRef.current = null;
        return null;
      }

      if (current) {
        flushPresetDwell(current);
      }

      if (typeof onQuestionClick === "function") {
        onQuestionClick(label);
      }

      currentPresetRef.current = key;
      presetStartTimeRef.current = Date.now();
      console.log(`⏱️ [항목 확인 시작] ${label} (${key})`);

      return key;
    });
  };

  // 모달 딤 배경 클릭해서 닫을 때 정산
  const handleCloseModal = () => {
    if (currentPresetRef.current) {
      flushPresetDwell(currentPresetRef.current);
      currentPresetRef.current = null;
    }
    setSelectedPreset(null);
  };

  // 모달 열린 채로 페이지 뒤로가기 시 정산
  useEffect(() => {
    return () => {
      if (currentPresetRef.current) {
        flushPresetDwell(currentPresetRef.current);
      }
    };
  }, []);

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
      <BackButton onClick={() => navigate(-1)} />

      <S.ProductWrapper>
        <S.ProductImageBox>
          <S.ProductImage src={productImage} alt={productName} />
        </S.ProductImageBox>

        <S.TextWrapper>
          <S.ProductTitle>{productName}</S.ProductTitle>
          <S.ProductColor>
            색상 : {product?.attributes?.color ?? "정보 없음"}
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
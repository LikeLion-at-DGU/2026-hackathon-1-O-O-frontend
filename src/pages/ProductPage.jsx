// src/pages/ProductPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

import useChatStore from "../stores/useChatStore";
import * as S from "../components/Shelf/Shelf.style";
import { MessageBubble } from "../components/ChatMessage/ChatMessage.styled";
import { shelfData } from "../components/Shelf/ShelfData";

import useProduct from "../hooks/useProduct";
import useProductEvent from "../hooks/useProductEvent";
import { useDwellTimer } from "../hooks/useDwellTimer";

import ProductInfo from "../components/Product/ProductInfo";
import BackButton from "../components/Shelf/icon/BackButton";

function ProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const imageId = productId?.replace("p-", "");

  const { product, loading } = useProduct(productId);

  const productImage =
    product?.thumbnail ??
    product?.images?.thumbnail ??
    product?.images?.main ??
    `/images/${imageId}-Photoroom.png`;

  const { sendQuestionClick } = useProductEvent(productId);

  const selectedProduct = useChatStore((state) => state.selectedProduct);

  const localProduct = Object.values(shelfData)
    .flat()
    .find((item) => String(item.id) === String(productId));

  const productName =
    product?.name ??
    selectedProduct?.name ??
    localProduct?.name ??
    `상품 ${imageId}`;

  useDwellTimer({
    eventType: "product_dwell",
    targetId: productId,
    extra: {
      product_name: productName,
      scene_id: product?.scene_id || selectedProduct?.scene_id,
    },
    minDwellMs: 1000,
  });

  const handleQuestionClick = async (question) => {
    await sendQuestionClick(question);
    console.log(`${productName}에 대한 질문: ${question}`);
  };

  return (
    <S.PageContainer>
      {/* ⭐️ 선반과 100% 동일한 363x300 기준 박스 */}
      <div
        style={{
          position: "relative",
          width: "363px",
          height: "300px",
        }}
      >
        {/* ⭐️ 선반과 1픽셀 오차도 없는 정확한 좌측 상단 백버튼 위치 */}
        <div style={{ position: "absolute", top: "9px", left: "8px", zIndex: 50 }}>
          <BackButton onClick={() => navigate(-1)} />
        </div>

        <ProductInfo
          product={product}
          productName={productName}
          productImage={productImage}
          productId={productId}
          imageId={imageId}
          loading={loading}
          onQuestionClick={handleQuestionClick}
        />
      </div>
    </S.PageContainer>
  );
}

export default ProductPage;
import React from "react";
import { useParams } from "react-router-dom";
import { createPortal } from "react-dom";

import ChatMessage from "../components/ChatMessage/ChatMessage";
import useChatStore from "../stores/useChatStore";

import bearImage from "../assets/bear.png";
import * as S from "../components/Shelf/Shelf.style";
import { MessageBubble } from "../components/ChatMessage/ChatMessage.styled";

import { getProduct } from "../api/products";
import { useState,useEffect } from "react";
import { sendEvent } from "../api/events";

function ProductPage() {
    const { productId } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchProduct = async () => {
    try {
        const response = await getProduct(productId);

        setProduct(response.data);

        const visitId = sessionStorage.getItem("visit_id");

        if (visitId) {
        await sendEvent({
            visit_id: visitId,
            event_type: "PRODUCT_VIEW",
            product_id: Number(productId),
        });
        }
    } catch (error) {
        console.error("상품 조회 실패:", error);
    } finally {
        setLoading(false);
    }
    };

    fetchProduct();
    }, [productId]);

    const handleProductClick = async () => {
    const visitId = sessionStorage.getItem("visit_id");

    if (!visitId) {
    console.warn("visit_id가 없습니다.");
    return;
    }

    await sendEvent({
    visit_id: visitId,
    event_type: "PRODUCT_CLICK",
    product_id: product.id,
    });

    };

   
    const selectedZoneId = useChatStore(
        (state) => state.selectedZoneId
    );

    const selectedProduct = useChatStore(
        (state) => state.selectedProduct
    );

    const selectQuestion = useChatStore((state) => state.selectQuestion);

    const productName =
        selectedProduct?.name?.split(" - ")[1] ??
        selectedProduct?.name ??
        "선택한 상품";

    const PRODUCT_INFO = {
        "재질": selectedProduct?.material || "고급 비세토스 코팅 캔버스 소재입니다.",
        "가격": selectedProduct?.price || "공식 판매가 1,250,000원입니다.",
        "디자인 의도": selectedProduct?.concept || "클래식한 헤리티지를 현대적으로 재해석했습니다.",
    };

  const handleQuestionClick = async (question) => {
    const visitId = sessionStorage.getItem("visit_id");

    if (visitId) {
        await sendEvent({
            visit_id: visitId,
            event_type: "QUESTION_CLICK",
            product_id: Number(productId),
            question,
        }); 
    }

    console.log(
        `${productName}에 대한 질문: ${question}`
    );
};

    const chatSlot = document.getElementById("chat-bottom-slot");

    return (
        <S.PageContainer>
            {/* 현재는 임시 상품 상세 영역 */}
            <S.ProductArea>
    {loading ? (
        <S.ProductInfo>
            상품을 불러오는 중...
        </S.ProductInfo>
    ) : !product ? (
        <S.ProductInfo>
            상품을 찾을 수 없습니다.
        </S.ProductInfo>
    ) : (
        <>
            <S.ProductTitle>
                {product.name}
            </S.ProductTitle>

            <S.ProductInfo>
                선택한 상품 ID: {product.id}
            </S.ProductInfo>

            <S.ProductInfo>
                가격: {product.price.toLocaleString()}원
            </S.ProductInfo>

            <S.ProductInfo>
                카테고리: {product.category}
            </S.ProductInfo>

            <S.ProductInfo>
                {product.description}
            </S.ProductInfo>
        </>
    )}
</S.ProductArea>
        {chatSlot &&
        createPortal(
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "8px" }}>
                {["가격", "재질", "디자인 의도"].map((q) => (
                <MessageBubble
                    key={q}
                    as="button"
                    $type="user"
                    onClick={() => handleQuestionClick(q)}
                    style={{
                        cursor: "pointer",
                        border: "none",
                        outline: "none",
                        borderRadius: "16px",
                    }}
                    >
                    {q}
                </MessageBubble>
                ))}
            </div>,
            chatSlot
            )}
        </S.PageContainer>
    );
}

export default ProductPage;
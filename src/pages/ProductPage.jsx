import React from "react";
import { useParams } from "react-router-dom";
import { createPortal } from "react-dom";

import ChatMessage from "../components/ChatMessage/ChatMessage";
import useChatStore from "../stores/useChatStore";

import bearImage from "../assets/bear.png";
import * as S from "../components/Shelf/Shelf.style";
import { MessageBubble } from "../components/ChatMessage/ChatMessage.styled";

function ProductPage() {
    const { productId } = useParams();

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

    const handleQuestionClick = (question) => {
        console.log(
            `${productName}에 대한 질문: ${question}`
        );

        // 다음 단계에서 질문별 챗봇 답변을 연결하면 됩니다.
    };

    const chatSlot = document.getElementById("chat-bottom-slot");

    return (
        <S.PageContainer>
            {/* 현재는 임시 상품 상세 영역 */}
            <S.ProductArea>
                <S.ProductTitle>
                    {productName}
                </S.ProductTitle>

                <S.ProductInfo>
                    선택한 상품 ID: {productId}
                </S.ProductInfo>
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
import React from "react";
import { useParams } from "react-router-dom";

import ChatMessage from "../components/ChatMessage/ChatMessage";
import useChatStore from "../stores/useChatStore";

import bearImage from "../assets/bear.png";
import * as S from "../components/Shelf/Shelf.style";

function ProductPage() {
    const { productId } = useParams();

    const selectedZoneId = useChatStore(
        (state) => state.selectedZoneId
    );

    const selectedProduct = useChatStore(
        (state) => state.selectedProduct
    );

    const productName =
        selectedProduct?.name?.split(" - ")[1] ??
        selectedProduct?.name ??
        "선택한 상품";

    const handleQuestionClick = (question) => {
        console.log(
            `${productName}에 대한 질문: ${question}`
        );

        // 다음 단계에서 질문별 챗봇 답변을 연결하면 됩니다.
    };

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

            <S.ChatArea>
                {/* 기존 챗봇 안내 메시지 */}
                <ChatMessage
                    type="assistant"
                    profileImage={bearImage}
                >
                    저와 함께 MCM을 경험해 보아요!
                    <br />
                    각 상품을 눌러 궁금한 점을 알아보세요.
                </ChatMessage>

                {/* 이전 진열대 클릭 메시지 유지 */}
                {selectedZoneId && (
                    <ChatMessage type="user">
                        {selectedZoneId}번 진열대 클릭
                    </ChatMessage>
                )}

                {/* 새 상품 클릭 메시지 추가 */}
                {selectedProduct && (
                    <ChatMessage type="user">
                        {productName} 상품 클릭
                    </ChatMessage>
                )}

                {/* 예시 질문 */}
                {selectedProduct && (
                    <S.QuestionButtons>
                        <S.QuestionButton
                            type="button"
                            onClick={() =>
                                handleQuestionClick("가격")
                            }
                        >
                            가격
                        </S.QuestionButton>

                        <S.QuestionButton
                            type="button"
                            onClick={() =>
                                handleQuestionClick("재질")
                            }
                        >
                            재질
                        </S.QuestionButton>

                        <S.QuestionButton
                            type="button"
                            onClick={() =>
                                handleQuestionClick("디자인 의도")
                            }
                        >
                            디자인 의도
                        </S.QuestionButton>
                    </S.QuestionButtons>
                )}
            </S.ChatArea>
        </S.PageContainer>
    );
}

export default ProductPage;
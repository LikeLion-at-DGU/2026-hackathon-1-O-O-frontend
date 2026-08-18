import { useEffect } from "react";
import { sendEvent } from "../api/events";

export default function useProductEvent(productId) {
    useEffect(() => {
        const sendProductView = async () => {
            if (!productId) return;

            try {
                await sendEvent({
                    event_type: "product_view",

                    // API가 내려준 상품 ID를 문자열 그대로 전송
                    product_id: String(productId),
                });
            } catch (error) {
                console.error(
                    "상품 조회 이벤트 저장 실패:",
                    error.response?.data ?? error,
                );
            }
        };

        sendProductView();
    }, [productId]);

    const sendQuestionClick = async (question) => {
        if (!productId || !question) return;

        try {
            await sendEvent({
                event_type: "question_submit",

                // Number로 변환하지 않음
                product_id: String(productId),

                metadata: {
                    question,
                },
            });
        } catch (error) {
            console.error(
                "질문 이벤트 저장 실패:",
                error.response?.data ?? error,
            );
        }
    };

    return {
        sendQuestionClick,
    };
}
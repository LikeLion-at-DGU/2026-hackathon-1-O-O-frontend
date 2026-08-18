import { useEffect } from "react";
import { sendEvent } from "../api/events";

export default function useProductEvent(productId) {
    const imageId = productId?.replace("p-", "");

    useEffect(() => {
        const sendProductView = async () => {
            const visitId = sessionStorage.getItem("visit_id");

            if (!visitId) return;

            try {
                await sendEvent({
                    visit_id: visitId,
                    event_type: "PRODUCT_VIEW",
                    product_id: Number(imageId),
                });
            } catch (error) {
                console.error(
                    "상품 조회 이벤트 실패:",
                    error
                );
            }
        };

        if (imageId) {
            sendProductView();
        }
    }, [imageId]);

    const sendQuestionClick = async (question) => {
        const visitId = sessionStorage.getItem("visit_id");

        if (!visitId) return;

        try {
            await sendEvent({
                visit_id: visitId,
                event_type: "QUESTION_CLICK",
                product_id: Number(imageId),
                question,
            });
        } catch (error) {
            console.error(
                "질문 클릭 이벤트 실패:",
                error
            );
        }
    };

    return {
        sendQuestionClick,
    };
}
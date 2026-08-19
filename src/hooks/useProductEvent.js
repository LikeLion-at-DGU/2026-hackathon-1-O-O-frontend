import { useEffect, useRef } from "react";
import { sendEvent } from "../api/events";

export default function useProductEvent(productId) {
  const enterTimeRef = useRef(Date.now());

  // 1. 상품 상세 진입 시 조회(product_view) 전송 & 이탈 시 체류(product_dwell) 전송
  useEffect(() => {
    const isFinished = 
      sessionStorage.getItem("is_visit_finished") === "true" ||
      Boolean(sessionStorage.getItem("report_slug"));
      
    if (!productId) return;

    // 진입 시각 기록
    enterTimeRef.current = Date.now();

    // (1) 상품 조회 이벤트 전송
    const sendProductView = async () => {
      try {
        await sendEvent({
          event_id: `e_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          event_type: "product_view",
          product_id: String(productId),
          client_timestamp: new Date().toISOString(),
          metadata: {},
        });
      } catch (error) {
        console.error(
          "상품 조회 이벤트 저장 실패:",
          error.response?.data ?? error
        );
      }
    };

    sendProductView();

    // (2) 모달/페이지 이탈 시 체류 시간(product_dwell) 계산 및 전송
    return () => {
      const dwellMs = Date.now() - enterTimeRef.current;

      // 최소 500ms(0.5초) 이상 머문 경우에만 체류 이벤트 발송
      if (dwellMs >= 500) {
        sendEvent({
          event_id: `e_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          event_type: "product_dwell",
          product_id: String(productId),
          client_timestamp: new Date().toISOString(),
          metadata: {
            dwell_ms: dwellMs,
          },
        }).catch((err) => {
          console.error("상품 체류 이벤트 저장 실패:", err.response?.data ?? err);
        });
      }
    };
  }, [productId]);

  // 2. 챗봇/상품 질문 클릭 이벤트 전송
  const sendQuestionClick = async (question) => {
    if (!productId || !question) return;

    try {
      await sendEvent({
        event_id: `e_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        event_type: "question_submit",
        product_id: String(productId),
        client_timestamp: new Date().toISOString(),
        metadata: {
          question: String(question),
        },
      });
    } catch (error) {
      console.error(
        "질문 이벤트 저장 실패:",
        error.response?.data ?? error
      );
    }
  };

  return {
    sendQuestionClick,
  };
}
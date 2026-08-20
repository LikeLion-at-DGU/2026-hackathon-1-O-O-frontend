import { useEffect, useRef } from "react";
import { sendEvent } from "../api/events";

export default function useProductEvent(productId) {
  // StrictMode 재마운트로 같은 상품에 product_view가 두 번 쌓이는 것을 막는다.
  // 중복이 쌓이면 서버의 재조회 판정과 왕복(A→B→A) 트리거가 오작동한다.
  const lastViewedRef = useRef(null);

  // 상품 상세 진입 시 조회(product_view) 전송.
  // 체류(product_dwell)는 useDwellTimer가 잰다 — 여기서도 보내면 같은 구간이
  // 두 번 계상되어 리포트 체류시간이 2배로 부풀었다.
  useEffect(() => {
    if (!productId || lastViewedRef.current === productId) return;
    lastViewedRef.current = productId;

    sendEvent({
      event_type: "product_view",
      product_id: String(productId),
      client_timestamp: new Date().toISOString(),
      metadata: {},
    });
  }, [productId]);

}

// src/hooks/useDwellTimer.js
import { useEffect, useRef } from "react";
import { sendEvent } from "../api/events";

export function useDwellTimer({
  eventType,
  targetId,
  extra = {},
  minDwellMs = 1000,
}) {
  const extraRef = useRef(extra);

  // extra는 매 렌더 새 객체라 effect 의존성에 넣으면 타이머가 계속 리셋된다.
  // 렌더 중 ref에 쓰는 대신 effect에서 최신값만 보관한다.
  useEffect(() => {
    extraRef.current = extra;
  });

  useEffect(() => {
    if (!targetId) return undefined;

    let enteredAt = Date.now();
    let active = true;

    const flush = () => {
      // 이미 정산되었으면 무시 — 언마운트·강제 flush·가시성 전환이 겹쳐도 1번만
      if (!active) return;
      active = false;

      const dwellMs = Date.now() - enteredAt;
      if (dwellMs < minDwellMs) return;

      const sec = Math.round(dwellMs / 1000);

      // scene_dwell은 세션 스토리지에도 초 단위로 누적한다 (로컬 표시용)
      if (eventType === "scene_dwell") {
        const zoneName = extraRef.current.zone_name || `${targetId}번 진열대`;
        const existingMap = JSON.parse(sessionStorage.getItem("local_zone_sec_map") || "{}");
        existingMap[zoneName] = (existingMap[zoneName] || 0) + sec;
        sessionStorage.setItem("local_zone_sec_map", JSON.stringify(existingMap));
      }

      sendEvent({
        event_type: eventType,
        ...(eventType === "scene_dwell" ? { scene_id: String(targetId) } : {}),
        ...(eventType === "product_dwell"
          ? {
              product_id: String(targetId),
              ...(extraRef.current.scene_id ? { scene_id: String(extraRef.current.scene_id) } : {}),
            }
          : {}),
        dwell_ms: dwellMs,
        metadata: {
          dwell_ms: dwellMs,
          ...extraRef.current,
        },
      });
    };

    // 탭이 숨겨지면 정산은 events.js의 force_flush 디스패치가 맡는다.
    // 다시 보이면 여기서 타이머를 재시작한다 — 없으면 복귀 후 체류가 0이 되고,
    // 예전처럼 아예 정산하지 않으면 숨겨둔 시간이 통째로 체류에 잡혔다.
    const handleVisibility = () => {
      if (!document.hidden && !active) {
        enteredAt = Date.now();
        active = true;
      }
    };

    window.addEventListener("force_flush_dwell_timer", flush);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("force_flush_dwell_timer", flush);
      document.removeEventListener("visibilitychange", handleVisibility);
      // 컴포넌트가 언마운트되거나 targetId가 바뀔 때 딱 1번만 정산
      flush();
    };
  }, [eventType, targetId, minDwellMs]);
}

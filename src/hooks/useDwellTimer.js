// src/hooks/useDwellTimer.js
import { useEffect, useRef } from "react";
import { sendEvent } from "../api/events";

export function useDwellTimer({
  eventType,
  targetId,
  extra = {},
  minDwellMs = 1000,
}) {
  const enterTimeRef = useRef(null);
  const extraRef = useRef(extra);
  extraRef.current = extra;
  
  // 현재 측정 중인 targetId를 추적하여 중복 실행 방지
  const activeTargetRef = useRef(null);

  const flushTimer = () => {
    // 이미 정산되었거나 targetId가 없으면 무시
    if (!enterTimeRef.current || !activeTargetRef.current) return;

    const dwellMs = Date.now() - enterTimeRef.current;
    const currentTarget = activeTargetRef.current;
    
    // 초기화하여 중복 플러시 원천 차단
    enterTimeRef.current = null;
    activeTargetRef.current = null;

    if (dwellMs >= minDwellMs) {
      const sec = Math.round(dwellMs / 1000);
      console.log(`⏱️ [체류 정산] ${eventType} (${currentTarget}) -> ${sec}초 (${dwellMs}ms)`);

      // 💡 [추가] scene_dwell 이벤트일 때 세션 스토리지에 시간 누적 저장하기
      if (eventType === "scene_dwell") {
        const zoneName = extraRef.current.zone_name || `${currentTarget}번 진열대`;
        const existingMap = JSON.parse(sessionStorage.getItem("local_zone_sec_map") || "{}");
        
        existingMap[zoneName] = (existingMap[zoneName] || 0) + sec;
        sessionStorage.setItem("local_zone_sec_map", JSON.stringify(existingMap));
      }

      sendEvent({
        event_type: eventType,
        ...(eventType === "scene_dwell" ? { scene_id: String(currentTarget) } : {}),
        ...(eventType === "product_dwell"
          ? {
              product_id: String(currentTarget),
              ...(extraRef.current.scene_id ? { scene_id: String(extraRef.current.scene_id) } : {}),
            }
          : {}),
        dwell_ms: dwellMs,
        metadata: {
          dwell_ms: dwellMs,
          ...extraRef.current,
        },
      });
    }
  };

  useEffect(() => {
    if (!targetId) return;

    // 1. 만약 이전 타이머가 아직 돌고 있다면 강제로 먼저 끝냄 (꼬임 방지)
    if (enterTimeRef.current && activeTargetRef.current !== targetId) {
      flushTimer();
    }

    // 2. 새로운 타이머 시작
    enterTimeRef.current = Date.now();
    activeTargetRef.current = targetId;

    // 탭이 숨겨지면 정산은 events.js의 force_flush 디스패치가 맡는다.
    // 다시 보이면 여기서 타이머를 재시작한다 — 없으면 복귀 후 체류가 0이 되고,
    // 예전처럼 아예 정산하지 않으면 숨겨둔 시간이 통째로 체류에 잡혔다.
    const handleVisibility = () => {
      if (!document.hidden && !activeTargetRef.current) {
        enterTimeRef.current = Date.now();
        activeTargetRef.current = targetId;
      }
    };

    window.addEventListener("force_flush_dwell_timer", flushTimer);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("force_flush_dwell_timer", flushTimer);
      document.removeEventListener("visibilitychange", handleVisibility);
      // 컴포넌트가 언마운트되거나 targetId가 바뀔 때 딱 1번만 정산
      flushTimer();
    };
  }, [eventType, targetId, minDwellMs]);
}
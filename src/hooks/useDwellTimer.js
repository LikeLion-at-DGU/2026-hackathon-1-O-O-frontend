    // src/hooks/useDwellTimer.js
    import { useEffect, useRef } from "react";
    import { sendEvent } from "../api/events";

    export function useDwellTimer({
    eventType,
    targetId,
    extra = {},
    minDwellMs = 1000,
    }) {
    const enterTimeRef = useRef(Date.now());
    const extraRef = useRef(extra);
    extraRef.current = extra;

    const flushTimer = () => {
        if (!enterTimeRef.current || !targetId) return;

        const dwellMs = Date.now() - enterTimeRef.current;
        enterTimeRef.current = null; // 중복 전송 방지

        if (dwellMs >= minDwellMs) {
        console.log(`⏱️ [체류 정산] ${eventType} (${targetId}) -> ${Math.round(dwellMs / 1000)}초 (${dwellMs}ms)`);

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
        }
    };

    useEffect(() => {
        if (!targetId) return;

        enterTimeRef.current = Date.now();

        // ⭐️ Header에서 관람 마치기 눌렀을 때 즉시 정산
        window.addEventListener("force_flush_dwell_timer", flushTimer);

        return () => {
        window.removeEventListener("force_flush_dwell_timer", flushTimer);
        flushTimer();
        };
    }, [eventType, targetId, minDwellMs]);
    }
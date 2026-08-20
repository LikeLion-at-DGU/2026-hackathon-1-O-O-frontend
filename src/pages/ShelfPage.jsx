    import React, { useEffect, useRef, useMemo } from "react";
    import { useParams } from "react-router-dom";

    import Shelf from "../components/Shelf/Shelf";
    import useChatStore from "../stores/useChatStore";
    import { createChatMessage } from "../api/chat";
    import { useDwellTimer } from "../hooks/useDwellTimer";

    function ShelfPage() {
    const { zoneId } = useParams();

    const selectShelf = useChatStore((state) => state.selectShelf);
    const addServerMessages = useChatStore((state) => state.addServerMessages);

    // 현재 진열대 scene 객체 가져오기
    const currentScene = useMemo(() => {
        try {
        const scenes = JSON.parse(sessionStorage.getItem("scenes") ?? "[]");
        return scenes.find((item) => Number(item.no) === Number(zoneId));
        } catch {
        return null;
        }
    }, [zoneId]);

    const sceneId = currentScene?.scene_id || zoneId;

    // ⭐️ 진열대 체류시간 측정 (상품 상세를 보더라도 진열대 시간은 계속 누적)
    useDwellTimer({
        eventType: "scene_dwell",
        targetId: sceneId,
        extra: {
        zone_no: zoneId,
        zone_name: `${zoneId}번 진열대`,
        },
    });

    const recordedZoneRef = useRef(null);

    // 진열대 클릭 챗봇 메시지 기록
    useEffect(() => {
        if (recordedZoneRef.current === zoneId) return;
        recordedZoneRef.current = zoneId;

        const recordSceneClick = async () => {
        selectShelf(zoneId);

        if (!currentScene?.scene_id) return;
        if (Boolean(sessionStorage.getItem("report_slug"))) return;

        try {
            const response = await createChatMessage({
            type: "scene_click",
            scene_id: currentScene.scene_id,
            });
            addServerMessages(response.data.messages ?? []);
        } catch (error) {
            console.error("진열대 클릭 메시지 저장 실패:", error);
        }
        };

        recordSceneClick();
    }, [zoneId, currentScene, selectShelf, addServerMessages]);

    return <Shelf />;
    }

    export default ShelfPage;
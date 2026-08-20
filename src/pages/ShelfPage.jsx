    import { useEffect, useRef, useMemo } from "react";
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

    // 서버 scene_id를 모르면 측정하지 않는다. zoneId("1")로 폴백하면 서버에
    // 없는 id라 그 이벤트가 rejected로 빠지고, 엉뚱한 집계만 남는다.
    const sceneId = currentScene?.scene_id ?? null;

    // 진열대 체류시간 측정. 상품 상세로 넘어가면 이 페이지가 언마운트되어
    // 진열대 체류는 멈춘다(상품 체류는 서버가 진열대에 합산한다).
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
        if (sessionStorage.getItem("report_slug")) return;

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

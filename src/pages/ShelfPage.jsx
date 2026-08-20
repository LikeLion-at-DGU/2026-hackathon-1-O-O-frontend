    import { useEffect, useRef, useMemo } from "react";
    import { useParams } from "react-router-dom";

    import Shelf from "../components/Shelf/Shelf";
    import useChatStore from "../stores/useChatStore";
    import { useDwellTimer } from "../hooks/useDwellTimer";

    function ShelfPage() {
    const { zoneId } = useParams();

    const selectShelf = useChatStore((state) => state.selectShelf);


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

    // 진열대 선택 상태만 갱신한다. 예전에는 scene_click 채팅 메시지도 만들었는데,
    // "N번 진열대 클릭" 말풍선이 타임라인을 도배해 생성 자체를 없앴다.
    // 분석용 수치는 scene_dwell·hotspot_click 이벤트가 계속 담당하고,
    // 챗봇의 진열대 문맥은 상품 클릭에서 서버가 유추한다.
    useEffect(() => {
        if (recordedZoneRef.current === zoneId) return;
        recordedZoneRef.current = zoneId;
        selectShelf(zoneId);
    }, [zoneId, selectShelf]);

    return <Shelf />;
    }

    export default ShelfPage;

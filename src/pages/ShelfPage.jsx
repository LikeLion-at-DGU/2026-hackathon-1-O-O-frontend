import { useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import Shelf from "../components/Shelf/Shelf";
import useChatStore from "../stores/useChatStore";
import { useDwellTimer } from "../hooks/useDwellTimer";

function ShelfPage() {
    const { zoneId } = useParams();
    const selectShelf = useChatStore((state) => state.selectShelf);

    // 1. 현재 진열대(Scene) 객체 조회
    const currentScene = useMemo(() => {
        try {
        const scenes = JSON.parse(sessionStorage.getItem("scenes") ?? "[]");
        return scenes.find((item) => Number(item.no) === Number(zoneId));
        } catch {
        return null;
        }
    }, [zoneId]);

    // 2. 서버 scene_id 유효성 검증
    // 서버 scene_id가 없을 경우 측정을 중단하여 유효하지 않은 zoneId 폴백으로 인한 rejected 이벤트 방지
    const sceneId = currentScene?.scene_id ?? null;

    // 3. 진열대 체류 시간(scene_dwell) 측정
    // 상세 페이지 이동 시 컴포넌트가 언마운트되며 체류 정산 완료
    useDwellTimer({
        eventType: "scene_dwell",
        targetId: sceneId,
        extra: {
        zone_no: zoneId,
        zone_name: `${zoneId}번 진열대`,
        },
    });

    const recordedZoneRef = useRef(null);

    // 4. 진열대 선택 상태 갱신 (중복 호출 방지)
    useEffect(() => {
        if (recordedZoneRef.current === zoneId) return;
        recordedZoneRef.current = zoneId;
        selectShelf(zoneId);
    }, [zoneId, selectShelf]);

    return <Shelf />;
}

export default ShelfPage;
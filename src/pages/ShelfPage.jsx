import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import Shelf from "../components/Shelf/Shelf";
import ChatMessage from "../components/ChatMessage/ChatMessage";
import useChatStore from "../stores/useChatStore";
import { createChatMessage } from "../api/chat";

import bearImage from "../assets/bear.png";
import * as S from "../components/Shelf/Shelf.style";

function ShelfPage() {
    const { zoneId } = useParams();

    const selectShelf = useChatStore(
        (state) => state.selectShelf
    );

    const addServerMessages = useChatStore(
        (state) => state.addServerMessages
    );

    const recordedZoneRef = useRef(null);

    // 선반 페이지에 들어오면 현재 진열대 번호를 저장
    useEffect(() => {
        if (recordedZoneRef.current === zoneId) return;
        recordedZoneRef.current = zoneId;

        const recordSceneClick = async () => {
            selectShelf(zoneId);

            let scenes = [];
            try {
                scenes = JSON.parse(sessionStorage.getItem("scenes") ?? "[]");
            } catch {
                scenes = [];
            }
        console.group(`🏬 [전체 선반별 상품 현황]`);
            scenes.forEach((sceneItem) => {
                const shelfNo = sceneItem.no ?? sceneItem.scene_no ?? "알 수 없음";
                const productList = sceneItem.products ?? sceneItem.items ?? [];
                console.log(`📌 [${shelfNo}번 진열대] 상품 배열 (${productList.length}개):`, productList);
            });
            console.groupEnd();

            const scene = scenes.find(
                (item) => Number(item.no) === Number(zoneId)
            );

            if (!scene?.scene_id) return;

            try {
                const response = await createChatMessage({
                    type: "scene_click",
                    scene_id: scene.scene_id,
                });
                addServerMessages(response.data.messages ?? []);
            } catch (error) {
                console.error("진열대 클릭 메시지 저장 실패:", error);
            }
        };

        recordSceneClick();
    }, [zoneId, selectShelf, addServerMessages]);

    return (

                <Shelf/>
    );
}
export default ShelfPage;

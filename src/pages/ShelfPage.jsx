import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import Shelf from "../components/Shelf/Shelf";
import ChatMessage from "../components/ChatMessage/ChatMessage";
import useChatStore from "../stores/useChatStore";

import bearImage from "../assets/bear.png";
import * as S from "../components/Shelf/Shelf.style";

function ShelfPage() {
    const { zoneId } = useParams();

    const selectedZoneId = useChatStore(
        (state) => state.selectedZoneId
    );

    const selectShelf = useChatStore(
        (state) => state.selectShelf
    );

    // 선반 페이지에 들어오면 현재 진열대 번호를 저장
    useEffect(() => {
        if (selectedZoneId !== zoneId) {
            selectShelf(zoneId);
        }
    }, [zoneId, selectedZoneId, selectShelf]);

    return (

                <Shelf/>
    );
}
export default ShelfPage;
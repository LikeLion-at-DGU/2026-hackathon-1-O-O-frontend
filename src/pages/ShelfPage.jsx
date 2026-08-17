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
        // <S.PageContainer>
        //     <S.ShelfArea>
                <Shelf/>
        //     </S.ShelfArea>

        //     {/* <S.ChatArea>
        //         <ChatMessage
        //             type="assistant"
        //             profileImage={bearImage}
        //         >
        //             저와 함께 MCM을 경험해 보아요!
        //             <br />
        //             각 상품을 눌러 궁금한 점을 알아보세요.
        //         </ChatMessage>

        //         <ChatMessage type="user">
        //             {zoneId}번 진열대 클릭
        //         </ChatMessage>
        //     </S.ChatArea> */}
        // </S.PageContainer>
    );
}

export default ShelfPage;
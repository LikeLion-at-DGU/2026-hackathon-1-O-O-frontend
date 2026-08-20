// src/components/FloorMap/FloorMap.jsx
import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import PlusButton from "./icons/PlusButton";
import FloorPlan1 from "./FloorPlan1";
import * as S from "./FloorMap.style";

const MAP_GUIDE_SEEN_KEY =
  "map_guide_seen";
const GUIDE_ITEMS = [
  { id: 1, text: "토트백" },
  { id: 2, text: "백팩" },
  { id: 3, text: "쇼퍼백" },
  { id: 4, text: "악세서리" },
  { id: 5, text: "여성 의류" },
  { id: 6, text: "남성 의류" },
  { id: 7, text: "F/W 신상" },
];

export default function FloorMap({ showGuideMessage = false, guideClickPath = null, }) {
  const [activeZone, setActiveZone] = useState(null);
  const [
  isGuideMessageVisible,
  setIsGuideMessageVisible,
] = useState(() => {
  const hasSeenGuide =
    sessionStorage.getItem(
      MAP_GUIDE_SEEN_KEY
    ) === "true";

  return (
    showGuideMessage &&
    !hasSeenGuide
  );
});
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const navigate = useNavigate();

  const outletContext = useOutletContext();
  const setSelectedZone = outletContext?.setSelectedZone;

  const handleZoneClick = (zoneId) => {
    if (isGuideMessageVisible) return;

    if (zoneId === "plus") {
      setIsGuideOpen(true);
      return;
    }

    if (isGuideOpen) return;

    if (setSelectedZone) {
      setSelectedZone(zoneId);
    }

    navigate(`/shelf/${zoneId}`);
  };

  const handleFirstGuideClick = (event) => {
  event.stopPropagation();

  // 현재 FloorMap에서 안내 메시지 제거
  setIsGuideMessageVisible(false);

  // 이동할 주소가 전달된 경우에만 페이지 이동
  if (guideClickPath) {
    navigate(guideClickPath);
  }
};
  return (
    <S.MapRoot>
      {/* 1. 메인 지도 영역 */}
      <S.MapContainer>
        <FloorPlan1
          activeZone={activeZone}
          onZoneClick={handleZoneClick}
          isGuideOpen={isGuideOpen}
        />
      </S.MapContainer>

      {/* 2. 지도를 눌러 보세요! 오버레이 */}
      {!isGuideOpen && isGuideMessageVisible && (
        <S.GuideOverlay
          role="button"
          tabIndex={0}
          onClick={handleFirstGuideClick}
        >
          지도를 눌러 보세요!
        </S.GuideOverlay>
      )}

      {/* 3. 진열대 안내 오버레이 (+ 버튼 클릭 시) */}
      {isGuideOpen && (
        <S.ShelfInfoOverlay>
          <S.ShelfInfoTitle>진열대 안내</S.ShelfInfoTitle>
          <S.ShelfInfoGrid>
            {GUIDE_ITEMS.map((item) => (
              <S.ShelfInfoItem key={item.id}>
                {item.id}. {item.text}
              </S.ShelfInfoItem>
            ))}
          </S.ShelfInfoGrid>
        </S.ShelfInfoOverlay>
      )}

      {/* 4. (+) / 닫기 버튼 레이어 */}
      {!isGuideMessageVisible && (
        <S.PlusButtonLayer>
          <svg viewBox="0 0 363 300">
            <g>
              <PlusButton
                cx={25}
                cy={24}
                isOpen={isGuideOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsGuideOpen(!isGuideOpen);
                }}
              />
            </g>
          </svg>
        </S.PlusButtonLayer>
      )}
    </S.MapRoot>
  );
}
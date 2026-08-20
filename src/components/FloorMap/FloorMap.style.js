// src/components/FloorMap/FloorMap.style.js
import styled from "styled-components";

// ⭐️ 전체 외곽 영역 (상하좌우 정중앙 정렬)
export const MapRoot = styled.div`
  width: 100%;
  height: 100%;
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .swiper-pagination {
    pointer-events: none;
  }
  .swiper-pagination-bullet {
    pointer-events: auto;
  }
`;

// ⭐️ 363px x 300px 기본 카드 프레임 (모든 오버레이와 맵의 공통 기준점)
export const MapContainer = styled.div`
  position: relative;
  width: 363px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// ⭐️ 1. '지도를 눌러 보세요!' 오버레이
export const GuideOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 363px;
  height: 300px;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: center;
  align-items: center;

  color: #e5e3e0;
  font-size: 14px;
  font-weight: 300;
  font-family: Pretendard, sans-serif;
  font-style: normal;
  line-height: 140%;
  cursor: pointer;
  z-index: 20;

  &:hover {
    color: #222222;
  }
`;

// ⭐️ 2. 진열대 안내 (+ 버튼 클릭 시 팝업 오버레이)
export const ShelfInfoOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 363px;
  height: 300px;
  border-radius: 20px;
  background-color: rgba(60, 60, 60, 0.58);

  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 48px;
  box-sizing: border-box;
  color: #ffffff;
  z-index: 20;
`;

export const ShelfInfoTitle = styled.div`
  margin-bottom: 24px;
  font-size: 14px;
  font-weight: 500;
`;

export const ShelfInfoGrid = styled.div`
  display: grid;
  grid-templateColumns: 1fr 1fr;
  width: 210px;
  column-gap: 30px;
  row-gap: 7px;
`;

export const ShelfInfoItem = styled.div`
  font-size: 12px;
  white-space: nowrap;
`;

// ⭐️ 3. 좌측 상단 (+) 버튼 SVG 레이어
export const PlusButtonLayer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 363px;
  height: 300px;
  pointer-events: none;
  z-index: 30;

  & > svg {
    width: 100%;
    height: 100%;
  }

  & g {
    pointer-events: auto;
  }
`;

// 맵이나 선반에서 사용하는 공통 스타일
export const COLORS = {
  background: "#E5E3E0",   // 전체 배경색
  zoneDefault: "#D1CCC7",  // 기본 구역색
  zoneActive: "#C2B29F",   // 선택되었을 때 구역색
  cognacText: "#8C6239",   // 숫자 텍스트 색상
  neutralText: "#E5E3E0",  // 입구 텍스트 색상
  bearFill: "#8C6239",     // 곰돌이 아이콘 채우기 색상
};

export const TEXT_STYLES = {
    numberText: {
        fill: COLORS.cognacText,
        fontSize: "12px",
        fontWeight: "300",
        fontFamily: "Pretendard, sans-serif",
        textAnchor: "middle",
        dominantBaseline: "central",
        pointerEvents: "none",
        userSelect: "none",
    },
    entranceText: {
        fill: COLORS.neutralText,
        fontSize: "12px",
        fontWeight: "300",
        fontFamily: "Pretendard, sans-serif",
        textAnchor: "middle",
        dominantBaseline: "central",
        pointerEvents: "none",
        userSelect: "none",
    },
};
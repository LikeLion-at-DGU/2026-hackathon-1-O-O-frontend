import styled from "styled-components";
import { COLORS } from "../FloorMap/FloorMap.style";

// src/components/Shelf/Shelf.style.js

// src/components/Shelf/Shelf.style.js
export const shelfStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "8px",
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    padding: "16px 14px 20px",
    boxSizing: "border-box",
  },
  tier: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    alignItems: "center",
    justifyItems: "center",
    backgroundColor: "#ECE9E5", /* 선반 밝은 그레이 */
    borderRadius: "16px",
    width: "100%",
    flex: "1",
    boxSizing: "border-box",
  },
  productSlot: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export const PageContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  background-color: transparent; /* ⭐️ 이중 여백을 없애기 위해 투명화 */
`;
export const ShelfArea = styled.div`
display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  padding: 16px 12px 24px;
  box-sizing: border-box;

  /* 사진처럼 상단만 흰색으로 쪼개주는 핵심 스타일 */
  background-color: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08); /* 상단과 하단을 갈라주는 그림자 */
  z-index: 10;
  
`;

export const ProductArea = styled.div`
  width: 100%;
  min-height: 300px;
  padding: 24px;
  box-sizing: border-box;

  background-color: #f8f8f8;
`;

export const ProductTitle = styled.h1`
  margin: 0 0 12px;

  color: #1f1f1f;
  font-size: 22px;
`;

export const ProductInfo = styled.p`
  margin: 0;

  color: #666666;
  font-size: 14px;
`;

export const ChatArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  width: 100%;
  min-height: 260px;
  padding: 8px 16px 28px;
  box-sizing: border-box;

  background-color: #F4F2EE;
`;

export const QuestionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;

  width: 100%;
`;

export const QuestionButton = styled.button`
  padding: 10px 15px;

  border: none;
  border-radius: 18px;

  color: #ffffff;
  background-color: #9a6b3b;

  font-family: inherit;
  font-size: 12px;
  font-weight: 400;

  cursor: pointer;

  &:active {
    transform: scale(0.97);
  }
`;
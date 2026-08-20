import styled from "styled-components";
import { COLORS } from "../FloorMap/FloorMap.style";

export const shelfStyles = {
  // 📌 1. 진열장 전체 외곽 프레임
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", 
    gap: "10px",
    width: "100%",
    width: "363px",
    height: "300px",
    backgroundColor: COLORS.zoneDefault,
    borderRadius: "20px",
    // padding: "12px",
    boxSizing: "border-box",
    margin: "0 auto",
  },

  // 📌 2. 각 층별 선반 박스
  tier: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    alignItems: "center",
    justifyItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: "10px",
    height: "80px",
    width: "323px",
    // padding: "4px 8px",
    boxSizing: "border-box",
  },

  // 📌 3. 상품 슬롯
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
  min-height: 100%;
  background-color: #F4F2EE;
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
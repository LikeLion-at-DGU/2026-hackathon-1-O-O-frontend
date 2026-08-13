import styled from "styled-components";
import { COLORS } from "../FloorMap/FloorMap.style";

// 실제 진열대 스타일
export const shelfStyles = {
    container: {
        width: "100%",
        maxWidth: "363px",
        height: "300px",
        padding: "16px",

        backgroundColor: COLORS.zoneDefault,
        borderRadius: "20px",

        boxSizing: "border-box",

        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },

    tier: {
        width: "100%",
        height: "126px",

        backgroundColor: COLORS.background,
        borderRadius: "14px",

        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",

        padding: "0 20px",
        boxSizing: "border-box",
    },

    productSlot: {
        width: "100px",
        height: "100px",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        fontSize: "56px",
        cursor: "pointer",
    },
};

// ShelfPage와 ProductPage에서 사용하는 스타일
export const PageContainer = styled.div`
  width: 100%;
  min-height: 100%;
  background-color: #ffffff;
`;

export const ShelfArea = styled.div`
  display: flex;
  justify-content: center;

  width: 100%;
  padding: 16px 12px 12px;
  box-sizing: border-box;
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

  background-color: #ffffff;
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
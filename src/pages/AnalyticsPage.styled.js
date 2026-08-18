import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  background-color: #f6f5f2;
  padding: 24px 20px 48px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
`;

export const SectionHeader = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: 8px;
  gap: 16px;
`;

export const MainTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #111111;
  margin: 0 0 8px;
  letter-spacing: -0.5px;
  margin-bottom: 16px;
`;

export const SubTitle = styled.p`
    color: var(--Neutral-N30, #A8A29D);
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    margin: 0;
    text-align: left;
`;

export const SummaryCard = styled.div`
  width: 100%;
  max-width: 360px;
  background-color: #ffffff;
  border-radius: 24px;
  padding: 24px 20px;
  box-sizing: border-box;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
`;

export const SummaryLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #555555;
  margin-bottom: 12px;
`;

export const TotalTimePill = styled.div`
  width: 100%;
  height: 36px;
  background-color: #9d9995;
  border-radius: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 16px;
`;

export const TimeBreakdownContainer = styled.div`
  width: 100%;
`;

export const BreakdownRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 8px;
`;

export const BreakdownItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: ${(props) => (props.$isHighlight ? 1.3 : 1)};
`;

export const BreakdownPill = styled.div`
  width: 100%;
  height: 32px;
  border-radius: 16px;
  background-color: ${(props) => (props.$isHighlight ? "#d97457" : "#dfdedb")};
  color: ${(props) => (props.$isHighlight ? "#ffffff" : "#444444")};
  font-size: 12px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${(props) => (props.$isHighlight ? "6px" : "0")};
`;

export const BreakdownLabel = styled.span`
  font-size: 11px;
  color: #777777;
  margin-bottom: 6px;
`;

export const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
`;

export const ItemCard = styled.div`
  background-color: #D1CCC7; /* 하단 텍스트 영역 배경색 (베이지 그레이) */
  border-radius: 20px;
  height: 169px;
  width: 110px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.98);
  }
`;

export const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  background-color: #ffffff;
  border-radius: 20px; /* 흰색 상단 영역 곡률 */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;
`;

export const CheckBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #d86e48; /* 테라코타 / 브릭 오렌지 포인트 색상 */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(216, 110, 72, 0.4);
`;

export const ItemImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

export const ItemInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
  box-sizing: border-box;
`;

export const ItemName = styled.p`
    width: 84px;
    color: var(--Deep-Slate, #222);
    text-align: center;
    font-family: Pretendard;
    font-size: var(--Font-size-XS, 12px);
    font-style: normal;
    font-weight: var(--Font-weight-Light, 300);
    line-height: 140%; /* 16.8px */
`;
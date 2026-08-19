import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  background-color: #f6f5f2;
  padding: 60px 20px 60px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SectionHeader = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: 8px;
  gap: 16px;
`;

export const MainTitle = styled.h1`
  color: var(--Deep-Slate, #222);
  text-align: center;
  font-family: Pretendard;
  font-size: var(--Font-size-XL, 20px);
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 28px */
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
  max-width: 363px;
  /* height: 149px; */
  background-color: #ffffff;
  border-radius: 20px;
  padding: 15px 20px;
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
  height: 22px;
  background-color: #9d9995;
  border-radius: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--Pure-Surface, #FFF);
  text-align: center;
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: var(--Font-weight-Light, 300);
  line-height: 140%; /* 14px */
  margin-bottom: 8px;
`;

export const TimeBreakdownContainer = styled.div`
  width: 100%;
`;

export const BreakdownRow = styled.div`
display: flex;
  align-items: flex-start;
  width: 100%;
  gap: 0.5px;
`;

export const BreakdownItem = styled.div`
display: flex;
  flex-direction: column;
  align-items: center;
  flex: ${(props) => props.$flex || 1} 1 0px;
  min-width: 50px;
  
  /* ⭐️ 1번째 아이템 (1층: 오렌지 1위) */
  &:nth-child(1) {
    margin-top: 0px;

    & > span {
      margin-top: 4px;
      
    }
  }

  /* ⭐️ 2번째 아이템 (2층: 1위 아래로 내려앉음) */
  &:nth-child(2) {
    margin-top: 7px;
    & > span {
      margin-bottom: 4px;
    }
  }

  /* ⭐️ 3번째 아이템 (3층: 2위 아래로 더 내려앉음) */
  &:nth-child(3) {
    margin-top: 30px;
    & > span {
      margin-bottom: 4px;
    }
  }
`;

export const BreakdownPill = styled.div`
width: 100%;
  height: 22px;
  border-radius: 19px;
  background-color: ${(props) => (props.$isHighlight ? "#D97251" : "#DFE0E4")};
  color: ${(props) => (props.$isHighlight ? "#FFFFFF" : "#111111")};

  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--Deep-Slate, #222);
text-align: center;
font-family: Pretendard;
font-size: 10px;
font-style: normal;
font-weight: var(--Font-weight-Light, 300);
line-height: 140%; /* 14px */
`;

export const BreakdownLabel = styled.span`
color: var(--Neutral-N40, #746F6A);
text-align: center;
font-family: Pretendard;
font-size: 10px;
font-style: normal;
font-weight: var(--Font-weight-Light, 300);
line-height: 140%; /* 14px */
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

export const CheckIconImage = styled.img`
  position: absolute;
  top: 7px;
  right: 7px;
  width: 16px;
  height: 16px;
  object-fit: contain;
  z-index: 2;
  pointer-events: none;
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
    position: relative;
    top: -8px;
`;
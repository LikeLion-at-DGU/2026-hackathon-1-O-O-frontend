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
  line-height: 140%;
`;

export const SubTitle = styled.p`
  color: var(--Neutral-N30, #a8a29d);
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
  color: var(--Pure-Surface, #fff);
  text-align: center;
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: var(--Font-weight-Light, 300);
  line-height: 140%;
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

  &:nth-child(1) {
    margin-top: 0px;

    & > span {
      margin-top: 4px;
    }
  }

  &:nth-child(2) {
    margin-top: 7px;

    & > span {
      margin-bottom: 4px;
    }
  }

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
  color: ${(props) => (props.$isHighlight ? "#FFFFFF" : "var(--Deep-Slate, #222)")};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: var(--Font-weight-Light, 300);
  line-height: 140%;
`;

export const BreakdownLabel = styled.span`
  color: var(--Neutral-N40, #746f6a);
  text-align: center;
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: var(--Font-weight-Light, 300);
  line-height: 140%;
`;

export const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 1fr;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
`;

export const ItemCard = styled.div`
  background-color: #d1ccc7;
  border-radius: 20px;
  width: 100%;
  height: 100%;
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
  height: 110px;
  flex-shrink: 0;
  background-color: #ffffff;
  border-radius: 20px;
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
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  padding: 8px 6px 6px;
  text-align: center;
  box-sizing: border-box;
`;

export const ItemName = styled.p`
  width: 100%;
  color: var(--Deep-Slate, #222);
  text-align: center;
  font-family: Pretendard;
  font-size: var(--Font-size-XS, 12px);
  font-style: normal;
  font-weight: var(--Font-weight-Light, 300);
  line-height: 140%;
  margin: 0;
  word-break: keep-all;
  height: 34px;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ReasonBadge = styled.span`
  width: 100%;
  max-width: 92px;
  color: #746f6a;
  font-family: Pretendard, sans-serif;
  font-size: 9px;
  line-height: 1.25;
  white-space: normal;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

export const CameraButton = styled.button`
  width: 100%;
  height: 52px;
  margin-top: 24px;
  color: #ffffff;
  font-family: Pretendard, sans-serif;
  font-size: 15px;
  font-weight: 600;
  background: #8c6239;
  border: 0;
  border-radius: 14px;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;
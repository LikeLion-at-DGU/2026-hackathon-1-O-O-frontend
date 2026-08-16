import styled from "styled-components";
import { COLORS } from "../../FloorMap/FloorMap.style";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;

  width: 100%;
  max-width: 363px;
  height: 300px;

  margin: 0 auto;
  padding: 12px;

  box-sizing: border-box;

  background-color: ${COLORS.zoneDefault};
  border-radius: 20px;
`;

export const Tier = styled.div`
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  align-items: center;
  justify-items: center;

  height: 82px;

  padding: 4px 8px;

  box-sizing: border-box;

  background-color: ${COLORS.background};
  border-radius: 14px;
`;

export const ProductSlot = styled.div`
  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  cursor: ${({ $clickable }) =>
    $clickable ? "pointer" : "default"};

  transition: transform 0.15s ease;

  &:active {
    transform: ${({ $clickable }) =>
      $clickable ? "scale(0.96)" : "none"};
  }
`;

export const ProductImage = styled.img`
  width: 100%;
  max-height: 86px;

  object-fit: contain;

  user-select: none;
`;

export const ProductName = styled.span`
  font-size: 12px;
`;
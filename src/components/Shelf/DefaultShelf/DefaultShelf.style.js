import styled from "styled-components";
import { COLORS } from "../../FloorMap/FloorMap.style";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;

  width: 100%;
  width: 363px;
  height: 300px;

  margin: 0 auto;
  padding: 20px 19.5px 20px;

  box-sizing: border-box;

  background-color: ${COLORS.zoneDefault};
  border-radius: 20px;

  @media (max-width: 600px) {
    width: 100%;
    height: 100%;
  }
`;

export const Tier = styled.div`
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  align-items: center;
  justify-items: center;

  flex: 1;
  min-height: 0;

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

  transform: translateY(-5px);

  filter: drop-shadow(0 5px 8px rgba(0, 0, 0, 0.2));

  @media (max-width: 600px) {
    max-height: calc(min(82.645vw - 86.446px, 38dvh - 60px) / 3 + 6px);
  }
`;

export const ProductName = styled.span`
  font-size: 12px;
`;

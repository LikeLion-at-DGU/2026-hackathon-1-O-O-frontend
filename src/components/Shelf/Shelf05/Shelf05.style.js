import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 363px;
  height: 300px;

  padding: 20px;
  box-sizing: border-box;

  background: #d1ccc7;
  border-radius: 20px;

  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: visible;
`;

export const ShelfRow = styled.div`
  position: relative;

  width: 800px;
  height: 100%;

  display: grid;
  grid-template-columns: repeat(6, 130px);

  align-items: center;
  justify-items: center;

  background: #e5e3e0;
  border-radius: 10px;

  box-sizing: border-box;

  overflow: visible;

  &::before {
    content: "";

    position: absolute;

    left: 0;
    right: 0;
    top: 66px;

    height: 5px;

    background: #d1ccc7;
    border-radius: 999px;

    z-index: 3;
  }
`;

export const ProductSlot = styled.div`
  position: relative;
  margin-left :30px;
  width: 130px;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: visible;

  cursor: ${({ $clickable }) =>
    $clickable ? "pointer" : "default"};
`;

export const Hanger = styled.div`
  position: relative;

  width: 100%;
  height: 100%;

  z-index: 6;
`;

export const HangerIcon = styled.div`
  position: absolute;

  top: 62px;
  left: 50%;

  transform: translateX(-50%);

  z-index: 5;
`;

export const ProductImage = styled.img`
  position: absolute;

  left: 50%;
  top: ${({ $up }) => ($up ? "30px" : "50px")};

  width: 150px;
  height: 162px;

  object-fit: contain;

  transform: translateX(-50%);

  filter: drop-shadow(
    0 3px 3px rgba(0, 0, 0, 0.14)
  );

  z-index: 10;

  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
`;
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: stretch;

  gap: 10px;

  width: 100%;
  max-width: 363px;
  height: 300px;

  margin: 0 auto;
  padding: 20px;

  box-sizing: border-box;

  background: #D1CCC7;
  border-radius: 20px;


  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.25);


  overflow: visible;

  @media (max-width: 600px) {
    height: 100%;
  }
`;

/* ========================================
   왼쪽 선반
======================================== */

export const LeftShelf = styled.div`
  display: flex;
  flex-direction: column;

  width: 35%;
  height: 100%;

  box-sizing: border-box;

  background: var(--neutral, #E5E3E0);

  border-radius: 10px;

  overflow: hidden;
`;

/* ========================================
   오른쪽 선반
======================================== */

export const RightShelf = styled.div`
  display: flex;
  flex-direction: column;

  width: 65%;
  height: 100%;

  box-sizing: border-box;

  background: var(--neutral, #E5E3E0);
  border-radius: 10px;

  overflow: hidden;
`;

/* ========================================
   선반 한 줄
======================================== */

export const ShelfRow = styled.div`
  position: relative;

  display: grid;
  grid-template-columns: repeat(3, 1fr);

  align-items: center;
  justify-items: center;

  width: 100%;
  height: 33.333%;

  box-sizing: border-box;

  overflow: visible;

  /*
    왼쪽 선반에만
    상품을 거는 가로 봉 생성
  */
  &::before {
    content: ${({ $side }) =>
      $side === "left" ? '""' : "none"};

    position: absolute;

    top: ${({ $rowIndex }) =>
    $rowIndex === 2 ? "30px" : "23px"};
    
    left: 7px;
    right: 7px;

    height: 5px;


    background: #D1CCC7;
    border-radius: 999px;

    z-index: 3;
  }
`;

/* ========================================
   상품 슬롯
======================================== */

export const ProductSlot = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  overflow: visible;

  cursor: ${({ $clickable }) =>
    $clickable ? "pointer" : "default"};

  &:active {
    transform: ${({ $clickable }) =>
      $clickable
        ? "scale(0.97)"
        : "none"};
  }
`;

/* ========================================
   상품 이미지
======================================== */

export const ProductImage = styled.img`
  position: absolute;

  left: ${({ $side, $rowIndex, $slotIndex }) => {
  if ($side === "left" && $rowIndex === 2) {
    if ($slotIndex === 0) return "45%";
    if ($slotIndex === 1) return "50%";
    if ($slotIndex === 2) return "55%";
  }

  return "50%";
}};

  /*
    왼쪽 상품은 봉에 걸려 있어야 하니까 위쪽을 기준으로 위치시킴
    오른쪽 상품은 중앙 배치.
  */

    /* 여기 맨 아래줄 키링 높이 조절하는건데 잘 안맞으면 여기 고쳐주세요..ㅠ */

  top: ${({ $side, $rowIndex, $slotIndex }) => {
  if ($side === "left" && $rowIndex === 2) {
    if ($slotIndex === 0) return "-3px";
    if ($slotIndex === 1) return "-6px";
    if ($slotIndex === 2) return "2px";
  }

  if ($side === "left") {
    return "3px";
  }

  return "50%";
}};

  /*
    왼쪽 PNG가 슬롯 너비 때문에 계속 너무 과하게 작아져서 슬롯보다 큰 width 허용
  */
  width: ${({ $side, $rowIndex }) => {
  if ($side === "left" && $rowIndex === 2) {
    return "170%";
  }

  if ($side === "left") {
    return "190%";
  }

  return "105%";
}};

  height: ${({ $side, $rowIndex }) => {
    if ($side === "left" && $rowIndex === 2) {
      return "72%";
    }

    if ($side === "left") {
      return "105%";
    }

    return "90%";
  }};

  max-width: none;
  max-height: none;

  object-fit: contain;

  transform: ${({ $side, $rowIndex }) => {
    if ($side === "left" && $rowIndex === 2) {
      return "translateX(-50%) scale(1.35)";
    }

    if ($side === "left") {
      return "translateX(-50%) scale(1.25)";
    }

    return "translate(-50%, -50%)";
  }};

  filter: drop-shadow(
    0 3px 3px rgba(0, 0, 0, 0.14)
  );

  transform-origin: center top;

  z-index: 2;

  user-select: none;
  pointer-events: none;

  -webkit-user-drag: none;
`;

export const ProductName = styled.span`
  position: relative;

  z-index: 4;

  font-family: Pretendard, sans-serif;
  font-size: 9px;

  text-align: center;

  color: #222;
`;

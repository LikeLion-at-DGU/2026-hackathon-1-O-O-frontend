import styled from "styled-components";
import { COLORS } from "../../FloorMap/FloorMap.style";

// 1. 바깥쪽 테두리 역할을 하는 프레임
export const OuterFrame = styled.div`
    width: 363px;
    height: 300px;
    margin: 0 auto;
    box-sizing: border-box;

    background-color: ${COLORS.zoneDefault};
    padding: 20px;
    border-radius: 20px;
`;

// 2. 안쪽 밝은 배경
export const InnerBackground = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 24px;

    width: 100%;
    height: 100%;
    
    background-color: ${COLORS.background};
    border-radius: 8px;
`;

// 3. 아이템 래퍼
export const ItemWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
`;

// 4. 상품 이미지
export const ProductImage = styled.img`
    width: 82px;
    object-fit: contain;
    cursor: pointer;
    z-index: 2;
    
    margin-bottom: -25px; 

    transition: transform 0.15s ease;
    &:active {
        transform: scale(0.96);
    }
`;

// 5. 하단 단상
export const Pedestal = styled.div`
    width: 70px;
    height: ${({ $height }) => $height}px;
    
    background-color: ${COLORS.zoneDefault}; 
    border-radius: 10px 10px 0 0;
`;
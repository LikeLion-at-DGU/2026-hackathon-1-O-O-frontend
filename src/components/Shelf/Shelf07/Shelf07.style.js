import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    align-items: flex-end;      /* 단상들을 바닥에 밀착 */
    justify-content: center;
    gap: 24px;                  /* 단상 사이 간격 */

    width: 363px;
    height: 300px;
    margin: 0 auto;
    padding-bottom: 20px;       /* 바닥 여백 */
    box-sizing: border-box;

    background-color: #E6E4E1;  /* 기본 배경색 (COLORS.zoneDefault) */
    border-radius: 24px;
    `;

    export const ItemWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    `;

    export const ProductImage = styled.img`
    width: 76px;
    object-fit: contain;
    cursor: pointer;
    z-index: 2;
    
    /* 기둥 위에 자연스럽게 얹혀지도록 살짝 내림 */
    margin-bottom: -6px; 

    transition: transform 0.15s ease;
    &:active {
        transform: scale(0.96);
    }
    `;

    export const Pedestal = styled.div`
    width: 74px;
    height: ${({ $height }) => $height}px;
    background-color: #D4D0CC; /* 기둥 색상 */
    border-radius: 16px 16px 0 0; /* 윗부분만 둥글게 */
    `;
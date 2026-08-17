import styled from "styled-components";

export const ProductArea = styled.div`
border-radius: 20px;
background: #E5E3E0;
height: 300px;
align-self: stretch;
`;

export const ProductTitle = styled.div`
color: var(--Deep-Slate, #222);
font-family: Pretendard;
font-size: var(--Font-size-SM, 14px);
font-style: normal;
font-weight: var(--Font-weight-Semi-Bold, 600);
line-height: 140%; /* 19.6px */
  width: 100%;
`;

export const ProductInfo = styled.div`
color: var(--Deep-Slate, #222);
font-family: Pretendard;
font-size: var(--Font-size-XS, 12px);
font-style: normal;
font-weight: var(--Font-weight-Light, 300);
line-height: 140%; /* 16.8px */
`;

export const Product = styled.div`
width: 166px;
height: 179.778px;
flex-shrink: 0;
aspect-ratio: 166.00/179.78;
border-radius: 20px;
background: url(<path-to-image>) #fff 50% / cover no-repeat;
display: flex;
justify-content: center;
align-items: center;
`;

export const ProductWrapper = styled.div`
  display: flex;
  height: 300px;
  padding: 20px;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 12px;
  width : 206px;
  border-right: none;

background-image: linear-gradient(
  to bottom,
  var(--Neutral-N30, #A8A29D) 0 12px,
  transparent 12px 17px
);

background-size: 1px 17px;
background-position: right;
background-repeat: repeat-y;
`;

export const TextWrapper = styled.div`
display: flex;
width: 166px;
flex-direction: column;
align-items: flex-start;
gap: 4px;
`;
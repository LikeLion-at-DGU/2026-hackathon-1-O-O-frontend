// src/components/Product/ProductInfo.styled.js
import styled from "styled-components";

// ⭐️ 메인 카드 프레임 (363px x 300px 고정)
export const ProductArea = styled.div`
  position: relative;
  width: 363px;
  height: 300px;
  margin: 0 auto;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: #E2DFD9;
  border-radius: 24px;
  padding: 16px;
  box-sizing: border-box;
  overflow: hidden;
  flex-shrink: 0;
`;

// ⭐️ 좌측 영역 (이미지 152px + 텍스트)
export const ProductWrapper = styled.div`
  width: 156px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-shrink: 0;
  padding-top: 0px;
  box-sizing: border-box;
`;

// ⭐️ 피그마 이미지 박스
export const ProductImageBox = styled.div`
  width: 166px;
  height: 179.78px;
  flex-shrink: 0;
  border-radius: 20px;
  background-color: #FFFFFF;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);


  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
  /* margin-top: -30px; */
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

// ⭐️ 좌측 텍스트
export const TextWrapper = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 4px;
  width: 100%;
`;

export const ProductTitle = styled.div`
color: var(--Deep-Slate, #222);
font-family: Pretendard;
font-size: var(--Font-size-SM, 14px);
font-style: normal;
font-weight: var(--Font-weight-Semi-Bold, 600);
line-height: 140%; /* 19.6px */
`;

export const ProductColor = styled.div`
color: var(--Deep-Slate, #222);
font-family: Pretendard;
font-size: var(--Font-size-XS, 12px);
font-style: normal;
font-weight: var(--Font-weight-Light, 300);
line-height: 140%; /* 16.8px */
`;

// ⭐️ 우측 버튼 영역 (충분한 너비 + 좌측 세로 점선)
export const DetailButtonWrapper = styled.div`
  width: 152px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  padding-left: 20px;
  border-left: 1px dashed #BEB9B2;
  box-sizing: border-box;
  flex-shrink: 0;
`;

export const DetailButtonGroup = styled.div`
  width: 100%;
`;

// ⭐️ 우측 버튼 (줄바꿈 방지 + 넉넉한 가로폭)
export const DetailButton = styled.button`
  width: 100%;
  height: 42px;
  padding: 0 14px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: #FFFFFF;
  border: none;
  border-radius: 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);

color: #000;
font-family: Pretendard;
font-size: var(--Font-size-SM, 14px);
font-style: normal;
font-weight: var(--Font-weight-Light, 300);
line-height: 140%; /* 19.6px */
  white-space: nowrap; /* ⭐️ '디자인 의도' 글자 깨짐 완전 방지 */
  cursor: pointer;
  transition: background-color 0.15s ease, transform 0.08s ease;

  &:hover {
    background-color: #F8F8F8;
  }

  &:active {
    transform: scale(0.98);
  }

  span:first-child {
    white-space: nowrap;
  }

  span:last-child {
    font-size: 16px;
    color: #8E8E93;
    font-weight: 300;
  }
`;

export const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 40;
  backdrop-filter: blur(2px);
`;

export const ModalBox = styled.div`
  width: 82%;
  max-width: 250px;
  background: #ffffff;
  border-radius: 16px;
  padding: 18px 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  text-align: center;
`;

export const ModalText = styled.p`
  margin: 0;
  font-family: Pretendard, sans-serif;
  font-size: 13px;
  line-height: 1.5;
  color: #222222;
  white-space: pre-line;
  word-break: keep-all;
`;
import styled from "styled-components";

export const ProductArea = styled.div`
  display: flex;

  width: 363px;
  height: 300px;

  overflow: hidden;

  border-radius: 20px;
  background: #e5e3e0;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);

  box-sizing: border-box;

  @media (max-width: 600px) {
    width: 100%;
    height: auto;
    aspect-ratio: 363 / 300;
  }
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

  width: 206px;

  background-image: linear-gradient(
    to bottom,
    #a8a29d 0 12px,
    transparent 12px 17px
  );

  background-size: 1px 17px;
  background-position: right;
  background-repeat: repeat-y;
`;

export const ProductImageBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 166px;
  height: 180px;

  overflow: hidden;

  border-radius: 20px;
  background: #ffffff;

  flex-shrink: 0;

  @media (max-width: 600px) {
    width: 100%;
    height: auto;
    aspect-ratio: 166 / 180;
  }
`;

export const ProductImage = styled.img`
  display: block;

  width: 100%;
  height: 100%;

  object-fit: contain;
`;

export const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;

  width: 166px;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const ProductTitle = styled.h1`
  width: 100%;
  margin: 0;

  color: #222222;

  font-family: Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;

  word-break: keep-all;
`;

export const ProductColor = styled.p`
  margin: 0;

  color: #222222;

  font-family: Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 300;
  line-height: 1.4;
`;

export const DetailButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 137px;

  padding: 80px 20px 0;

  box-sizing: border-box;

  @media (max-width: 600px) {
    flex: 1;
    width: auto;

    padding: 26.5% 5.5% 0;
  }
`;

export const DetailButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 117px;
  min-height: 37px;

  padding: 8px 16px;

  border: none;
  border-radius: 10px;

  color: #222222;
  background: #ffffff;

  font-family: Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.4;

  cursor: pointer;
  
  &:hover{
    background: var(--shelve, #D1CCC7);
  }

  @media (max-width: 600px) {
    width: 100%;
    min-height: 32px;

    padding: 7px 12px;
    font-size: 12px;
  }
`;

export const DetailButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  width: 117px;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const PresetAnswer = styled.div`
  width: 117px;
  padding: 10px 12px;

  border-radius: 10px;

  color: #e5e3e0;
  background: #222222;

  font-family: Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 300;
  line-height: 1.4;

  word-break: keep-all;
  box-sizing: border-box;

  @media (max-width: 600px) {
    width: 100%;
    font-size: 11px;
  }
`;
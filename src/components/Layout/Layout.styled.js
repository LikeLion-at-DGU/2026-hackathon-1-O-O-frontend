import styled from "styled-components";

export const Content = styled.div`
  height: 300px;
  width: 363px;
  flex-shrink: 0;

  border-radius: 20px;
  background: #e5e3e0;

  margin: 24px auto;

  /* 휴대폰에서만 화면 비율에 맞춰 축소 */
  @media (max-width: 600px) {
    width: calc(100% - 32px);
    height: auto;
    aspect-ratio: 363 / 300;
  }
`;

export const Containerbottom = styled.div`
  position: relative;

  width: 100%;
  height: calc(100vh - 103px);

  background-color: #f5f4f1;

  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    transparent 24px
  );

  overflow: hidden;
  box-sizing: border-box;

  @media (max-width: 600px) {
    height: calc(100dvh - 103px);
    min-height: 500px;
  }
`;

export const Chat = styled.div`
  display: flex;

  width: 364px;
  height: 366px;

  flex-direction: column;
  align-items: flex-start;
  gap: 10px;

  margin: 0 auto 16px;

  overflow-y: auto;
  overflow-x: hidden;

  padding: 24px 6px 24px 0;
  box-sizing: border-box;

  @media (max-width: 600px) {
    width: calc(100% - 32px);
    height: 42dvh;
    min-height: 240px;
    max-height: 366px;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    margin: 20px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1ccc7;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #d4d4d8;
  }
`;

export const GoChat = styled.div`
  color: #71717a;
  text-align: center;

  font-family: Pretendard;
  font-size: 12px;
  font-weight: 300;
  line-height: 140%;

  padding-bottom: 16px;

  display: flex;
  justify-content: flex-end;
  align-items: center;

  margin-right: 20px;
  margin-bottom: 24px;
  gap: 8px;

  cursor: pointer;

  @media (max-width: 600px) {
    margin-right: 16px;
    margin-bottom: 16px;
  }

  &:hover {
    color: #222;
  }
`;

export const Line = styled.svg`
  position: absolute;
  right: 14px;
  top: 500px;

  @media (max-width: 600px) {
    right: 12px;
    top: 58dvh;
  }
`;
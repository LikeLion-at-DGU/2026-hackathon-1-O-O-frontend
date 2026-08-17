import styled from "styled-components";

export const Content = styled.div`
  height: 300px;
  width: 363px;
  flex-shrink: 0;

  border-radius: 20px;
  background: #e5e3e0;

  margin: 24px auto;
`;

export const Containerbottom = styled.div`
  position: relative;

  width: 100%;
  height: calc(100vh - 103px);

  background-color: #F5F4F1;

  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    transparent 24px
  );

  overflow: hidden;

  box-sizing: border-box;
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

  padding-right: 6px;
  padding-top: 24px;
  padding-bottom: 24px;

  box-sizing: border-box;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    margin: 20px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: #D1CCC7;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #D4D4D8;
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

  &:hover {
    color: #222;
  }
`;

export const Line = styled.svg`
  position: absolute;
  right: 14px;
  top: 500px;
`;
import styled from "styled-components";

export const Content = styled.div`
  height: 300px;
  width: 363px;
  align-self: stretch;
  border-radius: 20px;
  background: #e5e3e0;
  margin: 24px auto;
`;

export const Chat = styled.div`
  display: flex;
  width: 364px;
  height: 366px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;

  /* border: 2px solid black; */

  margin: 0 auto 16px;
`;

export const GoChat = styled.div`
  color: var(--Neutral-N40, #71717a);
  text-align: center;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 300;
  line-height: 140%;

  display: flex;
  justify-content: flex-end;
  align-items: center;

  margin-right: 20px;
  gap: 8px;
  margin-bottom: 24px;
  cursor: pointer;

  &:hover {
  color: var(--Deep-Slate, #222);
  }
`;

export const Line = styled.svg`
  position: absolute;
  right: 14px;
  top: 500px;
`;
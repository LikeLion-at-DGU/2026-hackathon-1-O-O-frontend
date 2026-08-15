import styled from "styled-components";

export const Content = styled.div`
  height: 300px;
  width: 363px;
  align-self: stretch;
  border-radius: 20px;
  background: #e5e3e0;
  margin: 24px auto;
  flex-shrink: 0;
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

  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 6px; /* 텍스트와 스크롤바 간격 */

  /* !!!!!!여기 스크롤 아직 수정중 일단 급한대로 끼워넣음 */

  /* 🚀 스크롤바 너비 */
  &::-webkit-scrollbar {
    width: 6px;
    display: block;
  }

  /* 🚀 스크롤바 배경(트랙) 투명 처리 */
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  /* 🚀 스크롤바 막대(Thumb) 디자인 */
  &::-webkit-scrollbar-thumb {
    background: #E4E4E7; /* 연한 그레이 색상 */
    border-radius: 10px;
  }

  /* 마우스 호버 시 살짝 진하게 */
  &::-webkit-scrollbar-thumb:hover {
    background: #D4D4D8;
  }
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
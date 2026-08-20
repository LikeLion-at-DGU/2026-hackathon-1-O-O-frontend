// src/components/Layout/Layout.styled.js
import styled from "styled-components";

// ⭐️ 1. 상단 카드 영역 (최대 600px까지 비율 유지하며 확장)
export const Content = styled.div`
  width: calc(100% - 32px);
  max-width: 568px; /* 600px 컨테이너 기준 좌우 16px 패딩 제외 */
  aspect-ratio: 363 / 300;
  max-height: 38dvh;
  margin: 14px auto 20px;

  border-radius: 24px;
  background-color: transparent;
  box-shadow: none;

  position: relative;
  flex-shrink: 0;
  z-index: 2;
  overflow: visible;

  /* ⭐️ 600px 초과 PC 화면에서는 기본 363x300 고정 */
  @media (min-width: 601px) {
    width: 363px;
    height: 300px;
    max-height: none;
    aspect-ratio: auto;
    margin: 16px auto 24px;
  }
`;

// ⭐️ 2. 하단 회색 컨테이너 영역 (600px까지 너비 100% 꽉 채움)
// src/components/Layout/Layout.styled.js

// ⭐️ 1. 하단 회색 영역: 600px 폭 전체를 꽉 채우도록 수정 (양옆 흰 여백 제거)
export const Containerbottom = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;

  flex: 1 1 0%;
  min-height: 0;

  display: flex;
  flex-direction: column;
  background-color: #f4f2ee;
  border-top: 1px solid rgba(0, 0, 0, 0.05);

  box-shadow: inset 0 12px 14px -10px rgba(0, 0, 0, 0.12);
  z-index: 1;
`;

// ⭐️ 2. 채팅 메시지 영역: 늘어난 너비에 맞춰 양옆 16px 여백을 두고 꽉 차게 확장
export const Chat = styled.div`
  width: calc(100% - 32px);
  margin: 0 auto;

  flex: 1 1 0%;
  min-height: 0;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;

  padding: 16px 0 8px;
  box-sizing: border-box;

  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    width: 4px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.15);
    border-radius: 4px;
  }
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.15) transparent;
`;

export const Line = styled.svg`
  display: none;
`;

// ⭐️ 3. 하단 '채팅으로 대화하기' 링크: 늘어난 너비의 오른쪽 끝에 정확히 위치
export const GoChat = styled.div`
  flex-shrink: 0;
  width: calc(100% - 32px);
  margin: 0 auto 8px;
  padding: 6px 0 calc(6px + env(safe-area-inset-bottom));

  color: #71717a;
  font-family: Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 300;
  line-height: 140%;

  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  &:hover {
    color: #222222;
  }
`;
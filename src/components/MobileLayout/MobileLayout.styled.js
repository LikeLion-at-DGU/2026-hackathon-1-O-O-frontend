// src/components/MobileLayout/MobileLayout.styled.js
import styled from "styled-components";

export const PageBackground = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  background-color: #eeeeee;
  overflow: hidden;
`;

export const MobileContainer = styled.div`
  position: relative;
  /* ⭐️ 600px 초과 시 기본 402px 고정, 600px 이하에서는 100% 반응형 */
  width: 402px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  overflow: hidden;

  @media (max-width: 600px) {
    width: 100vw;
  }
`;

export const MainContent = styled.main`
  flex: 1;
  min-height: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ $showHeader }) =>
    $showHeader ? "#ffffff" : "#222222"};
  
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;
import styled from "styled-components";

export const PageBackground = styled.div`
  display: flex;
  justify-content: center;

  width: 100%;
  min-height: 100vh;
  background-color: #eeeeee;
`;

export const MobileContainer = styled.div`
  position: relative;

  width: 100%;
  max-width: 402px;

  background-color: #ffffff;

  /* 휴대폰 화면에서만 전체 너비 사용 */
  @media (max-width: 600px) {
    width: 100vw;
    max-width: none;
  }
`;

export const MainContent = styled.main`
  min-height: ${({ $showHeader }) =>
    $showHeader ? "calc(100vh - 103px)" : "100vh"};

  background-color: ${({ $showHeader }) =>
    $showHeader ? "#ffffff" : "#222222"};

  overflow: hidden;

  @media (max-width: 600px) {
    min-height: ${({ $showHeader }) =>
      $showHeader ? "calc(100dvh - 103px)" : "100dvh"};
  }
`;
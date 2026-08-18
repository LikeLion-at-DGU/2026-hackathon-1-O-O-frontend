import styled from "styled-components";

export const PageBackground = styled.div`
  display: flex;
  justify-content: center;

  width: 100%;
  background-color: #eeeeee;
`;

export const MobileContainer = styled.div`
  position: relative;

  width: 100%;
  max-width: 402px;

  background-color: #ffffff;
`;

export const MainContent = styled.main`
  min-height: ${({ $showHeader }) =>
    $showHeader ? "calc(100dvh - 103px)" : "100dvh"};

  background-color: ${({ $showHeader }) =>
    $showHeader ? "#ffffff" : "#222222"};

  overflow: hidden;
`;
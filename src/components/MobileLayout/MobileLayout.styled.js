import styled from "styled-components";

export const PageBackground = styled.div`
  display: flex;
  justify-content: center;

  min-height: 100dvh;
  background-color: #eeeeee;
`;

export const MobileContainer = styled.div`
  position: relative;

  width: 100%;
  max-width: 402px;
  min-height: 100dvh;

  background-color: #ffffff;
`;

export const MainContent = styled.main`
  min-height: calc(100dvh - 72px);

  background-color: #ffffff;
  border-radius: 2px 2px 0 0;
  overflow: hidden;
`;
import styled from "styled-components";

export const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;

  width: 100%;
  height: 103px;
  padding: 51px 16px 14px 19px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: ${({ $isLight }) => ($isLight ? "#F3EEE3" : "#222")};
  box-sizing: border-box;
`;
export const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

`;

export const LogoText = styled.span`
  color: ${({ $isLight }) => ($isLight ? "#222" : "#F3EEE3")};

  font-family: Georgia, "Times New Roman", serif;
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
`;

export const Ampersand = styled.span`
  margin: 0 2px;
  padding-top: 12px;

  color: #8C6239;

  font-family: Georgia, "Times New Roman", serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
`;

export const SoundButton = styled.button`
  width: 24px;
  height: 24px;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #ffffff;
  font-size: 18px;

  background: none;
  border: none;
  cursor: pointer;
`;
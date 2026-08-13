import styled from "styled-components";

export const HeaderContainer = styled.header`
  width: 100%;
  height: 103px;
  padding: 51px 16px 14px 19px;


  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: #1f1f1f;
  box-sizing: border-box;

  margin-bottom : 24px;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

`;

export const LogoText = styled.span`
  color: #F3EEE3;

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
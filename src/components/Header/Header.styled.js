import styled from "styled-components";

export const HeaderContainer = styled.header`

  width: 100%;
  height: 103px;
  padding: 51px 16px 14px 19px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: #222;
  box-sizing: border-box;
`;
export const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

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

export const Finish = styled.button`
  display: flex;
padding: 8px 12px;
justify-content: center;
align-items: center;
border-radius: 10px;
background: var(--Heritage-Cognac, #8C6239);
  border: none;

color: var(--neutral, #E5E3E0);
font-family: Pretendard;
font-size: var(--Font-size-SM, 14px);
font-style: normal;
font-weight: 600;
line-height: 140%; /* 19.6px */

  &:hover {
    background: var(--Neutral-N40, #746F6A);
    color: #B9B6B1;
  }

`;  

export const ButtonWrapper= styled.div`
display: flex;
align-items: center;
gap: 12px;

`;
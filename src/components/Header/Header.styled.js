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

export const Logo = styled.h1`
  margin: 0;

  color: #ffffff;
  font-family: serif;
  font-size: 32px;
  line-height: 38px;
  font-weight: 700;
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
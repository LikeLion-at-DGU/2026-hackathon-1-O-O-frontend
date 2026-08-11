import styled from "styled-components";

export const LandingContainer = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  min-height: 100dvh;

  padding: 24px;
  box-sizing: border-box;

  background-color: #222;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  transform: translateY(-3vh);
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 8px;
`;

export const LogoText = styled.span`
  color: #F3EEE3;

  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(52px, 16vw, 68px);
  font-weight: 700;
  line-height: 1;
`;

export const Ampersand = styled.span`
  margin: 0 5px;
  padding-top: 15px;

  color: #8C6239;

  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(30px, 9vw, 40px);
  font-weight: 700;
  line-height: 1;
`;

export const Question = styled.p`
  margin: 0 0 24px;

  color: #f2efe9;

  font-size: 15px;
  font-weight: 500;
  line-height: 1.4;
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const BaseButton = styled.button`
  width: 74px;
  height: 36px;

  border: none;
  border-radius: 12px;

  color: #ffffff;

  font-family: inherit;
  font-size: 13px;
  font-weight: 500;

  cursor: pointer;

  transition:
    transform 0.15s ease,
    opacity 0.15s ease;

  &:active {
    transform: scale(0.96);
  }

  &:hover {
    opacity: 0.9;
  }
`;

export const CancelButton = styled(BaseButton)`
  background-color: #71717A;
`;

export const EnterButton = styled(BaseButton)`
  background-color: #8C6239;
`;
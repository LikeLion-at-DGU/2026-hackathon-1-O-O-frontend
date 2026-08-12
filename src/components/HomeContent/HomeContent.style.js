import styled from "styled-components";

export const Container = styled.main`
 width: 100%;
`;

export const Greeting = styled.div`
  width: 364px;
  margin: 0 auto 0 28px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

export const Title = styled.h1`
  margin: 0;

  color: var(--Deep-Slate, #222);
  font-family: Pretendard;
  font-size: var(--Font-size-XL, 20px);
  font-weight: 600;
  line-height: 140%;
`;

export const GreetingBear = styled.img`
  width: 114px;
  height: auto;
  flex-shrink: 0;
`;

export const Description = styled.p`
  color: var(--Deep-Slate, #222);
font-family: Pretendard;
font-size: var(--Font-size-SM, 14px);
font-style: normal;
font-weight: 300;
line-height: 140%; /* 19.6px */
width: 363px;
margin: 16px auto 24px;
`;

export const Section = styled.section`
 width: 363px;
 margin : 23px auto;
`;

export const SectionTitle = styled.h2`
  color: var(--Deep-Slate, #222);
font-family: Pretendard;
font-size: var(--Font-size-SM, 14px);
font-style: normal;
font-weight: var(--Font-weight-Semi-Bold, 600);
line-height: 140%; /* 19.6px */
`;

export const Text = styled.p`
  color: var(--Deep-Slate, #222);
font-family: Pretendard;
font-size: var(--Font-size-SM, 14px);
font-style: normal;
font-weight: var(--Font-weight-Light, 300);
line-height: 140%;
`;
export const MCM = styled.span`
  color: var(--Heritage-Cognac, #8C6239);
  font-family: "Noto Sans";
  font-size: 21px;
  font-style: normal;
  font-weight: 900;
  line-height: 140%;
`;

export const Place = styled.span`
  color: var(--Heritage-Cognac, #8C6239);
  font-family: Pretendard;
  font-size: var(--Font-size-XL, 20px);
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
`;

export const SubTitle = styled.div`
  display: flex;
  padding: 10px 20px;
  align-items: center;
  gap: 10px;
  align-self: stretch;

  background: var(--Deep-Slate, #222);
  color: var(--Gallery-Cream, #F3EEE3);

  font-family: Pretendard;
  font-size: var(--Font-size-MD, 16px);
  font-style: normal;
  font-weight: var(--Font-weight-medium, 500);
  line-height: 140%;
`;
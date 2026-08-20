import styled from "styled-components";

export const Container = styled.main`
  width: 100%;
`;

export const Greeting = styled.div`
  width: 364px;
  margin: 0 auto 13px 28px; // 저거그림자때메간격조정약간애매한데일단 13

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  /* 402px 기준 좌 28 / 우 10 여백을 유지하며 화면 폭에 맞춘다 */
  @media (max-width: 600px) {
    width: calc(100% - 38px);
  }
`;

export const Title = styled.h1`
  margin: 0;

  color: var(--Deep-Slate, #222);
  font-family: Pretendard;
  font-size: var(--Font-size-XL, 20px);
  font-weight: 600;
  line-height: 140%;
`;

export const BearWrapper = styled.div`
  position: relative;

  width: 114px;
  flex-shrink: 0;

  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

export const BearShadow = styled.div`
  position: absolute;

  left: 50%;
  bottom: -8px;
  transform: translateX(-50%);

  width: 109px;
  height: 43px;

  z-index: 0;
  pointer-events: none;
`;

export const GreetingBear = styled.img`
  position: relative;
  z-index: 1;

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
  line-height: 140%;

  width: 363px;
  margin: 16px auto 24px;

  @media (max-width: 600px) {
    width: calc(100% - 39px);
  }
`;

export const Section = styled.section`
  width: 363px;
  margin: 23px auto;

  @media (max-width: 600px) {
    width: calc(100% - 39px);
  }
`;

export const SectionTitle = styled.h2`
  color: var(--Deep-Slate, #222);

  font-family: Pretendard;
  font-size: var(--Font-size-SM, 14px);
  font-style: normal;
  font-weight: var(--Font-weight-Semi-Bold, 600);
  line-height: 140%;
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
import styled, { keyframes } from "styled-components";

const bearBounce = keyframes`
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-5px) rotate(2deg); }
`;

export const Container = styled.div`
  position: relative;

  width: 100%;
  min-height: 100dvh;

  overflow: hidden;
  box-sizing: border-box;

  color: #e5e3e0;

  background: linear-gradient(
    180deg,
    #222222 0%,
    #222222 58.17%,
    #d1ccc7 100%
  );

  @media (max-width: 600px) {
    min-height: 100dvh;
  }
`;

export const Logo = styled.div`
  position: absolute;
  top: 50px;
  left: 19px;

  display: flex;
  align-items: center;
`;

export const LogoMain = styled.span`
  color: #f3eee3;

  font-family: Georgia, "Times New Roman", serif;
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
`;

export const Ampersand = styled.span`
  margin: 0 2px;
  padding-top: 11px;

  color: #8c6239;

  font-family: Georgia, "Times New Roman", serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
`;

export const LoadingContent = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  padding-top: 163px;
  box-sizing: border-box;
`;

export const ErrorContent = styled(LoadingContent)`
  gap: 20px;
  padding: 220px 24px 0;
  text-align: center;
`;

export const Title = styled.h1`
  margin: 0;

  color: #e5e3e0;

  font-family: Pretendard, sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
  text-align: center;
`;

export const Description = styled.p`
  max-width: 320px;
  margin: 0;

  color: #d1ccc7;

  font-family: Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 300;
  line-height: 1.5;
  text-align: center;
`;

export const CardSection = styled.section`
  width: calc(100% - 39px);
  max-width: 363px;
  margin-top: 120px;
`;

export const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

export const Card = styled.div`
  position: relative;

  width: 105px;
  height: 200px;

  overflow: hidden;

  border: none;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);

  @media (max-width: 600px) {
    width: 29%;
  }
`;

export const CardFill = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;

  height: ${({ $height }) => $height};

  border-radius: 10px 10px 0 0;
  background: #8c6239;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.25);

  transition: height 1.3s ease-in-out;
  will-change: height;
`;

export const CardLabels = styled.div`
  display: flex;
  justify-content: space-around;

  margin-top: 12px;

  color: #e5e3e0;

  font-family: Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 300;

  gap: 30px;
`;

export const ProgressSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: calc(100% - 40px);
  max-width: 362px;
  margin-top: 32px;
`;

export const Character = styled.img`
  width: 70px;
  height: 70px;

  object-fit: contain;
  filter: drop-shadow(0 8px 4px rgba(0, 0, 0, 0.28));
  animation: ${bearBounce} 1.1s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const CardBorder = styled.svg`
  position: absolute;
  z-index: 2;
  inset: 0;

  width: 100%;
  height: 100%;

  overflow: visible;
  pointer-events: none;

  rect {
    fill: none;
    stroke: var(--Neutral-N30, #a8a29d);
    stroke-width: 2;
    stroke-dasharray: 10 7;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }
`;

export const ProgressContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  width: 285px;
`;

export const ProgressLabel = styled.span`
  color: #e5e3e0;

  font-family: Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 300;
`;

export const ProgressTrack = styled.div`
  width: 285px;
  height: 6px;

  overflow: hidden;

  border-radius: 999px;
  background: #ffffff;
`;

export const ProgressBar = styled.div`
  width: ${({ $progress }) => `${$progress}%`};
  height: 100%;

  border-radius: inherit;
  background: #e07a5f;

  transition: width 0.4s ease;
`;

export const RetryButton = styled.button`
  width: 220px;
  height: 48px;

  border: none;
  border-radius: 12px;

  color: #222222;
  background: #f3eee3;

  font-family: Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 600;

  cursor: pointer;
`;

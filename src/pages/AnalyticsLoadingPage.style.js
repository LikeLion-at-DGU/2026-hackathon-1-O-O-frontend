import styled, { keyframes } from "styled-components";

const float = keyframes`
  0% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-8px) scale(1.02); }
  100% { transform: translateY(0px) scale(1); }
`;

const pulse = keyframes`
  0% { transform: scale(0.95); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(0.95); opacity: 0.3; }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

export const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  padding: 0 24px;
  background-color: #f4f2ee;
`;

export const VisualBadge = styled.div`
  position: relative;
  width: 110px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  margin-top: 200px;

  &::before {
    content: "";
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(224, 122, 95, 0.22) 0%, rgba(224, 122, 95, 0) 70%);
    animation: ${pulse} 2.5s infinite ease-in-out;
  }
`;

export const CharacterImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: contain;
  z-index: 1;
  animation: ${float} 2.5s infinite ease-in-out;
`;

export const MainTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #2d2d2d;
  text-align: center;
  margin-bottom: 8px;
`;

export const SubTitle = styled.p`
  font-size: 14px;
  color: #7a7a7a;
  text-align: center;
  margin: 0;
`;

export const LoadingProgressBar = styled.div`
  width: 250px;
  height: 4px;
  background: #e5e0d8;
  border-radius: 999px;
  overflow: hidden;
  position: relative;
  margin-top: 35px;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, #e07a5F, transparent);
    animation: ${shimmer} 1.5s infinite ease-in-out;
  }
`;
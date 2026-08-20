import styled from "styled-components";

export const Content = styled.div`
  /* 컴퓨터에서는 기존 크기 유지 */
  width: 363px;
  height: 300px;
  flex: 0 0 auto;
  flex-shrink: 0;
  border-radius: 20px;
  /* background: #e5e3e0; */
  margin: 24px auto;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;

  /* 휴대폰에서만 반응형 적용 */
  @media (max-width: 600px) {
    width: calc(100% - 32px);
    height: auto;

    /* 기존 363:300 비율 유지 */
    aspect-ratio: 363 / 300;

    margin: 16px auto;
    border-radius: 16px;
  }
`;

export const Containerbottom = styled.div`
  position: relative;

  /* 기존 코드 유지 */
  width: 100%;
  height: calc(100vh - 430px);
  background-color: #F4F2EE;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  /* 추가 */
  display: flex;
  flex-direction: column;
  max-height: 844px;
/* 좌우는 완전히 제외하고 오직 상단 -> 하단으로만 떨어지는 그림자 */
  box-shadow: inset 0 12px 14px -10px rgba(0, 0, 0, 0.14),
              inset 0 4px 6px -3px rgba(0, 0, 0, 0.08);
  /* 나머지 기존 코드 유지 */

  @media (max-width: 600px) {
    /* 기존 반응형 코드 유지 */
    height: calc(100dvh - 103px);
    min-height: 500px;

    /* 추가 */
    max-height: 844px;

    
  }
`;

export const Chat = styled.div`
  
  display: flex;
    flex: 1 1 auto;
  min-height: 0;

  overflow-y: auto;

  /* 추가 */
  min-height: 0;
  flex-shrink: 1;

  /* 기존 코드 유지 */
  width: 364px;
  height: 366px;

  /* 기존 코드 그대로 */
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;

  margin: 0 auto 16px;
  padding: 16px 0 16px;

  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;

  /* ⭐️ [핵심] 스크롤바 배경 투명화 및 슬림 바 디자인 */
  &::-webkit-scrollbar {
    width: 4px; /* 얇은 너비 */
    background-color: transparent; /* 트랙 배경 완전 투명 */
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.15); /* 반투명한 얇은 막대 */
    border-radius: 4px;
  }

  /* Firefox 대응 */
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.15) transparent;

  @media (max-width: 600px) {
    width: calc(100% - 32px);
    height: clamp(240px, 42dvh, 366px);

    margin: 0 auto 12px;
    padding: 20px 4px 16px 0;
    gap: 10px;
  }

  /* 기존 미디어쿼리도 그대로 유지 */
  @media (max-width: 600px) {
    width: calc(100% - 32px);
    height: clamp(240px, 42dvh, 366px);

    margin: 0 auto 12px;
    padding: 16px 4px 16px 0;
    gap: 8px;
  }
`;

export const Line = styled.svg`
  position: absolute;
  right: 14px;
  top: 500px;

  @media (max-width: 600px) {
    right: 12px;
    top: 58dvh;
  }
`;

export const GoChat = styled.div`
  color: #71717a;
  text-align: center;

  font-family: Pretendard;
  font-size: 12px;
  font-weight: 300;
  line-height: 140%;

  padding-bottom: 16px;

  display: flex;
  justify-content: flex-end;
  align-items: center;

  margin-right: 20px;
  margin-bottom: 24px;

  gap: 8px;

  cursor: pointer;

  @media (max-width: 600px) {
    margin-right: 16px;
    margin-bottom: 16px;
  }

  &:hover {
    color: #222;
  }

  flex-shrink: 0;
`;
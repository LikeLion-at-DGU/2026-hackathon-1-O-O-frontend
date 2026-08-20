import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100dvh - 103px);
  padding: 16px 20px 24px;
  box-sizing: border-box;
`;

export const TitleArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 8px;
`;

export const Title = styled.h2`
  margin: 24px 0 0;
  color: var(--Deep-Slate, #222);
  text-align: center;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 600;
  line-height: 140%;
`;

export const SubTitle = styled.p`
  margin: 0;
  color: var(--Neutral-N30, #a8a29d);
  font-family: Pretendard;
  font-size: 11px;
  font-weight: 300;
  line-height: 140%;
  text-align: left;
`;

export const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100%;
  min-height: 320px;
  max-height: 560px;
  overflow: hidden;
  background-color: #e4e4e7;
  border-radius: 12px;
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const ErrorMessage = styled.p`
  margin: 14px 0 0;
  color: #c8503c;
  font-size: 13px;
  line-height: 150%;
  text-align: center;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
`;

export const RetakeButton = styled.button`
  height: 48px;
  padding: 0 18px;
  color: var(--Deep-Slate, #222);
  font-family: Pretendard;
  font-size: 15px;
  font-weight: 600;
  line-height: 140%;
  background: var(--neutral, #e5e3e0);
  border: none;
  border-radius: 12px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ConfirmButton = styled.button`
  flex: 1;
  height: 48px;
  padding: 0 16px;
  color: #f5f4f0;
  font-family: Pretendard;
  font-size: 15px;
  font-weight: 600;
  line-height: 140%;
  background-color: #222;
  border: none;
  border-radius: 12px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const CenterBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: calc(100dvh - 103px);
`;

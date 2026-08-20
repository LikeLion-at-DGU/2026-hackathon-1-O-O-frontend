import styled from "styled-components";

export const MessageRow = styled.div`
  display: flex;
  justify-content: ${({ $isAssistant }) =>
    $isAssistant
      ? "flex-start"
      : "flex-end"};
  align-items: flex-start;
  gap: 10px;
  width: 100%;
`;

export const ProfileImage = styled.img`
  flex-shrink: 0;

  width: 36px;
  height: 36px;

  object-fit: cover;
  border-radius: 50%;
`;

export const MessageBubble = styled.div`
  max-width: 260px;
  padding: 12px 16px;

  color: #ffffff;
  background-color: ${({ $isAssistant }) =>
    $isAssistant
      ? "#1f1f1f"
      : "#8c6239"};

  font-size: 13px;
  font-family: "Pretendard";
  font-weight: 400;
  line-height: 1.5;
  word-break: keep-all;

  border-radius: ${({ $isAssistant }) =>
    $isAssistant
      ? "0 20px 20px 20px"
      : "20px 0 20px 20px"};

  cursor: ${({ $clickable }) =>
    $clickable ? "pointer" : "default"};
`;

export const ActionList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  margin: 8px 0 0 46px;
`;

export const ActionButton = styled.button`
  padding: 9px 14px;

  color: #8c6239;
  background: #ffffff;

  border: 1px solid #8c6239;
  border-radius: 999px;

  font-family: "Pretendard";
  font-size: 13px;

  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`;
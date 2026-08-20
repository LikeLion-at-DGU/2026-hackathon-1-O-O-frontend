import styled from "styled-components";

export const MessageRow = styled.div`
  display: flex;
  justify-content: ${({ $isAssistant }) =>
    $isAssistant ? "flex-start" : "flex-end"};
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
    $isAssistant ? "#1f1f1f" : "#8C6239"};

  color: var(--neutral, #E5E3E0);
  font-family: Pretendard;
  font-size: var(--Font-size-SM, 14px);
  font-style: normal;
  font-weight: 300;
  line-height: 140%; /* 19.6px */


  border-radius: ${({ $isAssistant }) =>
    $isAssistant ? "0 20px 20px 20px" : "20px 0 20px 20px"};
    

  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
`;
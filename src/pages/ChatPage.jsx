import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import MobileLayout from "../components/MobileLayout/MobileLayout";
import ChatMessage from "../components/ChatMessage/ChatMessage";
import bearImage from "../assets/bear.png";
import Header from "../components/Header/Header";
import useChatStore from "../stores/useChatStore";
import { getChatMessages, streamChat } from "../api/chat";
import { useDwellTimer } from "../hooks/useDwellTimer";

function ChatPage() {
  const navigate = useNavigate();
  const {
    messages,
    addCustomMessage,
    setServerMessages,
    startAssistantMessage,
    appendAssistantDelta,
  } = useChatStore();

  useDwellTimer({
    eventType: "chat_dwell",
    targetId: "chat_room",
    minDwellMs: 1000, // 1초 이상 머물렀을 때 전송
  });

  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  // 새 메시지가 생기면 맨 아래로 이동하기 위한 ref
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  useEffect(() => {
    const loadChatMessages = async () => {
      const visitId =
        localStorage.getItem("visitId") ??
        sessionStorage.getItem("visit_id");

      if (!visitId) return;

      try {
        const response = await getChatMessages();
        setServerMessages(response.data.messages ?? []);
      } catch (error) {
        console.error("채팅 내역 조회 실패:", error);
      }
    };

    loadChatMessages();
  }, [setServerMessages]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedValue = inputValue.trim();

    // 공백만 입력한 경우 전송하지 않음
    if (!trimmedValue || isSending) return;

    addCustomMessage("user", trimmedValue);
    setInputValue("");

    try {
      setIsSending(true);
      startAssistantMessage();

      await streamChat({
        message: trimmedValue,
        onDelta: appendAssistantDelta,
      });

      // 서버에 저장된 message_id와 role까지 다시 맞춘다.
      const response = await getChatMessages();
      setServerMessages(response.data.messages ?? []);
    } catch (error) {
      console.error("AI 채팅 전송 실패:", error);
      appendAssistantDelta(
        "죄송해요. 답변을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <MobileLayout>
      <ChatPageContainer>
        <MessageArea>
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              type={message.type}
              profileImage={
                message.type === "assistant"
                  ? bearImage
                  : undefined
              }
            >
              {message.text}
            </ChatMessage>
          ))}

          <div ref={messagesEndRef} />
        </MessageArea>

        <BottomArea>
          <BackChat
            type="button"
            onClick={() => navigate(-1)}
          >
            돌아가기

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="8"
              viewBox="0 0 11 8"
              fill="none"
            >
              <path
                d="M0.5 3.18213C0.223858 3.18213 0 3.40599 0 3.68213C0 3.95827 0.223858 4.18213 0.5 4.18213V3.68213V3.18213ZM10.8536 4.03568C11.0488 3.84042 11.0488 3.52384 10.8536 3.32858L7.67157 0.146595C7.47631 -0.0486672 7.15973 -0.0486672 6.96447 0.146595C6.7692 0.341857 6.7692 0.65844 6.96447 0.853702L9.79289 3.68213L6.96447 6.51056C6.7692 6.70582 6.7692 7.0224 6.96447 7.21766C7.15973 7.41293 7.47631 7.41293 7.67157 7.21766L10.8536 4.03568ZM0.5 3.68213V4.18213H10.5V3.68213V3.18213H0.5V3.68213Z"
                fill="#71717A"
              />
            </svg>
          </BackChat>

          <ChatForm onSubmit={handleSubmit}>
            <ChatInput
              type="text"
              value={inputValue}
              onChange={(event) =>
                setInputValue(event.target.value)
              }
              placeholder="메시지를 입력해 주세요"
              aria-label="채팅 메시지"
            />

            <SendButton
              type="submit"
              disabled={!inputValue.trim() || isSending}
              aria-label="메시지 전송"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M5 12H19M19 12L13 6M19 12L13 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </SendButton>
          </ChatForm>
        </BottomArea>
      </ChatPageContainer>
    </MobileLayout>
  );
}

export default ChatPage;

const ChatPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  /*
   * ChatHeader가 72px라면 화면 전체 높이에서
   * 헤더 높이만큼 빼서 사용해.
   */
  height: calc(100dvh - 72px);
  min-height: 0;

  background: #F4F2EE;
`;

const MessageArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;

  padding: 15px 20px 24px;
  box-sizing: border-box;

  /* iPhone에서 부드럽게 스크롤 */
  -webkit-overflow-scrolling: touch;
/* ⭐️ 1. 스크롤바 너비 및 배경 투명화 */
  &::-webkit-scrollbar {
    width: 6px;
    background-color: transparent; /* 스크롤바 전체 배경 투명 */
  }

  /* ⭐️ 2. 스크롤 트랙(레일) 투명화 */
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  /* ⭐️ 3. 움직이는 스크롤 바(Thumb) 디자인 */
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.15); /* 은은한 반투명 막대 */
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }

  /* Firefox 전용 */
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.15) transparent;
`;

const BottomArea = styled.div`
  flex-shrink: 0;
  padding: 8px 20px
    calc(12px + env(safe-area-inset-bottom));

  background: #F4F2EE;
  border-top: 1px solid #f1f1f3;
`;

const BackChat = styled.button`
  width: 100%;
  margin-bottom: 10px;
  padding: 0;

  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;

  color: #71717a;
  font-family: Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 300;
  line-height: 140%;

  background: none;
  border: none;
  cursor: pointer;
`;

const ChatForm = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;

  width: 100%;
  padding: 6px 6px 6px 16px;
  box-sizing: border-box;

  border: 1px solid #e4e4e7;
  border-radius: 24px;
  background: #F4F2EE;

  &:focus-within {
    border-color: #18181b;
  }
`;

const ChatInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 36px;

  padding: 0;
  border: none;
  outline: none;
  background: transparent;

  color: #18181b;
  font-family: Pretendard, sans-serif;
  font-size: 14px;

  &::placeholder {
    color: #a1a1aa;
  }
`;

const SendButton = styled.button`
  flex-shrink: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 36px;
  height: 36px;
  padding: 0;

  border: none;
  border-radius: 50%;
  background: #18181b;
  color: #F4F2EE;
  cursor: pointer;

  &:disabled {
    background: #e4e4e7;
    color: #a1a1aa;
    cursor: default;
  }
`;
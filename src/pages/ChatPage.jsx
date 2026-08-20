import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import MobileLayout from "../components/MobileLayout/MobileLayout";
import ChatMessage from "../components/ChatMessage/ChatMessage";
import bearImage from "../assets/bear.png";
import useChatStore from "../stores/useChatStore";


import { streamChat } from "../api/chat";
import { useChatSync } from "../hooks/useChatSync";

function ChatPage() {
  const navigate = useNavigate();

  const {
    messages,
    addCustomMessage,
    pendingAction,
    startAssistantMessage,
    appendAssistantDelta,
  } = useChatStore();

  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);


  const messagesEndRef = useRef(null);

  // 진행 중인 SSE 스트림. 화면을 떠나면 끊는다.
  const streamAbortRef = useRef(null);

  useEffect(() => {
    return () => {
      streamAbortRef.current?.abort();
    };
  }, []);

  // 메시지가 추가되면 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  // 채팅 메시지와 pending_action 조회
  // 폴링·트리거 응답은 Layout과 공유하는 훅이 담당한다.
  // SSE 답변 생성 중에는 폴링을 멈춘다 — 임시 말풍선이 덮이지 않게.
  const { handleAction, isActionLoading, refresh } = useChatSync({
    paused: isSending,
  });

  // 직접 입력 채팅
  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedValue =
      inputValue.trim();

    if (!trimmedValue || isSending) {
      return;
    }

    addCustomMessage(
      "user",
      trimmedValue,
    );

    setInputValue("");

    try {
      setIsSending(true);

      // 스트리밍 답변을 담을 빈 말풍선
      startAssistantMessage();

      streamAbortRef.current = new AbortController();
      await streamChat({
        message: trimmedValue,
        onDelta: appendAssistantDelta,
        signal: streamAbortRef.current.signal,
      });

      // 서버에 저장된 message_id와 role로 동기화
      await refresh();
    } catch (error) {
      // 화면 이탈로 우리가 끊은 스트림은 오류가 아니다
      if (error?.name === "AbortError") {
        return;
      }

      console.error(
        "AI 채팅 전송 실패:",
        error,
      );

      appendAssistantDelta(
        error?.message ||
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
                message.type ===
                "assistant"
                  ? bearImage
                  : undefined
              }
              pendingAction={
                pendingAction?.reply_to ===
                message.id
                  ? pendingAction
                  : null
              }
              onAction={handleAction}
              isActionLoading={
                isActionLoading
              }
            >
              {message.text}
            </ChatMessage>
          ))}

          <div ref={messagesEndRef} />
        </MessageArea>

        <BottomArea>

          <ChatForm onSubmit={handleSubmit}>
            <ChatInput
              type="text"
              value={inputValue}
              onChange={(event) =>
                setInputValue(
                  event.target.value,
                )
              }
              placeholder="메시지를 입력해 주세요"
              aria-label="채팅 메시지"
            />

            <SendButton
              type="submit"
              disabled={
                !inputValue.trim() ||
                isSending
              }
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
          <br/>
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

  padding:
    8px 20px
    calc(
      12px +
        env(safe-area-inset-bottom)
    );

  background: #F4F2EE;
  border-top: 1px solid #f1f1f3;
`;

const BackChat = styled.button`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;

  width: 100%;
  margin-bottom: 10px;
  padding: 0;

  color: #71717a;
  font-family: Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 300;
  line-height: 140%;

  background: none;
  border: none;
  cursor: pointer;

  &:hover{
    color: var(--Deep-Slate, #222);
  }
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
  /* iOS Safari는 16px 미만 입력창에 포커스하면 화면을 자동 확대한다. */
  font-size: 16px;

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
  color: #ffffff;

  cursor: pointer;

  &:disabled {
    background: #e4e4e7;
    color: #a1a1aa;
    cursor: default;
  }
`;

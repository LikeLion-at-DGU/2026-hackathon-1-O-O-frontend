import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import MobileLayout from "../components/MobileLayout/MobileLayout";
import ChatMessage from "../components/ChatMessage/ChatMessage";
import bearImage from "../assets/bear.png";
import useChatStore from "../stores/useChatStore";

import { streamChat } from "../api/chat";
import { useChatSync } from "../hooks/useChatSync";
import * as S from "./ChatPage.styled";

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

  // 1. SSE 스트림 제어 (컴포넌트 언마운트 시 스트림 중단)
  const streamAbortRef = useRef(null);

  useEffect(() => {
    return () => {
      streamAbortRef.current?.abort();
    };
  }, []);

  // 2. 메시지 추가 시 하단 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  // 3. 채팅 동기화 및 Action 핸들링 (답변 생성 중 폴링 일시 정지)
  const { handleAction, isActionLoading, refresh } = useChatSync({
    paused: isSending,
  });

  // 4. 메시지 전송 및 SSE 스트리밍 핸들러
  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedValue = inputValue.trim();
    if (!trimmedValue || isSending) {
      return;
    }

    addCustomMessage("user", trimmedValue);
    setInputValue("");

    try {
      setIsSending(true);

      // 스트리밍 응답용 빈 말풍선 생성
      startAssistantMessage();

      streamAbortRef.current = new AbortController();
      await streamChat({
        message: trimmedValue,
        onDelta: appendAssistantDelta,
        signal: streamAbortRef.current.signal,
      });

      // 서버 메시지 상태 동기화
      await refresh();
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }

      console.error("AI 채팅 전송 실패:", error);

      appendAssistantDelta(
        error?.message ||
          "죄송해요. 답변을 불러오지 못했어요. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <MobileLayout>
      <S.ChatPageContainer>
        <S.MessageArea>
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              type={message.type}
              profileImage={
                message.type === "assistant" ? bearImage : undefined
              }
              pendingAction={
                pendingAction?.reply_to === message.id ? pendingAction : null
              }
              onAction={handleAction}
              isActionLoading={isActionLoading}
            >
              {message.text}
            </ChatMessage>
          ))}

          <div ref={messagesEndRef} />
        </S.MessageArea>

        <S.BottomArea>
          <S.ChatForm onSubmit={handleSubmit}>
            <S.ChatInput
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="메시지를 입력해 주세요"
              aria-label="채팅 메시지"
            />

            <S.SendButton
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
            </S.SendButton>
          </S.ChatForm>

          <br />

          <S.BackChat type="button" onClick={() => navigate(-1)}>
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
          </S.BackChat>
        </S.BottomArea>
      </S.ChatPageContainer>
    </MobileLayout>
  );
}

export default ChatPage;
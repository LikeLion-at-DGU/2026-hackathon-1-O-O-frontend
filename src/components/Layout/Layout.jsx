import * as S from "./Layout.styled";
import MobileLayout from "../MobileLayout/MobileLayout";
import {
  Outlet,
  useNavigate,
} from "react-router-dom";
import ChatMessage from "../ChatMessage/ChatMessage";
import bearImage from "../../assets/bear.png";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import useChatStore from "../../stores/useChatStore";

import {
  answerPendingAction,
  getChatMessages,
} from "../../api/chat";

function Layout() {
  const navigate = useNavigate();

  const {
    messages,
    pendingAction,
    syncChatState,
    applyActionResponse,
  } = useChatStore();

  const [isActionLoading, setIsActionLoading] =
    useState(false);

  const chatRef = useRef(null);

  // 메시지가 추가되면 아래로 스크롤
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop =
        chatRef.current.scrollHeight;
    }
  }, [messages]);

  // 서버 채팅 및 pending_action 조회
  useEffect(() => {
    let isMounted = true;

    const loadChatMessages = async () => {
      const visitId =
        localStorage.getItem("visitId") ??
        sessionStorage.getItem(
          "visit_id",
        );

      if (!visitId) {
        return;
      }

      try {
        const response =
          await getChatMessages();

        if (isMounted) {
          syncChatState(response.data);
        }
      } catch (error) {
        console.error(
          "채팅 트리거 조회 실패:",
          error.response?.data ?? error,
        );
      }
    };

    // 처음 화면 진입 시 즉시 조회
    loadChatMessages();

    // 이후 3초마다 트리거 확인
    const pollingId = window.setInterval(
      loadChatMessages,
      3000,
    );

    return () => {
      isMounted = false;
      window.clearInterval(pollingId);
    };
  }, [syncChatState]);

  // 트리거 선택지 클릭
  const handleAction = async (
    action,
    option,
  ) => {
    if (isActionLoading) {
      return;
    }

    try {
      setIsActionLoading(true);

      const response =
        await answerPendingAction({
          pendingAction: action,
          option,
        });

      applyActionResponse(
        response.data.messages ?? [],
      );
    } catch (error) {
      console.error(
        "트리거 응답 실패:",
        error.response?.data ?? error,
      );

      // 중복 클릭 또는 만료된 가설이면
      // 서버 상태로 다시 맞춘다.
      try {
        const response =
          await getChatMessages();

        syncChatState(response.data);
      } catch (reloadError) {
        console.error(
          "채팅 상태 복구 실패:",
          reloadError,
        );
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <MobileLayout>
      <S.Content>
        <Outlet />
      </S.Content>

      <S.Containerbottom>
        <S.Chat ref={chatRef}>
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

          <div
            id="chat-bottom-slot"
            style={{
              width: "100%",
            }}
          />
        </S.Chat>

        <S.Line
          width="5"
          height="50"
          viewBox="0 0 5 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        />

        <S.GoChat
          onClick={() =>
            navigate("/chat")
          }
        >
          채팅으로 대화하기

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
        </S.GoChat>
      </S.Containerbottom>
    </MobileLayout>
  );
}

export default Layout;
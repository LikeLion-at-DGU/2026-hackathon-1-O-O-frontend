import { create } from "zustand";
import { persist } from "zustand/middleware";

// 진열대 연속 클릭 방지용 타임스탬프
let lastShelfLogAt = 0;

/**
 * 로컬 임시 메시지 ID 생성기
 */
const newLocalId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? `local-${crypto.randomUUID()}`
    : `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/**
 * UI에 노출되지 않아야 하는 시스템/사용자 인터랙션 로그 패턴 목록
 */
const HIDDEN_CLICK_PATTERNS = [
  /^\d+번 진열대 클릭$/,
  /상품 클릭$/,
  /^(가격|재질|디자인 의도)$/,
];

/**
 * 숨김 대상 클릭 로그 여부 검증
 */
const isHiddenClickLog = (message) =>
  message.role === "user_action" &&
  HIDDEN_CLICK_PATTERNS.some((pattern) => pattern.test(message.content));

/**
 * 백엔드 메시지 스펙 정규화
 */
const normalizeServerMessage = (message) => ({
  id: message.message_id,
  type:
    message.role === "assistant" || message.role === "preset"
      ? "assistant"
      : "user",
  role: message.role || (message.type === "assistant" ? "assistant" : "user"),
  text: message.content,
  createdAt: message.created_at,
});

/**
 * 초기 진입 시 기본 환영 메시지 (type과 role 모두 지정)
 */
const INITIAL_MESSAGES = [
  {
    id: "init",
    type: "assistant",
    role: "assistant",
    text:
      "뮤즈님, 안녕하세요! 저는 패디에요.\n" +
      "저와 함께 MCM을 경험해 보아요.\n" +
      "각 진열대를 눌러 상품에 대해 알아보세요.",
  },
];

const useChatStore = create(
  persist(
    (set) => ({
      selectedZoneId: null,
      selectedProduct: null,
      selectedQuestion: null,
      selectedAnswer: null,
      pendingAction: null,
      messages: INITIAL_MESSAGES,

      selectShelf: (zoneId) =>
        set((state) => {
          const zone = Number(zoneId);
          const now = Date.now();

          if (state.selectedZoneId === zone) {
            return { selectedZoneId: zone };
          }

          if (now - lastShelfLogAt < 400) {
            return { selectedZoneId: zone };
          }

          lastShelfLogAt = now;
          console.log(`[Shelf Selected] ${zone}번 진열대 클릭`);

          return { selectedZoneId: zone };
        }),

      selectProduct: (product) =>
        set((state) => {
          const productName = product?.name || product?.product_name || "상품";

          return {
            selectedProduct: product,
            selectedQuestion: null,
            selectedAnswer: null,
            messages: [
              ...state.messages,
              {
                id: newLocalId(),
                type: "user",
                role: "user",
                text: productName,
              },
            ],
          };
        }),

      selectQuestion: (question, answer) =>
        set((state) => {
          const lastMessage = state.messages[state.messages.length - 1];

          if (lastMessage?.text === answer) {
            return {};
          }

          return {
            selectedQuestion: question,
            selectedAnswer: answer,
            messages: [
              ...state.messages,
              {
                id: newLocalId(),
                type: "user",
                role: "user",
                text: question,
              },
              {
                id: newLocalId(),
                type: "assistant",
                role: "assistant",
                text: answer,
              },
            ],
          };
        }),

      addCustomMessage: (type, text) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: newLocalId(),
              type,
              role: type === "assistant" ? "assistant" : "user",
              text,
            },
          ],
        })),

      setMessages: (messages) =>
        set({
          messages,
        }),

      setPendingAction: (pendingAction) =>
        set({
          pendingAction,
        }),

      /**
       * 서버 동기화: 백엔드 메시지가 들어와도 INITIAL_MESSAGES를 항상 맨 앞에 유지
       */
      syncChatState: ({ messages = [], pending_action = null } = {}) =>
        set((state) => {
          const filteredServer = (messages || [])
            .filter((message) => !isHiddenClickLog(message))
            .map(normalizeServerMessage);

          // 현재 상태에 있는 로컬 임시 메시지 추출 (id가 local- 또는 stream- 으로 시작하는 것)
          const localMessages = state.messages.filter(
            (msg) =>
              msg.id?.startsWith("local-") || msg.id?.startsWith("stream-")
          );

          // 서버 메시지와 로컬 메시지 병합 (중복 방지)
          const existingIds = new Set(filteredServer.map((m) => m.id));
          const safeLocalMessages = localMessages.filter(
            (m) => !existingIds.has(m.id)
          );

          return {
            messages: [
              ...INITIAL_MESSAGES,
              ...filteredServer,
              ...safeLocalMessages,
            ],
            pendingAction: pending_action,
          };
        }),

      /**
       * 서버 메시지 설정 시에도 INITIAL_MESSAGES 항상 유지
       */
      setServerMessages: (serverMessages = []) =>
        set((state) => {
          const filteredServer = (serverMessages || [])
            .filter((message) => !isHiddenClickLog(message))
            .map(normalizeServerMessage);

          const localMessages = state.messages.filter(
            (msg) =>
              msg.id?.startsWith("local-") || msg.id?.startsWith("stream-")
          );

          const existingIds = new Set(filteredServer.map((m) => m.id));
          const safeLocalMessages = localMessages.filter(
            (m) => !existingIds.has(m.id)
          );

          return {
            messages: [
              ...INITIAL_MESSAGES,
              ...filteredServer,
              ...safeLocalMessages,
            ],
          };
        }),

      addServerMessages: (serverMessages = []) =>
        set((state) => {
          const existingIds = new Set(
            state.messages.map((message) => message.id)
          );

          const newMessages = (serverMessages || [])
            .filter((message) => !isHiddenClickLog(message))
            .map(normalizeServerMessage)
            .filter((message) => !existingIds.has(message.id));

          if (!newMessages.length) {
            return {};
          }

          return {
            messages: [...state.messages, ...newMessages],
          };
        }),

      applyActionResponse: (serverMessages = []) =>
        set((state) => {
          const existingIds = new Set(
            state.messages.map((message) => message.id)
          );

          const newMessages = (serverMessages || [])
            .filter((message) => !isHiddenClickLog(message))
            .map(normalizeServerMessage)
            .filter((message) => !existingIds.has(message.id));

          return {
            messages: newMessages.length
              ? [...state.messages, ...newMessages]
              : state.messages,
            pendingAction: null,
          };
        }),

      startAssistantMessage: () =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: `stream-${newLocalId()}`,
              type: "assistant",
              role: "assistant",
              text: "",
            },
          ],
        })),

      appendAssistantDelta: (delta) =>
        set((state) => {
          const lastIndex = state.messages.length - 1;
          const lastMessage = state.messages[lastIndex];

          if (lastMessage?.type !== "assistant") {
            return {};
          }

          return {
            messages: state.messages.map((message, index) =>
              index === lastIndex
                ? {
                    ...message,
                    text: message.text + delta,
                  }
                : message
            ),
          };
        }),

      resetChat: () =>
        set({
          selectedZoneId: null,
          selectedProduct: null,
          selectedQuestion: null,
          selectedAnswer: null,
          pendingAction: null,
          messages: INITIAL_MESSAGES,
        }),
    }),
    {
      name: "ono-chat-storage",
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);

export default useChatStore;
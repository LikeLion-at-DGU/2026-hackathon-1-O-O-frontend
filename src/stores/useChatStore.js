import { create } from "zustand";
import { persist } from "zustand/middleware";
import styled from "styled-components";

let lastShelfLogAt = 0;

// 화면에 보이면 안 되는 클릭 로그. 진열대/상품 클릭과 프리셋 버튼 라벨은 숨기되,
// 손님이 버튼으로 답한 말("맞아요" 등)은 남긴다. 서버가 action_type을 내려주지
// 않아 문구 패턴으로 구분한다 — 서버 문구(chat/messages.py)와 짝이다.
const HIDDEN_CLICK_PATTERNS = [
    /^\d+번 진열대 클릭$/,
    /상품 클릭$/,
    /^(가격|재질|디자인 의도)$/,
];

const isHiddenClickLog = (message) =>
    message.role === "user_action" &&
    HIDDEN_CLICK_PATTERNS.some((pattern) =>
        pattern.test(message.content),
    );

const normalizeServerMessage = (message) => ({
    id: message.message_id,
    // preset은 서버가 미리 써 둔 답변이라 어시스턴트 말풍선(왼쪽)이어야 한다
    type:
        message.role === "assistant" ||
            message.role === "preset"
            ? "assistant"
            : "user",
    role: message.role,
    text: message.content,
    createdAt: message.created_at,
});

export const MessageText = styled.p`
  white-space: pre-line;
  color: var(--neutral, #e5e3e0);
  font-family: Pretendard;
  font-size: var(--Font-size-SM, 14px);
  font-style: normal;
  font-weight: 300;
  line-height: 140%;
`;

const INITIAL_MESSAGES = [
    {
        id: "init",
        type: "assistant",
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

            // 서버에서 받은 현재 트리거
            pendingAction: null,

            // 누적 대화
            messages: INITIAL_MESSAGES,

            // 진열대 선택
            selectShelf: (zoneId) =>
                set((state) => {
                    const zone = Number(zoneId);
                    const now = Date.now();

                    // 같은 진열대를 다시 선택한 경우
                    if (state.selectedZoneId === zone) {
                        return {
                            selectedZoneId: zone,
                        };
                    }

                    // 400ms 안에 연속으로 발생한 이벤트 방지
                    if (now - lastShelfLogAt < 400) {
                        return {
                            selectedZoneId: zone,
                        };
                    }

                    lastShelfLogAt = now;

                    console.log(
                        `[Shelf Selected] ${zone}번 진열대 클릭`,
                    );

                    return {
                        selectedZoneId: zone,
                    };
                }),

            // 상품 선택
            selectProduct: (product) =>
                set({
                    selectedProduct: product,
                }),

            // 미리 정의된 질문 선택
            selectQuestion: (question, answer) =>
                set((state) => {
                    const lastMessage =
                        state.messages[
                        state.messages.length - 1
                        ];

                    if (lastMessage?.text === answer) {
                        return {};
                    }

                    return {
                        selectedQuestion: question,
                        selectedAnswer: answer,
                        messages: [
                            ...state.messages,
                            {
                                id: Date.now(),
                                type: "user",
                                text: question,
                            },
                            {
                                id: Date.now() + 1,
                                type: "assistant",
                                text: answer,
                            },
                        ],
                    };
                }),

            // 직접 입력한 메시지 추가
            addCustomMessage: (type, text) =>
                set((state) => ({
                    messages: [
                        ...state.messages,
                        {
                            id: Date.now(),
                            type,
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

            // GET /chat/messages 응답 전체 동기화
            syncChatState: ({
                messages = [],
                pending_action = null,
            } = {}) =>
                set({
                    messages: messages.length
                        ? messages
                            .filter(
                                (message) =>
                                    !isHiddenClickLog(
                                        message,
                                    ),
                            )
                            .map(
                                normalizeServerMessage,
                            )
                        : INITIAL_MESSAGES,

                    pendingAction: pending_action,
                }),

            // 기존 함수 호환용
            setServerMessages: (
                serverMessages = [],
            ) =>
                set({
                    messages: serverMessages.length
                        ? serverMessages
                            .filter(
                                (message) =>
                                    !isHiddenClickLog(
                                        message,
                                    ),
                            )
                            .map(
                                normalizeServerMessage,
                            )
                        : INITIAL_MESSAGES,
                }),

            // 서버 메시지를 중복 없이 추가
            addServerMessages: (
                serverMessages = [],
            ) =>
                set((state) => {
                    const existingIds = new Set(
                        state.messages.map(
                            (message) => message.id,
                        ),
                    );

                    // syncChatState와 같은 필터를 태운다. 여기만 빠져 있어서
                    // "N번 진열대 클릭"이 폴링 전 잠깐 표시되는 깜빡임이 있었다.
                    const newMessages = serverMessages
                        .filter(
                            (message) =>
                                !isHiddenClickLog(message),
                        )
                        .map(normalizeServerMessage)
                        .filter(
                            (message) =>
                                !existingIds.has(message.id),
                        );

                    if (!newMessages.length) {
                        return {};
                    }

                    return {
                        messages: [
                            ...state.messages,
                            ...newMessages,
                        ],
                    };
                }),

            // 트리거 응답 결과 반영
            applyActionResponse: (
                serverMessages = [],
            ) =>
                set((state) => {
                    const existingIds = new Set(
                        state.messages.map(
                            (message) => message.id,
                        ),
                    );

                    const newMessages = serverMessages
                        .filter(
                            (message) =>
                                !isHiddenClickLog(message),
                        )
                        .map(normalizeServerMessage)
                        .filter(
                            (message) =>
                                !existingIds.has(message.id),
                        );
                        
                    return {
                        messages: newMessages.length
                            ? [
                                ...state.messages,
                                ...newMessages,
                            ]
                            : state.messages,

                        // 답변했으므로 선택지 제거
                        pendingAction: null,
                    };
                }),

            // SSE 답변용 빈 말풍선 생성
            startAssistantMessage: () =>
                set((state) => ({
                    messages: [
                        ...state.messages,
                        {
                            id: `stream-${Date.now()}`,
                            type: "assistant",
                            role: "assistant",
                            text: "",
                        },
                    ],
                })),

            // SSE로 받은 답변 조각 연결
            appendAssistantDelta: (delta) =>
                set((state) => {
                    const lastIndex =
                        state.messages.length - 1;

                    const lastMessage =
                        state.messages[lastIndex];

                    if (
                        lastMessage?.type !== "assistant"
                    ) {
                        return {};
                    }

                    return {
                        messages: state.messages.map(
                            (message, index) =>
                                index === lastIndex
                                    ? {
                                        ...message,
                                        text:
                                            message.text +
                                            delta,
                                    }
                                    : message,
                        ),
                    };
                }),

            // 채팅 초기화
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
                    const value =
                        sessionStorage.getItem(name);

                    return value
                        ? JSON.parse(value)
                        : null;
                },

                setItem: (name, value) => {
                    sessionStorage.setItem(
                        name,
                        JSON.stringify(value),
                    );
                },

                removeItem: (name) => {
                    sessionStorage.removeItem(name);
                },
            },
        },
    ),
);

export default useChatStore;
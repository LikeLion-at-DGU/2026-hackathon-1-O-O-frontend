import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    newLocalId,
    prepareServerMessages,
    keepPendingLocalMessages,
} from "./chatMessages";

// 진열대 연속 클릭 방지용 타임스탬프
let lastShelfLogAt = 0;

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
            const filteredServer = prepareServerMessages(messages);

            // 서버 메시지와 로컬 임시 메시지 병합 (중복 방지)
            const existingIds = new Set(filteredServer.map((m) => m.id));
            const safeLocalMessages = keepPendingLocalMessages(
                state.messages,
                existingIds
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
            const filteredServer = prepareServerMessages(serverMessages);

            const existingIds = new Set(filteredServer.map((m) => m.id));
            const safeLocalMessages = keepPendingLocalMessages(
                state.messages,
                existingIds
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

            const newMessages = prepareServerMessages(serverMessages).filter(
                (message) => !existingIds.has(message.id)
            );

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

            const newMessages = prepareServerMessages(serverMessages).filter(
                (message) => !existingIds.has(message.id)
            );

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

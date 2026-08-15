import { create } from "zustand";
import { persist } from "zustand/middleware";

const INITIAL_MESSAGES = [
    {
        id: "init",
        type: "assistant",
        text: "저와 함께 MCM을 경험해 보아요!\n각 상품을 눌러 궁금한 점을 알아보세요.",
    },
    ];

    const useChatStore = create(
    persist(
        (set) => ({
        selectedZoneId: null,
        selectedProduct: null,
        selectedQuestion: null,
        selectedAnswer: null,

        // 🚀 누적 대화 기록 배열 (초기 곰돌이 안내 메시지 포함)
        messages: INITIAL_MESSAGES,

        // 1. 진열대 클릭 시
        selectShelf: (zoneId) =>
            set((state) => {
                const text = `${zoneId}번 진열대 클릭`;
                const lastMsg = state.messages[state.messages.length - 1];

                // 방금 전 메시지와 똑같으면 중복 추가 안 함
                if (lastMsg?.text === text) return { selectedZoneId: zoneId };

                return {
                selectedZoneId: zoneId,
                messages: [...state.messages, { id: Date.now(), type: "user", text }],
                };
            }),

        // 2. 상품 클릭 시
        selectProduct: (product) =>
            set((state) => {
                const productName = product?.name?.split(" - ")[1] ?? product?.name ?? product;
                const text = `${productName} 클릭`;
                const lastMsg = state.messages[state.messages.length - 1];

                if (lastMsg?.text === text) return { selectedProduct: product };

                return {
                selectedProduct: product,
                messages: [...state.messages, { id: Date.now(), type: "user", text }],
                };
            }),

        // 3. 질문 버튼 클릭 시 (유저 질문 + 봇 답변을 동시에 누적)
        selectQuestion: (question, answer) =>
            set((state) => {
                const lastMsg = state.messages[state.messages.length - 1];
                if (lastMsg?.text === answer) return {};

                return {
                selectedQuestion: question,
                selectedAnswer: answer,
                messages: [
                    ...state.messages,
                    { id: Date.now(), type: "user", text: question },
                    { id: Date.now() + 1, type: "assistant", text: answer },
                ],
                };
            }),

        // 4. /chat 페이지에서 유저가 직접 입력창으로 메시지 보낼 때 사용
        addCustomMessage: (type, text) =>
            set((state) => ({
            messages: [...state.messages, { id: Date.now(), type, text }],
            })),

        // 5. 대화 내역 완전 초기화 (초기 안내 메시지로 복구)
        resetChat: () =>
            set({
            selectedZoneId: null,
            selectedProduct: null,
            selectedQuestion: null,
            selectedAnswer: null,
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
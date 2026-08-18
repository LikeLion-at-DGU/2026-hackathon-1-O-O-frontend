import { create } from "zustand";
import { persist } from "zustand/middleware";
import styled from "styled-components";

let lastShelfLogAt = 0;
let lastShelfLogZone = null;

export const MessageText = styled.p`
    white-space: pre-line;
    color: var(--neutral, #E5E3E0);
    font-family: Pretendard;
    font-size: var(--Font-size-SM, 14px);
    font-style: normal;
    font-weight: 300;
    line-height: 140%; /* 19.6px */
`;

const INITIAL_MESSAGES = [
    {
        id: "init",
        type: "assistant",
        text: "뮤즈님, 안녕하세요! 저는 패디에요.\n저와 함께 MCM을 경험해 보아요.\n각 진열대를 눌러 상품에 대해 알아보세요.",
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

        // ...create((set, get) => ({
        selectShelf: (zoneId) =>
        set((state) => {
            const zone = Number(zoneId);
            const now = Date.now();

            // ✅ 1) 현재 보고 있는 구역과 같으면 로그 없이 상태만 유지
            if (state.selectedZoneId === zone) {
            return { selectedZoneId: zone };
            }

            // ✅ 2) 400ms 안에 들어온 왕복 이벤트는 잔여 이벤트로 보고 폐기
            //    (5→4 스와이프가 4,5,4 로 세 번 들어와도 첫 번째만 통과)
            if (now - lastShelfLogAt < 400) {
            return { selectedZoneId: zone };
            }

            lastShelfLogAt = now;
            lastShelfLogZone = zone;

            console.log(`[Shelf Selected] ${zone}번 진열대 클릭 (timestamp: ${now})`);

            return {
            selectedZoneId: zone,
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
import { create } from "zustand";
import { persist } from "zustand/middleware";

// 진열대 연속 클릭 방지용 타임스탬프
let lastShelfLogAt = 0;

/**
 * 로컬 임시 메시지 ID 생성기
 * 동일 밀리초 내 다중 생성 시 React Key 충돌을 방지하기 위해 UUID 또는 Random String 사용
 */
const newLocalId = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    /**
     * UI에 노출되지 않아야 하는 시스템/사용자 인터랙션 로그 패턴 목록
     * 단순 진열대/상품 클릭 로그 및 프리셋 질문 키워드는 메시지 창에서 숨김 처리
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
     * 백엔드 메시지 스펙을 클라이언트 메시지 인터페이스로 정규화
     * preset 역할(사전 정의된 서버 응답)은 assistant(패디 말풍선)로 매핑
     */
    const normalizeServerMessage = (message) => ({
    id: message.message_id,
    type:
        message.role === "assistant" || message.role === "preset"
        ? "assistant"
        : "user",
    role: message.role,
    text: message.content,
    createdAt: message.created_at,
    });

    /**
     * 초기 진입 시 기본 환영 메시지
     */
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
        // 상태 필드
        selectedZoneId: null,
        selectedProduct: null,
        selectedQuestion: null,
        selectedAnswer: null,
        pendingAction: null, // 서버에서 내려온 사용자 인터랙션 트리거
        messages: INITIAL_MESSAGES, // 누적 대화 목록

        /**
         * 진열대 선택 (400ms 디바운스 적용)
         */
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

        /**
         * 상품 선택
         */
        selectProduct: (product) =>
            set({
            selectedProduct: product,
            }),

        /**
         * 프리셋 질문/답변 선택 및 메시지 목록 추가
         */
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
                    text: question,
                },
                {
                    id: newLocalId(),
                    type: "assistant",
                    text: answer,
                },
                ],
            };
            }),

        /**
         * 직접 입력한 사용자 메시지 추가
         */
        addCustomMessage: (type, text) =>
            set((state) => ({
            messages: [
                ...state.messages,
                {
                id: newLocalId(),
                type,
                text,
                },
            ],
            })),

        /**
         * 메시지 목록 직접 설정
         */
        setMessages: (messages) =>
            set({
            messages,
            }),

        /**
         * 서버 트리거 액션 설정
         */
        setPendingAction: (pendingAction) =>
            set({
            pendingAction,
            }),

        /**
         * 서버 동기화: 메시지 목록 및 트리거 상태 전체 갱신
         */
        syncChatState: ({ messages = [], pending_action = null } = {}) =>
            set({
            messages: messages.length
                ? messages
                    .filter((message) => !isHiddenClickLog(message))
                    .map(normalizeServerMessage)
                : INITIAL_MESSAGES,
            pendingAction: pending_action,
            }),

        /**
         * 기존 호환용 서버 메시지 전체 설정
         */
        setServerMessages: (serverMessages = []) =>
            set({
            messages: serverMessages.length
                ? serverMessages
                    .filter((message) => !isHiddenClickLog(message))
                    .map(normalizeServerMessage)
                : INITIAL_MESSAGES,
            }),

        /**
         * 서버 메시지 중복 검증 후 추가 (ID 기반 중복 방지)
         */
        addServerMessages: (serverMessages = []) =>
            set((state) => {
            const existingIds = new Set(
                state.messages.map((message) => message.id)
            );

            const newMessages = serverMessages
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

        /**
         * 트리거 응답 메시지 반영 및 pendingAction 초기화
         */
        applyActionResponse: (serverMessages = []) =>
            set((state) => {
            const existingIds = new Set(
                state.messages.map((message) => message.id)
            );

            const newMessages = serverMessages
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

        /**
         * SSE 스트리밍 답변용 빈 어시스턴트 말풍선 생성
         */
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

        /**
         * SSE 청크 데이터를 마지막 어시스턴트 메시지에 실시간 연결
         */
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

        /**
         * 스토어 상태 전체 초기화
         */
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
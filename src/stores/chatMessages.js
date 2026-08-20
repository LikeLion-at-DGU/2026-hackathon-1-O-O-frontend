// 채팅 메시지 정규화 · 필터링 순수 로직.
// useChatStore의 여러 액션(syncChatState, setServerMessages, addServerMessages,
// applyActionResponse)이 같은 규칙을 공유하므로 한 곳에 모으고 단위 테스트로 고정한다.

/**
 * 로컬 임시 메시지 ID 생성기
 */
export const newLocalId = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
    ? `local-${crypto.randomUUID()}`
    : `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/**
 * UI에 노출되지 않아야 하는 시스템/사용자 인터랙션 로그 패턴 목록
 */
export const HIDDEN_CLICK_PATTERNS = [
    /^\d+번 진열대 클릭$/,
    /상품 클릭$/,
    /^(가격|재질|디자인 의도)$/,
];

/**
 * 숨김 대상 클릭 로그 여부 검증
 */
export const isHiddenClickLog = (message) =>
    message.role === "user_action" &&
    HIDDEN_CLICK_PATTERNS.some((pattern) => pattern.test(message.content));

/**
 * 백엔드 메시지 스펙 정규화
 */
export const normalizeServerMessage = (message) => ({
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
 * 서버 메시지 목록을 화면용으로 준비한다:
 * 숨김 클릭 로그를 거르고 스펙을 정규화한다.
 */
export const prepareServerMessages = (serverMessages) =>
    (serverMessages || [])
        .filter((message) => !isHiddenClickLog(message))
        .map(normalizeServerMessage);

/**
 * 서버 동기화 시 유지할 로컬 임시 메시지(전송 직후·스트리밍 중)만 남긴다.
 * 서버가 이미 같은 id를 돌려줬다면 중복을 막기 위해 제외한다.
 */
export const keepPendingLocalMessages = (messages, serverIds) =>
    (messages || []).filter(
        (message) =>
            (message.id?.startsWith("local-") ||
                message.id?.startsWith("stream-")) &&
            !serverIds.has(message.id)
    );

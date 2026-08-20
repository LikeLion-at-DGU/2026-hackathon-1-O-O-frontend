import styled from "styled-components";

export const ChatPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100dvh - 72px);
    min-height: 0;
    background: #f4f2ee;
`;

export const MessageArea = styled.div`
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

    /* 스크롤바 커스텀 스타일링 */
    &::-webkit-scrollbar {
        width: 6px;
        background-color: transparent;
    }

    &::-webkit-scrollbar-track {
        background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.15);
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background-color: rgba(0, 0, 0, 0.3);
    }

    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.15) transparent;
`;

export const BottomArea = styled.div`
    flex-shrink: 0;
    padding: 8px 20px calc(12px + env(safe-area-inset-bottom));
    background: #f4f2ee;
    border-top: 1px solid #f1f1f3;
`;

export const BackChat = styled.button`
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

    &:hover {
        color: var(--Deep-Slate, #222);
    }
`;

export const ChatForm = styled.form`
    display: flex;
    align-items: center;
    gap: 8px;

    width: 100%;
    padding: 6px 6px 6px 16px;
    box-sizing: border-box;

    border: 1px solid #e4e4e7;
    border-radius: 24px;
    background: #f4f2ee;

    &:focus-within {
        border-color: #18181b;
    }
`;

export const ChatInput = styled.input`
    flex: 1;
    min-width: 0;
    height: 36px;

    padding: 0;
    border: none;
    outline: none;
    background: transparent;

    color: #18181b;
    font-family: Pretendard, sans-serif;
    font-size: 16px;

    &::placeholder {
        color: #a1a1aa;
    }
`;

export const SendButton = styled.button`
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
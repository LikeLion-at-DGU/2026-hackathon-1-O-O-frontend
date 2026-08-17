import * as S from "./ChatMessage.styled";

const ChatMessage = ({
    children,
    type = "assistant",
    profileImage,
    onClick,
}) => {
    const isAssistant = type === "assistant";

    return (
        <>
            <S.MessageRow $isAssistant={isAssistant}>
                {isAssistant && profileImage && (
                    <S.ProfileImage src={profileImage} alt="챗봇 프로필" />
                )}

                <S.MessageBubble
                    $isAssistant={isAssistant}
                    onClick={onClick}
                    $clickable={Boolean(onClick)}
                >
                    {children}
                </S.MessageBubble>
            </S.MessageRow>
        </>
    );
};

export default ChatMessage;
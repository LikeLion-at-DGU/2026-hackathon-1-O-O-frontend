import * as S from "./ChatMessage.styled";

const ChatMessage = ({
    children,
    type = "assistant",
    profileImage,
    onClick,

    // 트리거 관련 props
    pendingAction,
    onAction,
    isActionLoading = false,
}) => {
    const isAssistant = type === "assistant";

    return (
        <>
            <S.MessageRow $isAssistant={isAssistant}>
                {isAssistant && profileImage && (
                    <S.ProfileImage
                        src={profileImage}
                        alt="챗봇 프로필"
                    />
                )}

                <S.MessageBubble
                    $isAssistant={isAssistant}
                    onClick={onClick}
                    $clickable={Boolean(onClick)}
                >
                    {children}
                </S.MessageBubble>
            </S.MessageRow>

            {isAssistant &&
                pendingAction?.options?.length > 0 && (
                    <S.ActionList>
                        {pendingAction.options.map(
                            (option, index) => (
                                <S.ActionButton
                                    key={`${pendingAction.reply_to}-${option.type
                                        }-${option.product_id ??
                                        option.option ??
                                        index
                                        }`}
                                    type="button"
                                    disabled={isActionLoading}
                                    onClick={() =>
                                        onAction?.(
                                            pendingAction,
                                            option,
                                        )
                                    }
                                >
                                    {option.label}
                                </S.ActionButton>
                            ),
                        )}
                    </S.ActionList>
                )}
        </>
    );
};

export default ChatMessage;
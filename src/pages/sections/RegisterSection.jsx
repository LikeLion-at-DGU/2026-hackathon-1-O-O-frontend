import * as S from "../LandingPage.styled";

import hellopaddy from "../../../assets/hellopaddy.png";
import heartpaddy from "../../../assets/heartpaddy.png";

export default function RegisterSection({
    refs,
    registerDone,
    doorClosing,
    isEntering,
    onEnter,
}) {
    const { registerRef, slotNumberRef, slotStateRef, slotRef } = refs;

    return (
        <S.RegisterChapter ref={registerRef}>
            <S.StickyBase>
                <S.RegisterHead>
                    <h2>
                        당신의 번호를
                        <br />
                        등록할게요.
                    </h2>
                    <p>오늘의 MCM 여정을 함께 기록할 고유 번호예요.</p>
                </S.RegisterHead>

                <S.Slot ref={slotRef}>
                    <span>MCM 50TH ANNIVERSARY / MUSE CANDIDATE</span>
                    <strong ref={slotNumberRef}>N.---</strong>
                    <b ref={slotStateRef}>REGISTERING...</b>
                </S.Slot>

                <S.RegisterPaddy
                    src={registerDone ? heartpaddy : hellopaddy}
                    alt="패디"
                />

                <S.EnterButton type="button" onClick={onEnter} disabled={isEntering}>
                    <div>
                        <strong>
                            {isEntering ? "ENTERING MCM HAUS..." : "BECOME THE MUSE"}
                        </strong>
                        <span>패디와 함께 MCM 롯데백화점 잠실점 입장하기</span>
                    </div>
                    <i>↗</i>
                </S.EnterButton>

                <S.Door $closing={doorClosing}>
                    <i />
                    <i />
                </S.Door>
            </S.StickyBase>
        </S.RegisterChapter>
    );
}

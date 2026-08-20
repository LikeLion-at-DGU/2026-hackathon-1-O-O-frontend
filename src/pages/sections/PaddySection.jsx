import * as S from "../LandingPage.styled";

import hellopaddy from "../../../assets/hellopaddy.png";
import worrypaddy from "../../../assets/worrypaddy.png";

const SPEECHES = [
    <>
        안녕하세요.
        <br />
        <b>저는 패디예요.</b>
    </>,
    <>
        저희에게 <b>영감을 줄 사람</b>을 찾고 있어요.
        <br />
        MCM을 둘러보는 동안 <b>계속 함께할게요.</b>
    </>,
    <>
        먼저, 당신의 <b>뮤즈 번호를 등록해볼게요.</b>
    </>,
];

export default function PaddySection({ refs, speechPhase }) {
    const { paddyRef, paddyImgRef, speechHintRef } = refs;

    return (
        <S.PaddyChapter ref={paddyRef}>
            <S.StickyBase>
                <S.SpeechHint ref={speechHintRef}>
                    패디와 함께
                    <br />
                    뮤즈가 되어 보세요.
                </S.SpeechHint>
                <S.PaddySmall
                    ref={paddyImgRef}
                    src={speechPhase === 2 ? hellopaddy : worrypaddy}
                    alt="패디"
                />
                <S.Speech>
                    <strong>PADDY</strong>
                    <p>{SPEECHES[speechPhase]}</p>
                </S.Speech>
            </S.StickyBase>
        </S.PaddyChapter>
    );
}

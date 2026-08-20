import * as S from "../LandingPage.styled";

import paddyhead from "../../assets/paddy-head.png";

export default function HeroSection({ refs, stars }) {
    const {
        heroRef,
        envelopeRef,
        flapRef,
        sealRef,
        paperRef,
        paperContentRef,
        whiteoutRef,
    } = refs;

    return (
        <S.HeroChapter ref={heroRef}>
            <S.StickyNight>
                <S.Stars>
                    {stars.map((star) => (
                        <S.Star
                            key={star.id}
                            style={{
                                left: `${star.left}%`,
                                top: `${star.top}%`,
                                opacity: star.opacity,
                                transform: `scale(${star.scale})`,
                            }}
                        />
                    ))}
                </S.Stars>

                <S.InvitationPaper ref={paperRef}>
                    <S.PaperContent ref={paperContentRef}>
                        <S.InvitationLabel>INVITATION</S.InvitationLabel>
                        <h1>
                            MCM의 새로운
                            <br />
                            뮤즈가 되어볼까요?
                        </h1>
                        <S.InvitationPaddy src={paddyhead} alt="패디" />
                        <S.InvitationCopy>
                            저희의 브랜드에 영감을 줄 사람을 찾습니다!
                        </S.InvitationCopy>
                        <S.PaddySignature>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 23"
                                fill="none"
                                aria-hidden="true"
                            >
                                <g filter="url(#paw-blur)">
                                    <ellipse cx="11.5742" cy="14.9728" rx="7.55274" ry="6.42002" fill="currentColor" />
                                    <ellipse cx="11.5738" cy="4.02118" rx="3.0211" ry="3.02119" fill="currentColor" />
                                    <ellipse cx="19.1271" cy="7.04267" rx="3.0211" ry="3.02119" fill="currentColor" />
                                    <ellipse cx="4.0211" cy="7.04267" rx="3.0211" ry="3.02119" fill="currentColor" />
                                </g>
                                <defs>
                                    <filter
                                        id="paw-blur"
                                        x="-1"
                                        y="-1"
                                        width="26"
                                        height="25"
                                        filterUnits="userSpaceOnUse"
                                        colorInterpolationFilters="sRGB"
                                    >
                                        <feGaussianBlur stdDeviation="0.35" />
                                    </filter>
                                </defs>
                            </svg>
                            <span>from. PADDY</span>
                        </S.PaddySignature>
                    </S.PaperContent>
                </S.InvitationPaper>

                <S.EnvelopeFlight ref={envelopeRef}>
                    <S.Envelope>
                        <S.Flap ref={flapRef}>
                            <svg viewBox="0 0 850 300" preserveAspectRatio="none" aria-hidden="true">
                                <path d="M 18 2 H 832 Q 844 2 836 14 L 454 270 Q 425 292 396 270 L 14 14 Q 6 2 18 2 Z" />
                            </svg>
                        </S.Flap>
                        <S.Seal ref={sealRef}>MCM</S.Seal>
                    </S.Envelope>
                </S.EnvelopeFlight>

                <S.PaperWhiteout ref={whiteoutRef} />
                <S.ScrollArrow aria-hidden="true">
                    <span />
                    <i>↓</i>
                </S.ScrollArrow>
            </S.StickyNight>
        </S.HeroChapter>
    );
}

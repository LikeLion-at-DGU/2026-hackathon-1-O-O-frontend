import * as S from "../LandingPage.styled";

import munich1 from "../../assets/munich-1.png";
import munich2 from "../../assets/munich-2.png";
import munich3 from "../../assets/munich-3.png";

export default function ErasSection({ refs }) {
    const {
        eraRef,
        eraStickyRef,
        yearRef,
        introRef,
        photosRef,
        railRef,
        fiberRef,
        grainRef,
        cognacRef,
        silverRef,
        finalMomentRef,
        photoRefs,
        imageRefs,
    } = refs;

    return (
        <S.ErasChapter ref={eraRef}>
            <S.EraSticky ref={eraStickyRef}>
                <S.CognacWash ref={cognacRef} />
                <S.PaperFiber ref={fiberRef} />
                <S.FilmGrain ref={grainRef} />
                <S.SilverSweep ref={silverRef} />

                <S.EraRail ref={railRef}>
                    1976 · 1986 · 1996 · 2006 · 2016 · 2026 · 1976 · 1986 · 1996 · 2006 · 2016 · 2026
                </S.EraRail>
                <S.EraYear ref={yearRef}>1976</S.EraYear>
                <S.EraIntro ref={introRef}>
                    <h2>뮌헨에서 시작된 50년.</h2>
                    <p>도시의 건축, 음악, 이동과 문화는 MCM이 세상을 바라보는 방식이 되었습니다.</p>
                </S.EraIntro>

                <S.EraPhotos ref={photosRef}>
                    <S.EraPhoto ref={photoRefs[0]} $variant="one">
                        <img ref={imageRefs[0]} src={munich1} alt="뮌헨 아카이브" />
                    </S.EraPhoto>
                    <S.EraPhoto ref={photoRefs[1]} $variant="two">
                        <img ref={imageRefs[1]} src={munich2} alt="뮌헨 아카이브" />
                    </S.EraPhoto>
                    <S.EraPhoto ref={photoRefs[2]} $variant="three">
                        <img ref={imageRefs[2]} src={munich3} alt="뮌헨 아카이브" />
                    </S.EraPhoto>
                </S.EraPhotos>

                <S.FinalMoment ref={finalMomentRef}>
                    <div>
                        <strong>2026</strong>
                        <span>50 YEARS.</span>
                        <b>이제, 당신의 차례입니다.</b>
                    </div>
                </S.FinalMoment>
            </S.EraSticky>
        </S.ErasChapter>
    );
}

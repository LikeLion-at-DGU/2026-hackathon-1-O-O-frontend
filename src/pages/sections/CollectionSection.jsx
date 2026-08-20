import * as S from "../LandingPage.styled";

import MCM from "../../../assets/MCM.png";
import mcmbag1 from "../../../assets/mcmbag1.png";
import mcmbag2 from "../../../assets/mcmbag2.png";

export default function CollectionSection({ refs }) {
    const {
        collectionRef,
        collectionStickyRef,
        collectionVisualRef,
        collectionCopyRef,
        collectionLineRef,
    } = refs;

    return (
        <S.CollectionChapter ref={collectionRef}>
            <S.CollectionSticky ref={collectionStickyRef}>
                <S.CollectionGlow />
                <S.CollectionVisual ref={collectionVisualRef} aria-hidden="true">
                    <S.CollectionImage $position="left">
                        <img src={mcmbag1} alt="" />
                    </S.CollectionImage>
                    <S.CollectionImage $position="center">
                        <img src={MCM} alt="" />
                    </S.CollectionImage>
                    <S.CollectionImage $position="right">
                        <img src={mcmbag2} alt="" />
                    </S.CollectionImage>
                    <S.CollectionYear>50</S.CollectionYear>
                </S.CollectionVisual>

                <S.CollectionCopy ref={collectionCopyRef}>
                    <S.CollectionKicker>MCM 50TH ANNIVERSARY</S.CollectionKicker>
                    <h2>
                        2026
                        <span>FALL / WINTER</span>
                    </h2>
                    <S.CollectionLine ref={collectionLineRef} />
                    <p>
                        회고적이면서도 미래지향적인 컬렉션은 뮌헨의 문화와 음악을 통해
                        MCM의 50주년을 기념합니다. 최첨단 소재와 미래적인 스타일,
                        스터드 실루엣과 혁신적인 가죽 제품은 하우스의 정체성을 드러냅니다.
                    </p>
                    <strong>ART · TECHNOLOGY · TRAVEL</strong>
                </S.CollectionCopy>
                <S.CollectionSideText>MÜNCHEN / ARCHIVE × FUTURE</S.CollectionSideText>
            </S.CollectionSticky>
        </S.CollectionChapter>
    );
}

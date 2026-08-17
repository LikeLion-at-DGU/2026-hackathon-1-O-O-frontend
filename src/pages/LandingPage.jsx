import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../components/MobileLayout/MobileLayout";
import * as S from "./LandingPage.styled";
import { BgmManager } from "../components/SoundButton";

import { shelfData } from "../components/Shelf/ShelfData";

function LandingPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const activeZones = [1, 2, 3, 4, 5, 6, 7];

        const imageUrls = activeZones
            .flatMap((zone) => shelfData[zone] ?? [])
            .map((product) => product.imageUrl)
            .filter(Boolean);

        imageUrls.forEach((src) => {
            const img = new Image();
            img.src = src;
        });

        console.log(`${imageUrls.length}개 상품 이미지 preload 시작`);
    }, []);

    return (
        <MobileLayout showHeader={false}>
            <S.LandingContainer>
                <S.Content>
                    <S.Logo>
                        <S.LogoText>O</S.LogoText>
                        <S.Ampersand>&</S.Ampersand>
                        <S.LogoText>O</S.LogoText>
                    </S.Logo>

                    <S.ButtonContainer>
                        <S.EnterButton
                            type="button"
                            onClick={() => {
                                BgmManager.play().catch((err) =>
                                    console.log("음악 재생 실패:", err)
                                );

                                navigate("/home");
                            }}
                        >
                            입장하기
                        </S.EnterButton>
                    </S.ButtonContainer>
                </S.Content>
            </S.LandingContainer>
        </MobileLayout>
    );
}

export default LandingPage;
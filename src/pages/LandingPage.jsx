import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "../components/MobileLayout/MobileLayout";
import * as S from "./LandingPage.styled";
import { BgmManager } from "../components/SoundButton";

import { shelfData } from "../components/Shelf/ShelfData";
import { enterStore } from "../api/visits";

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
                            onClick={async () => {
                                try {
                                    // 1. 입장 API 호출 (성별/연령대 state가 있다면 괄호 안에 넣어주세요)
                                    // 예: await enterStore(selectedAge, selectedGender);
                                    await enterStore(); 

                                    // 2. API 호출 성공 시 배경음악 재생
                                    BgmManager.play().catch((err) =>
                                        console.log("음악 재생 실패:", err)
                                    );

                                    // 3. API 호출 성공 시 홈 화면으로 이동
                                    navigate("/home");
                                    
                                } catch (error) {
                                    // API 호출 실패 시 처리 (화면 이동을 막고 에러 메시지를 띄웁니다)
                                    // console.error("입장 실패:", error);
                                    // alert("입장에 실패했습니다. 잠시 후 다시 시도해주세요.");
                                    console.error("백엔드 미연결 - 강제 통과합니다:", error);
                
                                    // UI 테스트를 위해 음악 재생 및 이동 강제 실행
                                    BgmManager.play().catch((err) => console.log(err));
                                    navigate("/home");
                                }
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
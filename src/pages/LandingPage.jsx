import { useNavigate } from "react-router-dom";
import MobileLayout from "../components/MobileLayout/MobileLayout";
import * as S from "./LandingPage.styled";
import { BgmManager } from "../components/SoundButton";

function LandingPage() {
    const navigate = useNavigate();

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
                                BgmManager.play().catch((err) => console.log("음악 재생 실패:", err));
                                navigate("/home")}
                            }
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
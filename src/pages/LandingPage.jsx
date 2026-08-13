import { useNavigate } from "react-router-dom";
import MobileLayout from "../components/MobileLayout/MobileLayout";
import * as S from "./LandingPage.styled";

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
                            onClick={() => navigate("/home")}
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
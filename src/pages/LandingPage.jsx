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

                    <S.Question>입장하시겠습니까?</S.Question>

                    <S.ButtonContainer>
                        <S.CancelButton type="button">
                            아니오
                        </S.CancelButton>

                        <S.EnterButton
                            type="button"
                            onClick={() => navigate("/guide")}
                        >
                            예
                        </S.EnterButton>
                    </S.ButtonContainer>
                </S.Content>
            </S.LandingContainer>
        </MobileLayout>
    );
}

export default LandingPage;
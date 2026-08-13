import * as S from "./Header.styled";
import SoundButton from "../SoundButton";

function Header() {
    return (
        <S.HeaderContainer>
            <S.Logo>
                <S.LogoText>O</S.LogoText>
                <S.Ampersand>&</S.Ampersand>
                <S.LogoText>O</S.LogoText>
            </S.Logo>

            {/* <S.SoundButton type="button" aria-label="소리 켜기">
                🔊
            </S.SoundButton> */}
            <SoundButton />
        </S.HeaderContainer>
    );
}

export default Header;
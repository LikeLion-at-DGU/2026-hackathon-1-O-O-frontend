import * as S from "./Header.styled";

function Header() {
    return (
        <S.HeaderContainer>
            <S.Logo>O&O</S.Logo>

            <S.SoundButton type="button" aria-label="소리 켜기">
                🔊
            </S.SoundButton>
        </S.HeaderContainer>
    );
}

export default Header;
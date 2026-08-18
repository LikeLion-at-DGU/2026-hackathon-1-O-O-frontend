import React from "react";
import * as S from "./Header.styled";
import SoundButton from "../SoundButton";
import { useNavigate, Link } from "react-router-dom";

function Header({ showActions = true }) {
    const navigate = useNavigate();

    const handleFinish = () => {
        navigate("/analytics");
    };

    return (
        <S.HeaderContainer>
            <Link
                to="/home"
                style={{ textDecoration: "none", color: "inherit" }}
            >
                <S.Logo>
                    <S.LogoText>O</S.LogoText>
                    <S.Ampersand>&</S.Ampersand>
                    <S.LogoText>O</S.LogoText>
                </S.Logo>
            </Link>

            {showActions && (
                <S.ButtonWrapper>
                    <S.Finish onClick={handleFinish}>
                        관람 마치기
                    </S.Finish>

                    <SoundButton />
                </S.ButtonWrapper>
            )}
        </S.HeaderContainer>
    );
}

export default Header;
import React from "react";
import styled from "styled-components";
import * as S from "./Header.styled";
import SoundButton from "../SoundButton";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

// header 기본값 dark, chat페이지만 light
function Header({ theme = "dark" }) {
    const isLight = theme === "light";

    return (
        <S.HeaderContainer $isLight={isLight}>
            <Link to="/home" style={{ textDecoration: "none", color: "inherit" }}>
                <S.Logo>
                    <S.LogoText $isLight={isLight}>O</S.LogoText>
                    <S.Ampersand>&</S.Ampersand>
                    <S.LogoText $isLight={isLight}>O</S.LogoText>
                </S.Logo>
            </Link>

            <SoundButton isLight={isLight} />
        </S.HeaderContainer>
    );
}

export default Header;
import React from "react";
import styled from "styled-components";
import * as S from "./ChatHeader.styled";
import SoundButton from "../SoundButton";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Header() {

    return (
        <S.HeaderContainer>
            <Link to="/home" style={{ textDecoration: "none", color: "inherit" }}>
                <S.Logo>
                    <S.LogoText>O</S.LogoText>
                    <S.Ampersand>&</S.Ampersand>
                    <S.LogoText>O</S.LogoText>
                </S.Logo>
            </Link>

            <SoundButton color="#222222" />
        </S.HeaderContainer>
    );
}

export default Header;
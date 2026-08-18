import React from "react";
import * as S from "./Header.styled";

import SoundButton from "../SoundButton";

import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

function Header({ showActions = true }) {
    const navigate = useNavigate();
    const location = useLocation();

    const isAnalyticsPage =
        location.pathname === "/analytics";

    const handleFinish = () => {
        navigate("/analytics");
    };

    const handlePhotoShoot = () => {
        navigate("/camera");
    };

    return (
        <S.HeaderContainer>
            <Link
                to="/home"
                style={{
                    textDecoration: "none",
                    color: "inherit",
                }}
            >
                <S.Logo>
                    <S.LogoText>O</S.LogoText>
                    <S.Ampersand>&</S.Ampersand>
                    <S.LogoText>O</S.LogoText>
                </S.Logo>
            </Link>

            {showActions && (
                <S.ButtonWrapper>
                    <S.Finish
                        type="button"
                        onClick={
                            isAnalyticsPage
                                ? handlePhotoShoot
                                : handleFinish
                        }
                    >
                        {isAnalyticsPage
                            ? "화보 찍기"
                            : "관람 마치기"}
                    </S.Finish>

                    <SoundButton />
                </S.ButtonWrapper>
            )}
        </S.HeaderContainer>
    );
}

export default Header;
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
        const savedProducts = sessionStorage.getItem("selected_products");
        
        if (!savedProducts || JSON.parse(savedProducts).length === 0) {
            // 상품이 선택되지 않았을 때의 예외 처리
            console.warn("선택된 상품이 없습니다. 기본 첫 번째 상품으로 진행하거나 선택을 유도합니다.");
        }
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
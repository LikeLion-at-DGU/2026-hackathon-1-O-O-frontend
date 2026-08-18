import React from "react";
import * as S from "./Header.styled";
import SoundButton from "../SoundButton";
import { useNavigate, useLocation, Link } from "react-router-dom";

function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    // /analytics 경로 여부 확인
    const isAnalyticsPage = location.pathname.startsWith("/analytics");

    // 관람 마치기 클릭 핸들러
    const handleFinish = async () => {
        try {
        // tracker가 window 전역 또는 모듈로 존재할 경우에만 안전하게 실행
        if (typeof tracker !== "undefined" && tracker?.flushPending) {
            const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            await Promise.race([tracker.flushPending(), sleep(3000)]);
        }

        // 💡 추후 백엔드 API 연동 시 주석 해제:
        // const visitId = sessionStorage.getItem("visit_id");
        // await api.post(`/api/v1/visits/${visitId}/finish`, {
        //   events: tracker.drain()
        // });

        navigate("/analytics");
        } catch (error) {
        console.error("관람 종료 중 에러 발생:", error);
        navigate("/analytics");
        }
    };

    // 화보 찍기 클릭 핸들러
    const handlePhotoShoot = () => {
        navigate("/camera");
    };

    return (
        <S.HeaderContainer>
        <Link to="/home" style={{ textDecoration: "none", color: "inherit" }}>
            <S.Logo>
            <S.LogoText>O</S.LogoText>
            <S.Ampersand>&</S.Ampersand>
            <S.LogoText>O</S.LogoText>
            </S.Logo>
        </Link>
        <S.ButtonWrapper>
            <S.Finish
            type="button"
            onClick={isAnalyticsPage ? handlePhotoShoot : handleFinish}
            >
            {isAnalyticsPage ? "화보 찍기" : "관람 마치기"}
            </S.Finish>
            <SoundButton />
        </S.ButtonWrapper>
        </S.HeaderContainer>
    );
}

export default Header;
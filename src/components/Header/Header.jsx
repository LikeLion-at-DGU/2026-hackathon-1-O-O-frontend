import React from "react";
import * as S from "./Header.styled";

import SoundButton from "../SoundButton";
import { api } from "../../api/api";
import { drainEventBuffer } from "../../api/events";

import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

function Header({ showActions = true }) {
    const navigate = useNavigate();
    const location = useLocation();

    const isAnalyticsPage = location.pathname.startsWith("/analytics");

    const handleFinish = async () => {
        const visitId = sessionStorage.getItem("visit_id");
        const visitToken = sessionStorage.getItem("visit_token");

        if (!visitId) {
            alert("방문 정보가 없습니다.");
            return;
        }

        try {
            // 1. 백엔드에 관람 종료 및 리포트 생성 요청 (POST /visits/{visitId}/finish)
            sessionStorage.setItem("is_visit_finished", "true");

            const remainingEvents = drainEventBuffer ? drainEventBuffer() : [];
            console.log("📦 [관람 종료] 함께 동봉할 잔여 이벤트들:", remainingEvents);

            const response = await api.post(
            `/visits/${visitId}/finish`,
            {
                events: [], // 아직 안 보낸 버퍼 이벤트가 있다면 여기에 배열로 전달
            },
            {
                headers: {
                "X-Visit-Token": visitToken || "",
                },
            }
            );

            console.log("🏁 [관람 종료 성공] 응답 데이터:", response.data);

            // 2. 백엔드가 발급해 준 리포트용 slug 추출 (예: "r_7Ka9xQ")
            const { slug } = response.data;

            if (slug) {
            // 3. 발급받은 slug를 세션에 저장
            sessionStorage.setItem("report_slug", slug);
            
            // 4. slug를 들고 리포트 페이지로 이동!
            navigate(`/analytics/${slug}`); // 또는 navigate("/analytics")
            } else {
            navigate("/analytics");
            }
        } catch (error) {
            console.error("🚨 관람 종료 요청 실패:", error.response?.data || error);
            alert("관람 기록을 정리하는 중 오류가 발생했습니다.");
        }
};

    const handlePhotoShoot = () => {
        const saved = sessionStorage.getItem("selected_products");
        const selectedProducts = saved ? JSON.parse(saved) : [];

        if (selectedProducts.length === 0) {
            alert("화보에 담을 아이템을 먼저 선택해 주세요.");
            return;
        }

        // 안전하게 저장되어 있으므로 바로 카메라로 이동
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
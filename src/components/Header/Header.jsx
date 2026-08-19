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

    function Header({ hideShoot = false, showActions = true }) {
    const navigate = useNavigate();
    const location = useLocation();

    // ⭐️ 1. 로딩 페이지와 실제 분석 결과 페이지 명확히 분리
    const isLoadingPage =
        location.pathname.includes("loading") ||
        location.pathname.startsWith("/analytics-loading");

    const isAnalyticsPage =
        location.pathname.startsWith("/analytics") && !isLoadingPage;

    const handleFinish = async () => {
        const visitId = sessionStorage.getItem("visit_id");
        const visitToken = sessionStorage.getItem("visit_token");

        if (!visitId) {
        alert("방문 정보가 없습니다.");
        return;
        }

        try {
        sessionStorage.setItem("is_visit_finished", "true");

        const remainingEvents = drainEventBuffer ? drainEventBuffer() : [];
        console.log("📦 [관람 종료] 잔여 이벤트 동봉:", remainingEvents);

        const response = await api.post(
            `/visits/${visitId}/finish`,
            { events: [] },
            {
            headers: {
                "X-Visit-Token": visitToken || "",
            },
            }
        );

        console.log("🏁 [관람 종료 성공] 응답 데이터:", response.data);

        const { slug } = response.data;

        if (slug) {
            sessionStorage.setItem("report_slug", slug);
            // ⭐️ 2. 분석 완료 전 로딩 페이지로 먼저 이동
            navigate(`/analytics-loading?slug=${slug}`);
        } else {
            navigate("/analytics-loading");
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
            {/* ⭐️ 로딩 페이지나 hideShoot이 아닐 때만 버튼 노출 */}
            {!hideShoot && !isLoadingPage && (
                <S.Finish
                type="button"
                onClick={isAnalyticsPage ? handlePhotoShoot : handleFinish}
                >
                {isAnalyticsPage ? "화보 찍기" : "관람 마치기"}
                </S.Finish>
            )}

            {/* SoundButton은 항상 유지 */}
            <SoundButton />
            </S.ButtonWrapper>
        )}
        </S.HeaderContainer>
    );
    }

    export default Header;
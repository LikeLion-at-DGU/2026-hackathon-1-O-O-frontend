    // src/components/Header/Header.jsx
    import * as S from "./Header.styled";
    import { useState } from "react";
    import SoundButton from "../SoundButton";
    import { api } from "../../api/api";
    import {
        drainEventBuffer,
        hasProductInteraction,
    } from "../../api/events";
    import { Link, useLocation, useNavigate } from "react-router-dom";

    function Header({ hideShoot = false, showActions = true }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);

    const isLoadingPage =
        location.pathname.includes("loading") ||
        location.pathname.startsWith("/analytics-loading");

    const isAnalyticsPage =
        location.pathname.startsWith("/analytics") && !isLoadingPage;

    const finishVisit = async () => {
        const visitId = sessionStorage.getItem("visit_id");
        const visitToken = sessionStorage.getItem("visit_token");

        if (!visitId || !visitToken) {
        alert("방문 정보가 없습니다.");
        return;
        }

        try {
        // ⭐️ [핵심] 현재 머물고 있는 컴포넌트의 타이머를 즉시 종료시키기 위해 커스텀 이벤트 발송
        window.dispatchEvent(new Event("force_flush_dwell_timer"));

        // 타이머가 큐에 담길 시간을 0.1초 대기
        await new Promise((resolve) => setTimeout(resolve, 100));

        // ⭐️ 마지막 머문 시간까지 포함된 잔여 이벤트 전량 회수
        const remainingEvents = drainEventBuffer ? drainEventBuffer() : [];
        console.log("📦 [관람 종료] 최종 동봉 이벤트 (현재 보고있던 시간 포함):", remainingEvents);

        const response = await api.post(
            `/visits/${visitId}/finish`,
            { events: remainingEvents },
            {
            headers: {
                "X-Visit-Token": visitToken,
            },
            }
        );

        console.log("🏁 [관람 종료 성공]:", response.data);

        const slug = response.data?.slug;
        if (slug) {
            sessionStorage.setItem("report_slug", slug);
            navigate(`/analytics-loading?slug=${slug}`);
        } else {
            navigate("/analytics-loading");
        }
        } catch (error) {
        console.error("🚨 관람 종료 요청 실패:", error.response?.data || error);
        alert(`관람 종료 실패: ${error.response?.data?.message || "서버 응답 오류"}`);
        }
    };

    const handleFinish = () => {
        if (!hasProductInteraction()) {
        setIsExitModalOpen(true);
        return;
        }

        finishVisit();
    };

    const handleExitAnyway = () => {
        setIsExitModalOpen(false);
        finishVisit();
    };

    const handlePhotoShoot = () => {
        const savedCandidate =
        sessionStorage.getItem("selected_candidate");

        let selectedCandidate;

        try {
        selectedCandidate = savedCandidate
            ? JSON.parse(savedCandidate)
            : null;
        } catch {
        selectedCandidate = null;
        }

        if (!selectedCandidate?.product_id) {
        alert("화보에 담을 아이템을 먼저 선택해 주세요.");
        return;
        }

        navigate("/camera");
    };

    return (
        <>
        <S.HeaderContainer>
        <Link to="/map" style={{ textDecoration: "none", color: "inherit" }}>
            <S.Logo>
            <S.LogoText>O</S.LogoText>
            <S.Ampersand>&</S.Ampersand>
            <S.LogoText>O</S.LogoText>
            </S.Logo>
        </Link>

        {showActions && (
            <S.ButtonWrapper>
            {!hideShoot && !isLoadingPage && (
                <S.Finish
                type="button"
                onClick={isAnalyticsPage ? handlePhotoShoot : handleFinish}
                >
                {isAnalyticsPage ? "화보 찍기" : "관람 마치기"}
                </S.Finish>
            )}

            <SoundButton />
            </S.ButtonWrapper>
        )}
        </S.HeaderContainer>

        {isExitModalOpen && (
            <S.ExitModalOverlay>
            <S.ExitModal
                role="dialog"
                aria-modal="true"
                aria-labelledby="exit-modal-message"
            >
                <S.ExitModalMessage id="exit-modal-message">
                <span>아직 뮤즈님을 잘 모르겠어요.</span>
                <span>
                    지금 나가시면 화보를 만들어 드릴 수 없어요.
                </span>
                </S.ExitModalMessage>

                <S.ExitModalActions>
                <S.ContinueButton
                    type="button"
                    onClick={() => setIsExitModalOpen(false)}
                >
                    조금 더 둘러볼게요.
                </S.ContinueButton>

                <S.ExitAnywayButton
                    type="button"
                    onClick={handleExitAnyway}
                >
                    그냥 나갈래요.
                </S.ExitAnywayButton>
                </S.ExitModalActions>
            </S.ExitModal>
            </S.ExitModalOverlay>
        )}
        </>
    );
    }

    export default Header;

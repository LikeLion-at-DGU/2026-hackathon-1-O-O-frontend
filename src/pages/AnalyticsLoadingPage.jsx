import { useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getAnalytics } from "../api/analytics";
import MobileLayout from "../components/MobileLayout/MobileLayout";
import * as S from "./AnalyticsLoadingPage.style";
import paddyThinkImg from "../assets/paddy-think.png";

export default function AnalyticsLoadingPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const pollTimerRef = useRef(null);

  // Header가 ?slug=로 넘기는데 useParams만 읽어 sessionStorage 폴백으로만
  // 동작하고 있었다. visit_id는 slug가 아니라 폴백에서 뺀다.
  const reportSlug =
    slug ||
    searchParams.get("slug") ||
    sessionStorage.getItem("report_slug");

  useEffect(() => {
    if (!reportSlug) {
      navigate("/analytics");
      return;
    }

    let isMounted = true;

    const checkReportStatus = async () => {
      try {
        const data = await getAnalytics(reportSlug);
        if (!isMounted) return;

        // 준비 완료되면 실제 분석 결과 페이지로 이동
        if (data?.status === "ready") {
          navigate(`/analytics/${reportSlug}`, { replace: true, state: { reportData: data } });
          return;
        }

        // 분석이 실패로 끝났으면 무한 폴링하지 않고 결과 페이지로 넘긴다
        if (data?.status === "failed") {
          navigate(`/analytics/${reportSlug}`, { replace: true });
          return;
        }

        // 여전히 pending 상태면 2초 후 재시도
        pollTimerRef.current = setTimeout(checkReportStatus, 2000);
      } catch (err) {
        console.error("🚨 리포트 분석 대기 중 오류:", err);
        // 에러 시에도 결과 페이지로 넘겨 에러 화면 표시
        navigate(`/analytics/${reportSlug}`, { replace: true });
      }
    };

    checkReportStatus();

    return () => {
      isMounted = false;
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, [reportSlug, navigate]);

    return (
        <MobileLayout disableShoot={true}>
        <S.LoadingWrapper>
            <S.VisualBadge>
            <S.CharacterImage
                src={paddyThinkImg}
                alt="분석 중인 패디"
                />
            </S.VisualBadge>

            <S.MainTitle>관람 기록을 분석하고 있어요</S.MainTitle>
            <S.SubTitle>취향 분석 리포트와 추천 아이템을 정리 중입니다</S.SubTitle>

            <S.LoadingProgressBar />
        </S.LoadingWrapper>
        </MobileLayout>
    );
}

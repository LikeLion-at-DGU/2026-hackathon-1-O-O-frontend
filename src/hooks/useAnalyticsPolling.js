import { useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getAnalytics } from "../api/analytics";

export default function useAnalyticsPolling() {
    const navigate = useNavigate();
    const { slug } = useParams();
    const [searchParams] = useSearchParams();
    const pollTimerRef = useRef(null);

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

            if (data?.status === "ready") {
            navigate(`/analytics/${reportSlug}`, {
                replace: true,
                state: { reportData: data },
            });
            return;
            }

            if (data?.status === "failed") {
            navigate(`/analytics/${reportSlug}`, { replace: true });
            return;
            }

            pollTimerRef.current = setTimeout(checkReportStatus, 2000);
        } catch (err) {
            console.error("🚨 리포트 분석 대기 중 오류:", err);
            navigate(`/analytics/${reportSlug}`, { replace: true });
        }
        };

        checkReportStatus();

        return () => {
        isMounted = false;
        if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
        };
    }, [reportSlug, navigate]);
}
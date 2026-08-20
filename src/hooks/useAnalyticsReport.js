// src/hooks/useAnalyticsReport.js
import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAnalytics } from "../api/analytics";
import { getLookbookCandidates } from "../api/lookbooks";
import { showToast } from "../utils/toast";

const CANDIDATE_RETRY_DELAY = 2000;
const CANDIDATE_MAX_RETRIES = 5;

export default function useAnalyticsReport() {
    const navigate = useNavigate();
    const { slug } = useParams();

    const reportSlug = slug || sessionStorage.getItem("report_slug");

    const [report, setReport] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [selectedProductIds, setSelectedProductIds] = useState([]);
    const [candidateProducts, setCandidateProducts] = useState([]);
    const [candidateError, setCandidateError] = useState("");
    const [isPending, setIsPending] = useState(() => Boolean(reportSlug));
    const pollTimerRef = useRef(null);

    useEffect(() => {
        if (!reportSlug) {
        return;
        }

        let isMounted = true;

        const getCandidatesWithRetry = async (retryCount = 0) => {
        try {
            return await getLookbookCandidates(reportSlug);
        } catch (error) {
            const shouldRetry =
            error.response?.status === 409 &&
            retryCount < CANDIDATE_MAX_RETRIES;

            if (!shouldRetry) {
            throw error;
            }

            await new Promise((resolve) => {
            pollTimerRef.current = window.setTimeout(
                resolve,
                CANDIDATE_RETRY_DELAY
            );
            });

            if (!isMounted) return null;

            return getCandidatesWithRetry(retryCount + 1);
        }
        };

        const loadReport = async () => {
        try {
            const data = await getAnalytics(reportSlug);
            if (!isMounted) return;

            if (data?.status === "pending") {
            navigate(`/analytics-loading?slug=${reportSlug}`, { replace: true });
            return;
            }

            if (data?.status === "ready" || data?.taste_profile || data?.summary) {
            setReport(data);

            try {
                const candidates = await getCandidatesWithRetry();

                if (!isMounted || !candidates) return;

                const items = Array.isArray(candidates?.items)
                ? candidates.items.filter((item) => item?.product_id)
                : [];

                if (items.length === 0) {
                throw new Error("선택 가능한 화보 상품이 없습니다.");
                }

                setCandidateProducts(items);
                setCandidateError("");

                const savedCandidateText = sessionStorage.getItem("selected_candidate");
                let savedCandidate = null;

                try {
                savedCandidate = savedCandidateText
                    ? JSON.parse(savedCandidateText)
                    : null;
                } catch {
                savedCandidate = null;
                }

                const preselectedId = Array.isArray(candidates?.preselected)
                ? candidates.preselected[0]
                : null;

                const initialCandidate =
                items.find(
                    (item) => item.product_id === savedCandidate?.product_id
                ) ||
                items.find((item) => item.product_id === preselectedId) ||
                items[0];

                const initialProductId = String(initialCandidate.product_id);

                setSelectedCandidate(initialCandidate);
                setSelectedProductIds([initialProductId]);

                sessionStorage.setItem(
                "selected_candidate",
                JSON.stringify(initialCandidate)
                );
                sessionStorage.setItem(
                "selected_products",
                JSON.stringify([initialProductId])
                );
            } catch {
                if (!isMounted) return;

                setCandidateProducts([]);
                setSelectedCandidate(null);
                setSelectedProductIds([]);
                setCandidateError(
                "화보 후보 상품을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
                );

                sessionStorage.removeItem("selected_candidate");
                sessionStorage.removeItem("selected_products");
            }

            setIsPending(false);
            }
        } catch {
            if (isMounted) setIsPending(false);
        }
        };

        loadReport();

        return () => {
        isMounted = false;
        if (pollTimerRef.current) {
            clearTimeout(pollTimerRef.current);
        }
        };
    }, [reportSlug, navigate]);

    const metrics = useMemo(() => {
        if (!report) {
        return {
            topZoneName: "진열대",
            totalMinutes: 0,
            totalRawSec: 0,
            top1: { zone_name: "-", duration_min: 0, raw_sec: 0 },
            top2: { zone_name: "-", duration_min: 0, raw_sec: 0 },
            etcMinutes: 0,
            etcRawSec: 0,
        };
        }

        const rawScenes = report.scenes || [];
        const sortedZones = rawScenes.map((s, index) => {
        const sec = Math.round((s.dwell_ms ?? 0) / 1000);
        const shelfNumber = s.scene_no ?? index + 1;
        return {
            zone_name: `${shelfNumber}번 진열대`,
            raw_sec: sec,
            duration_min: Math.round(sec / 60),
        };
        });

        const top1Zone = sortedZones[0] || {
        zone_name: "1번 진열대",
        duration_min: 0,
        raw_sec: 0,
        };
        const top2Zone = sortedZones[1] || {
        zone_name: "2번 진열대",
        duration_min: 0,
        raw_sec: 0,
        };

        const etcRawSec = sortedZones
        .slice(2)
        .reduce((sum, zone) => sum + (zone.raw_sec || 0), 0);
        const etcMin = Math.round(etcRawSec / 60);

        const serverTotalSec = Math.round(
        (report.visit_summary?.total_dwell_ms ?? 0) / 1000
        );
        const totalRawSec =
        serverTotalSec > 0
            ? serverTotalSec
            : (top1Zone.raw_sec || 0) + (top2Zone.raw_sec || 0) + etcRawSec;
        const calcTotalMin = Math.round(totalRawSec / 60);

        return {
        topZoneName: top1Zone.zone_name,
        totalMinutes: calcTotalMin,
        totalRawSec,
        top1: top1Zone,
        top2: top2Zone,
        etcMinutes: etcMin,
        etcRawSec,
        };
    }, [report]);

    const handleToggleSelect = (candidate) => {
        const productId = candidate?.product_id;
        if (!productId) return;

        const normalizedProductId = String(productId);
        const isAlreadySelected = selectedCandidate?.product_id === productId;

        if (isAlreadySelected) {
        setSelectedCandidate(null);
        setSelectedProductIds([]);
        sessionStorage.removeItem("selected_candidate");
        sessionStorage.setItem("selected_products", JSON.stringify([]));
        return;
        }

        setSelectedCandidate(candidate);
        setSelectedProductIds([normalizedProductId]);

        sessionStorage.setItem("selected_candidate", JSON.stringify(candidate));
        sessionStorage.setItem(
        "selected_products",
        JSON.stringify([normalizedProductId])
        );
    };

    const handleGoToCamera = () => {
        if (!selectedCandidate?.product_id) {
        showToast("화보에 담을 아이템을 1개 선택해 주세요.");
        return;
        }

        const productId = String(selectedCandidate.product_id);

        sessionStorage.setItem(
        "selected_candidate",
        JSON.stringify(selectedCandidate)
        );
        sessionStorage.setItem("selected_products", JSON.stringify([productId]));
        navigate("/camera");
    };

    return {
        report,
        isPending,
        candidateProducts,
        candidateError,
        selectedCandidate,
        selectedProductIds,
        metrics,
        handleToggleSelect,
        handleGoToCamera,
    };
}

import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAnalytics } from "../api/analytics";
import { getLookbookCandidates } from "../api/lookbooks";
import * as S from "./AnalyticsPage.styled";
import MobileLayout from "../components/MobileLayout/MobileLayout";
import checkActiveImg from "../assets/check.svg";
import checkInactiveImg from "../assets/check.png";

const defaultBagImg =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23eee%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%23aaa%22%20font-size%3D%2214%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E";

const CANDIDATE_RETRY_DELAY = 2000;
const CANDIDATE_MAX_RETRIES = 5;

export const getProductImage = (product) => {
  return (
    product?.cutout_url ??
    product?.thumbnail ??
    product?.images?.[0] ??
    product?.images?.thumbnail ??
    product?.images?.main ??
    defaultBagImg
  );
};

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const { slug } = useParams();

  const reportSlug =
    slug ||
    sessionStorage.getItem("report_slug") ||
    sessionStorage.getItem("visit_id");

  const [report, setReport] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [candidateProducts, setCandidateProducts] = useState([]);
  const [candidateError, setCandidateError] = useState("");
  const [isPending, setIsPending] = useState(true);
  const pollTimerRef = useRef(null);

  useEffect(() => {
    if (!reportSlug) {
      console.warn("⚠️ [AnalyticsPage] reportSlug 없음");
      setIsPending(false);
      return;
    }

    let isMounted = true;

    const getCandidatesWithRetry = async (
      retryCount = 0
    ) => {
      try {
        return await getLookbookCandidates(
          reportSlug
        );
      } catch (error) {
        const shouldRetry =
          error.response?.status === 409 &&
          retryCount < CANDIDATE_MAX_RETRIES;

        if (!shouldRetry) {
          throw error;
        }

        console.info(
          "[Lookbook] 후보 분석 대기 후 재조회",
          {
            reportSlug,
            retryCount: retryCount + 1,
            retryAfterMs:
              CANDIDATE_RETRY_DELAY,
          }
        );

        await new Promise((resolve) => {
          pollTimerRef.current =
            window.setTimeout(
              resolve,
              CANDIDATE_RETRY_DELAY
            );
        });

        if (!isMounted) return null;

        return getCandidatesWithRetry(
          retryCount + 1
        );
      }
    };

    const loadReport = async () => {
      try {
        const data = await getAnalytics(reportSlug);
        if (!isMounted) return;

        console.log("📊 [AnalyticsPage] 서버 리포트 원본 데이터:", data);

        if (data?.status === "pending") {
          navigate(`/analytics-loading?slug=${reportSlug}`, { replace: true });
          return;
        }

        if (data?.status === "ready" || data?.taste_profile || data?.summary) {
          setReport(data);

          try {
            const candidates =
              await getCandidatesWithRetry();

            if (!isMounted || !candidates) return;

            const items = Array.isArray(candidates?.items)
              ? candidates.items.filter(
                  (item) => item?.product_id
                )
              : [];

            if (items.length === 0) {
              throw new Error(
                "선택 가능한 화보 상품이 없습니다."
              );
            }

            setCandidateProducts(items);
            setCandidateError("");

            const savedCandidateText =
              sessionStorage.getItem(
                "selected_candidate"
              );

            let savedCandidate = null;

            try {
              savedCandidate = savedCandidateText
                ? JSON.parse(savedCandidateText)
                : null;
            } catch {
              savedCandidate = null;
            }

            const preselectedId = Array.isArray(
              candidates?.preselected
            )
              ? candidates.preselected[0]
              : null;

            const initialCandidate =
              items.find(
                (item) =>
                  item.product_id ===
                  savedCandidate?.product_id
              ) ||
              items.find(
                (item) =>
                  item.product_id === preselectedId
              ) ||
              items[0];

            const initialProductId = String(
              initialCandidate.product_id
            );

            setSelectedCandidate(initialCandidate);
            setSelectedProductIds([
              initialProductId,
            ]);

            sessionStorage.setItem(
              "selected_candidate",
              JSON.stringify(initialCandidate)
            );

            sessionStorage.setItem(
              "selected_products",
              JSON.stringify([initialProductId])
            );
          } catch (candidateRequestError) {
            console.error(
              "화보 후보 상품 조회 실패:",
              candidateRequestError.response?.data ||
                candidateRequestError
            );

            if (!isMounted) return;

            setCandidateProducts([]);
            setSelectedCandidate(null);
            setSelectedProductIds([]);
            setCandidateError(
              "화보 후보 상품을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
            );

            sessionStorage.removeItem(
              "selected_candidate"
            );
            sessionStorage.removeItem(
              "selected_products"
            );
          }

          setIsPending(false);
        }
      } catch (err) {
        console.error("🚨 리포트 조회 실패:", err);
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


// ⭐️ 2. 체류 시간 정밀 계산 및 집계 (서버 신규 필드 기반)
  const { topZoneName, totalMinutes, top1, top2, etcMinutes } = useMemo(() => {
    if (!report) {
      return {
        topZoneName: "진열대",
        totalMinutes: 0,
        top1: { zone_name: "-", duration_min: 0, raw_sec: 0 },
        top2: { zone_name: "-", duration_min: 0, raw_sec: 0 },
        etcMinutes: 0,
      };
    }

    // 1. 서버에서 이미 체류시간 긴 순으로 정렬되어 내려오는 scenes 사용
    const rawScenes = report.scenes || [];

// AnalyticsPage.jsx 내 useMemo 내부

const sortedZones = rawScenes.map((s, index) => {
  const sec = Math.round((s.dwell_ms ?? 0) / 1000);
  
  // ⭐️ scene_name(여성의류 등) 대신 항상 'N번 진열대' 형식으로 고정
  const shelfNumber = s.scene_no ?? (index + 1);
  const zoneName = `${shelfNumber}번 진열대`;

  return {
    zone_name: zoneName, // 예: "1번 진열대", "2번 진열대"
    raw_sec: sec,
    duration_min: Math.max(1, Math.round(sec / 60) || 1),
  };
});

    // 2. Top 1, Top 2 진열대 추출 (없을 경우 기본값)
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

    // 3. 3위 이하 나머지 진열대 합산 (기타)
    const etcRawSec = sortedZones
      .slice(2)
      .reduce((sum, zone) => sum + (zone.raw_sec || 0), 0);
    const etcMin = etcRawSec > 0 ? Math.max(1, Math.round(etcRawSec / 60)) : 0;

    // 4. 총 관람시간 (서버 total_dwell_ms가 있으면 분 변환, 없으면 알약 합산)
    const serverTotalSec = Math.round(
      (report.visit_summary?.total_dwell_ms ?? 0) / 1000
    );
    const calcTotalMin =
      serverTotalSec > 0
        ? Math.max(1, Math.round(serverTotalSec / 60))
        : top1Zone.duration_min + top2Zone.duration_min + etcMin;

    console.log("⏱️ [체류시간 서버 데이터 파싱 완료]:", {
      sortedZones,
      totalMinutes: calcTotalMin,
    });

    return {
      topZoneName: top1Zone.zone_name,
      totalMinutes: calcTotalMin,
      top1: top1Zone,
      top2: top2Zone,
      etcMinutes: etcMin,
    };
  }, [report]);

  const handleToggleSelect = (candidate) => {
    const productId = candidate?.product_id;

    if (!productId) return;

    const normalizedProductId = String(productId);
    const isAlreadySelected =
      selectedCandidate?.product_id === productId;

    if (isAlreadySelected) {
      setSelectedCandidate(null);
      setSelectedProductIds([]);
      sessionStorage.removeItem(
        "selected_candidate"
      );
      sessionStorage.setItem(
        "selected_products",
        JSON.stringify([])
      );
      return;
    }

    setSelectedCandidate(candidate);
    setSelectedProductIds([
      normalizedProductId,
    ]);

    sessionStorage.setItem(
      "selected_candidate",
      JSON.stringify(candidate)
    );

    sessionStorage.setItem(
      "selected_products",
      JSON.stringify([normalizedProductId])
    );
  };

  const handleGoToCamera = () => {
    if (!selectedCandidate?.product_id) {
      alert("화보에 담을 아이템을 1개 선택해 주세요.");
      return;
    }

    const productId = String(
      selectedCandidate.product_id
    );

    sessionStorage.setItem(
      "selected_candidate",
      JSON.stringify(selectedCandidate)
    );

    sessionStorage.setItem(
      "selected_products",
      JSON.stringify([productId])
    );
    navigate("/camera");
  };

  const displayProducts = candidateProducts;

  if (isPending) {
    return null;
  }

  if (!report) {
    return (
      <MobileLayout>
        <S.Container style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
          <S.MainTitle>리포트를 불러올 수 없습니다.</S.MainTitle>
        </S.Container>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <S.Container>
        {/* 1. 관람 결과 요약 카드 */}
        <S.SectionHeader>
          <S.MainTitle>뮤즈님의 관람 결과입니다.</S.MainTitle>
          <S.SubTitle>{topZoneName}에 가장 많은 관심을 보였어요!</S.SubTitle>
        </S.SectionHeader>

        <S.SummaryCard>
          <S.SummaryLabel>총 관람시간</S.SummaryLabel>
          <S.TotalTimePill>{totalMinutes}분</S.TotalTimePill>

          <S.TimeBreakdownContainer>
            <S.BreakdownRow>
              <S.BreakdownItem $flex={top1.duration_min}>
                <S.BreakdownPill $isHighlight>{top1.duration_min}분</S.BreakdownPill>
                <S.BreakdownLabel>{top1.zone_name}</S.BreakdownLabel>
              </S.BreakdownItem>

              <S.BreakdownItem $flex={top2.duration_min}>
                <S.BreakdownLabel>{top2.zone_name}</S.BreakdownLabel>
                <S.BreakdownPill>{top2.duration_min}분</S.BreakdownPill>
              </S.BreakdownItem>

              <S.BreakdownItem $flex={etcMinutes}>
                <S.BreakdownLabel>기타</S.BreakdownLabel>
                <S.BreakdownPill>{etcMinutes}분</S.BreakdownPill>
              </S.BreakdownItem>
            </S.BreakdownRow>
          </S.TimeBreakdownContainer>
        </S.SummaryCard>

        {/* 2. 화보 아이템 선택 섹션 */}
        <S.SectionHeader $isSecond>
          <S.MainTitle>화보에 담을 아이템을 골라주세요.</S.MainTitle>
          <S.SubTitle>
            오늘 가장 관심 있게 보신 상품을 미리 담아두었어요. 변경 하셔도 돼요!
          </S.SubTitle>
          {candidateError && (
            <S.SubTitle>
              {candidateError}
            </S.SubTitle>
          )}
        </S.SectionHeader>

        <S.ItemGrid>
          {displayProducts.map((item, index) => {
            const productId = item.product_id;
            const isSelected = selectedProductIds.includes(productId);
            const imgSrc = getProductImage(item);

            return (
              <S.ItemCard
                key={productId}
                $selected={isSelected}
                onClick={() => handleToggleSelect(item)}
              >
                <S.ImageContainer>
                  <S.CheckIconImage
                    src={isSelected ? checkActiveImg : checkInactiveImg}
                    alt={isSelected ? "선택됨" : "선택 안 됨"}
                  />
                  <S.ItemImage
                    src={imgSrc}
                    alt={item.name || "상품 이미지"}
                    onError={(e) => {
                      e.currentTarget.src = defaultBagImg;
                    }}
                  />
                </S.ImageContainer>

                <S.ItemInfo>
                  <S.ItemName>{item.name || `상품 ${index + 1}`}</S.ItemName>
                  {item.reason && (
                    <S.ReasonBadge data-reason-code={item.reason_code || undefined}>
                      {item.reason}
                    </S.ReasonBadge>
                  )}
                </S.ItemInfo>
              </S.ItemCard>
            );
          })}
        </S.ItemGrid>

        <S.CameraButton
          type="button"
          onClick={handleGoToCamera}
          disabled={!selectedCandidate?.product_id}
        >
          선택한 상품으로 화보 만들기
        </S.CameraButton>
      </S.Container>
    </MobileLayout>
  );
}

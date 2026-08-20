import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAnalytics } from "../api/analytics";
import { getLookbookCandidates } from "../api/lookbooks";
import * as S from "./AnalyticsPage.styled";
import MobileLayout from "../components/MobileLayout/MobileLayout";
import Header from "../components/Header/Header";
import checkActiveImg from "../assets/check.svg";
import checkInactiveImg from "../assets/check.png";

const defaultBagImg =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23eee%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%23aaa%22%20font-size%3D%2214%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E";

export const getProductImage = (product) => {
  const prodId = product?.product_id ?? product?.id;
  if (prodId) {
    return `/images/${prodId}-Photoroom.png`;
  }
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
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [candidateProducts, setCandidateProducts] = useState([]);
  const [candidateMaxSelect, setCandidateMaxSelect] = useState(1);
  const [candidateMinSelect, setCandidateMinSelect] = useState(1);
  const [isPending, setIsPending] = useState(true);
  const pollTimerRef = useRef(null);

  useEffect(() => {
    if (!reportSlug) {
      console.warn("⚠️ [AnalyticsPage] reportSlug 없음");
      setIsPending(false);
      return;
    }

    let isMounted = true;

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
          setIsPending(false);

          const defaultProduct =
            data.hero ||
            (Array.isArray(data.recommendations) && data.recommendations[0]) ||
            null;

          if (defaultProduct) {
            const defaultId = defaultProduct.product_id || defaultProduct.id;
            if (defaultId) {
              const normalizedId = String(defaultId);

              setSelectedProductIds([normalizedId]);

              sessionStorage.setItem(
                "selected_products",
                JSON.stringify([normalizedId])
              );
            }
          }
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

  // ⭐️ 2. 체류 시간 정밀 계산 및 집계
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

    const zoneSecMap = {};
    let totalSec = 0;

    // (A) 서버 리포트 내 scene / zones 요약 데이터 1순위 파싱
    const sceneSummaries =
      report.scenes ||
      report.summary?.scenes ||
      report.zone_summary ||
      report.scene_stats ||
      [];

    if (Array.isArray(sceneSummaries) && sceneSummaries.length > 0) {
      sceneSummaries.forEach((s) => {
        const sec = Number(
          s.dwell_sec ??
          (s.dwell_ms ? Math.round(s.dwell_ms / 1000) : 0) ??
          s.duration_sec ??
          0
        );
        const name = s.zone_name || s.scene_name || `${s.scene_no || s.no || 1}번 진열대`;
        zoneSecMap[name] = (zoneSecMap[name] || 0) + sec;
        totalSec += sec;
      });
    }

    // (B) report.interested 파싱 (초/밀리초/텍스트)
    if (Array.isArray(report.interested) && report.interested.length > 0) {
      report.interested.forEach((item, idx) => {
        let sec = 0;
        if (typeof item.dwell_sec === "number") sec = item.dwell_sec;
        else if (typeof item.dwell_ms === "number") sec = Math.round(item.dwell_ms / 1000);
        else if (typeof item.reason === "string") {
          const match = item.reason.match(/체류\s*(\d+)\s*(?:초|s|sec)?/i);
          if (match) sec = parseInt(match[1], 10);
        }

        let shelfNo = item.scene_no || item.scene_id || item.zone_no;
        if (!shelfNo && item.product_id) {
          const pMatch = String(item.product_id).match(/p_(\d)/);
          if (pMatch) shelfNo = parseInt(pMatch[1], 10);
        }

        const zoneKey = shelfNo ? `${shelfNo}번 진열대` : `${idx + 1}번 진열대`;
        zoneSecMap[zoneKey] = (zoneSecMap[zoneKey] || 0) + sec;
        totalSec += sec;
      });
    }

    // (C) 총 시간 필드가 서버에 명시된 경우 우선 반영
    const serverTotalSec =
      report.total_duration_sec ??
      (report.total_dwell_ms ? Math.round(report.total_dwell_ms / 1000) : 0) ??
      report.summary?.total_duration_sec;

    if (serverTotalSec && serverTotalSec > totalSec) {
      totalSec = serverTotalSec;
    }

    // (D) 정렬 및 최소 1분 단위 보정
    const sortedZones = Object.entries(zoneSecMap)
      .map(([zone_name, sec]) => ({
        zone_name,
        raw_sec: sec,
        duration_min: Math.max(1, Math.round(sec / 60) || 1),
      }))
      .sort((a, b) => b.raw_sec - a.raw_sec);

    console.log("⏱️ [체류시간 파싱 결과]:", {
      zoneSecMap,
      totalSec,
      sortedZones,
    });

// src/pages/AnalyticsPage.jsx (useMemo 내부 하단)

    // 1. Top1, Top2 진열대 추출 (0초보다 크면 최소 1분 올림)
    const top1Zone = sortedZones[0] || { zone_name: "1번 진열대", duration_min: 0, raw_sec: 0 };
    const top2Zone = sortedZones[1] || { zone_name: "2번 진열대", duration_min: 0, raw_sec: 0 };

    // 2. 3위 이하 나머지 진열대들의 체류시간 합산 (기타)
    const etcRawSec = sortedZones
      .slice(2)
      .reduce((sum, zone) => sum + (zone.raw_sec || 0), 0);
    const etcMin = etcRawSec > 0 ? Math.ceil(etcRawSec / 60) : 0;

    // ⭐️ 3. 총 관람시간 = 아래 3개 알약의 단순 합산으로 일치화
    const calcTotalMin = top1Zone.duration_min + top2Zone.duration_min + etcMin;

    return {
      topZoneName: top1Zone.zone_name,
      totalMinutes: calcTotalMin, // Top1 + Top2 + 기타 합계 (예: 8 + 1 + 0 = 9분)
      top1: top1Zone,
      top2: top2Zone,
      etcMinutes: etcMin,
    };
  }, [report]);

  const handleToggleSelect = (productId) => {
    setSelectedProductIds((current) => {
      const next = current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId].slice(-candidateMaxSelect);

      sessionStorage.setItem(
        "selected_products",
        JSON.stringify(next)
      );

      return next;
    });
  };

  const handleGoToCamera = () => {
    if (selectedProductIds.length < candidateMinSelect) {
      alert("화보에 담을 아이템을 1개 이상 선택해 주세요.");
      return;
    }
    sessionStorage.setItem(
      "selected_products",
      JSON.stringify(selectedProductIds)
    );
    navigate("/camera");
  };

  const displayProducts = useMemo(() => {
    if (candidateProducts.length > 0) {
      return candidateProducts;
    }

    if (!report) return [];

    const list = [];
    if (report.hero) list.push(report.hero);
    if (Array.isArray(report.recommendations)) list.push(...report.recommendations);
    if (Array.isArray(report.items)) list.push(...report.items);
    if (Array.isArray(report.interested)) list.push(...report.interested);

    const unique = [];
    const seen = new Set();
    list.forEach((item) => {
      const id = item.product_id || item.id;
      if (id && !seen.has(id)) {
        seen.add(id);
        unique.push(item);
      }
    });

    return unique.slice(0, 6);
  }, [report]);

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
        </S.SectionHeader>

        <S.ItemGrid>
          {displayProducts.map((item, index) => {
            const productId = item.product_id || item.id || `temp_${index}`;
            const isSelected = selectedProductIds.includes(productId);
            const imgSrc = getProductImage(item);

            return (
              <S.ItemCard
                key={productId}
                $selected={isSelected}
                onClick={() => handleToggleSelect(productId)}
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
          disabled={selectedProductIds.length < candidateMinSelect}
        >
          선택한 상품으로 화보 만들기
        </S.CameraButton>
      </S.Container>
    </MobileLayout>
  );
}

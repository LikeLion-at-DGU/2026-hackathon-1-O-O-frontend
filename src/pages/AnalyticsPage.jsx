import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAnalytics } from "../api/analytics";
import * as S from "./AnalyticsPage.styled";
import MobileLayout from "../components/MobileLayout/MobileLayout";
import Header from "../components/Header/Header";

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const { slug } = useParams();

  // 1. 식별자 확인 (URL params -> sessionStorage)
  const reportSlug =
    slug ||
    sessionStorage.getItem("report_slug") ||
    sessionStorage.getItem("visit_id");

  const [report, setReport] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const pollTimerRef = useRef(null);

  // 2. 백엔드 리포트 데이터 조회 및 Pending 폴링
  useEffect(() => {
    if (!reportSlug) {
      alert("리포트 식별자가 없습니다.");
      setIsPending(false);
      return;
    }

    let isMounted = true;

    const loadReport = async () => {
      try {
        const data = await getAnalytics(reportSlug);
        if (!isMounted) return;

        console.log("📊 [AnalyticsPage] 수신 데이터:", data);

        // (1) 백엔드 분석 진행 중 (pending) -> 2초 주기 폴링
        if (data?.status === "pending") {
          setIsPending(true);
          pollTimerRef.current = setTimeout(loadReport, 2000);
          return;
        }

        // (2) 분석 완료 (ready)
        if (data?.status === "ready") {
          setReport(data);
          setIsPending(false);

          // Hero 상품 또는 preselected 상품 기본 선택
          const initialSelected = data.hero?.product_id
            ? [data.hero.product_id]
            : data.preselected || [];

          setSelectedProductIds(initialSelected);
          if (initialSelected.length > 0) {
            sessionStorage.setItem(
              "selected_products",
              JSON.stringify(initialSelected)
            );
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
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, [reportSlug]);

  // 3. 서버 체류 이벤트 기반 집계 계산
  const { topZoneName, totalMinutes, top1, top2, etcMinutes } = useMemo(() => {
    if (!report) {
      return {
        topZoneName: "",
        totalMinutes: 0,
        top1: { zone_name: "-", duration_min: 0 },
        top2: { zone_name: "-", duration_min: 0 },
        etcMinutes: 0,
      };
    }

    // 총 체류 시간 (visit_start ~ visit_end 또는 summary 필드)
    let totalMin = 0;
    if (report.visit_start && report.visit_end) {
      const start = new Date(report.visit_start).getTime();
      const end = new Date(report.visit_end).getTime();
      totalMin = Math.max(1, Math.round(Math.max(0, end - start) / 60000));
    } else if (report.summary?.total_stay_duration_sec) {
      totalMin = Math.max(1, Math.round(report.summary.total_stay_duration_sec / 60));
    }

    // 체류 이벤트 추출 및 구역별 집계
    const dwellEvents =
      report.events?.filter((e) => e.event_type === "scene_dwell") || [];

    const zoneMap = {};
    dwellEvents.forEach((event) => {
      const zoneId =
        event.payload?.zone_id ??
        event.zone_id ??
        event.scene_id ??
        "기타";
      const dwellMs = Number(
        event.payload?.dwell_time_ms ??
          event.metadata?.dwell_ms ??
          event.dwell_time_ms ??
          0
      );
      zoneMap[zoneId] = (zoneMap[zoneId] || 0) + dwellMs;
    });

    const stats = Object.entries(zoneMap).map(([zoneId, totalMs]) => {
      const min = Math.round(totalMs / 60000);
      return {
        zone_id: zoneId,
        zone_name: isNaN(zoneId) ? zoneId : `${zoneId}번 진열대`,
        duration_min: min,
        raw_ms: totalMs,
      };
    });

    stats.sort((a, b) => b.raw_ms - a.raw_ms);

    const top1Zone = stats[0] || { zone_name: "미확인 구역", duration_min: 0 };
    const top2Zone = stats[1] || { zone_name: "미확인 구역", duration_min: 0 };

    const top2SumMin = top1Zone.duration_min + top2Zone.duration_min;
    const calculatedEtc = Math.max(0, totalMin - top2SumMin);

    return {
      topZoneName: top1Zone.zone_name,
      totalMinutes: totalMin,
      top1: top1Zone,
      top2: top2Zone,
      etcMinutes: calculatedEtc,
    };
  }, [report]);


  useEffect(() => {
    if (report?.hero?.product_id) {
      const defaultSelected = [report.hero.product_id];
      setSelectedProductIds(defaultSelected);
      sessionStorage.setItem("selected_products", JSON.stringify(defaultSelected));
    }
  }, [report]);
  
  // 4. 상품 선택 토글 핸들러
  const handleToggleSelect = (productId) => {
    const maxSelect = report?.max_select || 1;

    let updated;
    if (maxSelect === 1) {
      // 1개만 고르는 경우: 클릭한 상품으로 바로 교체
      updated = [productId];
    } else {
      // 다중 선택 가능한 경우: 토글 처리 (단, 최소 1개는 유지)
      if (selectedProductIds.includes(productId)) {
        // 선택 해제 시도 시, 마지막 남은 1개라면 해제 방지
        updated = selectedProductIds.length > 1
          ? selectedProductIds.filter((id) => id !== productId)
          : selectedProductIds;
      } else if (selectedProductIds.length < maxSelect) {
        updated = [...selectedProductIds, productId];
      } else {
        updated = selectedProductIds;
      }
    }

    setSelectedProductIds(updated);
    sessionStorage.setItem("selected_products", JSON.stringify(updated));
  };

  // 5. 화보 촬영 페이지로 이동
  const handleGoToCamera = () => {
    if (selectedProductIds.length === 0) {
      alert("화보에 담을 아이템을 1개 이상 선택해 주세요.");
      return;
    }
    sessionStorage.setItem("selected_products", JSON.stringify(selectedProductIds));
    navigate("/camera");
  };

  // 6. 서버 응답 상품 목록 구성 (hero + recommendations + interested)
  const displayProducts = useMemo(() => {
    if (!report) return [];

    const list = [];
    if (report.hero) list.push(report.hero);
    if (Array.isArray(report.recommendations)) list.push(...report.recommendations);
    if (Array.isArray(report.items)) list.push(...report.items);

    // product_id 기준 중복 제거
    const unique = [];
    const seen = new Set();
    list.forEach((item) => {
      const id = item.product_id || item.id;
      if (id && !seen.has(id)) {
        seen.add(id);
        unique.push(item);
      }
    });

    return unique.slice(0,6);
  }, [report]);

  // 로딩 화면
  if (isPending) {
    return (
      <MobileLayout>
        <S.Container style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
          <S.MainTitle style={{ textAlign: "center", marginBottom: 8 }}>관람 기록을 분석하고 있어요</S.MainTitle>
          <S.SubTitle style={{ textAlign: "center" }}>취향 분석 리포트를 준비 중입니다...</S.SubTitle>
        </S.Container>
      </MobileLayout>
    );
  }

  // 데이터 수신 실패 시
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
              <S.BreakdownItem $flex={top1.duration_min || 30}>
                <S.BreakdownPill $isHighlight>{top1.duration_min}분</S.BreakdownPill>
                <S.BreakdownLabel>{top1.zone_name}</S.BreakdownLabel>
              </S.BreakdownItem>

              <S.BreakdownItem $flex={top2.duration_min || 20}>
                <S.BreakdownLabel>{top2.zone_name}</S.BreakdownLabel>
                <S.BreakdownPill>{top2.duration_min}분</S.BreakdownPill>
              </S.BreakdownItem>

              <S.BreakdownItem $flex={etcMinutes || 10}>
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
            const productId = item.product_id || `temp_${index}`;
            const isSelected = selectedProductIds.includes(productId);
            // thumbnail 우선, 없으면 cutout_url, 없으면 기본 이미지
            const imgSrc = item.thumbnail || item.cutout_url || defaultBagImg;

            return (
              <S.ItemCard
                key={productId}
                $selected={isSelected}
                onClick={() => handleToggleSelect(productId)}
              >
                <S.ImageContainer>
                  {isSelected && (
                    <S.CheckBadge>
                      <svg
                        width="14"
                        height="10"
                        viewBox="0 0 14 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 5L4.8 9L13 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </S.CheckBadge>
                  )}
                  <S.ItemImage
                    src={imgSrc}
                    alt={item.name || "상품 이미지"}
                  />
                </S.ImageContainer>

                <S.ItemInfo>
                  <S.ItemName>{item.name || `상품 ${index + 1}`}</S.ItemName>
                </S.ItemInfo>
              </S.ItemCard>
            );
          })}
        </S.ItemGrid>
      </S.Container>
    </MobileLayout>
  );
}
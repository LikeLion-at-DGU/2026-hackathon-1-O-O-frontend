import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAnalytics, createLookbook } from "../api/analytics";
import * as S from "./AnalyticsPage.styled";
import MobileLayout from "../components/MobileLayout/MobileLayout";
import defaultBagImg from "../../public/images/1-Photoroom.png";

// 서버 데이터 로드 전/실패 시 보여줄 안전 Mock Data
const DEFAULT_PRODUCTS = [
  { product_id: "p_101", name: "New Liz 비세토스 쇼퍼", thumbnail: defaultBagImg },
  { product_id: "p_102", name: "New Liz 비세토스 쇼퍼", thumbnail: defaultBagImg },
  { product_id: "p_103", name: "New Liz 비세토스 쇼퍼", thumbnail: defaultBagImg },
  { product_id: "p_104", name: "New Liz 비세토스 쇼퍼", thumbnail: defaultBagImg },
  { product_id: "p_105", name: "New Liz 비세토스 쇼퍼", thumbnail: defaultBagImg },
  { product_id: "p_106", name: "New Liz 비세토스 쇼퍼", thumbnail: defaultBagImg },
];

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. 백엔드 데이터 불러오기 (GET)
  useEffect(() => {
    const loadReport = async () => {
      const visitId = sessionStorage.getItem("visit_id");

      if (!visitId) {
        console.warn("⚠️ visit_id 없음 - 기본 UI 유지");
        return;
      }

      try {
        const data = await getAnalytics(visitId);
        console.log("📊 [AnalyticsPage] 수신 성공:", data);
        setReport(data);

        // 백엔드에서 지정해 준 1등 관심 상품 자동 선택
        if (data?.preselected && Array.isArray(data.preselected) && data.preselected.length > 0) {
          setSelectedProductIds(data.preselected);
        }
      } catch (err) {
        console.warn("⚠️ 리포트 조회 실패/생성 전 (기본값 유지):", err.message);
      }
    };

    loadReport();
  }, []);

  // 2. 체류 시간 집계 계산 로직 (서버 데이터가 없을 때 안전하게 Fallback)
  const { topZoneName, totalMinutes, top1, top2, etcMinutes } = useMemo(() => {
    let totalMin = 60;
    if (report?.visit_start && report?.visit_end) {
      const start = new Date(report.visit_start).getTime();
      const end = new Date(report.visit_end).getTime();
      const diffMs = Math.max(0, end - start);
      totalMin = Math.max(1, Math.round(diffMs / 60000));
    }
    console.log("👉 총 관람시간:", `${totalMin}분`);

    const dwellEvents = report?.events?.filter((e) => e.event_type === "scene_dwell") || [];
    console.log("👉 수신된 체류 이벤트 목록:", dwellEvents);
    
    const zoneMap = {};

    dwellEvents.forEach((event) => {
      const zoneId = event.payload?.zone_id ?? event.zone_id ?? "기타";
      const dwellMs = Number(event.payload?.dwell_time_ms ?? event.dwell_time_ms ?? 0);
      zoneMap[zoneId] = (zoneMap[zoneId] || 0) + dwellMs;
    });
    console.log("👉 진열대별 합산 체류시간(ms):", zoneMap);

    let stats = Object.entries(zoneMap).map(([zoneId, totalMs]) => {
      const min = Math.round(totalMs / 60000);
      return {
        zone_id: zoneId,
        zone_name: isNaN(zoneId) ? zoneId : `${zoneId}번 진열대`,
        duration_min: min > 0 ? min : 1,
        raw_ms: totalMs,
      };
    });

    // 기본 디자인 가이드용 Mock 데이터
    if (stats.length === 0) {
      console.log("⚠️ 서버 이벤트 데이터 없음: 기본 목업 데이터(1번: 30분, 2번: 20분)를 사용합니다.");
      stats = [
        { zone_name: "1번 진열대", duration_min: 30, raw_ms: 1800000 },
        { zone_name: "2번 진열대", duration_min: 20, raw_ms: 1200000 },
      ];
    }

    stats.sort((a, b) => b.raw_ms - a.raw_ms);

    const top1Zone = stats[0] || { zone_name: "1번 진열대", duration_min: 30 };
    const top2Zone = stats[1] || { zone_name: "2번 진열대", duration_min: 20 };

    const top2SumMin = top1Zone.duration_min + top2Zone.duration_min;
    const calculatedEtc =
      totalMin > top2SumMin
        ? totalMin - top2SumMin
        : Math.max(1, totalMin - top1Zone.duration_min);

    console.log("🏆 최다 체류 구역(TOP 1):", `${top1Zone.zone_name} (${top1Zone.duration_min}분)`);
  console.log("🥈 차순위 구역(TOP 2):", `${top2Zone.zone_name} (${top2Zone.duration_min}분)`);
  console.log("📦 기타 체류 시간:", `${calculatedEtc}분`);
  console.groupEnd();

    return {
      topZoneName: top1Zone.zone_name,
      totalMinutes: totalMin,
      top1: top1Zone,
      top2: top2Zone,
      etcMinutes: calculatedEtc,
    };
  }, [report]);

  // 3. 상품 카드 클릭 시 선택 토글 핸들러
  const handleToggleSelect = (productId) => {
    const maxSelect = report?.max_select || 1;

    const newSelected = [productId];
    setSelectedProductIds(newSelected);
    sessionStorage.setItem("selected_products", JSON.stringify(newSelected));

    if (maxSelect === 1) {
      setSelectedProductIds([productId]);
    } else {
      setSelectedProductIds((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : prev.length < maxSelect
          ? [...prev, productId]
          : prev
      );
    }
  };

  // 4. 상단 '화보 찍기' 버튼 클릭 시 (POST 요청 ➔ 다음 페이지 이동)
  const handleCreateLookbook = async () => {
    const visitId = sessionStorage.getItem("visit_id");
    if (!visitId) {
      alert("입장 정보가 없습니다.");
      return;
    }

    try {
      setIsLoading(true);
      // 서버로 선택한 상품 정보 전송
      const res = await createLookbook(visitId, {
        selected_product_ids: selectedProductIds,
      });

      console.log("🚀 화보 생성 작업 시작됨:", res);
      
      // 작업 정보를 세션이나 state로 넘기며 로딩/결과 페이지로 이동
      if (res?.job_id) {
        sessionStorage.setItem("current_job_id", res.job_id);
      }
      if (res?.share_slug) {
        sessionStorage.setItem("share_slug", res.share_slug);
      }

      // 다음 경로로 이동 (프로젝트 라우트에 맞게 수정)
      // navigate("/lookbook/loading");
    } catch (err) {
      console.error("화보 생성 요청 실패:", err);
      alert("화보 생성 요청 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 실제 렌더링할 상품 6개 리스트
  const displayProducts = report?.items && report.items.length > 0 ? report.items : DEFAULT_PRODUCTS;

  
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
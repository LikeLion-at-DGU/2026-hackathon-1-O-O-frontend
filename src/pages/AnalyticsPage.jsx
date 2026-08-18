import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getReport } from "../api/reports";
import * as S from "./AnalyticsPage.styled";
import MobileLayout from "../components/MobileLayout/MobileLayout";
import defaultBagImg from "../../public/images/1-Photoroom.png"; 

// 백엔드 데이터 로드 실패 시 보여줄 기본 UI용 Mock Data
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

  useEffect(() => {
    const loadReport = async () => {
      const visitId = sessionStorage.getItem("visit_id");

      if (!visitId) {
        console.log("❌ visit_id 없음 - Mock 데이터 유지");
        return;
      }

      try {
        const response = await getReport(visitId);
        const data = response.data;
        setReport(data);

        // 🚀 서버에서 넘겨준 preselected 상품 자동 선택
        if (data?.preselected && Array.isArray(data.preselected)) {
          setSelectedProductIds(data.preselected);
        }
      } catch (err) {
        console.error("리포트 조회 실패:", err);
      }
    };

    loadReport();
  }, []);

  // 밀리초(ms) 단위의 체류 시간 및 랭킹 단일 집계
  const { topZoneName, totalMinutes, top1, top2, etcMinutes } = useMemo(() => {
    // 1. 총 관람 시간 계산 (visit_end - visit_start)
    let totalMin = 60; // 기본 Mock
    if (report?.visit_start && report?.visit_end) {
      const start = new Date(report.visit_start).getTime();
      const end = new Date(report.visit_end).getTime();
      const diffMs = Math.max(0, end - start);
      totalMin = Math.max(1, Math.round(diffMs / 60000));
    }

    // 2. 7개 진열대 체류 시간 집계 (scene_dwell 이벤트)
    const dwellEvents = report?.events?.filter((e) => e.event_type === "scene_dwell") || [];
    const zoneMap = {};

    dwellEvents.forEach((event) => {
      const zoneId = event.payload?.zone_id ?? event.zone_id ?? "기타";
      const dwellMs = Number(event.payload?.dwell_time_ms ?? event.dwell_time_ms ?? 0);
      zoneMap[zoneId] = (zoneMap[zoneId] || 0) + dwellMs;
    });

    // 배열 변환 (밀리초 -> 분)
    let stats = Object.entries(zoneMap).map(([zoneId, totalMs]) => {
      const min = Math.round(totalMs / 60000);
      return {
        zone_id: zoneId,
        zone_name: isNaN(zoneId) ? zoneId : `${zoneId}번 진열대`,
        duration_min: min > 0 ? min : 1,
        raw_ms: totalMs,
      };
    });

    // 데이터 없을 때 기본 Mock
    if (stats.length === 0) {
      stats = [
        { zone_name: "1번 진열대", duration_min: 30, raw_ms: 1800000 },
        { zone_name: "2번 진열대", duration_min: 20, raw_ms: 1200000 },
      ];
    }

    // 체류 시간 기준 내림차순 정렬 (1위 ~ 7위)
    stats.sort((a, b) => b.raw_ms - a.raw_ms);

    // 1위, 2위 진열대 추출
    const top1Zone = stats[0] || { zone_name: "1번 진열대", duration_min: 30 };
    const top2Zone = stats[1] || { zone_name: "2번 진열대", duration_min: 20 };

    // 3. 기타 시간 계산 (총 관람 시간 - 상위 2개 진열대 체류시간)
    const top2SumMin = top1Zone.duration_min + top2Zone.duration_min;
    const calculatedEtc =
      totalMin > top2SumMin
        ? totalMin - top2SumMin
        : Math.max(1, totalMin - top1Zone.duration_min);

    return {
      topZoneName: top1Zone.zone_name,
      totalMinutes: totalMin,
      top1: top1Zone,
      top2: top2Zone,
      etcMinutes: calculatedEtc,
    };
  }, [report]);

    // 상품 선택 토글 핸들러
    // 🚀 max_select: 1 에 맞춘 단일 선택 처리
  const toggleSelect = (productId) => {
    // 이미 선택된 아이템을 클릭해도 최소 1개(min_select: 1) 유지를 위해 1개 선택 고정
    setSelectedProductIds([productId]);
  };

  // 백엔드 상품 목록이 없을 경우 기본 상품 목록 사용
  // ⭕ 새로운 JSON 스펙(items)에 맞춘 코드
const displayProducts = report?.items && report.items.length > 0 ? report.items : DEFAULT_PRODUCTS;

// 최다 관심 상품(가장 체류시간이 길었던 상품)을 가져와야 할 때
const mostInterested = 
  report?.items?.find((item) => item.reason_code === "most_dwelled") || 
  report?.items?.[0] || 
  null;

  return (
    <MobileLayout>
      <S.Container>
        {/* 1. 관람 결과 요약 섹션 */}
        <S.SectionHeader>
          <S.MainTitle>뮤즈님의 관람 결과입니다.</S.MainTitle>
          <S.SubTitle>
            {topZoneName}에 가장 많은 관심을 보였어요!
          </S.SubTitle>
        </S.SectionHeader>

        <S.SummaryCard>
          <S.SummaryLabel>총 관람시간</S.SummaryLabel>
          <S.TotalTimePill>
            {totalMinutes}분
          </S.TotalTimePill>

          <S.TimeBreakdownContainer>
            <S.BreakdownRow>
              {/* 1번 진열대 (하이라이트) */}
              <S.BreakdownItem $isHighlight>
                <S.BreakdownPill $isHighlight>
                  {top1.duration_min}분
                </S.BreakdownPill>
                <S.BreakdownLabel>{top1.zone_name}</S.BreakdownLabel>
              </S.BreakdownItem>

              {/* 2번 진열대 */}
              <S.BreakdownItem>
                <S.BreakdownLabel>{top2.zone_name}</S.BreakdownLabel>
                <S.BreakdownPill>
                  {top2.duration_min}분
                </S.BreakdownPill>
              </S.BreakdownItem>

              {/* 질문/기타 */}
              <S.BreakdownItem>
                <S.BreakdownLabel>기타</S.BreakdownLabel>
                <S.BreakdownPill>
                  {etcMinutes}분
                </S.BreakdownPill>
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

            return (
              <S.ItemCard
                key={productId}
                $selected={isSelected}
                onClick={() => toggleSelect(productId)}
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
                    src={item.thumbnail || "/1-Photoroom.png"}
                    alt={item.name || "상품 이미지"}
                  />
                </S.ImageContainer>

                <S.ItemInfo>
                  <S.ItemName>{item.name || `상품 ${productId}`}</S.ItemName>
                </S.ItemInfo>
              </S.ItemCard>
            );
          })}
        </S.ItemGrid>
      </S.Container>
    </MobileLayout>
  );
}
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAnalytics } from "../api/analytics";
import * as S from "./AnalyticsPage.styled";
import MobileLayout from "../components/MobileLayout/MobileLayout";
import Header from "../components/Header/Header";

const defaultBagImg =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23eee%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%23aaa%22%20font-size%3D%2214%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E";

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const { slug } = useParams();

  const reportSlug =
    slug ||
    sessionStorage.getItem("report_slug") ||
    sessionStorage.getItem("visit_id");

  const [report, setReport] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
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

        console.log("📊 [AnalyticsPage] 서버 응답:", data);

        if (data?.status === "pending") {
          setIsPending(true);
          pollTimerRef.current = setTimeout(loadReport, 2000);
          return;
        }

        if (data?.status === "ready") {
          setReport(data);
          setIsPending(false);

          const defaultSelectedId =
            data.hero?.product_id ||
            (data.recommendations && data.recommendations[0]?.product_id) ||
            null;

          if (defaultSelectedId) {
            setSelectedProductIds([defaultSelectedId]);
            sessionStorage.setItem(
              "selected_products",
              JSON.stringify([defaultSelectedId])
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
//-------------------------
// 3. 1~7번 진열대 체류 시간 초 단위 정밀 계산 및 콘솔 출력
  const { topZoneName, totalMinutes, top1, top2, etcMinutes } = useMemo(() => {
    // ⭐️ 1. 리포트 데이터 도착 여부 콘솔
    if (!report) {
      console.log("⏳ [AnalyticsPage] 리포트 데이터 수신 대기 중...");
      return {
        topZoneName: "1번 진열대",
        totalMinutes: 0,
        top1: { zone_name: "1번 진열대", duration_min: 0 },
        top2: { zone_name: "2번 진열대", duration_min: 0 },
        etcMinutes: 0,
      };
    }

    console.group("⏱️ [체류시간 초(Seconds) 정밀 분석 콘솔]");
    console.log("1. 서버 report.interested 원본:", report.interested);
    console.log("2. 서버 report.visit_summary 원본:", report.visit_summary);
    console.log("3. 서버 report.events 원본:", report.events);

    const zoneSecMap = {};
    let totalSec = 0;

    // (A) report.interested 파싱
    if (Array.isArray(report.interested) && report.interested.length > 0) {
      report.interested.forEach((item, idx) => {
        let sec = 0;

        // 초/ms/숫자 필드 확인
        if (typeof item.dwell_sec === "number") {
          sec = item.dwell_sec;
        } else if (typeof item.dwell_ms === "number") {
          sec = Math.round(item.dwell_ms / 1000);
        } else if (typeof item.reason === "string") {
          // '체류 30초', '30초', '30s', '체류 30' 매칭
          const match =
            item.reason.match(/체류\s*(\d+)\s*(?:초|s|sec)?/i) ||
            item.reason.match(/(\d+)\s*(?:초|s|sec)/i);
          if (match) {
            sec = parseInt(match[1], 10);
          } else if (item.reason.includes("대화") || item.reason.includes("챗봇")) {
            const countMatch = item.reason.match(/(\d+)\s*회/);
            const count = countMatch ? parseInt(countMatch[1], 10) : 1;
            sec = count * 15; // 챗봇 1회당 15초 환산
          }
        }

        // 진열대 번호 판별 (scene_no 또는 product_id)
        let shelfNo = item.scene_no;
        if (!shelfNo && item.product_id) {
          const pMatch = String(item.product_id).match(/p_(\d)/);
          if (pMatch) shelfNo = parseInt(pMatch[1], 10);
        }

        const zoneKey = shelfNo ? `${shelfNo}번 진열대` : `${idx + 1}번 진열대`;
        zoneSecMap[zoneKey] = (zoneSecMap[zoneKey] || 0) + sec;
        totalSec += sec;

        console.log(`- [항목 ${idx + 1}] 진열대: ${zoneKey} | 이유: "${item.reason}" ➔ 계산된 체류: ${sec}초`);
      });
    }

    // (B) report.events 배열 파싱 (동봉된 경우)
    if (Array.isArray(report.events) && report.events.length > 0) {
      report.events.forEach((ev, idx) => {
        const ms = Number(
          ev.payload?.dwell_time_ms ??
            ev.metadata?.dwell_ms ??
            ev.dwell_time_ms ??
            0
        );
        const sec = Math.round(ms / 1000);
        const rawZone = String(
          ev.payload?.zone_id ?? ev.zone_id ?? ev.scene_id ?? ""
        );
        const numMatch = rawZone.match(/\d+/);
        const zoneKey = numMatch ? `${numMatch[0]}번 진열대` : "기타 진열대";

        zoneSecMap[zoneKey] = (zoneSecMap[zoneKey] || 0) + sec;
        totalSec += sec;

        console.log(`- [이벤트 ${idx + 1}] 타입: ${ev.event_type} | 구역: ${zoneKey} ➔ 체류: ${sec}초 (${ms}ms)`);
      });
    }

    // (C) 체류시간 내림차순 정렬
    const sortedZones = Object.entries(zoneSecMap)
      .map(([zone_name, sec]) => ({
        zone_name,
        duration_min: sec, // 화면에 초 단위 수치 전달
        raw_sec: sec,
      }))
      .sort((a, b) => b.raw_sec - a.raw_sec);

    const top1Zone = sortedZones[0] || { zone_name: "1번 진열대", duration_min: 0, raw_sec: 0 };
    const top2Zone = sortedZones[1] || { zone_name: "2번 진열대", duration_min: 0, raw_sec: 0 };
    const top2Sum = top1Zone.raw_sec + top2Zone.raw_sec;
    const calculatedEtc = Math.max(0, totalSec - top2Sum);

    const result = {
      topZoneName: top1Zone.zone_name,
      totalMinutes: totalSec,
      top1: top1Zone,
      top2: top2Zone,
      etcMinutes: calculatedEtc,
    };

    console.log("📊 진열대별 최종 초 단위 집계표:", zoneSecMap);
    console.log(`🥇 1위 진열대: ${top1Zone.zone_name} (${top1Zone.raw_sec}초)`);
    console.log(`🥈 2위 진열대: ${top2Zone.zone_name} (${top2Zone.raw_sec}초)`);
    console.log(`📦 기타 진열대: ${calculatedEtc}초`);
    console.log(`⏱️ 전체 총 관람시간: ${totalSec}초`);
    console.groupEnd();

    return result;
  }, [report]);
  //-------------------------------------
  const handleToggleSelect = (productId) => {
    setSelectedProductIds([productId]);
    sessionStorage.setItem("selected_products", JSON.stringify([productId]));
  };

  const handleGoToCamera = () => {
    if (selectedProductIds.length === 0) {
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
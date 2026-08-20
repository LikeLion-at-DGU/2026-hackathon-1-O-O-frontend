import { useEffect, useRef } from "react";
import styled from "styled-components";

import MobileLayout from "../components/MobileLayout/MobileLayout";
import FloorMap from "../components/FloorMap/FloorMap";
import HomeContent from "../components/HomeContent/HomeContent";

import { enterStore } from "../api/visits";
import { getVisitId } from "../utils/storage";

function HomePage() {
  const visitStarted = useRef(false);

  // 1. 매장 방문 세션 초기화 및 검증
  useEffect(() => {
    if (visitStarted.current) return;
    visitStarted.current = true;

    const startVisit = async () => {
      const existingVisitId = getVisitId();

      // 기존 발급된 방문 ID가 존재하면 유지
      if (existingVisitId) {
        console.log("기존 방문 유지:", existingVisitId);
        return;
      }

      try {
        // 서버 유효성 검증을 준수하여 빈 객체로 기본 방문 등록 요청
        const entered = await enterStore({});
        console.log("방문 시작:", entered?.visit_id);
      } catch (error) {
        console.error("방문 시작 실패:", error);
      }
    };

    startVisit();
  }, []);

  return (
    <MobileLayout>
      <PageContainer>
        <FloorMap showGuideMessage />
        <HomeContent />
      </PageContainer>
    </MobileLayout>
  );
}

export default HomePage;

const PageContainer = styled.div`
  padding-top: 24px;
`;
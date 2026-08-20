import { useEffect, useRef } from "react";
import MobileLayout from "../components/MobileLayout/MobileLayout";
import FloorMap from "../components/FloorMap/FloorMap";
import HomeContent from "../components/HomeContent/HomeContent";
import styled from "styled-components";
import { enterStore } from "../api/visits";

function HomePage() {
  const visitStarted = useRef(false);

  useEffect(() => {
    if (visitStarted.current) return;

    visitStarted.current = true;

    const startVisit = async () => {
      const existingVisitId = sessionStorage.getItem("visit_id");

      if (existingVisitId) {
        console.log("기존 방문 유지:", existingVisitId);
        return;
      }

      try {
        // 연령대·성별을 지어내지 않는다. "20s"/"M" 하드코딩이 리포트 개인화에
        // 그대로 들어갔고, "M"은 서버 choices(male/female/...)에 없어 400이었다.
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

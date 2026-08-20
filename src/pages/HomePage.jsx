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
        const response = await enterStore({
          age_band: "20s",
          gender: "M",
        });

        const visitId = response.visit_id;

        console.log("방문 시작:", response.data);
        console.log("visit_id 저장:", visitId);
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

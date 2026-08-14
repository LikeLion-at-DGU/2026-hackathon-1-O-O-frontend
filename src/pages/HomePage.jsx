import React from "react";
import MobileLayout from "../components/MobileLayout/MobileLayout";
import FloorMap from "../components/FloorMap/FloorMap";
import HomeContent from "../components/HomeContent/HomeContent";
import styled from "styled-components";

function HomePage() {
  return (
      <MobileLayout>
        <PageContainer>
        <FloorMap showGuideMessage/>
        <HomeContent />
          </PageContainer>
      </MobileLayout>
      
  );
}

export default HomePage;

const PageContainer = styled.div`
  padding-top : 24px;
`
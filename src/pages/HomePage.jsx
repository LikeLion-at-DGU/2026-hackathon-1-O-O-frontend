import React from "react";
import MobileLayout from "../components/MobileLayout/MobileLayout";
import FloorMap from "../components/FloorMap/FloorMap";
import HomeContent from "../components/HomeContent/HomeContent";

function HomePage() {
  return (
      <MobileLayout>
        <FloorMap />
         <HomeContent />
      </MobileLayout>
  );
}

export default HomePage;
import React from "react";
<<<<<<< HEAD
import Layout from "../components/Layout/Layout";

function HomePage() {
  return (
    <>
      <h1>홈페이지입니다</h1>
    </>
=======
import MobileLayout from "../components/MobileLayout/MobileLayout";
import FloorMap from "../components/FloorMap/FloorMap";
import HomeContent from "../components/HomeContent/HomeContent";

function HomePage() {
  return (
      <MobileLayout>
        <FloorMap />
         <HomeContent />
      </MobileLayout>
>>>>>>> d870b0bfe0d912357522e3f87b0d801a73cdda05
  );
}

export default HomePage;
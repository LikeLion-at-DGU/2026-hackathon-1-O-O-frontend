import { Route, Routes } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import HomePage from "../pages/HomePage";
import MapPage from "../pages/MapPage";
import ShelfPage from "../pages/ShelfPage";
import ProductPage from "../pages/ProductPage";
import GuidePage from "../pages/GuidePage";
import Layout from "../components/Layout/Layout";
import ChatPage from "../pages/ChatPage";
import AnalyticsPage from "../pages/AnalyticsPage";

function Router() {
  return (
    <Routes>
      {/* 랜딩 페이지 */}
      <Route path="/" element={<LandingPage />} />

      {/* 홈 페이지 */}
      <Route path="/home" element={<HomePage />} />

      {/* 채팅 페이지 */}
      <Route path="/chat" element={<ChatPage />} />

      {/* 리포트 페이지 */}
      <Route path="/analytics" element={<AnalyticsPage />} />

      {/* Layout을 사용하는 페이지 */}
      <Route element={<Layout />}>
        {/* 매장 평면도 페이지 */}
        <Route path="/map" element={<MapPage />} />

        {/* 선반 페이지 */}
        <Route path="/shelf/:zoneId" element={<ShelfPage />} />

        {/* 상품 상세 페이지 */}
        <Route
          path="/product/:productId"
          element={<ProductPage />}
        />

        {/* 가이드 페이지 */}
        <Route path="/guide" element={<GuidePage />} />
      </Route>
    </Routes>
  );
}

export default Router;
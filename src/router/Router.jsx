import { Route, Routes } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import HomePage from "../pages/HomePage";
import MapPage from "../pages/MapPage";
import ShelfPage from "../pages/ShelfPage";
import ProductPage from "../pages/ProductPage";
import GuidePage from "../pages/GuidePage";

function Router() {
  return (
    <Routes>
      {/* 랜딩 페이지 */}
      <Route path="/" element={<LandingPage />} />

      {/* 메인 페이지 */}
      <Route path="/home" element={<HomePage />} />

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
    </Routes>
  );
}

export default Router;
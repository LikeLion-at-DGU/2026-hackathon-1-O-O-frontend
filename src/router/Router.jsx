import { Route, Routes } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import HomePage from "../pages/HomePage";
import MapPage from "../pages/MapPage";
import ShelfPage from "../pages/ShelfPage";
import ProductPage from "../pages/ProductPage";
import GuidePage from "../pages/GuidePage";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout/Layout";

function Router() {
  return (
    <Routes>
      {/* 랜딩 페이지 */}
      <Route path="/" element={<LandingPage />} />

<<<<<<< HEAD
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<Layout />}>
        <Route path="/map" element={<MapPage />} /> // 매장 평면도 페이지
        <Route path="/shelf/:zoneId" element={<ShelfPage />} /> // 선반 페이지
        <Route path="/product/:productId" element={<ProductPage />} /> // 상품 상세 페이지
        <Route path="/guide" element={<GuidePage />} /> //플러스 누르면 가이드 페이지 이동
        </Route>
      </Routes>
=======
      {/* 메인 페이지 */}
      <Route path="/home" element={<HomePage />} />
>>>>>>> d870b0bfe0d912357522e3f87b0d801a73cdda05

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
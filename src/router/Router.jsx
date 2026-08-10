import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import MapPage from "../pages/MapPage";
import ShelfPage from "../pages/ShelfPage";
import ProductPage from "../pages/ProductPage";
import GuidePage from "../pages/GuidePage";

function Router() {
  return (

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} /> // 매장 평면도 페이지
        <Route path="/shelf/:zoneId" element={<ShelfPage />} /> // 선반 페이지
        <Route path="/product/:productId" element={<ProductPage />} /> // 상품 상세 페이지
        <Route path="/guide" element={<GuidePage />} /> //플러스 누르면 가이드 페이지 이동
      </Routes>

  );
}

export default Router;
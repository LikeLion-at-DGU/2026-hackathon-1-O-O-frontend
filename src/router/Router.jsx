import {
  Route,
  Routes,
} from "react-router-dom";

import Layout from "../components/Layout/Layout";

import LandingPage from "../pages/LandingPage";
import HomePage from "../pages/HomePage";
import MapPage from "../pages/MapPage";
import ShelfPage from "../pages/ShelfPage";
import ProductPage from "../pages/ProductPage";
import GuidePage from "../pages/GuidePage";
import ChatPage from "../pages/ChatPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import CameraPage from "../pages/CameraPage";
import PhotoConfirmPage from "../pages/PhotoConfirmPage";
import LookbookPage from "../pages/LookbookPage";
import LookbookLoadingPage from "../pages/LookbookLoadingPage";

function Router() {
  return (
    <Routes>
      {/* 로딩확인 페이지 */}
      <Route
      path="/lookbook-loading-preview"
      element={
      <LookbookLoadingPage
      progress={58}
      stage="상품 추가 중..."
      />
      }
      />
      {/* 랜딩 페이지 */}
      <Route
        path="/"
        element={<LandingPage />}
      />

      {/* 홈 페이지 */}
      <Route
        path="/home"
        element={<HomePage />}
      />

      {/* 채팅 페이지 */}
      <Route
        path="/chat"
        element={<ChatPage />}
      />

      {/* 리포트 페이지 */}
      <Route
        path="/analytics"
        element={<AnalyticsPage />}
      />

      <Route
        path="/analytics/:slug"
        element={<AnalyticsPage />}
      />

      {/* 촬영 페이지 */}
      <Route
        path="/camera"
        element={<CameraPage />}
      />

      {/* 촬영 사진 확인 */}
      <Route
        path="/camera/confirm"
        element={<PhotoConfirmPage />}
      />

      {/*
        화보 공개 주소

        LookbookPage 내부에서 아직 생성 중이면
        LookbookLoadingPage를 렌더링하고,
        완료되면 화보 화면을 렌더링합니다.
      */}
      <Route
        path="/l/:shareSlug"
        element={<LookbookPage />}
      />

      {/*
        기존 코드나 저장된 주소 호환용입니다.
        share_slug가 sessionStorage에 있으면
        LookbookPage가 해당 값을 사용합니다.
      */}
      <Route
        path="/lookbook"
        element={<LookbookPage />}
      />

      {/* Layout을 사용하는 매장 페이지 */}
      <Route element={<Layout />}>
        <Route
          path="/map"
          element={<MapPage />}
        />

        <Route
          path="/shelf/:zoneId"
          element={<ShelfPage />}
        />

        <Route
          path="/product/:productId"
          element={<ProductPage />}
        />

        <Route
          path="/guide"
          element={<GuidePage />}
        />
      </Route>
    </Routes>
  );
}

export default Router;
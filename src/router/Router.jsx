import {
  Route,
  Routes,
  useNavigate, useLocation
} from "react-router-dom";
import { useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { getVisitId } from "../utils/storage";

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
import AnalyticsLoadingPage from "../pages/AnalyticsLoadingPage";

function Router() {
  const navigate = useNavigate();
  const location = useLocation();

  // ⭐️ visit_id 검사 및 리다이렉트 로직
  useEffect(() => {
    // 1. 검사를 건너뛸 '공개 페이지' 경로 설정 (랜딩 페이지, 로딩, 공유된 화보 주소 등)
    // 화보 공유 주소(/lookbook/...)는 방문 ID가 없는 외부 사용자가 여는 링크다.
    // 구 주소(/l/...)만 열어두면 실제 공유 주소가 랜딩으로 튕긴다.
    const isPublicPage =
      location.pathname === "/" ||
      location.pathname === "/lookbook-loading-preview" ||
      location.pathname.startsWith("/l/") ||
      location.pathname.startsWith("/lookbook");

    // 2. 공개 페이지가 아닌데(즉, 매장이나 챗봇 화면인데)
    if (!isPublicPage) {
      const visitId = getVisitId();

      // 3. visitId가 없으면 랜딩 페이지로 쫓아냄
      if (!visitId) {
        console.warn("⚠️ visit_id가 존재하지 않아 랜딩 페이지로 이동합니다.");
        // replace: true를 넣으면 뒤로가기 버튼을 눌러도 다시 튕기지 않아 깔끔합니다.
        navigate("/", { replace: true });
      }
    }
  }, [location.pathname, navigate]);

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
    path="/analytics-loading" 
    element={<AnalyticsLoadingPage />} />

      <Route
        path="/analytics/:slug?"
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
        path="/lookbook/:shareSlug"
        element={<LookbookPage />}
      />

      {/* 이전 공유 주소 호환용 */}
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

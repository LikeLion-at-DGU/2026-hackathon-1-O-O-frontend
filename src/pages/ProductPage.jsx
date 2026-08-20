// src/pages/ProductPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import * as S from "../components/Shelf/Shelf.style";
import ProductInfo from "../components/Product/ProductInfo";
import BackButton from "../components/Shelf/icon/BackButton";
import useProductDetail from "../hooks/useProductDetail";

function ProductPage() {
    const { productId } = useParams();
    const navigate = useNavigate();

    // 커스텀 훅으로 비즈니스 로직 및 이벤트 바인딩 처리
    const { product, productName, productImage, loading } = useProductDetail(productId);

    return (
        <S.PageContainer>
        {/* 선반과 100% 동일한 기준 박스 — 부모(Layout Content)가 데스크톱에선 363x300,
            모바일에선 화면 폭에 맞춰 줄어들므로 100%로 따라간다 */}
        <div
            style={{
            position: "relative",
            width: "100%",
            maxWidth: "363px",
            height: "100%",
            maxHeight: "300px",
            }}
        >
            {/* 선반 레이아웃과 일치하는 좌측 상단 백버튼 */}
            <div style={{ position: "absolute", top: "9px", left: "8px", zIndex: 50 }}>
            <BackButton onClick={() => navigate(-1)} />
            </div>

            <ProductInfo
            product={product}
            productName={productName}
            productImage={productImage}
            loading={loading}
            />
        </div>
        </S.PageContainer>
    );
}

export default ProductPage;
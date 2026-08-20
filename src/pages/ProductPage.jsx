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
        {/* 선반과 100% 동일한 363x300 기준 박스 */}
        <div
            style={{
            position: "relative",
            width: "363px",
            height: "300px",
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
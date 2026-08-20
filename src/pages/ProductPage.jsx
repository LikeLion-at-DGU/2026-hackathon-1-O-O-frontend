// src/pages/ProductPage.jsx
import { useParams, useNavigate } from "react-router-dom";

import useChatStore from "../stores/useChatStore";
import * as S from "../components/Shelf/Shelf.style";
import { shelfData } from "../components/Shelf/ShelfData";

import useProduct from "../hooks/useProduct";
import useProductEvent from "../hooks/useProductEvent";
import { useDwellTimer } from "../hooks/useDwellTimer";

import ProductInfo from "../components/Product/ProductInfo";
import BackButton from "../components/Shelf/icon/BackButton";
import { getLocalProductImage } from "../utils/productImage";

function ProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const imageId = productId?.replace("p-", "");

  const { product, loading } = useProduct(productId);

  // 서버 images는 리스트다. 이전 코드는 images.thumbnail/main을 읽어 항상
  // undefined였고, 서버 이미지가 한 번도 표시되지 않았다. 로컬 파일명은
  // 서버 id 형식(p_101-Photoroom.png)과 같아 productId를 그대로 쓴다.
  const productImage =
    product?.images?.[0] ??
    getLocalProductImage(productId);

  useProductEvent(productId);

  const selectedProduct = useChatStore((state) => state.selectedProduct);

  const localProduct = Object.values(shelfData)
    .flat()
    .find((item) => String(item.id) === String(productId));
// 데이터가 들어오는 곳에 추가해 보세요
  const productName =
    product?.name ??
    selectedProduct?.name ??
    localProduct?.name ??
    `상품 ${imageId}`;

  useDwellTimer({
    eventType: "product_dwell",
    targetId: productId,
    extra: {
      product_name: productName,
      scene_id: product?.scene_id || selectedProduct?.scene_id,
    },
    minDwellMs: 1000,
  });

  return (
    <S.PageContainer>
      {/* ⭐️ 선반과 100% 동일한 363x300 기준 박스 */}
      <div
        style={{
          position: "relative",
          width: "363px",
          height: "300px",
        }}
      >
        {/* ⭐️ 선반과 1픽셀 오차도 없는 정확한 좌측 상단 백버튼 위치 */}
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

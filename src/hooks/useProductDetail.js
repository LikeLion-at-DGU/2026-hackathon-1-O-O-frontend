// src/hooks/useProductDetail.js
import useChatStore from "../stores/useChatStore";
import { shelfData } from "../components/Shelf/ShelfData";
import useProduct from "./useProduct";
import useProductEvent from "./useProductEvent";
import { useDwellTimer } from "./useDwellTimer";
import { getLocalProductImage } from "../utils/productImage";

export function useProductDetail(productId) {
    const imageId = productId?.replace("p-", "");

    // 1. 상품 상세 정보 조회
    const { product, loading } = useProduct(productId);

    // 2. 상품 이미지 결정 (서버 첫 번째 이미지 -> 로컬 정적 에셋 폴백)
    const productImage =
        product?.images?.[0] ??
        getLocalProductImage(productId);

    // 3. 상품 상세 조회 이벤트 전송
    useProductEvent(productId);

    const selectedProduct = useChatStore((state) => state.selectedProduct);

    // 4. 로컬 정적 데이터 매핑 조회
    const localProduct = Object.values(shelfData)
        .flat()
        .find((item) => String(item.id) === String(productId));

    // 5. 상품명 추출 (서버 -> 전역 상태 -> 로컬 정적 데이터 -> 기본 텍스트)
    const productName =
        product?.name ??
        selectedProduct?.name ??
        localProduct?.name ??
        `상품 ${imageId}`;

    // 6. 상품 체류 시간(product_dwell) 측정
    useDwellTimer({
        eventType: "product_dwell",
        targetId: productId,
        extra: {
        product_name: productName,
        scene_id: product?.scene_id || selectedProduct?.scene_id,
        },
        minDwellMs: 1000,
    });

    return {
        product,
        productName,
        productImage,
        loading,
    };
}

export default useProductDetail;
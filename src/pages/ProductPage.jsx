    import React from "react";
    import { useParams } from "react-router-dom";
    import { createPortal } from "react-dom";

    import useChatStore from "../stores/useChatStore";
    import * as S from "../components/Shelf/Shelf.style";
    import { MessageBubble } from "../components/ChatMessage/ChatMessage.styled";
    import { shelfData } from "../components/Shelf/ShelfData";

    import useProduct from "../hooks/useProduct";
    import useProductEvent from "../hooks/useProductEvent";
    import { useDwellTimer } from "../hooks/useDwellTimer"; // ⭐️ 체류시간 훅 추가

    import ProductInfo from "../components/Product/ProductInfo";

    function ProductPage() {
    const { productId } = useParams();

    const imageId = productId?.replace("p-", "");

    const { product, loading } = useProduct(productId);

    const productImage =
        product?.thumbnail ??
        product?.images?.thumbnail ??
        product?.images?.main ??
        `/images/${imageId}-Photoroom.png`;

    const { sendQuestionClick } = useProductEvent(productId);

    const selectedProduct = useChatStore((state) => state.selectedProduct);

    // shelfData에서 현재 상품 찾기
    const localProduct = Object.values(shelfData)
        .flat()
        .find((item) => String(item.id) === String(productId));

    const productName =
        product?.name ??
        selectedProduct?.name ??
        localProduct?.name ??
        `상품 ${imageId}`;

    // ⭐️ [핵심] 상품 체류시간(product_dwell) 측정
    // 상세 화면을 보다가 뒤로가거나 다른 페이지로 나갈 때 총 머문 시간 전송
    useDwellTimer({
        eventType: "product_dwell",
        targetId: productId,
        extra: {
        product_name: productName,
        scene_id: product?.scene_id || selectedProduct?.scene_id,
        },
        minDwellMs: 1000, // 1초 이상 머물렀을 때 전송
    });

    const handleQuestionClick = async (question) => {
        await sendQuestionClick(question);
        console.log(`${productName}에 대한 질문: ${question}`);
    };

    const chatSlot = document.getElementById("chat-bottom-slot");

    return (
        <S.PageContainer>
        <ProductInfo
            product={product}
            productName={productName}
            productImage={productImage}
            productId={productId}
            imageId={imageId}
            loading={loading}
        />
        </S.PageContainer>
    );
    }

    export default ProductPage;
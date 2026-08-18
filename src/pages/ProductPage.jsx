import React from "react";
import { useParams } from "react-router-dom";
import { createPortal } from "react-dom";

import useChatStore from "../stores/useChatStore";

import * as S from "../components/Shelf/Shelf.style";
import { MessageBubble } from "../components/ChatMessage/ChatMessage.styled";

import { shelfData } from "../components/Shelf/ShelfData";

import useProduct from "../hooks/useProduct";
import useProductEvent from "../hooks/useProductEvent";

import ProductInfo from "../components/Product/ProductInfo";

function ProductPage() {
    const { productId } = useParams();

    const imageId = productId?.replace("p-", "");

    const { product, loading } =
        useProduct(productId);

    const productImage =
        product?.thumbnail ??
        product?.images?.thumbnail ??
        product?.images?.main ??
        `/images/${imageId}-Photoroom.png`;

    const { sendQuestionClick } =
        useProductEvent(productId);

    const selectedProduct = useChatStore(
        (state) => state.selectedProduct
    );

    // shelfData에서 현재 상품 찾기
    const localProduct = Object.values(shelfData)
        .flat()
        .find(
            (item) =>
                String(item.id) ===
                String(productId)
        );

    const productName =
        product?.name ??
        selectedProduct?.name ??
        localProduct?.name ??
        `상품 ${imageId}`;

    const handleQuestionClick = async (question) => {
        await sendQuestionClick(question);

        console.log(
            `${productName}에 대한 질문: ${question}`
        );
    };

    const chatSlot =
        document.getElementById(
            "chat-bottom-slot"
        );

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

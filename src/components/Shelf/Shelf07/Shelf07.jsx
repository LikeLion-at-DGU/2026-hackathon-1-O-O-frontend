import React from "react";
import * as S from "./Shelf07.style";

export default function Shelf07({ products = [], onProductClick }) {
  // 📌 기둥 높이 (좌측부터: 낮음, 가장 높음, 중간)
    const PEDESTAL_HEIGHTS = [110, 170, 135];

    const handleItemClick = (product) => {
        if (product && onProductClick) {
        onProductClick(product);
        }
    };

    return (
        <S.Container>
        {products.slice(0, 3).map((product, index) => (
            <S.ItemWrapper key={product?.id || index}>
            {/* 상품 이미지 (있을 경우에만 렌더링) */}
            {product && (
                <S.ProductImage
                src={product.image}
                alt={product.name}
                onClick={() => handleItemClick(product)}
                />
            )}
            
            {/* 하단 기둥 (단상) */}
            <S.Pedestal $height={PEDESTAL_HEIGHTS[index]} />
            </S.ItemWrapper>
        ))}
        </S.Container>
    );
}
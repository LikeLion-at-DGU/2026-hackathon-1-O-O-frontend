import React from "react";
import * as S from "./Shelf07.style";

export default function Shelf07({ products = [], onProductClick }) {
  // 📌 기둥 높이 (좌측부터: 낮음, 가장 높음, 중간)
    const PEDESTAL_HEIGHTS = [95, 150, 120];

    const handleItemClick = (product) => {
        if (product && onProductClick) {
        onProductClick(product);
        }
    };

    return (
        <S.OuterFrame>
            <S.InnerBackground>
                {products.slice(0, 3).map((product, index) => (
                <S.ItemWrapper key={product?.id || index}>
                    {product && (
                    <S.ProductImage
                        src={product.imageUrl}
                        alt={product.name}
                        onClick={() => handleItemClick(product)}
                    />
                    )}
                    <S.Pedestal $height={PEDESTAL_HEIGHTS[index]} />
                </S.ItemWrapper>
                ))}
            </S.InnerBackground>
        </S.OuterFrame>
    );
}
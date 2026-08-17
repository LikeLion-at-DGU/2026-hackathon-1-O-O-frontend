import React from "react";
import * as S from "./Shelf05.style";

function Shelf05({
  products = [],
  onProductClick,
}) {
  const renderProduct = (product, slotIndex) => (
    <S.ProductSlot
      key={slotIndex}
      $clickable={Boolean(product)}
      $slotIndex={slotIndex}
      onClick={() => {
        if (product) {
          onProductClick?.(product);
        }
      }}
    >
      {product?.imageUrl && (
        <S.ProductImage
          src={product.imageUrl}
          alt={product.name ?? "상품"}
          $slotIndex={slotIndex}
        />
      )}
    </S.ProductSlot>
  );

  return (
    <S.Container>
      <S.ShelfRow>
        {[0, 1, 2, 3, 4, 5].map((slotIndex) =>
          renderProduct(
            products[slotIndex],
            slotIndex
          )
        )}
      </S.ShelfRow>
    </S.Container>
  );
}

export default Shelf05;
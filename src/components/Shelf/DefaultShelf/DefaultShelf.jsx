import React from "react";
import * as S from "./DefaultShelf.style";

function DefaultShelf({
  products = [],
  onProductClick,
}) {
  const shelvesList = [
    products.slice(0, 3),
    products.slice(3, 6),
    products.slice(6, 9),
  ];

  return (
    <S.Container>
      {shelvesList.map(
        (tierProducts, tierIndex) => (
          <S.Tier key={tierIndex}>
            {[0, 1, 2].map((slotIndex) => {
              const product =
                tierProducts[slotIndex];

              return (
                <S.ProductSlot
                  key={slotIndex}
                  $clickable={Boolean(product)}
                  onClick={() =>
                    product &&
                    onProductClick?.(product)
                  }
                >
                  {product?.imageUrl && (
                    <S.ProductImage
                      src={product.imageUrl}
                      alt={
                        product.name ??
                        `상품 ${slotIndex + 1}`
                      }
                    />
                  )}

                  {!product?.imageUrl &&
                    product?.icon}

                  {!product?.imageUrl &&
                    !product?.icon &&
                    product?.name && (
                      <S.ProductName>
                        {product.name}
                      </S.ProductName>
                    )}
                </S.ProductSlot>
              );
            })}
          </S.Tier>
        )
      )}
    </S.Container>
  );
}

export default DefaultShelf;
import React from "react";
import * as S from "./Shelf04.style";

function Shelf04({
  products = [],
  onProductClick,
}) {
  // 왼쪽 9개
  const leftProducts = products.slice(0, 9);

  // 오른쪽 9개
  const rightProducts = products.slice(9, 18);

  const leftRows = [
    leftProducts.slice(0, 3),
    leftProducts.slice(3, 6),
    leftProducts.slice(6, 9),
  ];

  const rightRows = [
    rightProducts.slice(0, 3),
    rightProducts.slice(3, 6),
    rightProducts.slice(6, 9),
  ];

  const renderProduct = (
    product,
    key,
    side,
    rowIndex,
    slotIndex
  ) => (
    <S.ProductSlot
      key={key}
      $clickable={Boolean(product)}
      $side={side}
      $rowIndex={rowIndex}
      $slotIndex={slotIndex}
      onClick={() =>
        product &&
        onProductClick?.(product)
      }
    >
      {product?.imageUrl && (
        <S.ProductImage
          src={product.imageUrl}
          alt={product.name ?? "상품"}
          $side={side}
          $rowIndex={rowIndex}
          $slotIndex={slotIndex}
        />
      )}
    </S.ProductSlot>
  );

  return (
    <S.Container>
      {/* 왼쪽 선반 */}
      <S.LeftShelf>
        {leftRows.map(
          (rowProducts, rowIndex) => (
            <S.ShelfRow
              key={rowIndex}
              $side="left"
              $rowIndex={rowIndex}
            >
              {[0, 1, 2].map(
                (slotIndex) =>
                  renderProduct(
                    rowProducts[slotIndex],
                    `left-${rowIndex}-${slotIndex}`,
                    "left",
                    rowIndex,
                    slotIndex
                  )
              )}
            </S.ShelfRow>
          )
        )}
      </S.LeftShelf>

      {/* 오른쪽 선반 */}
      <S.RightShelf>
        {rightRows.map(
          (rowProducts, rowIndex) => (
            <S.ShelfRow
              key={rowIndex}
              $side="right"
            >
              {[0, 1, 2].map(
                (slotIndex) =>
                  renderProduct(
                    rowProducts[slotIndex],
                    `right-${rowIndex}-${slotIndex}`,
                    "right",
                    rowIndex,
                    slotIndex
                  )
              )}
            </S.ShelfRow>
          )
        )}
      </S.RightShelf>
    </S.Container>
  );
}

export default Shelf04;
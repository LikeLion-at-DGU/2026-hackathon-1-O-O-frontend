import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { shelfData } from "./ShelfData";
import useChatStore from "../../stores/useChatStore";

import DefaultShelf from "./DefaultShelf/DefaultShelf";
import Shelf04 from "./Shelf04/Shelf04";

export default function Shelf() {
  const { zoneId } = useParams();
  const navigate = useNavigate();

  const selectProduct = useChatStore(
    (state) => state.selectProduct
  );

  const currentZoneId = Number(zoneId);

  const products =
    shelfData[zoneId] ||
    shelfData[currentZoneId] ||
    [];

  const handleProductClick = (product) => {
    if (!product) return;

    console.log("상품 클릭:", product);

    selectProduct(product);

    navigate(`/product/${product.id}`);
  };

  // 4번 선반
  if (currentZoneId === 4) {
    return (
      <Shelf04
        products={products}
        onProductClick={handleProductClick}
      />
    );
  }

  // 기본 선반
  // 현재는 1, 2, 3번 + 아직 별도 디자인이 없는 선반에서 사용
  return (
    <DefaultShelf
      products={products}
      onProductClick={handleProductClick}
    />
  );
}
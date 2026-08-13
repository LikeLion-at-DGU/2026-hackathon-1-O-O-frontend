import React from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { SHELF_DATA_BY_ZONE } from "./ShelfData";
import { shelfStyles } from "./Shelf.style";
import useChatStore from "../../stores/useChatStore";

export default function Shelf() {
  const { zoneId } = useParams();
  const navigate = useNavigate();

  const selectProduct = useChatStore(
    (state) => state.selectProduct
  );

  const products =
    SHELF_DATA_BY_ZONE[zoneId] ??
    SHELF_DATA_BY_ZONE.default;

  const handleProductClick = (product) => {
    if (!product) return;

    console.log(
      `구역 ${zoneId}의 상품 클릭됨: ID ${product.id}`
    );

    // 선택한 상품을 Zustand에 저장
    selectProduct(product);

    // 저장한 직후 상품 상세 페이지로 이동
    navigate(`/product/${product.id}`);
  };

  return (
    <div style={shelfStyles.container}>
      {/* 1단 상단 */}
      <div style={shelfStyles.tier}>
        <div
          onClick={() =>
            handleProductClick(products[0])
          }
          style={shelfStyles.productSlot}
        >
          {products[0]?.icon}
        </div>

        <div
          onClick={() =>
            handleProductClick(products[1])
          }
          style={shelfStyles.productSlot}
        >
          {products[1]?.icon}
        </div>
      </div>

      {/* 2단 하단 */}
      <div style={shelfStyles.tier}>
        <div
          onClick={() =>
            handleProductClick(products[2])
          }
          style={shelfStyles.productSlot}
        >
          {products[2]?.icon}
        </div>

        <div
          onClick={() =>
            handleProductClick(products[3])
          }
          style={shelfStyles.productSlot}
        >
          {products[3]?.icon}
        </div>
      </div>
    </div>
  );
}
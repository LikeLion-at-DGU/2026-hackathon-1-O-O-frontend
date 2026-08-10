import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SHELF_DATA_BY_ZONE } from "./shelfData";
import { shelfStyles } from "./Shelf.style";

export default function Shelf() {
  const { zoneId } = useParams();
  const navigate = useNavigate();

  // shelfData에서 해당 zoneId의 데이터 가져오기
  const products = SHELF_DATA_BY_ZONE[zoneId] || SHELF_DATA_BY_ZONE.default;

  // 상품 클릭 핸들러 (상품 상세 페이지로 이동)
  const handleProductClick = (productId) => {
    if (productId) {
      console.log(`구역 ${zoneId}의 상품 클릭됨: ID ${productId}`);
      navigate(`/product/${productId}`);
    }
  };

  return (
    <div style={shelfStyles.container}>
      {/* // 1단 상단 */}
      <div style={shelfStyles.tier}>
        {/* // 상단 왼쪽 (1번) */}
        <div
          onClick={() => handleProductClick(products[0]?.id)}
          style={shelfStyles.productSlot}
        >
          {products[0]?.icon}
        </div>

        {/* // 상단 오른쪽 (2번) */}
        <div
          onClick={() => handleProductClick(products[1]?.id)}
          style={shelfStyles.productSlot}
        >
          {products[1]?.icon}
        </div>
      </div>

      {/* // 2단 하단 */}
      <div style={shelfStyles.tier}>
        {/* // 하단 왼쪽 (3번) */}
        <div
          onClick={() => handleProductClick(products[2]?.id)}
          style={shelfStyles.productSlot}
        >
          {products[2]?.icon}
        </div>

        {/* // 하단 오른쪽 (4번) */}
        <div
          onClick={() => handleProductClick(products[3]?.id)}
          style={shelfStyles.productSlot}
        >
          {products[3]?.icon}
        </div>
      </div>
    </div>
  );
}
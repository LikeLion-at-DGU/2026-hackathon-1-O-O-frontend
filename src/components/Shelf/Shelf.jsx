import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { shelfData } from "./ShelfData";
import { shelfStyles } from "./Shelf.style";
import useChatStore from "../../stores/useChatStore";

export default function Shelf() {
  const { zoneId } = useParams();
  const navigate = useNavigate();

  const selectProduct = useChatStore((state) => state.selectProduct);

  // 1. zoneId로 데이터 찾기 (문자열/숫자 타입 불일치 방지 및 배열 형태 지원)
  let currentZone = null;

  if (Array.isArray(shelfData)) {
    // shelfData가 배열 형태일 때 ([ { zoneId: 1, ... } ])
    currentZone = shelfData.find(
      (item) => String(item.zoneId || item.id) === String(zoneId)
    );
  } else if (shelfData && typeof shelfData === "object") {
    // shelfData가 객체 형태일 때 ({ "1": [...], default: [...] })
    currentZone = shelfData[zoneId] || shelfData[Number(zoneId)] || shelfData.default;
  }

  // 2. 3단 선반 리스트 추출
  let shelvesList = [];

  if (currentZone?.shelves) {
    // { shelves: [ { products: [...] }, ... ] } 구조인 경우
    shelvesList = currentZone.shelves.map((s) => s.products || []);
  } else if (Array.isArray(currentZone)) {
    // 9개 상품이 일렬로 들어있는 평탄한 배열인 경우
    shelvesList = [
      currentZone.slice(0, 3),
      currentZone.slice(3, 6),
      currentZone.slice(6, 9),
    ];
  } else {
    // 데이터가 아예 없을 때도 빈 선반 3개 렌더링 유지
    shelvesList = [[], [], []];
  }

  const handleProductClick = (product) => {
    if (!product) return;
    console.log(`상품 클릭:`, product);
    selectProduct(product);
    navigate(`/product/${product.id}`);
  };

  return (
    <div style={shelfStyles.container}>
      {shelvesList.slice(0, 3).map((tierProducts, tierIndex) => (
        <div key={tierIndex} style={shelfStyles.tier}>
          {[0, 1, 2].map((slotIndex) => {
            const product = tierProducts[slotIndex];
            return (
              <div
                key={slotIndex}
                onClick={() => handleProductClick(product)}
                style={{
                  ...shelfStyles.productSlot,
                  cursor: product ? "pointer" : "default",
                }}
              >
                {/* 1. 상품 이미지 렌더링 */}
                {product?.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name ?? `상품 ${slotIndex + 1}`}
                    style={{
                      width: "100%",
                      maxHeight: "86px",
                      objectFit: "contain",
                    }}
                  />
                )}

                {/* 2. 아이콘 또는 텍스트 렌더링 (이미지가 없을 때) */}
                {!product?.imageUrl && product?.icon}
                {!product?.imageUrl && !product?.icon && product?.name && (
                  <span style={{ fontSize: "12px" }}>{product.name}</span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
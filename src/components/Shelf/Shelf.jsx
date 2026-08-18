import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { shelfData } from "./ShelfData";
import useChatStore from "../../stores/useChatStore";

import DefaultShelf from "./DefaultShelf/DefaultShelf";
import Shelf04 from "./Shelf04/Shelf04";
import BackButton from "./icon/BackButton";
import { sendEvent } from "../../api/events";
import Shelf07 from "./Shelf07/Shelf07";
import Shelf05 from "./Shelf05/Shelf05";

const ZONES = [1, 2, 3, 4, 5, 6, 7];
const clamp = (v) => Math.max(1, Math.min(7, Number(v) || 1));

export default function Shelf() {
  const { zoneId } = useParams();
  const navigate = useNavigate();
  const swiperRef = useRef(null);

  const selectShelf = useChatStore((s) => s.selectShelf);
  const selectProduct = useChatStore((s) => s.selectProduct);

  const urlZone = clamp(zoneId);

  // 이 컴포넌트가 "직접 URL에 써넣은" 구역. 이 값과 URL이 같으면 내가 만든 변경이므로 무시.
  const selfWroteZoneRef = useRef(urlZone);
  // Swiper의 실제 현재 위치
  const swiperZoneRef = useRef(urlZone);

  // URL → Swiper: 오직 "외부發" 변경만 반영 (지도 클릭 / 뒤로가기)
  useEffect(() => {
    if (urlZone === selfWroteZoneRef.current) return; // 내가 쓴 URL → 되밀지 않음
    if (urlZone === swiperZoneRef.current) return;    // 이미 그 위치 → 할 일 없음

    selfWroteZoneRef.current = urlZone;
    swiperZoneRef.current = urlZone;
    // 3번째 인자 false = 콜백 미발생 → onSlideChange 계열이 아예 안 터짐
    swiperRef.current?.slideTo(urlZone - 1, 0, false);
  }, [urlZone]);

  // 슬라이드가 "완전히 멈춘" 뒤 1회만
  const handleSettled = (swiper) => {
    const zone = (swiper.realIndex ?? swiper.activeIndex) + 1;
    if (zone === swiperZoneRef.current) return;

    swiperZoneRef.current = zone;
    selfWroteZoneRef.current = zone;   // ⚠️ navigate보다 먼저 기록해야 effect가 무시함

    selectShelf(zone);                 // 스토어 가드가 중복을 최종 차단
    navigate(`/shelf/${zone}`, { replace: true });
  };

  const handleProductClick = async (product) => {
  if (!product) return;

  const visitId = sessionStorage.getItem("visit_id");

  // 상품 클릭 이벤트 저장
  if (visitId) {
    await sendEvent({
      visit_id: visitId,
      event_type: "PRODUCT_CLICK",
      product_id: product.id,
    });
  }

  selectProduct(product);
  navigate(`/product/${product.id}`);
};

  return (
    <div
      style={{
        width: "100%",
        height: "300px",
        backgroundColor: "#FFFFFF",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <style>
        {`
          .swiper-pagination { pointer-events: none; }
          .swiper-pagination-bullet { pointer-events: auto; }
        `}
      </style>

      <BackButton onClick={() => navigate("/map")} />

      <Swiper
        modules={[Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        initialSlide={urlZone - 1}
        threshold={15}
        speed={250}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          swiperZoneRef.current = swiper.activeIndex + 1;
        }}
        onSlideChangeTransitionEnd={handleSettled}
        style={{
          width: "100%",
          height: "100%",
          "--swiper-pagination-color": "#222",
          "--swiper-pagination-bullet-inactive-color": "#E5E3E0",
          "--swiper-pagination-bullet-inactive-opacity": "1",
          "--swiper-pagination-bullet-size": "5px",
          "--swiper-pagination-bottom": "4px",
          "--swiper-pagination-bullet-horizontal-gap": "2.5px",
        }}
      >
        {ZONES.map((zone) => {
          const products = shelfData[zone] || [];
          return (
            <SwiperSlide key={zone}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <div style={{ width: "363px", height: "300px", position: "relative" }}>
                  {zone === 4 ? (
                  <Shelf04
                  products={products}
                  onProductClick={handleProductClick}
                  />
                  ) : zone === 5 || zone === 6 ? (
                  <Shelf05
                  products={products}
                  onProductClick={handleProductClick}
                  />
                  )
                   : zone === 7 ? (
                  <Shelf07
                  products={products}
                  onProductClick={handleProductClick}
                  />
                  ) : (
                  <DefaultShelf
                  products={products}
                  onProductClick={handleProductClick}
                  />
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

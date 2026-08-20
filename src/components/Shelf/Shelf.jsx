// src/components/Shelf/Shelf.jsx
import { useEffect, useRef, useState } from "react";
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
import { createChatMessage } from "../../api/chat";
import { getVisitId, isVisitFinished } from "../../utils/storage";
import Shelf07 from "./Shelf07/Shelf07";
import Shelf05 from "./Shelf05/Shelf05";

const ZONES = [1, 2, 3, 4, 5, 6, 7];
const clamp = (v) => Math.max(1, Math.min(7, Number(v) || 1));

export default function Shelf() {
  const { zoneId } = useParams();
  const navigate = useNavigate();
  const swiperRef = useRef(null);
  const [serverScenes] = useState(() => {
    try {
      return JSON.parse(
        sessionStorage.getItem("scenes") ?? "[]"
      );
    } catch (error) {
      console.error("선반 데이터 파싱 실패:", error);
      return [];
    }
  });

  const selectShelf = useChatStore((s) => s.selectShelf);
  const selectProduct = useChatStore((s) => s.selectProduct);
  const addServerMessages = useChatStore((s) => s.addServerMessages);

  const urlZone = clamp(zoneId);

  const selfWroteZoneRef = useRef(urlZone);
  const swiperZoneRef = useRef(urlZone);

  useEffect(() => {
    if (urlZone === selfWroteZoneRef.current) return;
    if (urlZone === swiperZoneRef.current) return;

    selfWroteZoneRef.current = urlZone;
    swiperZoneRef.current = urlZone;
    swiperRef.current?.slideTo(urlZone - 1, 0, false);
  }, [urlZone]);

  // 인접 진열대 이미지를 미리 디코드한다. 캐시가 빈 상태에서 6→7처럼 넘어가면
  // 다음 존 이미지가 전환 도중 뒤늦게 떠서 튀어 보인다. 표시 가능성이 높은
  // 양옆 존만 대상으로 하고, 실패해도 화면 동작에는 영향이 없다.
  useEffect(() => {
    [urlZone - 1, urlZone + 1]
      .filter((zone) => zone >= 1 && zone <= 7)
      .forEach((zone) => {
        const scene = serverScenes.find((item) => Number(item.no) === zone);
        const sources = scene
          ? (scene.products ?? []).map(
              (product) => `/images/${product.product_id ?? product.id}-Photoroom.png`
            )
          : (shelfData[zone] || []).map((product) => product.imageUrl);

        sources.forEach((src) => {
          const image = new Image();
          image.src = src;
          image.decode?.().catch(() => {});
        });
      });
  }, [urlZone, serverScenes]);

  const handleSettled = async (swiper) => {
    const zone = (swiper.realIndex ?? swiper.activeIndex) + 1;
    if (zone === swiperZoneRef.current) return;

    swiperZoneRef.current = zone;
    selfWroteZoneRef.current = zone;

    selectShelf(zone);
    navigate(`/shelf/${zone}`, { replace: true });
  };

  const handleProductClick = async (product) => {
    if (!product) return;

    const visitId = getVisitId();

    if (visitId) {
      await sendEvent({
        visit_id: visitId,
        event_type: "hotspot_click",
        product_id: product.id,
      });
    }

    // 관람 종료 후에는 채팅이 닫혀(403) 기록하지 않는다 — ShelfPage의
    // scene_click 가드와 같은 규칙이다.
    if (product.scene_id && !isVisitFinished()) {
      try {
        const response = await createChatMessage({
          type: "product_click",
          scene_id: product.scene_id,
          product_id: product.id,
        });
        addServerMessages(response.data.messages ?? []);
      } catch (error) {
        console.error("Product click recording failed:", error);
      }
    }

    selectProduct(product);
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "transparent", /* ⭐️ 바깥 거대 배경 완전 제거 */
      }}
    >

<style>
  {`
    /* 1. 점 전체 묶음 위치 */
    .swiper-pagination {
      bottom: 8px !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      gap: 4px !important; /* ⭐️ 점 사이 간격 4px */
    }

    /* 2. 기본 비활성 점 (차분한 소프트 웜그레이) */
    .swiper-pagination-bullet {
      width: 4px !important;  /* ⭐️ 사이즈 4px */
      height: 4px !important; /* ⭐️ 사이즈 4px */
      background-color: #BDB9B4 !important;
      opacity: 1 !important;
      margin: 0 !important;
      border-radius: 50% !important;
      transition: all 0.2s ease;
    }

    /* 3. 활성화된 점 (단정하고 고급스러운 딥 차콜 그레이) */
    .swiper-pagination-bullet-active {
      width: 4px !important;
      height: 4px !important;
      background-color: #383533 !important; /* ⭐️ 어두운 웜 차콜 */
      opacity: 1 !important;
    }
  `}
</style>
      {/* ⭐️ 선반 카드 영역 (363px 규격 안에 뒤로가기 버튼 + Swiper를 묶음) */}
      <div
        style={{
          position: "relative",
          width: "363px",
          height: "300px",
        }}
      >
        {/* 선반 내부 좌측 상단 뒤로가기 버튼 */}
        <div style={{ position: "absolute", top: "9px", left: "8px", zIndex: 50 }}>
          <BackButton onClick={() => navigate("/map")} />
        </div>

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
          }}
          onSlideChangeTransitionEnd={handleSettled}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          {ZONES.map((zone) => {
            const scene = serverScenes.find((item) => Number(item.no) === zone);

            const products = scene
              ? (scene.products ?? [])
                  .filter((product) => {
                    const prodId = product.product_id ?? product.id;
                    return !["p_607", "p_608", "p_609"].includes(prodId);
                  })
                  .map((product) => {
                    const prodId = product.product_id ?? product.id;
                    return {
                      id: prodId,
                      name: product.name,
                      price: product.price,
                      imageUrl: `/images/${prodId}-Photoroom.png`,
                      scene_id: scene.scene_id,
                    };
                  })
              : shelfData[zone] || [];

            return (
              <SwiperSlide
                key={zone}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  // 슬라이드 내용이 전환 중 옆 슬라이드 영역으로 새지 않게 한다
                  overflow: "hidden",
                }}
              >
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
                ) : zone === 7 ? (
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
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

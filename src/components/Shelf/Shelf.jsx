import React, { useEffect, useRef, useState } from "react";
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
import Shelf07 from "./Shelf07/Shelf07";
import Shelf05 from "./Shelf05/Shelf05";

const ZONES = [1, 2, 3, 4, 5, 6, 7];
const clamp = (v) => Math.max(1, Math.min(7, Number(v) || 1));

const SHELF_COUNTS = [9, 9, 9, 18, 6, 6, 3];

export default function Shelf() {
  const { zoneId } = useParams();
  const navigate = useNavigate();
  const swiperRef = useRef(null);
  const [serverScenes, setServerScenes] = useState([]);

  const selectShelf = useChatStore((s) => s.selectShelf);
  const selectProduct = useChatStore((s) => s.selectProduct);
  const addServerMessages = useChatStore((s) => s.addServerMessages);

  const urlZone = clamp(zoneId);

 useEffect(() => {
    try {
      const parsedScenes = JSON.parse(sessionStorage.getItem("scenes") ?? "[]");
      setServerScenes(parsedScenes);

      // ⭐️ 60개 상품 전수 검사 콘솔 표 출력
      let globalIndex = 0;
      const allProductList = [];

      parsedScenes.forEach((sceneItem) => {
        const shelfNo = sceneItem.no ?? sceneItem.scene_no ?? "미정";
        const productList = sceneItem.products ?? sceneItem.items ?? [];

        productList.forEach((prod, pIdx) => {
          globalIndex += 1;
          allProductList.push({
            "전체 순번": globalIndex,
            "선반": `${shelfNo}번 선반`,
            "선반 내 순서": `${pIdx + 1}번째`,
            "product_id": prod.product_id ?? prod.id,
            "상품명": prod.name,
            "가격": prod.price,
            "매핑될 이미지": `${globalIndex}-Photoroom.png`,
          });
        });
      });

      console.group("📦 [전체 상품 60개 product_id 전수 검사 표]");
      console.table(allProductList);
      console.log("총 상품 개수:", allProductList.length, "개");
      console.groupEnd();
    } catch {
      setServerScenes([]);
    }
  }, []);

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
  const handleSettled = async (swiper) => {
    const zone = (swiper.realIndex ?? swiper.activeIndex) + 1;
    if (zone === swiperZoneRef.current) return;

    swiperZoneRef.current = zone;
    selfWroteZoneRef.current = zone;   // ⚠️ navigate보다 먼저 기록해야 effect가 무시함

    selectShelf(zone);                 // 스토어 가드가 중복을 최종 차단
    const scene = serverScenes.find((item) => Number(item.no) === zone);
    if (scene?.scene_id) {
      try {
        const response = await createChatMessage({ type: "scene_click", scene_id: scene.scene_id });
        addServerMessages(response.data.messages ?? []);
      } catch (error) {
        console.error("Scene click recording failed:", error);
      }
    }
    navigate(`/shelf/${zone}`, { replace: true });
  };

  const handleProductClick = async (product) => {
    if (!product) return;

    const visitId = sessionStorage.getItem("visit_id");

    // 상품 클릭 이벤트 저장
    if (visitId) {
      await sendEvent({
        visit_id: visitId,
        event_type: "hotspot_click",
        product_id: product.id,
      });
    }

    if (product.scene_id) {
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
  const scene = serverScenes.find((item) => Number(item.no) === zone);

  // 1. 전체 상품 목록 추출
  const rawAllProducts = serverScenes.flatMap((s) => s.products ?? []);

  // 2. 58, 59, 60번째 상품(인덱스 57, 58, 59)을 제외한 '정제된 60개 목록' 생성
  // (61, 62, 63번 상품들이 자연스럽게 58, 59, 60번째 순서로 당겨짐)
  const clean60Products = rawAllProducts.filter((_, idx) => idx < 57 || idx > 59);

  const products = scene
    ? (scene.products ?? [])
        // 6번 선반에서 제외 대상인 상품(p_607 ~ p_609) 렌더링 필터링
        .filter((prod) => {
          const prodId = prod.product_id ?? prod.id;
          return !["p_607", "p_608", "p_609"].includes(prodId);
        })
        .map((product) => {
          // 정제된 60개 목록에서 현재 상품의 인덱스(0~59) 찾기
          const targetIndex = clean60Products.findIndex(
            (p) => (p.product_id ?? p.id) === (product.product_id ?? product.id)
          );

          // 1부터 60까지 순서대로 파일 번호 부여
          const photoNo = targetIndex !== -1 ? targetIndex + 1 : 1;

          return {
            id: product.product_id,
            name: product.name,
            price: product.price,
            // ⚠️ 파일 위치에 맞게 경로 지정 (/products/ 또는 /)
            imageUrl: `/images/${photoNo}-Photoroom.png`,
            scene_id: scene.scene_id,
          };
        })
    : shelfData[zone] || [];

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
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
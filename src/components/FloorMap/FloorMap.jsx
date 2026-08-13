import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import PlusButton from "./icons/PlusButton";

import FloorPlan1 from "./FloorPlan1";
import FloorPlan2 from "./FloorPlan2";

const GUIDE_ITEMS = [
    { id: 1, text: "F/W 신상품" },
    { id: 2, text: "가방" },
    { id: 3, text: "의류" },
    { id: 4, text: "액세서리" },
    { id: 5, text: "슈즈" },
    { id: 6, text: "지갑" },
    { id: 7, text: "주얼리" },
];

export default function FloorMap({ showGuideMessage = false }) {
    const [activeZone, setActiveZone] = useState(null);
    const [isGuideMessageVisible, setIsGuideMessageVisible] = useState(showGuideMessage);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const navigate = useNavigate();

    const handleZoneClick = (zoneId) => {
        if (isGuideMessageVisible) return;

        if (zoneId === "plus") {
            setIsGuideOpen(true);
            return;
        }

        if (isGuideOpen) return;

        setActiveZone(zoneId);
        console.log(`📌 선택된 구역: ${zoneId}`);

        if (zoneId === "entrance") {
            navigate("/entrance");
        } else {
            navigate(`/shelf/${zoneId}`);
        }
    };

    const handleFirstGuideClick = (event) => {
        event.stopPropagation();
        setIsGuideMessageVisible(false);
    };

    const handleGuideClose = (event) => {
        event.stopPropagation();
        setIsGuideOpen(false);
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
                    .swiper-pagination {
                        pointer-events: none;
                    }
                    .swiper-pagination-bullet {
                        pointer-events: auto;
                    }
                `}
            </style>
            {/* 🚀 스와이프 영역 */}
            <Swiper
                modules={[Pagination]}
                spaceBetween={0}
                slidesPerView={1}
                pagination={{ clickable: true }}
                style={{ width: "100%", height: "100%" }}
            >
                {/* 1페이지 */}
                <SwiperSlide>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                        <div style={{ width: "363px", height: "300px", position: "relative" }}>
                            <FloorPlan1 activeZone={activeZone} onZoneClick={handleZoneClick} isGuideOpen={isGuideOpen} />
                        </div>
                    </div>
                </SwiperSlide>

                {/* 2페이지 */}
                <SwiperSlide>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                        <div style={{ width: "363px", height: "300px", position: "relative" }}>
                            <FloorPlan2 activeZone={activeZone} onZoneClick={handleZoneClick} isGuideOpen={isGuideOpen} />
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
            
            {/* 1. 지도를 눌러 보세요! 안내 */}
            {!isGuideOpen && isGuideMessageVisible && (
                <div
                    role="button"
                    tabIndex={0}
                    onClick={handleFirstGuideClick}
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)", // 화면 정중앙 배치
                        width: "363px",
                        height: "300px",
                        borderRadius: "20px",
                        backgroundColor: "rgba(60, 60, 60, 0.55)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#FFFFFF",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                        zIndex: 20, // 스와이퍼보다 위에 표시
                    }}
                >
                    지도를 눌러 보세요!
                </div>
            )}

            {/* 2. 진열대 안내 (+ 버튼 클릭 시) */}
            {isGuideOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)", // 화면 정중앙 배치
                        width: "363px",
                        height: "300px",
                        borderRadius: "20px",
                        backgroundColor: "rgba(60, 60, 60, 0.58)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        paddingTop: "48px",
                        boxSizing: "border-box",
                        color: "#FFFFFF",
                        zIndex: 20, // 스와이퍼보다 위에 표시
                    }}
                >
                    <div style={{ marginBottom: "24px", fontSize: "14px", fontWeight: "500" }}>
                        진열대 안내
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            width: "210px",
                            columnGap: "30px",
                            rowGap: "7px",
                        }}
                    >
                        {GUIDE_ITEMS.map((item) => (
                            <div key={item.id} style={{ fontSize: "12px", whiteSpace: "nowrap" }}>
                                {item.id}. {item.text}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* 닫기 버튼 */}
            {!isGuideMessageVisible && (
            <div style={{ 
                position: "absolute", 
                top: "50%", 
                left: "50%", 
                transform: "translate(-50%, -50%)", 
                width: "363px", 
                height: "300px", 
                pointerEvents: "none",
                zIndex: 30
            }}>
                <svg viewBox="0 0 363 300" width="100%" height="100%">
                    <g style={{ pointerEvents: "auto"}}>
                        <PlusButton 
                            cx={328} 
                            cy={268} 
                            isOpen={isGuideOpen} 
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsGuideOpen(!isGuideOpen);
                            }} 
                        />
                    </g>
                </svg>
            </div>
        )}
        </div>
    );
}
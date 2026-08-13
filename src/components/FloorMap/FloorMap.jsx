import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    TransformWrapper,
    TransformComponent,
} from "react-zoom-pan-pinch";

import FloorPlanSVG from "./FloorPlanSVG";

// 진열대별 설명
// 실제 내용이 정해지면 text 부분만 바꾸면 됩니다.
const GUIDE_ITEMS = [
    { id: 1, text: "F/W 신상품" },
    { id: 2, text: "가방" },
    { id: 3, text: "의류" },
    { id: 4, text: "액세서리" },
    { id: 5, text: "슈즈" },
    { id: 6, text: "지갑" },
    { id: 7, text: "주얼리" },
];

export default function FloorMap({
    showGuideMessage = false,
}) {
    const [activeZone, setActiveZone] = useState(null);

    // 홈 화면에서 처음 표시되는 "지도를 눌러 보세요!"
    const [
        isGuideMessageVisible,
        setIsGuideMessageVisible,
    ] = useState(showGuideMessage);

    // + 버튼으로 여는 진열대 안내
    const [isGuideOpen, setIsGuideOpen] =
        useState(false);

    const navigate = useNavigate();

    const handleZoneClick = (zoneId) => {
        // 처음 안내가 떠 있을 때는 진열대 이동 방지
        if (isGuideMessageVisible) {
            return;
        }

        // + 버튼을 누르면 진열대 안내 열기
        if (zoneId === "plus") {
            setIsGuideOpen(true);
            return;
        }

        // 진열대 안내가 열린 상태에서는 이동 방지
        if (isGuideOpen) {
            return;
        }

        setActiveZone(zoneId);

        console.log(`📌 선택된 구역: ${zoneId}`);

        if (zoneId === "entrance") {
            navigate("/entrance");
        } else {
            navigate(`/shelf/${zoneId}`);
        }
    };

    // 처음 안내를 눌렀을 때 실행
    const handleFirstGuideClick = (event) => {
        event.stopPropagation();

        // 안내만 닫고 페이지 이동은 하지 않음
        setIsGuideMessageVisible(false);
    };

    // 진열대 안내의 - 버튼을 눌렀을 때 실행
    const handleGuideClose = (event) => {
        event.stopPropagation();
        setIsGuideOpen(false);
    };

    return (
        <div
            style={{
                width: "100%",
                height: "300px",
                backgroundColor: "#F8F8F8",

                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                overflow: "hidden",
            }}
        >
            <TransformWrapper
                initialScale={1}
                minScale={0.8}
                maxScale={4}
                centerOnInit={true}
                centerZoomedOut={true}
                panning={{
                    disabled:
                        isGuideOpen || isGuideMessageVisible,
                }}
                wheel={{
                    disabled:
                        isGuideOpen || isGuideMessageVisible,
                    step: 0.01,
                    smoothStep: 0.002,
                }}
            >
                <TransformComponent
                    wrapperStyle={{
                        width: "100%",
                        height: "100%",
                    }}
                    contentStyle={{
                        width: "100%",
                        height: "100%",

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            position: "relative",
                            width: "363px",
                            height: "300px",
                        }}
                    >
                        {/* 기본 지도 */}
                        <FloorPlanSVG
                            activeZone={activeZone}
                            onZoneClick={handleZoneClick}
                            isGuideOpen={isGuideOpen}
                        />

                        {/* 
              홈 화면에 처음 표시되는 안내
              자동으로 사라지지 않고 사용자가 눌러야 사라짐
            */}
                        {!isGuideOpen &&
                            isGuideMessageVisible && (
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={handleFirstGuideClick}
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === "Enter" ||
                                            event.key === " "
                                        ) {
                                            handleFirstGuideClick(event);
                                        }
                                    }}
                                    style={{
                                        position: "absolute",

                                        // SVG의 둥근 지도 크기와 맞춤
                                        top: "10px",
                                        right: "12px",
                                        bottom: "10px",
                                        left: "12px",

                                        borderRadius: "20px",
                                        backgroundColor:
                                            "rgba(60, 60, 60, 0.55)",

                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",

                                        color: "#FFFFFF",
                                        fontSize: "14px",
                                        fontWeight: "500",

                                        cursor: "pointer",
                                        zIndex: 20,
                                    }}
                                >
                                    지도를 눌러 보세요!
                                </div>
                            )}

                        {/* + 버튼으로 여는 진열대 안내 */}
                        {isGuideOpen && (
                            <>
                                {/* 회색 안내 레이어 */}
                                <div
                                    style={{
                                        position: "absolute",

                                        // SVG의 둥근 지도 크기와 맞춤
                                        top: "10px",
                                        right: "12px",
                                        bottom: "10px",
                                        left: "12px",

                                        borderRadius: "20px",
                                        backgroundColor:
                                            "rgba(60, 60, 60, 0.58)",

                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",

                                        paddingTop: "48px",
                                        boxSizing: "border-box",

                                        color: "#FFFFFF",
                                        zIndex: 10,
                                    }}
                                >
                                    <div
                                        style={{
                                            marginBottom: "24px",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                        }}
                                    >
                                        진열대 안내
                                    </div>

                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "1fr 1fr",

                                            width: "210px",

                                            columnGap: "30px",
                                            rowGap: "7px",
                                        }}
                                    >
                                        {GUIDE_ITEMS.map((item) => (
                                            <div
                                                key={item.id}
                                                style={{
                                                    fontSize: "12px",
                                                    fontWeight: "400",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {item.id}. {item.text}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 회색 안내 레이어 위의 - 버튼 */}
                                <button
                                    type="button"
                                    aria-label="진열대 안내 닫기"
                                    onClick={handleGuideClose}
                                    style={{
                                        position: "absolute",

                                        // 기존 + 버튼과 같은 위치
                                        right: "23px",
                                        bottom: "21px",

                                        width: "22px",
                                        height: "22px",
                                        padding: 0,

                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",

                                        border: "none",
                                        borderRadius: "50%",

                                        backgroundColor: "#FFFFFF",
                                        color: "#333333",

                                        fontSize: "18px",
                                        fontWeight: "500",
                                        lineHeight: 1,

                                        boxShadow:
                                            "0 1px 3px rgba(0, 0, 0, 0.15)",

                                        cursor: "pointer",
                                        zIndex: 30,
                                    }}
                                >
                                    −
                                </button>
                            </>
                        )}
                    </div>
                </TransformComponent>
            </TransformWrapper>
        </div>
    );
}
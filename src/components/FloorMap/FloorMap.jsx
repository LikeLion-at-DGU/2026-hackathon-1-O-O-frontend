import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import FloorPlanSVG from "./FloorPlanSVG";

export default function FloorMap() {
    const [activeZone, setActiveZone] = useState(null);
    const navigate = useNavigate();

    const handleZoneClick = (zoneId) => {

    setActiveZone(zoneId);
    
    // 콘솔에 클릭 구역 출력
    console.log(`📌 선택된 구역: ${zoneId}`);

    // 페이지 이동

    if (zoneId === "entrance") {
        navigate("/entrance");
    } else if (zoneId === "plus") {
        navigate("/guide");
    } else {
        navigate(`/shelf/${zoneId}`);
    }
    };

    return (
    <div
        style={{
            width: "100%",
            height: "100vh",
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
            wheel={{
            step: 0.01,
            smoothStep: 0.002,
            }}
        >
            <TransformComponent
            wrapperStyle={{ width: "100%", height: "100%" }}
            contentStyle={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
            >
            <div style={{ width: "363px", height: "300px" }}>
                <FloorPlanSVG activeZone={activeZone} onZoneClick={handleZoneClick} />
            </div>
            </TransformComponent>
        </TransformWrapper>
        </div>
    );
}
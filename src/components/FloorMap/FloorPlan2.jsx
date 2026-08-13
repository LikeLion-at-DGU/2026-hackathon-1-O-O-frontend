import React from "react";
import { COLORS, TEXT_STYLES } from "./FloorMap.style"; 
import PlusButton from "./icons/PlusButton";

export default function FloorPlan2({ activeZone, onZoneClick, isGuideOpen }) {
    
    const getZoneColor = (id) => (activeZone === id ? COLORS.zoneActive : COLORS.zoneDefault);

    const getTextStyle = (id) => ({
        ...TEXT_STYLES.numberText,
        fill: activeZone === id ? "#FFFFFF" : TEXT_STYLES.numberText.fill,
    });

    return (
        <svg
            viewBox="0 0 363 300"
            width="100%"
            height="100%"
            style={{ display: "block" }}
        >
            <rect x="0" y="0" width="363" height="300" rx="20" fill={COLORS.background} />

            {/* 구역 8 */}
            <g
                onClick={() => onZoneClick(8)}
                style={{ cursor: isGuideOpen ? "default" : "pointer" }}
            >
                <rect x="24.5" y="185" width="310" height="33" rx="10" fill={getZoneColor("8")} />
                <text x="181.5" y="200.5" style={getTextStyle("8")}>
                    8
                </text>
            </g>
            

            {/* 구역 9 */}
            <g
                onClick={() => onZoneClick(9)}
                style={{ cursor: isGuideOpen ? "default" : "pointer" }}
            >
                <rect x="118.5" y="237" width="44" height="27" rx="10" fill={getZoneColor("9")} />
                <text x="141" y="249" style={getTextStyle("9")}>
                    9
                </text>
            </g>

            {/* 구역 10 */}
            <g
                onClick={() => onZoneClick(10)}
                style={{ cursor: isGuideOpen ? "default" : "pointer" }}
            >
                <rect x="200.5" y="237" width="44" height="27" rx="10" fill={getZoneColor("10")} />
                <text x="222" y="249" style={getTextStyle("10")}>
                    10
                </text>
            </g>

        </svg>
    );
}
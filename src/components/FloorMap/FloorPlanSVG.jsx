import React from "react";
import Bear from "./icons/Bear";
import PlusButton from "./icons/PlusButton";
import { COLORS, TEXT_STYLES } from "./FloorMap.style";

export default function FloorPlanSVG({ activeZone, onZoneClick }) {
    const getZoneStyle = (id) => ({
        fill: activeZone === id ? COLORS.zoneActive : COLORS.zoneDefault,
        transition: "fill 0.2s ease",
    });

    return (
        <svg
        viewBox="0 0 363 300"
        style={{
            width: "100%",
            height: "100%",
            display: "block",
        }}
        >
        {/* 바깥 전체 배경 */}
        <rect x="12" y="10" width="339" height="280" rx="20" fill={COLORS.background} />

        {/* 1번 구역 */}
        <g onClick={() => onZoneClick(1)} style={{ cursor: "pointer" }}>
            <rect x="32" y="30" width="31" height="240" rx="10" style={getZoneStyle(1)} />
            <text x="47.5" y="150" style={TEXT_STYLES.numberText}>1</text>
        </g>

        {/* 2번 구역 */}
        <g onClick={() => onZoneClick(2)} style={{ cursor: "pointer" }}>
            <rect x="300" y="30" width="31" height="240" rx="10" style={getZoneStyle(2)} />
            <text x="315.5" y="150" style={TEXT_STYLES.numberText}>2</text>
        </g>

        {/* 5번 구역 */}
        <g onClick={() => onZoneClick(5)} style={{ cursor: "pointer" }}>
            <rect x="88" y="30" width="75" height="15" rx="7.5" style={getZoneStyle(5)} />
            <text x="125.5" y="37.5" style={TEXT_STYLES.numberText}>5</text>
        </g>

        {/* 6번 구역 */}
        <g onClick={() => onZoneClick(6)} style={{ cursor: "pointer" }}>
            <rect x="200" y="30" width="75" height="15" rx="7.5" style={getZoneStyle(6)} />
            <text x="237.5" y="37.5" style={TEXT_STYLES.numberText}>6</text>
        </g>

        {/* 3번 구역 */}
        <g onClick={() => onZoneClick(3)} style={{ cursor: "pointer" }}>
            <rect x="125" y="100" width="113" height="61" rx="10" style={getZoneStyle(3)} />
            <text x="181.5" y="130.5" style={TEXT_STYLES.numberText}>3</text>
        </g>

        {/* 4번 구역 */}
        <g onClick={() => onZoneClick(4)} style={{ cursor: "pointer" }}>
            <rect x="163" y="185" width="37" height="25" rx="8" style={getZoneStyle(4)} />
            <text x="181.5" y="197.5" style={TEXT_STYLES.numberText}>4</text>
        </g>

        {/* 7번 구역 */}
        <g onClick={() => onZoneClick(7)} style={{ cursor: "pointer" }}>
            <circle cx="181.5" cy="235" r="9" style={getZoneStyle(7)} />
            <circle cx="164" cy="254" r="9" style={getZoneStyle(7)} />
            <circle cx="199" cy="254" r="9" style={getZoneStyle(7)} />
            <text x="181.5" y="255" style={TEXT_STYLES.numberText}>7</text>
        </g>

        {/* 입구 곰돌이 아이콘 */}
        <Bear x={82} y={235} onClick={() => onZoneClick("entrance")} />

        {/* 우측 하단 플러스(+) 버튼 */}
        <PlusButton cx={328} cy={268} onClick={() => onZoneClick("plus")} />
        </svg>
    );
}
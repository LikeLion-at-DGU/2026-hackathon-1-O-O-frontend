import React, { useState } from "react";
import Bear from "./icons/Bear";
import PlusButton from "./icons/PlusButton";

import {
    COLORS,
    TEXT_STYLES,
} from "./FloorMap.style";

export default function FloorPlan1({
    activeZone,
    onZoneClick,
    isGuideOpen = false,
}) {
    const [hoverZone, setHoverZone] = useState(null);

    const getZoneStyle = (id) => ({
        fill:
            activeZone === id
                ? COLORS.zoneActive
                : hoverZone === id
                ? " var(--Neutral-N30, #A8A29D)" 
                : COLORS.zoneDefault,

        transition: "fill 0.2s ease",
    });

    const getCursor = () => {
        return isGuideOpen ? "default" : "pointer";
    };

    const getHoverHandlers = (id) => ({
        onMouseEnter: () => {
            if (!isGuideOpen) {
                setHoverZone(id);
            }
        },
        onMouseLeave: () => {
            setHoverZone(null);
        },
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
            <rect
                x="0"
                y="0"
                width="363"
                height="300"
                rx="20"
                fill={COLORS.background}
            />

            {/* 1번 구역 */}
            <g
                onClick={() => onZoneClick(1)}
                {...getHoverHandlers(1)}
                style={{
                    cursor: getCursor(),
                }}
            >
                <rect
                    x="21.5"
                    y="20"
                    width="33"
                    height="260"
                    rx="10"
                    style={getZoneStyle(1)}
                />

                <text
                    x="38"
                    y="150"
                    style={TEXT_STYLES.numberText}
                >
                    1
                </text>
            </g>

            {/* 2번 구역 */}
            <g
                onClick={() => onZoneClick(2)}
                {...getHoverHandlers(2)}
                style={{
                    cursor: getCursor(),
                }}
            >
                <rect
                    x="310"
                    y="20"
                    width="33"
                    height="260"
                    rx="10"
                    style={getZoneStyle(2)}
                />

                <text
                    x="326.5"
                    y="150"
                    style={TEXT_STYLES.numberText}
                >
                    2
                </text>
            </g>

            {/* 5번 구역 */}
            <g
                onClick={() => onZoneClick(5)}
                {...getHoverHandlers(5)}
                style={{
                    cursor: getCursor(),
                }}
            >
                <rect
                    x="80.5"
                    y="20"
                    width="80"
                    height="15"
                    rx="7.5"
                    style={getZoneStyle(5)}
                />

                <text
                    x="120.5"
                    y="27.5"
                    style={TEXT_STYLES.numberText}
                >
                    5
                </text>
            </g>

            {/* 6번 구역 */}
            <g
                onClick={() => onZoneClick(6)}
                {...getHoverHandlers(6)}
                style={{
                    cursor: getCursor(),
                }}
            >
                <rect
                    x="204.5"
                    y="20"
                    width="80"
                    height="15"
                    rx="7.5"
                    style={getZoneStyle(6)}
                />

                <text
                    x="244.5"
                    y="27.5"
                    style={TEXT_STYLES.numberText}
                >
                    6
                </text>
            </g>

            {/* 3번 구역 */}
            <g
                onClick={() => onZoneClick(3)}
                {...getHoverHandlers(3)}
                style={{
                    cursor: getCursor(),
                }}
            >
                <rect
                    x="120"
                    y="95"
                    width="123"
                    height="67"
                    rx="10"
                    style={getZoneStyle(3)}
                />

                <text
                    x="181.5"
                    y="128.5"
                    style={TEXT_STYLES.numberText}
                >
                    3
                </text>
            </g>

            {/* 4번 구역 */}
            <g
                onClick={() => onZoneClick(4)}
                {...getHoverHandlers(4)}
                style={{
                    cursor: getCursor(),
                }}
            >
                <rect
                    x="160"
                    y="188"
                    width="44"
                    height="27"
                    rx="10"
                    style={getZoneStyle(4)}
                />

                <text
                    x="182"
                    y="201.5"
                    style={TEXT_STYLES.numberText}
                >
                    4
                </text>
            </g>

            {/* 7번 구역 */}
            <g
                onClick={() => onZoneClick(7)}
                {...getHoverHandlers(7)}
                style={{
                    cursor: getCursor(),
                }}
            >   
                  <rect
                    x="145"
                    y="225"
                    width="75"
                    height="50"
                    fill="transparent"
                    />
                <circle
                    cx="182"
                    cy="240"
                    r="9"
                    style={getZoneStyle(7)}
                />

                <circle
                    cx="162"
                    cy="260"
                    r="9"
                    style={getZoneStyle(7)}
                />

                <circle
                    cx="202"
                    cy="260"
                    r="9"
                    style={getZoneStyle(7)}
                />

                <text
                    x="181.5"
                    y="259"
                    style={TEXT_STYLES.numberText}
                >
                    7
                </text>
            </g>

            {/* 입구 곰돌이 */}
            <Bear
                x={82}
                y={235}
            />
        </svg>
    );
}
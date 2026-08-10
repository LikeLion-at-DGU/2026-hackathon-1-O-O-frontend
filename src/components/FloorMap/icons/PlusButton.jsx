import React from "react";
import { TEXT_STYLES, COLORS } from "../FloorMap.style";

export default function PlusButton({ cx = 328, cy = 268, onClick }) {
  return (
    <g onClick={onClick} style={{ cursor: "pointer" }}>
      <circle
        cx={cx}
        cy={cy}
        r="11"
        fill="#FFFFFF"
        filter="drop-shadow(0px 1px 3px rgba(0,0,0,0.15))"
      />
      <path
        d={`M ${cx} ${cy - 5} L ${cx} ${cy + 5} M ${cx - 5} ${cy} L ${cx + 5} ${cy}`}
        stroke="#333333"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>
  );
}
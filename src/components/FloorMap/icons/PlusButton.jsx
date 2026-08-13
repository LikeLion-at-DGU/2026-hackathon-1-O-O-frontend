import React from "react";

export default function PlusButton({
  cx = 328,
  cy = 268,
  isOpen = false,
  onClick,
}) {
  return (
    <g
      onClick={onClick}
      style={{
        cursor: "pointer",
      }}
    >
      <circle
        cx={cx}
        cy={cy}
        r="11"
        fill="#FFFFFF"
        filter="drop-shadow(0px 1px 3px rgba(0,0,0,0.15))"
      />

      {/* 가로선: +와 - 모두 표시 */}
      <path
        d={`M ${cx - 5} ${cy} L ${cx + 5} ${cy}`}
        stroke="#333333"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* 세로선: 가이드가 닫혀 있을 때만 표시 */}
      {!isOpen && (
        <path
          d={`M ${cx} ${cy - 5} L ${cx} ${cy + 5}`}
          stroke="#333333"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
    </g>
  );
}
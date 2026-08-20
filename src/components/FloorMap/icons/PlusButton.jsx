export default function PlusButton({
  cx = 11.5,
  cy = 12,
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
      <circle cx={cx} cy={cy} r="20" fill="transparent" />
      <circle
        cx={cx}
        cy={cy}
        r="12"
        fill="#FFFFFF"
        filter="drop-shadow(0px 1px 3px rgba(0,0,0,0.15))"
      />

      {/* 가로선: +와 - 모두 표시 */}
      <path
        d={`M ${cx - 6} ${cy} L ${cx + 6} ${cy}`}
        stroke="#222222"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ pointerEvents: "none" }}
      />

      {/* 세로선: 가이드가 닫혀 있을 때만 표시 */}
      {!isOpen && (
        <path
          d={`M ${cx} ${cy - 6} L ${cx} ${cy + 6}`}
          stroke="#222222"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ pointerEvents: "none" }}
        />
      )}
    </g>
  );
}

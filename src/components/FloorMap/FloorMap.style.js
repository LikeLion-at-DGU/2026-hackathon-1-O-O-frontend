// 맵이나 선반에서 사용하는 공통 스타일
export const COLORS = {
  background: "#E5E3E0",   // 전체 배경색
  zoneDefault: "#D1CCC7",  // 기본 구역색
  zoneActive: "#C2B29F",   // 선택되었을 때 구역색
  cognacText: "#8C6239",   // 숫자 텍스트 색상
  neutralText: "#E5E3E0",  // 입구 텍스트 색상
  bearFill: "#8C6239",     // 곰돌이 아이콘 채우기 색상
};

export const TEXT_STYLES = {
    numberText: {
        fill: COLORS.cognacText,
        fontSize: "12px",
        fontWeight: "300",
        fontFamily: "Pretendard, sans-serif",
        textAnchor: "middle",
        dominantBaseline: "central",
        pointerEvents: "none",
        userSelect: "none",
    },
    entranceText: {
        fill: COLORS.neutralText,
        fontSize: "12px",
        fontWeight: "300",
        fontFamily: "Pretendard, sans-serif",
        textAnchor: "middle",
        dominantBaseline: "central",
        pointerEvents: "none",
        userSelect: "none",
    },
};
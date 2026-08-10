import { COLORS } from "../FloorMap/FloorMap.style";

// 선반 구조 스타일
export const shelfStyles = {
    container: {
        width: "100%",
        maxWidth: "363px",
        height: "300px",
        padding: "16px",
        backgroundColor: COLORS.zoneDefault, // #D1CCC7
        borderRadius: "20px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    tier: {
        width: "100%",
        height: "126px",
        backgroundColor: COLORS.background, // #E5E3E0
        borderRadius: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "0 20px", // 양쪽 패딩 조정
        boxSizing: "border-box",
    },
    productSlot: {
        width: "80px",
        height: "80px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "44px",
    },
};
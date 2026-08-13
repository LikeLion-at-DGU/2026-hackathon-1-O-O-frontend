import { create } from "zustand";
import { persist } from "zustand/middleware";

const useChatStore = create(
    persist(
        (set) => ({
            selectedZoneId: null,
            selectedProduct: null,

            // 진열대 클릭 정보를 저장
            selectShelf: (zoneId) =>
                set({
                    selectedZoneId: zoneId,
                    selectedProduct: null,
                }),

            // 상품 클릭 정보를 저장
            selectProduct: (product) =>
                set({
                    selectedProduct: product,
                }),

            // 채팅 기록 초기화
            resetChat: () =>
                set({
                    selectedZoneId: null,
                    selectedProduct: null,
                }),
        }),
        {
            name: "ono-chat-storage",
            storage: {
                getItem: (name) => {
                    const value = sessionStorage.getItem(name);

                    return value ? JSON.parse(value) : null;
                },

                setItem: (name, value) => {
                    sessionStorage.setItem(
                        name,
                        JSON.stringify(value)
                    );
                },

                removeItem: (name) => {
                    sessionStorage.removeItem(name);
                },
            },
        }
    )
);

export default useChatStore;
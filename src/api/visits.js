import { mockVisit } from "../mocks/visits";

export const enterStore = async (data) => {
    console.log("매장 입장 요청:", data);

    return {
        data: {
            ...mockVisit,
            started_at: new Date().toISOString(),
        },
    };
};
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// 방문 토큰을 붙이면 안 되는 공개 엔드포인트 전용 클라이언트입니다.
export const publicApi = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
    const visitToken = localStorage.getItem("visitToken") ?? sessionStorage.getItem("visit_token");
    if (visitToken) config.headers["X-Visit-Token"] = visitToken;
    return config;
});

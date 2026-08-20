import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const publicApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const visitToken = localStorage.getItem("visitToken") ?? sessionStorage.getItem("visit_token");
    if (visitToken) config.headers["X-Visit-Token"] = visitToken;
    return config;
});

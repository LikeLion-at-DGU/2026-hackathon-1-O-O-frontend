import { api } from "./api";

export const getProduct = async (productId) => api.get(`/products/${productId}`);

// 상품 목록은 별도 엔드포인트가 없으므로 입장 응답의 scenes에서 구성한다.
export const getProducts = async () => {
  const scenes = JSON.parse(sessionStorage.getItem("scenes") ?? "[]");
  return { data: scenes.flatMap((scene) => scene.products ?? []) };
};

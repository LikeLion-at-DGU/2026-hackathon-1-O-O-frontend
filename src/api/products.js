import { mockProducts } from "../mocks/products";

export const getProducts = async () => {
  return {
    data: mockProducts,
  };
};

export const getProduct = async (productId) => {
  const product = mockProducts.find(
    (item) => item.id === Number(productId)
  );

  return {
    data: product,
  };
};
import { useEffect, useState } from "react";
import { getProduct } from "../api/products";

export default function useProduct(productId) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProduct(productId);

                setProduct(response?.data ?? response);
            } catch {
                // 조회 실패 시 빈 상품 상태를 유지한다.
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    return {
        product,
        loading,
    };
}

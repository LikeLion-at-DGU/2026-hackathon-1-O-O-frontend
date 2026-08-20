import { useEffect, useState } from "react";
import { getProduct } from "../api/products";
import { getApiError } from "../api/errors";

export default function useProduct(productId) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProduct(productId);

                setProduct(response?.data ?? response);
                setError(null);
            } catch (fetchError) {
                // 빈 상품 상태를 유지하되, 화면이 실패 사실을 알 수 있게
                // 정규화된 에러를 함께 내보낸다.
                setError(getApiError(fetchError));
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
        error,
    };
}

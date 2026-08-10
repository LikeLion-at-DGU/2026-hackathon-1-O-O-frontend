import React from "react";
import { useParams } from "react-router-dom";

function ProductPage() {
    const { productId } = useParams();

    return (
        <>
            <h1>상품 상세 페이지</h1>
            <p>선택한 상품 ID: {productId}</p>
        </>
    );
}

export default ProductPage;
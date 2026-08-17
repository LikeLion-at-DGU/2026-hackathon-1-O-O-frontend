import * as S from "./ProductInfo.styled";

function ProductInfo({
    product,
    productName,
    productImage,
    productId,
    loading,
}) {
    return (
        <S.ProductArea>
            <S.ProductWrapper>
            <S.Product>
            <img
                src={productImage}
                alt={productName}
                style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "contain",
                }}
            />
            </S.Product>
            
            <S.TextWrapper>
            <S.ProductTitle>
                {productName}
            </S.ProductTitle>

            <S.ProductInfo>
                색상 : Soft Pink
            </S.ProductInfo>
            </S.TextWrapper>
            </S.ProductWrapper>

            {/* {loading ? (
                <S.ProductInfo>
                    상품 정보를 불러오는 중...
                </S.ProductInfo>
            ) : (
                <>
                    <S.ProductInfo>
                        상품 ID: {productId}
                    </S.ProductInfo>

                    <S.ProductInfo>
                        가격:{" "}
                        {product?.price
                            ? `${product.price.toLocaleString()}원`
                            : "가격 정보 없음"}
                    </S.ProductInfo>

                    <S.ProductInfo>
                        카테고리:{" "}
                        {product?.category ??
                            "카테고리 정보 없음"}
                    </S.ProductInfo>

                    <S.ProductInfo>
                        {product?.description ??
                            "상품 설명이 없습니다."}
                    </S.ProductInfo>
                </>
            )} */}
        </S.ProductArea>
    );
}

export default ProductInfo;
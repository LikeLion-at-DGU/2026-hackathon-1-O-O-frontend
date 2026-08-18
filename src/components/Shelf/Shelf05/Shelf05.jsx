import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FreeMode } from "swiper/modules";


import * as S from "./Shelf05.style";

function Shelf05({
  products = [],
  onProductClick,
}) {
  const renderProduct = (product, slotIndex) => (
    <S.ProductSlot
      key={slotIndex}
      $clickable={Boolean(product)}
      onClick={() => {
        if (product) {
          onProductClick?.(product);
        }
      }}
    >
      <S.Hanger>
        <S.HangerIcon>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 20 14" fill="none">
            <path d="M19.5844 12.11L10.5742 5.25L12.964 3.43C13.007 3.39749 13.042 3.35526 13.0661 3.30665C13.0902 3.25805 13.1028 3.20441 13.1029 3.15C13.1029 2.31457 12.7759 1.51335 12.1938 0.922614C11.6117 0.331874 10.8223 0 9.99914 0C9.17598 0 8.38654 0.331874 7.80448 0.922614C7.22242 1.51335 6.89542 2.31457 6.89542 3.15C6.89542 3.24283 6.93176 3.33185 6.99643 3.39749C7.0611 3.46313 7.14882 3.5 7.24028 3.5C7.33174 3.5 7.41946 3.46313 7.48413 3.39749C7.54881 3.33185 7.58514 3.24283 7.58514 3.15C7.58764 2.51708 7.83137 1.9097 8.26528 1.45511C8.6992 1.00052 9.28961 0.733998 9.91284 0.711376C10.5361 0.688754 11.1437 0.911791 11.6085 1.33376C12.0733 1.75573 12.3592 2.34388 12.4062 2.975L9.7974 4.96125L9.78533 4.97L0.413831 12.11C0.240237 12.2421 0.111974 12.4263 0.047188 12.6365C-0.0175984 12.8467 -0.0156287 13.0722 0.0528185 13.2812C0.121266 13.4902 0.252725 13.672 0.428599 13.801C0.604473 13.93 0.815858 13.9996 1.03285 14H18.9654C19.1826 14 19.3942 13.9307 19.5704 13.8018C19.7465 13.6729 19.8782 13.4911 19.9469 13.282C20.0156 13.073 20.0177 12.8473 19.9529 12.6369C19.8882 12.4266 19.7599 12.2422 19.5862 12.11H19.5844ZM19.2905 13.0611C19.269 13.1313 19.2258 13.1925 19.1672 13.2355C19.1086 13.2786 19.0378 13.3012 18.9654 13.3H1.03285C0.96047 13.3 0.889925 13.2769 0.831208 13.2339C0.772491 13.191 0.728578 13.1304 0.705689 13.0607C0.682801 12.991 0.682097 12.9158 0.703679 12.8456C0.72526 12.7755 0.768032 12.7141 0.825935 12.67L9.99914 5.6875L19.1706 12.67C19.2298 12.7131 19.2736 12.7746 19.2952 12.8452C19.3168 12.9157 19.3152 12.9916 19.2905 13.0611Z" fill="#A1A1AA"/>
         </svg>
        </S.HangerIcon>

        {product?.imageUrl && (
          <S.ProductImage
            src={product.imageUrl}
            alt={product.name ?? "상품"}
             $up={product.id === "p-55"}
          />
        )}
      </S.Hanger>
    </S.ProductSlot>
  );

  console.log(
  products.map((product) => ({
    id: product?.id,
    name: product?.name,
    imageUrl: product?.imageUrl,
  }))
);

  return (
    <S.Container>
            <Swiper
        modules={[FreeMode]}
        freeMode={true}
        nested={true}
        slidesPerView="auto"
        spaceBetween={0}
        style={{
            width: "100%",
            height: "100%",
            overflow: "visible",
        }}
        >
        <SwiperSlide
            style={{
            width: "800px",
            height: "100%",
            }}
        >
            <S.ShelfRow>
            {products.map((product, index) =>
                renderProduct(product, index)
            )}
            
            </S.ShelfRow>
        </SwiperSlide>
        </Swiper>
    </S.Container>
  );
}

export default Shelf05;
// src/pages/AnalyticsPage.jsx
import * as S from "./AnalyticsPage.styled";
import MobileLayout from "../components/MobileLayout/MobileLayout";
import checkActiveImg from "../assets/check.svg";
import checkInactiveImg from "../assets/check.png";
import useAnalyticsReport from "../hooks/useAnalyticsReport";

const defaultBagImg =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23eee%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%23aaa%22%20font-size%3D%2214%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E";

const getProductImage = (product) => {
  return (
    product?.cutout_url ??
    product?.thumbnail ??
    product?.images?.[0] ??
    product?.images?.thumbnail ??
    product?.images?.main ??
    defaultBagImg
  );
};

const minuteLabel = (rawSec, minutes) =>
  rawSec > 0 && rawSec < 60 ? "1분 미만" : `${minutes}분`;

export default function AnalyticsPage() {
  const {
    report,
    isPending,
    candidateProducts,
    candidateError,
    selectedCandidate,
    selectedProductIds,
    metrics,
    handleToggleSelect,
    handleGoToCamera,
  } = useAnalyticsReport();

  const {
    topZoneName,
    totalMinutes,
    totalRawSec,
    top1,
    top2,
    etcMinutes,
    etcRawSec,
  } = metrics;

  if (isPending) {
    return null;
  }

  if (!report) {
    return (
      <MobileLayout hideShoot>
        <S.Container
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <S.MainTitle>리포트를 불러올 수 없습니다.</S.MainTitle>
        </S.Container>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout hideShoot>
      <S.Container>
        <S.SectionHeader>
          <S.MainTitle>뮤즈님의 관람 결과입니다.</S.MainTitle>
          <S.SubTitle>{topZoneName}에 가장 많은 관심을 보였어요!</S.SubTitle>
        </S.SectionHeader>

        <S.SummaryCard>
          <S.SummaryLabel>총 관람시간</S.SummaryLabel>
          <S.TotalTimePill>
            {minuteLabel(totalRawSec, totalMinutes)}
          </S.TotalTimePill>

          <S.TimeBreakdownContainer>
            <S.BreakdownRow>
              <S.BreakdownItem $flex={top1.raw_sec || 1}>
                <S.BreakdownPill $isHighlight>
                  {minuteLabel(top1.raw_sec, top1.duration_min)}
                </S.BreakdownPill>
                <S.BreakdownLabel>{top1.zone_name}</S.BreakdownLabel>
              </S.BreakdownItem>

              <S.BreakdownItem $flex={top2.raw_sec || 1}>
                <S.BreakdownLabel>{top2.zone_name}</S.BreakdownLabel>
                <S.BreakdownPill>
                  {minuteLabel(top2.raw_sec, top2.duration_min)}
                </S.BreakdownPill>
              </S.BreakdownItem>

              <S.BreakdownItem $flex={etcRawSec || 1}>
                <S.BreakdownLabel>기타</S.BreakdownLabel>
                <S.BreakdownPill>
                  {minuteLabel(etcRawSec, etcMinutes)}
                </S.BreakdownPill>
              </S.BreakdownItem>
            </S.BreakdownRow>
          </S.TimeBreakdownContainer>
        </S.SummaryCard>

        <S.SectionHeader $isSecond>
          <S.MainTitle>화보에 담을 아이템을 골라주세요.</S.MainTitle>
          <S.SubTitle>
            오늘 가장 관심 있게 보신 상품을 미리 담아두었어요. 변경 하셔도 돼요!
          </S.SubTitle>
          {candidateError && <S.SubTitle>{candidateError}</S.SubTitle>}
        </S.SectionHeader>

        <S.ItemGrid>
          {candidateProducts.map((item, index) => {
            const productId = item.product_id;
            const isSelected = selectedProductIds.includes(productId);
            const imgSrc = getProductImage(item);

            return (
              <S.ItemCard
                key={productId}
                $selected={isSelected}
                onClick={() => handleToggleSelect(item)}
              >
                <S.ImageContainer>
                  <S.CheckIconImage
                    src={isSelected ? checkActiveImg : checkInactiveImg}
                    alt={isSelected ? "선택됨" : "선택 안 됨"}
                  />
                  <S.ItemImage
                    src={imgSrc}
                    alt={item.name || "상품 이미지"}
                    onError={(e) => {
                      e.currentTarget.src = defaultBagImg;
                    }}
                  />
                </S.ImageContainer>

                <S.ItemInfo>
                  <S.ItemName>{item.name || `상품 ${index + 1}`}</S.ItemName>
                  {item.reason && (
                    <S.ReasonBadge data-reason-code={item.reason_code || undefined}>
                      {item.reason}
                    </S.ReasonBadge>
                  )}
                </S.ItemInfo>
              </S.ItemCard>
            );
          })}
        </S.ItemGrid>

        <S.CameraButton
          type="button"
          onClick={handleGoToCamera}
          disabled={!selectedCandidate?.product_id}
        >
          선택한 상품으로 화보 만들기
        </S.CameraButton>
      </S.Container>
    </MobileLayout>
  );
}
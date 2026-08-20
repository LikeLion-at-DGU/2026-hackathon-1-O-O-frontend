import MobileLayout from "../components/MobileLayout/MobileLayout";
import * as S from "./AnalyticsLoadingPage.style";
import paddyThinkImg from "../assets/paddy-think.png";
import useAnalyticsPolling from "../hooks/useAnalyticsPolling";

export default function AnalyticsLoadingPage() {
  useAnalyticsPolling();

  return (
    <MobileLayout disableShoot={true}>
      <S.LoadingWrapper>
        <S.VisualBadge>
          <S.CharacterImage
            src={paddyThinkImg}
            alt="분석 중인 패디"
          />
        </S.VisualBadge>

        <S.MainTitle>관람 기록을 분석하고 있어요</S.MainTitle>
        <S.SubTitle>취향 분석 리포트와 추천 아이템을 정리 중입니다</S.SubTitle>

        <S.LoadingProgressBar />
      </S.LoadingWrapper>
    </MobileLayout>
  );
}
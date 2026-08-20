import { useEffect, useState } from "react";
import { keyframes } from "styled-components";

import MobileLayout from "../components/MobileLayout/MobileLayout";
import loadingBear from "../assets/LoadingBear.png";
import loadingBear2 from "../assets/LoadingBear2.png";
import * as S from "./LookbookLoadingPage.styled";

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }
`;

function LookbookLoadingPage({
  progress = 0,
  stage = "",
  step = "",
  errorMessage = "",
  onRetry,
  retryLabel = "다시 시도하기",
}) {
  const normalizedProgress = Math.min(
    100,
    Math.max(0, Number(progress) || 0)
  );

  const [bearIndex, setBearIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBearIndex((current) => (current === 0 ? 1 : 0));
    }, 800);

    return () => window.clearInterval(timer);
  }, []);

  const loadingBears = [loadingBear, loadingBear2];

  const stageLabel =
    step ||
    ({
      compose: "상품을 준비하고 있어요...",
      render: "화보를 만들고 있어요...",
      finalize: "마무리하고 있어요...",
    }[stage] ?? "화보를 만들고 있어요...");

  return (
    <MobileLayout showHeader={false}>
      <S.Container>
        <S.Logo>
          <S.LogoMain>O</S.LogoMain>
          <S.Ampersand>&</S.Ampersand>
          <S.LogoMain>O</S.LogoMain>
        </S.Logo>

        {errorMessage ? (
          <S.ErrorContent>
            <S.Title>
              화보를 만들지 못했어요.
            </S.Title>

            <S.Description>
              {errorMessage}
            </S.Description>

            {onRetry && (
              <S.RetryButton
                type="button"
                onClick={onRetry}
              >
                {retryLabel}
              </S.RetryButton>
            )}
          </S.ErrorContent>
        ) : (
          <S.LoadingContent>
            <S.Title>
              패디가 뮤즈님의 화보를 만들고 있어요.
            </S.Title>

            <S.CardSection>
              <S.CardRow>
                <S.Card>
                  <S.CardFill $height="102px" />
                </S.Card>

                <S.Card>
                  <S.CardFill $height="124px" />
                </S.Card>

                <S.Card>
                  <S.CardFill $height="56px" />
                </S.Card>
              </S.CardRow>

              <S.CardLabels>
                <span>color</span>
                <span>item</span>
                <span>mood</span>
              </S.CardLabels>
            </S.CardSection>

            <S.ProgressSection>
              <S.Character
                src={loadingBears[bearIndex]}
                alt=""
                $animation={floatAnimation}
              />

              <S.ProgressContent>
                <S.ProgressLabel>
                  {stageLabel}
                </S.ProgressLabel>

                <S.ProgressTrack>
                  <S.ProgressBar
                    $progress={normalizedProgress}
                  />
                </S.ProgressTrack>
              </S.ProgressContent>
            </S.ProgressSection>
          </S.LoadingContent>
        )}
      </S.Container>
    </MobileLayout>
  );
}

export default LookbookLoadingPage;

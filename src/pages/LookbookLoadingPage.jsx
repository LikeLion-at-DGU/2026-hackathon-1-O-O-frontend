import { useEffect, useState } from "react";

import MobileLayout from "../components/MobileLayout/MobileLayout";
import loadingBear from "../assets/LoadingBear.png";
import * as S from "./LookbookLoadingPage.styled";

const FILL_RANGES = [
  [72, 138],
  [92, 158],
  [42, 112],
];

const getRandomFillHeight = ([minimum, maximum]) =>
  Math.round(
    minimum + Math.random() * (maximum - minimum)
  );

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

  const [fillLevels, setFillLevels] = useState([
    102,
    124,
    56,
  ]);

  useEffect(() => {
    const updateFillLevels = () => {
      setFillLevels(
        FILL_RANGES.map(getRandomFillHeight)
      );
    };

    const timer = window.setInterval(
      updateFillLevels,
      1400
    );

    return () => window.clearInterval(timer);
  }, []);

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
                  <S.CardBorder
                    viewBox="0 0 105 200"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="105"
                      height="200"
                      rx="10"
                      ry="10"
                      strokeWidth="2"
                      strokeDasharray="10 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </S.CardBorder>
                  <S.CardFill
                    $height={`${fillLevels[0]}px`}
                  />
                </S.Card>

                <S.Card>
                  <S.CardBorder
                    viewBox="0 0 105 200"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="105"
                      height="200"
                      rx="10"
                      ry="10"
                      strokeWidth="2"
                      strokeDasharray="10 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </S.CardBorder>
                  <S.CardFill
                    $height={`${fillLevels[1]}px`}
                  />
                </S.Card>

                <S.Card>
                  <S.CardBorder
                    viewBox="0 0 105 200"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="105"
                      height="200"
                      rx="10"
                      ry="10"
                      strokeWidth="2"
                      strokeDasharray="10 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </S.CardBorder>
                  <S.CardFill
                    $height={`${fillLevels[2]}px`}
                  />
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
                src={loadingBear}
                alt=""
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

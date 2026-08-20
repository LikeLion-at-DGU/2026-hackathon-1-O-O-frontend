import { useState } from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

import MobileLayout from "../components/MobileLayout/MobileLayout";
import LookbookLoadingPage from "./LookbookLoadingPage";
import * as S from "./LookbookPage.styled";

import { createLookbook } from "../api/lookbooks";
import { getApiError } from "../api/errors";
import { useLookbookImageActions } from "../hooks/useLookbookImageActions";
import {
    DEFAULT_LOOKBOOK_POLL_INTERVAL,
    useLookbookPolling,
} from "../hooks/useLookbookPolling";
import { showToast } from "../utils/toast";

function LookbookPage() {
    const navigate = useNavigate();
    const { shareSlug: routeShareSlug } =
        useParams();

    const shareSlug =
        routeShareSlug ||
        sessionStorage.getItem("share_slug");

    const [isRetrying, setIsRetrying] =
        useState(false);

    const {
        lookbook,
        progress,
        stage,
        step,
        errorMessage,
        jobFailure,
        startLoading,
        clearLoadingError,
    } = useLookbookPolling(shareSlug);

    const {
        handleShare,
        handleDownload,
    } = useLookbookImageActions({
        imageUrl: lookbook?.image_url,
        shareSlug,
    });

    /*
     * 기존 사진과 상품으로 재생성
     */
    const handleRetry = async ({
        skipLimitCheck = false,
    } = {}) => {
        if (isRetrying) return;

        const reportSlug =
            sessionStorage.getItem(
                "report_slug"
            );

        const savedRequest =
            sessionStorage.getItem(
                "lookbook_request"
            );

        if (!reportSlug || !savedRequest) {
            showToast(
                "재생성에 필요한 원본 정보를 찾지 못했습니다."
            );

            return;
        }

        const remaining =
            lookbook
                ?.remaining_regenerations ??
            Number(
                sessionStorage.getItem(
                    "remaining_regenerations"
                )
            );

        if (
            !skipLimitCheck &&
            Number(remaining) <= 0
        ) {
            showToast(
                "화보 재생성 가능 횟수를 모두 사용했습니다."
            );

            return;
        }

        try {
            setIsRetrying(true);
            clearLoadingError();

            const payload =
                JSON.parse(savedRequest);

            const result =
                await createLookbook(
                    reportSlug,
                    payload
                );

            if (
                !result?.job_id ||
                !result?.share_slug
            ) {
                throw new Error(
                    "새 화보 작업 정보를 받지 못했습니다."
                );
            }

            sessionStorage.setItem(
                "lookbook_job_id",
                result.job_id
            );

            sessionStorage.setItem(
                "share_slug",
                result.share_slug
            );

            sessionStorage.setItem(
                "lookbook_attempt",
                String(result.attempt ?? 1)
            );

            sessionStorage.setItem(
                "remaining_regenerations",
                String(
                    result.remaining_regenerations ??
                    0
                )
            );

            sessionStorage.setItem(
                "lookbook_poll_after_ms",
                String(
                    result.poll_after_ms ??
                    DEFAULT_LOOKBOOK_POLL_INTERVAL
                )
            );

            /*
             * 재생성 때마다 새 share_slug URL로 이동합니다.
             */
            navigate(
                `/lookbook/${result.share_slug}`,
                {
                    replace: true,
                }
            );
        } catch (error) {
            console.error(
                "화보 재생성 실패:",
                error.response?.data || error
            );

            const { status, message } =
                getApiError(error);

            if (status === 429) {
                showToast(
                    "화보 재생성 가능 횟수를 모두 사용했습니다."
                );
            } else if (
                status === 409
            ) {
                showToast(
                    "이미 화보 생성 요청을 처리하고 있습니다."
                );
            } else {
                showToast(
                    message ||
                    "화보를 다시 만들지 못했습니다."
                );
            }
        } finally {
            setIsRetrying(false);
        }
    };

    if (!lookbook) {
        return (
            <LookbookLoadingPage
                progress={progress}
                stage={stage}
                step={step}
                errorMessage={errorMessage}
                onRetry={
                    jobFailure?.errorCode ===
                    "GEN_CONTENT_BLOCKED"
                        ? () =>
                              navigate("/camera", {
                                  replace: true,
                              })
                        : jobFailure?.retryable
                          ? () =>
                                handleRetry({
                                    skipLimitCheck: true,
                                })
                          : errorMessage
                            ? startLoading
                            : undefined
                }
                retryLabel={
                    jobFailure?.errorCode ===
                    "GEN_CONTENT_BLOCKED"
                        ? "다시 촬영하기"
                        : "다시 시도하기"
                }
            />
        );
    }

    const remainingRegenerations = Number(
        lookbook?.remaining_regenerations ??
            sessionStorage.getItem(
                "remaining_regenerations"
            )
    );

    const hasRemainingRegenerations =
        Number.isFinite(remainingRegenerations);

    return (
        <MobileLayout showHeader={false}>
            <S.LookbookContainer>
                <S.TopSection>
                    <S.Logo
                        type="button"
                        onClick={() =>
                            navigate("/home")
                        }
                        aria-label="처음 화면으로 이동"
                    >
                        <S.LogoMain>O</S.LogoMain>
                        <S.Ampersand>&</S.Ampersand>
                        <S.LogoMain>O</S.LogoMain>
                    </S.Logo>

                    <S.Message>
                        저희의 뮤즈가 되어 주셔서
                        감사합니다.
                    </S.Message>

                    <S.MuseInfo>
                        <span>
                            {lookbook.muse_label ||
                                `N.${String(
                                    lookbook.muse_no || 0
                                ).padStart(3, "0")}`}
                        </span>

                        <span>
                            {lookbook.venue}
                        </span>

                        <span>
                            {lookbook.season}
                        </span>
                    </S.MuseInfo>
                </S.TopSection>

                <S.ImageSection
                    $width={Number(
                        lookbook.width
                    )}
                    $height={Number(
                        lookbook.height
                    )}
                >
                    <S.LookbookImage
                        src={lookbook.image_url}
                        alt="AI로 생성된 나의 O&O 화보"
                        onLoad={() =>
                            console.info(
                                "[Lookbook] 이미지 로드 완료",
                                {
                                    imageUrl:
                                        lookbook.image_url,
                                }
                            )
                        }
                        onError={(event) =>
                            console.error(
                                "[Lookbook] 이미지 로드 실패",
                                {
                                    imageUrl:
                                        lookbook.image_url,
                                    event,
                                }
                            )
                        }
                    />
                </S.ImageSection>

                <S.BottomSection>
                    <S.ActionRow>
                        <S.DownloadButton
                            type="button"
                            onClick={handleDownload}
                        >
                            이미지 저장
                        </S.DownloadButton>

                        <S.ShareButton
                            type="button"
                            onClick={handleShare}
                            aria-label="화보 공유하기"
                        >
                            <S.ShareIcon
                                src="/images/lookbook-share.svg"
                                alt=""
                                aria-hidden="true"
                            />
                        </S.ShareButton>
                    </S.ActionRow>

                    <S.RetryDescription>
                        혹시 화보가 마음에 안 든다면,
                        다시 만들어보세요.
                    </S.RetryDescription>

                    <S.RetryButton
                        type="button"
                        onClick={handleRetry}
                        disabled={isRetrying}
                    >
                        {isRetrying
                            ? "다시 만드는 중..."
                            : hasRemainingRegenerations
                              ? `화보 다시 만들기 (남은 ${Math.max(
                                    0,
                                    remainingRegenerations
                                )}회)`
                              : "화보 다시 만들기"}
                    </S.RetryButton>
                </S.BottomSection>
            </S.LookbookContainer>
        </MobileLayout>
    );
}

export default LookbookPage;

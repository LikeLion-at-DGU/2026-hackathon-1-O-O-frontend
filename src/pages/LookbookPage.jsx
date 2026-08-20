import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

import MobileLayout from "../components/MobileLayout/MobileLayout";
import LookbookLoadingPage from "./LookbookLoadingPage";
import * as S from "./LookbookPage.styled";

import {
    createLookbook,
    getLookbook,
    getLookbookJob,
} from "../api/lookbooks";
import { getApiError } from "../api/errors";

const COMPLETE_STATUSES = [
    "ready",
    "completed",
    "succeeded",
    "success",
];

const FAILED_STATUSES = [
    "failed",
    "error",
];

const DEFAULT_POLL_INTERVAL = 3000;

function LookbookPage() {
    const navigate = useNavigate();
    const { shareSlug: routeShareSlug } =
        useParams();

    const shareSlug =
        routeShareSlug ||
        sessionStorage.getItem("share_slug");

    const timerRef = useRef(null);
    const mountedRef = useRef(true);

    const [lookbook, setLookbook] =
        useState(null);

    const [progress, setProgress] =
        useState(0);

    const [stage, setStage] =
        useState("");

    const [step, setStep] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    const [isRetrying, setIsRetrying] =
        useState(false);

    const [jobFailure, setJobFailure] =
        useState(null);

    const clearPollTimer = useCallback(() => {
        if (timerRef.current) {
            window.clearTimeout(
                timerRef.current
            );

            timerRef.current = null;
        }
    }, []);

    /*
     * 완성 화보를 조회합니다.
     */
    const loadCompletedLookbook =
        useCallback(
            async (targetShareSlug) => {
                const data = await getLookbook(
                    targetShareSlug
                );

                console.info(
                    "[Lookbook] 완성 화보 응답",
                    {
                        shareSlug:
                            targetShareSlug,
                        imageUrl:
                            data?.image_url,
                        width: data?.width,
                        height: data?.height,
                        attempt: data?.attempt,
                    }
                );

                if (!mountedRef.current) {
                    return null;
                }

                setLookbook(data);
                setProgress(100);
                setErrorMessage("");
                setJobFailure(null);

                sessionStorage.setItem(
                    "share_slug",
                    targetShareSlug
                );

                sessionStorage.setItem(
                    "lookbook_attempt",
                    String(data.attempt ?? 1)
                );

                return data;
            },
            []
        );

    /*
     * job_id가 없을 때 share_slug로 완성 여부를
     * 주기적으로 확인합니다.
     *
     * 공유 링크를 다른 사람이 열었을 때도 이 흐름을
     * 사용할 수 있습니다.
     */
    const pollByShareSlug = useCallback(
        (targetShareSlug) => {
            // useCallback 값은 초기화 중 자기 자신을 참조할 수 없어(TDZ)
            // 내부 함수로 재귀한다.
            const run = async () => {
                if (!mountedRef.current) return;

                try {
                    await loadCompletedLookbook(
                        targetShareSlug
                    );
                } catch (error) {
                    if (!mountedRef.current) return;

                    const status =
                        error.response?.status;

                    if (status === 409) {
                        timerRef.current =
                            window.setTimeout(
                                run,
                                DEFAULT_POLL_INTERVAL
                            );

                        return;
                    }

                    if (status === 404) {
                        setErrorMessage(
                            "존재하지 않는 화보이거나 삭제된 화보입니다."
                        );

                        return;
                    }

                    setErrorMessage(
                        "화보를 불러오지 못했습니다."
                    );
                }
            };

            return run();
        },
        [loadCompletedLookbook]
    );

    /*
     * job_id로 Redis 진행 상태를 조회합니다.
     */
    const pollJob = useCallback(
        (jobId, initialShareSlug, initialDelay = 0) => {
            // pollByShareSlug와 같은 이유로 내부 함수로 재귀한다.
            const run = async (targetShareSlug, delay) => {
            if (!mountedRef.current) return;

            if (delay > 0) {
                timerRef.current =
                    window.setTimeout(
                        () => run(targetShareSlug, 0),
                        delay
                    );

                return;
            }

            try {
                const job = await getLookbookJob(
                    jobId
                );

                if (!mountedRef.current) return;

                const status = String(
                    job?.status || ""
                ).toLowerCase();

                console.info(
                    "[Lookbook] 생성 작업 상태",
                    {
                        jobId,
                        status,
                        progress: job?.progress,
                        stage: job?.stage,
                        step: job?.step,
                        shareSlug:
                            job?.share_slug ||
                            targetShareSlug,
                        errorCode:
                            job?.error_code,
                        retryable:
                            job?.retryable,
                    }
                );

                const rawProgress =
                    Number(job?.progress) || 0;

                setProgress(
                    rawProgress <= 1
                        ? Math.round(rawProgress * 100)
                        : Math.round(rawProgress)
                );

                setStage(job?.stage || "");
                setStep(job?.step || "");

                if (
                    COMPLETE_STATUSES.includes(status)
                ) {
                    clearPollTimer();

                    await loadCompletedLookbook(
                        job.share_slug ||
                        targetShareSlug
                    );

                    return;
                }

                if (
                    FAILED_STATUSES.includes(status)
                ) {
                    clearPollTimer();

                    const errorCode =
                        job?.error_code || "";

                    const retryable =
                        Boolean(job?.retryable);

                    console.error(
                        "[Lookbook] 화보 이미지 생성 실패",
                        {
                            jobId,
                            shareSlug:
                                job?.share_slug ||
                                targetShareSlug,
                            status,
                            errorCode:
                                errorCode || null,
                            retryable,
                            progress: job?.progress,
                            stage: job?.stage,
                            step: job?.step,
                            pollAfterMs:
                                job?.poll_after_ms,
                            attempt: job?.attempt,
                            response: job,
                        }
                    );

                    setJobFailure({
                        errorCode,
                        retryable,
                    });

                    setErrorMessage(
                        errorCode ===
                            "GEN_CONTENT_BLOCKED"
                            ? "사진을 처리할 수 없습니다. 다른 사진으로 다시 촬영해 주세요."
                            : retryable
                              ? "화보 생성이 잠시 지연됐습니다. 다시 시도해 주세요."
                              : "화보 생성에 실패했습니다."
                    );

                    return;
                }

                const nextPoll =
                    Number(job?.poll_after_ms) ||
                    DEFAULT_POLL_INTERVAL;

                timerRef.current =
                    window.setTimeout(
                        () =>
                            run(
                                job.share_slug ||
                                targetShareSlug,
                                0
                            ),
                        nextPoll
                    );
            } catch (error) {
                if (!mountedRef.current) return;

                console.error(
                    "화보 상태 조회 실패:",
                    error.response?.data || error
                );

                if (error.response?.status === 404) {
                    try {
                        await loadCompletedLookbook(
                            targetShareSlug
                        );
                    } catch (lookbookError) {
                        if (!mountedRef.current) return;

                        if (
                            lookbookError.response?.status ===
                            409
                        ) {
                            pollByShareSlug(
                                targetShareSlug
                            );
                            return;
                        }

                        setErrorMessage(
                            "화보 진행 상태를 복구하지 못했습니다."
                        );
                    }

                    return;
                }

                // 일시적인 네트워크 오류는 다시 조회합니다.
                timerRef.current =
                    window.setTimeout(
                        () => run(targetShareSlug, 0),
                        DEFAULT_POLL_INTERVAL
                    );
            }
            };

            return run(initialShareSlug, initialDelay);
        },
        [
            clearPollTimer,
            loadCompletedLookbook,
            pollByShareSlug,
        ]
    );

    /*
     * 페이지 진입 시:
     *
     * 1. 우선 완성 화보 조회
     * 2. 아직 준비 중이면 job 폴링
     * 3. job_id가 없으면 share_slug로 폴링
     */
    const startLoading =
        useCallback(async () => {
            if (!shareSlug) {
                setErrorMessage(
                    "화보 주소가 올바르지 않습니다."
                );

                return;
            }

            clearPollTimer();
            setErrorMessage("");
            setJobFailure(null);

            const storedShareSlug =
                sessionStorage.getItem(
                    "share_slug"
                );

            const jobId =
                sessionStorage.getItem(
                    "lookbook_job_id"
                );

            const pollAfterMs =
                Number(
                    sessionStorage.getItem(
                        "lookbook_poll_after_ms"
                    )
                ) || DEFAULT_POLL_INTERVAL;

            sessionStorage.setItem(
                "share_slug",
                shareSlug
            );

            /*
             * 방금 생성 요청으로 이동한 경우에는 완성 화보 API를
             * 먼저 호출하지 않고 작업 상태부터 확인합니다.
             * 아직 생성 중인 화보에 대한 불필요한 409 응답을 피합니다.
             */
            if (
                jobId &&
                storedShareSlug === shareSlug
            ) {
                pollJob(
                    jobId,
                    shareSlug,
                    pollAfterMs
                );

                return;
            }

            try {
                await loadCompletedLookbook(
                    shareSlug
                );
            } catch (error) {
                if (!mountedRef.current) return;

                const status =
                    error.response?.status;

                if (status === 404) {
                    setErrorMessage(
                        "존재하지 않는 화보입니다."
                    );

                    return;
                }

                if (status !== 409) {
                    setErrorMessage(
                        "화보를 불러오지 못했습니다."
                    );

                    return;
                }

                if (
                    jobId &&
                    storedShareSlug === shareSlug
                ) {
                    pollJob(
                        jobId,
                        shareSlug,
                        pollAfterMs
                    );
                } else {
                    pollByShareSlug(shareSlug);
                }
            }
        }, [
            clearPollTimer,
            loadCompletedLookbook,
            pollByShareSlug,
            pollJob,
            shareSlug,
        ]);

    useEffect(() => {
        mountedRef.current = true;
        // startLoading은 시작하며 에러 상태를 동기 setState로 초기화한다.
        // effect 본문에서 바로 부르면 연쇄 렌더 경고라 한 틱 미룬다.
        const kickoff = window.setTimeout(startLoading, 0);

        return () => {
            mountedRef.current = false;
            window.clearTimeout(kickoff);
            clearPollTimer();
        };
    }, [clearPollTimer, startLoading]);

    /*
     * 이미지 Blob과 File 생성
     */
    const getImageFile = async () => {
        if (!lookbook?.image_url) {
            throw new Error(
                "저장할 이미지가 없습니다."
            );
        }

        const response = await fetch(
            lookbook.image_url
        );

        if (!response.ok) {
            throw new Error(
                `이미지 요청 실패: ${response.status}`
            );
        }

        const blob = await response.blob();

        const extension =
            blob.type === "image/png"
                ? "png"
                : "jpg";

        return new File(
            [blob],
            `OandO-${shareSlug}.${extension}`,
            {
                type:
                    blob.type || "image/jpeg",
            }
        );
    };

    /*
     * OS 공유 시트로 이미지 파일 공유
     */
    const handleShare = async () => {
        try {
            const imageFile =
                await getImageFile();

            const shareData = {
                files: [imageFile],
                title: "O&O Lookbook",
                text: "O&O에서 만든 나만의 화보",
            };

            if (
                navigator.share &&
                (!navigator.canShare ||
                    navigator.canShare(shareData))
            ) {
                await navigator.share(shareData);
                return;
            }

            alert(
                "이 브라우저에서는 이미지 파일 공유를 지원하지 않습니다. 이미지 저장을 이용해 주세요."
            );
        } catch (error) {
            /*
             * 공유창을 사용자가 닫은 경우는 별도 오류 안내를
             * 표시하지 않습니다.
             */
            if (error?.name === "AbortError") {
                return;
            }

            console.error(
                "이미지 공유 실패:",
                error
            );

            alert(
                "이미지를 공유하지 못했습니다."
            );
        }
    };

    /*
     * 이미지 저장
     *
     * iOS Safari에서는 download가 무시될 수 있으므로
     * 파일 공유를 먼저 시도합니다.
     */
    const handleDownload = async () => {
        try {
            const imageFile =
                await getImageFile();

            const isIOS =
                /iPad|iPhone|iPod/.test(
                    navigator.userAgent
                ) ||
                (navigator.platform ===
                    "MacIntel" &&
                    navigator.maxTouchPoints > 1);

            const shareData = {
                files: [imageFile],
                title: "O&O Lookbook",
            };

            if (
                isIOS &&
                navigator.share &&
                (!navigator.canShare ||
                    navigator.canShare(shareData))
            ) {
                await navigator.share(shareData);
                return;
            }

            const downloadUrl =
                URL.createObjectURL(imageFile);

            const link =
                document.createElement("a");

            link.href = downloadUrl;
            link.download = imageFile.name;

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.setTimeout(() => {
                URL.revokeObjectURL(
                    downloadUrl
                );
            }, 1000);
        } catch (error) {
            if (error?.name === "AbortError") {
                return;
            }

            console.error(
                "이미지 저장 실패:",
                error
            );

            alert(
                "이미지를 저장하지 못했습니다. 이미지를 길게 눌러 저장해 주세요."
            );
        }
    };

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
            alert(
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
            alert(
                "화보 재생성 가능 횟수를 모두 사용했습니다."
            );

            return;
        }

        try {
            setIsRetrying(true);
            setErrorMessage("");
            setJobFailure(null);

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
                    DEFAULT_POLL_INTERVAL
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
                alert(
                    "화보 재생성 가능 횟수를 모두 사용했습니다."
                );
            } else if (
                status === 409
            ) {
                alert(
                    "이미 화보 생성 요청을 처리하고 있습니다."
                );
            } else {
                alert(
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

                {lookbook.mood?.name && (
                    <S.MoodSection>
                        <S.MoodName>
                            {lookbook.mood.name}
                        </S.MoodName>

                        <S.MoodReason>
                            {lookbook.mood.reason}
                        </S.MoodReason>

                        <S.Palette>
                            {lookbook.mood.palette?.map(
                                (color) => (
                                    <S.PaletteColor
                                        key={color}
                                        $color={color}
                                        aria-label={color}
                                    />
                                )
                            )}
                        </S.Palette>
                    </S.MoodSection>
                )}

                {Array.isArray(
                    lookbook.stats
                ) &&
                    lookbook.stats.length > 0 && (
                        <S.StatsRow>
                            {lookbook.stats.map(
                                (stat) => (
                                    <S.StatItem
                                        key={stat.key}
                                    >
                                        <S.StatValue>
                                            {stat.value}
                                        </S.StatValue>

                                        <S.StatLabel>
                                            {stat.label}
                                        </S.StatLabel>
                                    </S.StatItem>
                                )
                            )}
                        </S.StatsRow>
                    )}

                <S.BottomSection>
                    <S.ActionRow>
                        <S.ShareFileButton
                            type="button"
                            onClick={handleShare}
                        >
                            인스타그램 스토리로 공유
                        </S.ShareFileButton>

                        <S.DownloadButton
                            type="button"
                            onClick={handleDownload}
                        >
                            이미지 저장
                        </S.DownloadButton>
                    </S.ActionRow>

                    <S.HomeButton
                        type="button"
                        onClick={() =>
                            navigate("/", {
                                replace: true,
                            })
                        }
                    >
                        처음 화면으로
                    </S.HomeButton>

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

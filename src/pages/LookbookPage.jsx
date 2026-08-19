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

                if (!mountedRef.current) {
                    return null;
                }

                setLookbook(data);
                setProgress(100);
                setErrorMessage("");

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
        async (targetShareSlug) => {
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
                            () =>
                                pollByShareSlug(
                                    targetShareSlug
                                ),
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
        },
        [loadCompletedLookbook]
    );

    /*
     * job_id로 Redis 진행 상태를 조회합니다.
     */
    const pollJob = useCallback(
        async (
            jobId,
            targetShareSlug,
            initialDelay = 0
        ) => {
            if (!mountedRef.current) return;

            if (initialDelay > 0) {
                timerRef.current =
                    window.setTimeout(
                        () =>
                            pollJob(
                                jobId,
                                targetShareSlug,
                                0
                            ),
                        initialDelay
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

                    setErrorMessage(
                        job?.error_code
                            ? `화보 생성에 실패했습니다. (${job.error_code})`
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
                            pollJob(
                                jobId,
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

                /*
                 * 일시적인 네트워크 오류라면 바로 실패시키지 않고
                 * 다시 조회합니다.
                 */
                timerRef.current =
                    window.setTimeout(
                        () =>
                            pollJob(
                                jobId,
                                targetShareSlug,
                                0
                            ),
                        DEFAULT_POLL_INTERVAL
                    );
            }
        },
        [
            clearPollTimer,
            loadCompletedLookbook,
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

            sessionStorage.setItem(
                "share_slug",
                shareSlug
            );

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

                if (jobId) {
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
        startLoading();

        return () => {
            mountedRef.current = false;
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
    const handleRetry = async () => {
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

        if (Number(remaining) <= 0) {
            alert(
                "화보 재생성 가능 횟수를 모두 사용했습니다."
            );

            return;
        }

        try {
            setIsRetrying(true);

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
                `/l/${result.share_slug}`,
                {
                    replace: true,
                }
            );
        } catch (error) {
            console.error(
                "화보 재생성 실패:",
                error.response?.data || error
            );

            if (
                error.response?.status === 429
            ) {
                alert(
                    "화보 재생성 가능 횟수를 모두 사용했습니다."
                );
            } else if (
                error.response?.status === 409
            ) {
                alert(
                    "이미 화보 생성 요청을 처리하고 있습니다."
                );
            } else {
                alert(
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
                    errorMessage
                        ? startLoading
                        : undefined
                }
            />
        );
    }

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

                <S.ImageSection>
                    <S.LookbookImage
                        src={lookbook.image_url}
                        alt="AI로 생성된 나의 O&O 화보"
                    />
                </S.ImageSection>

                {lookbook.mood && (
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
                            : "화보 다시 만들기"}
                    </S.RetryButton>
                </S.BottomSection>
            </S.LookbookContainer>
        </MobileLayout>
    );
}

export default LookbookPage;
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getLookbook,
  getLookbookJob,
} from "../api/lookbooks";
import {
  isCompleteStatus,
  isFailedStatus,
  normalizeJobProgress,
  getJobFailureMessage,
} from "./lookbookJobRules";

export const DEFAULT_LOOKBOOK_POLL_INTERVAL = 3000;

export function useLookbookPolling(shareSlug) {
  const timerRef = useRef(null);
  const mountedRef = useRef(true);

  const [lookbook, setLookbook] = useState(null);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const [step, setStep] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [jobFailure, setJobFailure] = useState(null);

  const clearPollTimer = useCallback(() => {
    if (!timerRef.current) return;

    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const clearLoadingError = useCallback(() => {
    setErrorMessage("");
    setJobFailure(null);
  }, []);

  const loadCompletedLookbook = useCallback(
    async (targetShareSlug) => {
      const data = await getLookbook(targetShareSlug);

      // 완료 화면으로 전환하기 전에 이미지 디코드를 기다려
      // 100% 직후 빈 화면이 보이는 전환 공백을 줄인다.
      if (data?.image_url) {
        try {
          const image = new Image();
          image.src = data.image_url;
          await (image.decode
            ? image.decode()
            : Promise.resolve());
        } catch {
          // 디코드 실패 처리는 별도 이미지 오류 개선 단계에서 다룬다.
        }
      }

      if (!mountedRef.current) return null;

      setLookbook(data);
      setProgress(100);
      clearLoadingError();

      sessionStorage.setItem(
        "share_slug",
        targetShareSlug,
      );
      sessionStorage.setItem(
        "lookbook_attempt",
        String(data.attempt ?? 1),
      );

      return data;
    },
    [clearLoadingError],
  );

  const pollByShareSlug = useCallback(
    (targetShareSlug) => {
      const run = async () => {
        if (!mountedRef.current) return;

        try {
          await loadCompletedLookbook(targetShareSlug);
        } catch (error) {
          if (!mountedRef.current) return;

          const status = error.response?.status;

          if (status === 409) {
            timerRef.current = window.setTimeout(
              run,
              DEFAULT_LOOKBOOK_POLL_INTERVAL,
            );
            return;
          }

          if (status === 404) {
            setErrorMessage(
              "존재하지 않는 화보이거나 삭제된 화보입니다.",
            );
            return;
          }

          setErrorMessage(
            "화보를 불러오지 못했습니다.",
          );
        }
      };

      return run();
    },
    [loadCompletedLookbook],
  );

  const pollJob = useCallback(
    (jobId, initialShareSlug, initialDelay = 0) => {
      const run = async (targetShareSlug, delay) => {
        if (!mountedRef.current) return;

        if (delay > 0) {
          timerRef.current = window.setTimeout(
            () => run(targetShareSlug, 0),
            delay,
          );
          return;
        }

        try {
          const job = await getLookbookJob(jobId);

          if (!mountedRef.current) return;

          const status = job?.status;

          setProgress(normalizeJobProgress(job?.progress));
          setStage(job?.stage || "");
          setStep(job?.step || "");

          if (isCompleteStatus(status)) {
            clearPollTimer();
            await loadCompletedLookbook(
              job.share_slug || targetShareSlug,
            );
            return;
          }

          if (isFailedStatus(status)) {
            clearPollTimer();

            const failure = {
              errorCode: job?.error_code || "",
              retryable: Boolean(job?.retryable),
            };

            setJobFailure(failure);
            setErrorMessage(getJobFailureMessage(failure));
            return;
          }

          const nextPoll =
            Number(job?.poll_after_ms) ||
            DEFAULT_LOOKBOOK_POLL_INTERVAL;

          timerRef.current = window.setTimeout(
            () =>
              run(
                job.share_slug || targetShareSlug,
                0,
              ),
            nextPoll,
          );
        } catch (error) {
          if (!mountedRef.current) return;

          if (error.response?.status === 404) {
            try {
              await loadCompletedLookbook(
                targetShareSlug,
              );
            } catch (lookbookError) {
              if (!mountedRef.current) return;

              if (
                lookbookError.response?.status === 409
              ) {
                pollByShareSlug(targetShareSlug);
                return;
              }

              setErrorMessage(
                "화보 진행 상태를 복구하지 못했습니다.",
              );
            }
            return;
          }

          timerRef.current = window.setTimeout(
            () => run(targetShareSlug, 0),
            DEFAULT_LOOKBOOK_POLL_INTERVAL,
          );
        }
      };

      return run(initialShareSlug, initialDelay);
    },
    [
      clearPollTimer,
      loadCompletedLookbook,
      pollByShareSlug,
    ],
  );

  const startLoading = useCallback(async () => {
    if (!shareSlug) {
      setErrorMessage(
        "화보 주소가 올바르지 않습니다.",
      );
      return;
    }

    clearPollTimer();
    clearLoadingError();

    const storedShareSlug =
      sessionStorage.getItem("share_slug");
    const jobId = sessionStorage.getItem(
      "lookbook_job_id",
    );
    const pollAfterMs =
      Number(
        sessionStorage.getItem(
          "lookbook_poll_after_ms",
        ),
      ) || DEFAULT_LOOKBOOK_POLL_INTERVAL;

    sessionStorage.setItem("share_slug", shareSlug);

    // 방금 생성 요청으로 이동했다면 불필요한 409를 만들지 않고
    // 완성 화보 조회보다 job 상태 조회를 먼저 시작한다.
    if (jobId && storedShareSlug === shareSlug) {
      pollJob(jobId, shareSlug, pollAfterMs);
      return;
    }

    try {
      await loadCompletedLookbook(shareSlug);
    } catch (error) {
      if (!mountedRef.current) return;

      const status = error.response?.status;

      if (status === 404) {
        setErrorMessage("존재하지 않는 화보입니다.");
        return;
      }

      if (status !== 409) {
        setErrorMessage(
          "화보를 불러오지 못했습니다.",
        );
        return;
      }

      if (jobId && storedShareSlug === shareSlug) {
        pollJob(jobId, shareSlug, pollAfterMs);
      } else {
        pollByShareSlug(shareSlug);
      }
    }
  }, [
    clearLoadingError,
    clearPollTimer,
    loadCompletedLookbook,
    pollByShareSlug,
    pollJob,
    shareSlug,
  ]);

  useEffect(() => {
    mountedRef.current = true;
    const kickoff = window.setTimeout(startLoading, 0);

    return () => {
      mountedRef.current = false;
      window.clearTimeout(kickoff);
      clearPollTimer();
    };
  }, [clearPollTimer, startLoading]);

  return {
    lookbook,
    progress,
    stage,
    step,
    errorMessage,
    jobFailure,
    startLoading,
    clearLoadingError,
  };
}

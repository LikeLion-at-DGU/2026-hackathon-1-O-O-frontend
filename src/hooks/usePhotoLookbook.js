// src/hooks/usePhotoLookbook.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadPhotoAndMask } from "../api/photoUpload";
import { createLookbook } from "../api/lookbooks";
import { getApiError } from "../api/errors";
import { processPhotoWithMediaPipe } from "../utils/mediaPipeHelper";

/**
 * Data URL (Base64) 문자열을 Blob 객체로 변환
 */
function dataURLtoBlob(dataUrl) {
    if (!dataUrl) {
        throw new Error("사진 데이터가 없습니다.");
    }

    const [metadata, encodedData] = dataUrl.split(",");
    const mimeMatch = metadata.match(/:(.*?);/);
    const mimeType = mimeMatch?.[1] || "image/jpeg";

    const binaryString = atob(encodedData);
    const byteArray = new Uint8Array(binaryString.length);

    for (let index = 0; index < binaryString.length; index += 1) {
        byteArray[index] = binaryString.charCodeAt(index);
    }

    return new Blob([byteArray], { type: mimeType });
    }

    /**
     * Promise 비동기 작업에 타임아웃 제한 적용
     */
    const withTimeout = (promise, ms) =>
    Promise.race([
        promise,
        new Promise((_, reject) =>
        window.setTimeout(() => reject(new Error("MediaPipe 시간 초과")), ms)
        ),
    ]);

    export default function usePhotoLookbook(photo) {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleRetake = () => {
        if (isSubmitting) return;
        sessionStorage.removeItem("temp_captured_photo");
        navigate("/camera", { replace: true });
    };

    const handleConfirmAndUpload = async () => {
        if (!photo || isSubmitting) return;

        try {
        setIsSubmitting(true);
        setErrorMessage("");

        const reportSlug = sessionStorage.getItem("report_slug");
        if (!reportSlug) {
            throw new Error(
            "리포트 정보가 없습니다. 관람 종료 후 다시 시도해 주세요."
            );
        }

        const savedCandidate = sessionStorage.getItem("selected_candidate");
        let selectedCandidate = null;

        try {
            selectedCandidate = savedCandidate ? JSON.parse(savedCandidate) : null;
        } catch {
            selectedCandidate = null;
        }

        const selectedProductId = selectedCandidate?.product_id;
        if (!selectedProductId) {
            throw new Error(
            "선택한 화보 후보가 없습니다. 리포트에서 상품을 다시 선택해 주세요."
            );
        }

        // 1. 원본 사진 Blob 변환
        const photoBlob = dataURLtoBlob(photo);

        // 2. MediaPipe 처리 (실패 시 일반 모드로 Fallback)
        let maskBlob = null;
        let photoMeta = null;

        try {
            const mediaPipeResult = await withTimeout(
            processPhotoWithMediaPipe(photo),
            8000
            );

            if (
            mediaPipeResult?.maskBlob instanceof Blob &&
            mediaPipeResult.maskBlob.size > 0
            ) {
            maskBlob = mediaPipeResult.maskBlob;
            }

            const detectedMeta = mediaPipeResult?.photoMeta;
            if (detectedMeta && Number(detectedMeta.face_count) > 0) {
            photoMeta = {
                face_count: Number(detectedMeta.face_count),
                face_ratio: Number(detectedMeta.face_ratio),
                face_center: detectedMeta.face_center,
            };
            }
        } catch {
            // 마스크 없이 원본 사진만으로 화보 생성을 계속한다.
        }

        // 3. 사진 및 마스크 업로드
        const { photo_key, mask_key } = await uploadPhotoAndMask(
            photoBlob,
            maskBlob
        );

        // 4. 페이로드 생성 및 세션 백업
        const payload = {
            product_ids: [String(selectedProductId)],
            photo_key,
            consent: true,
        };

        if (mask_key) payload.mask_key = mask_key;
        if (photoMeta) payload.photo_meta = photoMeta;

        sessionStorage.setItem("lookbook_request", JSON.stringify(payload));

        // 5. 화보 생성 요청
        const result = await createLookbook(reportSlug, payload);
        const jobId = result?.job_id;
        const shareSlug = result?.share_slug;

        if (!jobId || !shareSlug) {
            throw new Error("화보 생성 작업 정보를 받지 못했습니다.");
        }

        sessionStorage.setItem("lookbook_job_id", jobId);
        sessionStorage.setItem("share_slug", shareSlug);
        sessionStorage.setItem("lookbook_attempt", String(result.attempt ?? 1));
        sessionStorage.setItem(
            "remaining_regenerations",
            String(result.remaining_regenerations ?? 0)
        );
        sessionStorage.setItem(
            "lookbook_poll_after_ms",
            String(result.poll_after_ms ?? 3000)
        );

        navigate(`/lookbook/${shareSlug}`, {
            replace: true,
            state: { jobId },
        });
        } catch (error) {
        const { status, message, detail } = getApiError(error);
        const errorDetail = typeof detail === "string" ? detail : message;

        if (status === 400) {
            setErrorMessage(
            errorDetail || "사진 또는 선택한 상품 정보를 확인해 주세요."
            );
        } else if (status === 403) {
            setErrorMessage("방문 인증 정보가 일치하지 않습니다.");
        } else if (status === 409) {
            setErrorMessage(
            "리포트 분석이 아직 완료되지 않았습니다. 잠시 후 다시 시도해 주세요."
            );
        } else if (status === 429) {
            setErrorMessage("화보 생성 가능 횟수를 모두 사용했습니다.");
        } else {
            setErrorMessage(
            error.message || "화보 생성 요청 중 오류가 발생했습니다."
            );
        }
        } finally {
        setIsSubmitting(false);
        }
    };

    return {
        isSubmitting,
        errorMessage,
        handleRetake,
        handleConfirmAndUpload,
    };
}

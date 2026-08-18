    import { api } from "./api";
    import axios from "axios";

    /**
     * 1. 사진/마스크 동시 업로드용 Presigned URL 발급 요청
     * POST /api/v1/uploads/presign
     */
    export const getPresignedUrls = async ({ contentType, byteSize }) => {
    const visitToken = sessionStorage.getItem("visit_token");

    const response = await api.post(
        "/uploads/presign",
        {
        content_type: contentType,
        byte_size: byteSize,
        },
        {
        headers: {
            "X-Visit-Token": visitToken,
        },
        }
    );

    return response.data;
    /*
        반환 예시:
        {
        photo_key: "photos/2026/08/17/9c1f4a2b.jpg",
        photo_upload_url: "https://...",
        mask_key: "photos/2026/08/17/9c1f4a2b_mask.png",
        mask_upload_url: "https://...",
        headers: {
            photo: { "Content-Type": "image/jpeg" },
            mask: { "Content-Type": "image/png" }
        },
        expires_in: 600
        }
    */
    };

    /**
     * 2. 스토리지(S3/GCS)로 파일 직업로드 (PUT)
     * ⚠️ 순수 axios를 사용하여 Authorization/인증 인터셉터가 들어가지 않도록 합니다.
     */
    export const uploadFileToStorage = async (uploadUrl, fileBlob, contentType) => {
    await axios.put(uploadUrl, fileBlob, {
        headers: {
        "Content-Type": contentType,
        },
    });
    };

    /**
     * 3. 통합 업로드 파이프라인
     * 원본 사진 Blob과 마스크 PNG Blob을 한 번에 스토리지에 올리고 키 반환
     */
    export const uploadPhotoAndMask = async (photoBlob, maskBlob = null) => {
    // 5MB 용량 제한 체크
    const MAX_SIZE = 5 * 1024 * 1024;
    if (photoBlob.size > MAX_SIZE) {
        throw new Error("사진 용량은 5MB 이하여야 합니다.");
    }

    // 1) Presigned URL 발급
    const presignData = await getPresignedUrls({
        contentType: photoBlob.type || "image/jpeg",
        byteSize: photoBlob.size,
    });

    const {
        photo_key,
        photo_upload_url,
        mask_key,
        mask_upload_url,
        headers: uploadHeaders,
    } = presignData;

    // 2) 원본 사진 직업로드 (PUT)
    const photoUploadPromise = uploadFileToStorage(
        photo_upload_url,
        photoBlob,
        uploadHeaders?.photo?.["Content-Type"] || photoBlob.type || "image/jpeg"
    );

    // 3) 마스크 PNG 직업로드 (PUT) - 마스크가 존재하는 경우
    const maskUploadPromise =
        maskBlob && mask_upload_url
        ? uploadFileToStorage(
            mask_upload_url,
            maskBlob,
            uploadHeaders?.mask?.["Content-Type"] || "image/png"
            )
        : Promise.resolve();

    // 병렬 업로드 진행
    await Promise.all([photoUploadPromise, maskUploadPromise]);

    // 4) 화보 생성 요청에 사용할 키 반환
    return {
        photo_key,
        mask_key: maskBlob ? mask_key : null,
    };
    };
import axios from "axios";
import { requestUploadUrls } from "./lookbooks";
import { logger } from "../utils/logger";

const PHOTO_MAX_BYTES =
  5 * 1024 * 1024;

/*
  Presigned URL을 이용해 사진 또는 마스크를 스토리지에 직접 PUT 업로드합니다.
 */
export const uploadFileToStorage =
  async (
    uploadUrl,
    fileBlob,
    uploadHeaders = {}
  ) => {
    if (!uploadUrl) {
      throw new Error(
        "파일 업로드 URL이 없습니다."
      );
    }

    if (!fileBlob) {
      throw new Error(
        "업로드할 파일이 없습니다."
      );
    }

    /* 개발 환경의 가짜 업로드 주소라면 실제 네트워크 요청을 생략합니다.*/
    if (
      uploadUrl.includes(
        "uploads.invalid"
      ) ||
      uploadUrl.includes(
        "dev-unsigned"
      )
    ) {
      console.warn(
        "[개발 모드] 가짜 업로드 URL이므로 PUT 요청을 생략합니다.",
        uploadUrl
      );

      return {
        status: 200,
        statusText: "OK (Mocked)",
      };
    }

    const headers = {
      ...uploadHeaders,
    };

    /*
     * 서버가 Content-Type을 지정하지 않은 경우에만
     * 파일 Blob의 MIME 타입을 사용합니다.
     */
    if (
      !headers["Content-Type"] &&
      !headers["content-type"]
    ) {
      headers["Content-Type"] =
        fileBlob.type ||
        "application/octet-stream";
    }

    const response = await axios.put(
      uploadUrl,
      fileBlob,
      {
        headers,
      }
    );

    return response;
  };

/**
 * 사진과 선택적 마스크를 업로드하고
 * 화보 생성 API에 전달할 key를 반환합니다.
 */
export const uploadPhotoAndMask =
  async (
    photoBlob,
    maskBlob = null
  ) => {
    if (!photoBlob) {
      throw new Error(
        "촬영한 사진이 없습니다."
      );
    }

    if (
      photoBlob.size >
      PHOTO_MAX_BYTES
    ) {
      throw new Error(
        "사진 용량은 5MB 이하여야 합니다."
      );
    }

    /*
     * Presigned URL 발급
     *
     * 요청 한 번으로 사진·마스크 업로드 주소를
     * 모두 받습니다.
     */
    const presignData =
      await requestUploadUrls({
        contentType:
          photoBlob.type ||
          "image/jpeg",
        byteSize: photoBlob.size,
      });

    const {
      photo_key,
      photo_upload_url,
      mask_key,
      mask_upload_url,
      headers = {},
    } = presignData;

    // presigned URL은 일정 시간 유효한 자격 증명이라 로그에 남기지 않는다
    logger.debug("[Lookbook Upload] Presign 발급", {
      hasPhotoUrl: Boolean(photo_upload_url),
      hasMaskUrl: Boolean(mask_upload_url),
    });

    if (
      !photo_key ||
      !photo_upload_url
    ) {
      throw new Error(
        "사진 업로드 주소를 발급받지 못했습니다."
      );
    }

    /*
     * 원본 사진 업로드
     */
    logger.debug("[Lookbook Upload] 사진 PUT 시작", {
      contentType: photoBlob.type,
      byteSize: photoBlob.size,
    });

    const photoUploadResponse =
      await uploadFileToStorage(
      photo_upload_url,
      photoBlob,
      headers.photo
    );

    logger.debug("[Lookbook Upload] 사진 PUT 완료", {
      status: photoUploadResponse?.status,
    });

    let uploadedMaskKey = null;

    /*
     * 마스크가 정상 생성됐고 서버가 마스크 URL을
     * 내려준 경우에만 마스크를 업로드합니다.
     */
    if (
      maskBlob &&
      maskBlob.size > 0 &&
      mask_upload_url &&
      mask_key
    ) {
      logger.debug("[Lookbook Upload] 마스크 PUT 시작", {
        contentType: maskBlob.type,
        byteSize: maskBlob.size,
      });

      const maskUploadResponse =
        await uploadFileToStorage(
        mask_upload_url,
        maskBlob,
        headers.mask ?? { "Content-Type": "image/png" }
      );

      uploadedMaskKey = mask_key;

      logger.debug("[Lookbook Upload] 마스크 PUT 완료", {
        status: maskUploadResponse?.status,
      });
    } else {
      logger.info(
        "[Lookbook Upload] 마스크 PUT 생략",
        {
          hasMaskBlob: Boolean(maskBlob),
          maskByteSize: maskBlob?.size ?? 0,
          hasMaskUploadUrl: Boolean(
            mask_upload_url
          ),
          hasMaskKey: Boolean(mask_key),
        }
      );
    }

    return {
      photo_key,
      mask_key: uploadedMaskKey,
    };
  };

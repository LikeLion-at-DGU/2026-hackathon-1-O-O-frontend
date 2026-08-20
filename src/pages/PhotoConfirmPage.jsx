import { useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import styled from "styled-components";

import MobileLayout from "../components/MobileLayout/MobileLayout";

import { uploadPhotoAndMask } from "../api/photoUpload";
import { createLookbook } from "../api/lookbooks";
import { getApiError } from "../api/errors";
import { processPhotoWithMediaPipe } from "../utils/mediaPipeHelper";

function dataURLtoBlob(dataUrl) {
  if (!dataUrl) {
    throw new Error("사진 데이터가 없습니다.");
  }

  const [metadata, encodedData] =
    dataUrl.split(",");

  const mimeMatch = metadata.match(
    /:(.*?);/
  );

  const mimeType =
    mimeMatch?.[1] || "image/jpeg";

  const binaryString = atob(encodedData);
  const byteArray = new Uint8Array(
    binaryString.length
  );

  for (
    let index = 0;
    index < binaryString.length;
    index += 1
  ) {
    byteArray[index] =
      binaryString.charCodeAt(index);
  }

  return new Blob([byteArray], {
    type: mimeType,
  });
}

export default function PhotoConfirmPage() {
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * CameraPage의 navigation state를 우선 사용하고,
   * 새로고침한 경우 sessionStorage 백업을 사용합니다.
   */
  const photo =
    location.state?.photo ||
    sessionStorage.getItem(
      "temp_captured_photo"
    );

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const handleRetake = () => {
    if (isSubmitting) return;

    sessionStorage.removeItem(
      "temp_captured_photo"
    );

    navigate("/camera", {
      replace: true,
    });
  };

  const handleConfirmAndUpload = async () => {
    if (!photo || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const reportSlug =
        sessionStorage.getItem("report_slug");

      if (!reportSlug) {
        throw new Error(
          "리포트 정보가 없습니다. 관람 종료 후 다시 시도해 주세요."
        );
      }

      const savedProducts =
        sessionStorage.getItem(
          "selected_products"
        );

      const productIds = savedProducts
        ? JSON.parse(savedProducts)
        : [];

      if (
        !Array.isArray(productIds) ||
        productIds.length === 0
      ) {
        throw new Error(
          "선택한 상품이 없습니다. 리포트에서 상품을 선택해 주세요."
        );
      }

      /*
       * 원본 사진을 Blob으로 변환합니다.
       */
      const photoBlob =
        dataURLtoBlob(photo);

      /*
       * MediaPipe 처리를 시도합니다.
       *
       * 검출 실패는 전체 화보 생성 실패로 처리하지 않습니다.
       * 명세상 mask_key와 photo_meta는 선택값입니다.
       */
      let maskBlob = null;
      let photoMeta = null;

      try {
        const mediaPipeResult =
          await processPhotoWithMediaPipe(photo);

        if (
          mediaPipeResult?.maskBlob instanceof Blob &&
          mediaPipeResult.maskBlob.size > 0
        ) {
          maskBlob =
            mediaPipeResult.maskBlob;
        }

        const detectedMeta =
          mediaPipeResult?.photoMeta;

        /*
         * 얼굴이 실제로 검출됐을 때만
         * photo_meta를 생성 요청에 포함합니다.
         */
        if (
          detectedMeta &&
          Number(detectedMeta.face_count) > 0
        ) {
          photoMeta = {
            face_count: Number(
              detectedMeta.face_count
            ),
            face_ratio: Number(
              detectedMeta.face_ratio
            ),
            face_center:
              detectedMeta.face_center,
          };
        }
      } catch (mediaPipeError) {
        console.warn(
          "MediaPipe 검출에 실패하여 일반 생성으로 진행합니다.",
          mediaPipeError
        );
      }

      /*
       * Presigned URL 발급 후 사진과 마스크를
       * 스토리지에 직접 업로드합니다.
       */
      const {
        photo_key,
        mask_key,
      } = await uploadPhotoAndMask(
        photoBlob,
        maskBlob
      );

      /*
       * 필수 필드부터 생성합니다.
       */
      const payload = {
        product_ids: productIds.map(String),
        photo_key,
        consent: true,
      };

      /*
       * 선택 필드는 값이 있을 때만 추가합니다.
       */
      if (mask_key) {
        payload.mask_key = mask_key;
      }

      if (photoMeta) {
        payload.photo_meta = photoMeta;
      }

      /*
       * 재생성할 때 같은 payload가 필요하므로 저장합니다.
       */
      sessionStorage.setItem(
        "lookbook_request",
        JSON.stringify(payload)
      );

      /*
       * 화보 생성 작업을 큐에 등록합니다.
       */
      const result = await createLookbook(
        reportSlug,
        payload
      );

      const jobId = result?.job_id;
      const shareSlug = result?.share_slug;

      if (!jobId || !shareSlug) {
        throw new Error(
          "화보 생성 작업 정보를 받지 못했습니다."
        );
      }

      /*
       * 새로고침 복구와 재생성을 위한 값입니다.
       */
      sessionStorage.setItem(
        "lookbook_job_id",
        jobId
      );

      sessionStorage.setItem(
        "share_slug",
        shareSlug
      );

      sessionStorage.setItem(
        "lookbook_attempt",
        String(result.attempt ?? 1)
      );

      sessionStorage.setItem(
        "remaining_regenerations",
        String(
          result.remaining_regenerations ?? 0
        )
      );

      sessionStorage.setItem(
        "lookbook_poll_after_ms",
        String(
          result.poll_after_ms ?? 3000
        )
      );

      /*
       * share_slug URL에서 로딩과 완성 화면을 모두 처리합니다.
       * replace를 사용하여 확인 페이지로 뒤로 가지 않게 합니다.
       */
      navigate(`/l/${shareSlug}`, {
        replace: true,
        state: {
          jobId,
        },
      });
    } catch (error) {
      console.error(
        "화보 생성 요청 실패:",
        error.response?.data || error
      );

      const {
        status,
        message,
        detail,
      } = getApiError(error);

      const errorDetail =
        typeof detail === "string"
          ? detail
          : message;

      if (status === 400) {
        setErrorMessage(
          errorDetail ||
            "사진 또는 선택한 상품 정보를 확인해 주세요."
        );
      } else if (status === 403) {
        setErrorMessage(
          "방문 인증 정보가 일치하지 않습니다."
        );
      } else if (status === 409) {
        setErrorMessage(
          "리포트 분석이 아직 완료되지 않았습니다. 잠시 후 다시 시도해 주세요."
        );
      } else if (status === 429) {
        setErrorMessage(
          "화보 생성 가능 횟수를 모두 사용했습니다."
        );
      } else {
        setErrorMessage(
          error.message ||
            "화보 생성 요청 중 오류가 발생했습니다."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!photo) {
    return (
      <MobileLayout>
        <CenterBox>
          <p>촬영된 사진이 없습니다.</p>

          <RetakeButton
            type="button"
            onClick={() =>
              navigate("/camera")
            }
          >
            카메라로 이동
          </RetakeButton>
        </CenterBox>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <Container>
        <TitleArea>
          <Title>
            사진을 확인해 주세요
          </Title>

          <SubTitle>
            이 모습 그대로 룩북 화보가
            제작됩니다.
          </SubTitle>
        </TitleArea>

        <ImageWrapper>
          <PreviewImage
            src={photo}
            alt="촬영된 사진"
          />
        </ImageWrapper>

        {errorMessage && (
          <ErrorMessage>
            {errorMessage}
          </ErrorMessage>
        )}

        <ButtonGroup>
          <RetakeButton
            type="button"
            onClick={handleRetake}
            disabled={isSubmitting}
          >
            다시 찍기
          </RetakeButton>

          <ConfirmButton
            type="button"
            onClick={
              handleConfirmAndUpload
            }
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "사진을 처리하고 있어요..."
              : "이 사진으로 화보 만들기"}
          </ConfirmButton>
        </ButtonGroup>
      </Container>
    </MobileLayout>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;

  min-height: calc(100dvh - 103px);
  padding: 24px 20px;

  box-sizing: border-box;
`;

const TitleArea = styled.div`
  margin-bottom: 16px;
`;

const Title = styled.h2`
  margin: 0 0 6px;

  color: #111;
  font-size: 20px;
  font-weight: 700;
`;

const SubTitle = styled.p`
  margin: 0;

  color: #777;
  font-size: 14px;
`;

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  flex: 1;
  width: 100%;
  max-height: 480px;

  overflow: hidden;

  background-color: #000;
  border-radius: 16px;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;

  object-fit: cover;
`;

const ErrorMessage = styled.p`
  margin: 14px 0 0;

  color: #c8503c;
  font-size: 13px;
  line-height: 150%;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;

  margin-top: 20px;
`;

const RetakeButton = styled.button`
  flex: 1;
  height: 52px;

  color: #333;
  font-size: 15px;
  font-weight: 600;

  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ConfirmButton = styled.button`
  flex: 2;
  height: 52px;

  color: #fff;
  font-size: 15px;
  font-weight: 600;

  background-color: #111;
  border: none;
  border-radius: 12px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CenterBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;

  min-height: calc(100dvh - 103px);
`;

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import MobileLayout from "../components/MobileLayout/MobileLayout";
import Header from "../components/Header/Header";
import * as S from "./CameraPage.styled";

function CameraPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const navigate = useNavigate();

  const [cameraError, setCameraError] =
    useState(false);

  const [isCapturing, setIsCapturing] =
    useState(false);

  useEffect(() => {
    let stream = null;
    let isMounted = true;

    const startCamera = async () => {
      try {
        setCameraError(false);

        if (
          !navigator.mediaDevices ||
          !navigator.mediaDevices.getUserMedia
        ) {
          throw new Error(
            "이 브라우저는 카메라 촬영을 지원하지 않습니다."
          );
        }

        const isMobile =
          /Android|iPhone|iPad|iPod/i.test(
            navigator.userAgent
          );

        try {
          /*
           * 모바일에서는 후면 카메라를 우선 요청하고,
           * PC에서는 기본 웹캠을 요청합니다.
           */
          stream =
            await navigator.mediaDevices.getUserMedia({
              video: isMobile
                ? {
                    facingMode: {
                      ideal: "environment",
                    },
                    width: {
                      ideal: 1080,
                    },
                    height: {
                      ideal: 1920,
                    },
                  }
                : {
                    width: {
                      ideal: 1280,
                    },
                    height: {
                      ideal: 720,
                    },
                  },
              audio: false,
            });
        } catch (firstError) {
          console.warn(
            "선호 카메라 요청에 실패하여 기본 카메라로 다시 시도합니다.",
            firstError
          );

          stream =
            await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false,
            });
        }

        if (
          isMounted &&
          videoRef.current
        ) {
          videoRef.current.srcObject =
            stream;

          await videoRef.current.play();
        }
      } catch (error) {
        console.error(
          "카메라 실행 실패:",
          error
        );

        if (isMounted) {
          setCameraError(true);
        }
      }
    };

    startCamera();

    return () => {
      isMounted = false;

      if (stream) {
        stream
          .getTracks()
          .forEach((track) =>
            track.stop()
          );
      }

      if (videoRef.current) {
        videoRef.current.srcObject =
          null;
      }
    };
  }, []);

  const takePhoto = () => {
    if (isCapturing) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      alert(
        "카메라 화면을 불러오지 못했습니다."
      );
      return;
    }

    if (
      video.readyState <
      HTMLMediaElement.HAVE_CURRENT_DATA
    ) {
      alert(
        "카메라를 준비하고 있습니다. 잠시 후 다시 촬영해 주세요."
      );
      return;
    }

    const width =
      video.videoWidth ||
      video.clientWidth ||
      640;

    const height =
      video.videoHeight ||
      video.clientHeight ||
      480;

    if (!width || !height) {
      alert(
        "카메라 해상도를 확인하지 못했습니다."
      );
      return;
    }

    try {
      setIsCapturing(true);

      canvas.width = width;
      canvas.height = height;

      const context =
        canvas.getContext("2d");

      if (!context) {
        throw new Error(
          "Canvas를 사용할 수 없습니다."
        );
      }

      context.drawImage(
        video,
        0,
        0,
        width,
        height
      );

      const image =
        canvas.toDataURL(
          "image/jpeg",
          0.9
        );

      if (
        !image ||
        image.length < 500
      ) {
        throw new Error(
          "촬영된 이미지가 올바르지 않습니다."
        );
      }

      /*
       * 새로고침했을 때 사진 확인 페이지를
       * 복구하기 위한 임시 저장입니다.
       */
      try {
        sessionStorage.setItem(
          "temp_captured_photo",
          image
        );
      } catch (storageError) {
        /*
         * 고해상도 이미지는 sessionStorage 용량을
         * 초과할 수 있습니다.
         *
         * 이 경우에도 navigation state로는 전달되므로
         * 촬영 흐름은 계속 진행합니다.
         */
        console.warn(
          "촬영 사진을 sessionStorage에 저장하지 못했습니다.",
          storageError
        );
      }

      navigate("/camera/confirm", {
        state: {
          photo: image,
        },
      });
    } catch (error) {
      console.error(
        "사진 촬영 실패:",
        error
      );

      alert(
        "사진을 촬영하지 못했습니다. 다시 시도해 주세요."
      );

      setIsCapturing(false);
    }
  };

  return (
    <MobileLayout
      header={
        <Header showActions={false} />
      }
    >
      <S.PageContainer>
        <S.CameraArea>
          <S.Video
            ref={videoRef}
            autoPlay
            playsInline
            muted
          />

          <S.GuideText>
            화보에 들어갈 사진을
            찍어주세요!
            <br />
            전신이 모두 보이도록 거리를
            두고 촬영해 주세요.
          </S.GuideText>

          <S.PersonGuide />

          {cameraError && (
            <S.ErrorMessage>
              카메라를 사용할 수 없습니다.
              <br />
              브라우저의 카메라 권한을
              확인해 주세요.
            </S.ErrorMessage>
          )}

          <canvas
            ref={canvasRef}
            style={{
              display: "none",
            }}
          />

          <S.CaptureButton
            type="button"
            onClick={takePhoto}
            disabled={
              cameraError ||
              isCapturing
            }
            aria-label="사진 촬영"
          >
            <S.CameraIcon>
              <S.CameraLens />
            </S.CameraIcon>
          </S.CaptureButton>
        </S.CameraArea>
      </S.PageContainer>
    </MobileLayout>
  );
}

export default CameraPage;
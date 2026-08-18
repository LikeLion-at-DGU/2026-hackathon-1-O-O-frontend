import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./CameraPage.styled";
import MobileLayout from "../components/MobileLayout/MobileLayout";
import Header from "../components/Header/Header";
import { uploadPhotoAndMask } from "../api/photoUpload";
import { createLookbook } from "../api/analytics";

function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

function CameraPage() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const navigate = useNavigate();

    const [photo, setPhoto] = useState(null);
    const [cameraError, setCameraError] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        let stream;

        const startCamera = async () => {
            try {
                setCameraError(false);

                const isMobile =
                    /Android|iPhone|iPad|iPod/i.test(
                        navigator.userAgent
                    );

                /* 일단 먼저 1차 시도 
                모바일 -> 후면 카메라 우선 // (당일용) 노트북: 기본 웹캠 */
                try {
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
                        "첫 번째 카메라 요청 실패. 기본 카메라로 재시도합니다.",
                        firstError
                    );

                    /* 2차 시도에는 기기 종류 상관없이
                     사용 가능한 기본 카메라 요청 */
                    
                    stream =
                        await navigator.mediaDevices.getUserMedia({
                            video: true,
                            audio: false,
                        });
                }

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("카메라 실행 최종 실패:", error);

                setCameraError(true);
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => {
                    track.stop();
                });
            }
        };
    }, []);

const takePhoto = () => {
    console.group("📸 [촬영 디버깅]");
    const video = videoRef.current;
    const canvas = canvasRef.current;

    console.log("1. Video DOM 요소:", video);
    console.log("2. Canvas DOM 요소:", canvas);

    if (!video || !canvas) {
        console.error("❌ 비디오 또는 캔버스 요소를 찾을 수 없습니다.");
        console.groupEnd();
        return;
    }

    console.log("3. 비디오 해상도:", {
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        clientWidth: video.clientWidth,
        clientHeight: video.clientHeight,
    });

    const width = video.videoWidth || video.clientWidth || 640;
    const height = video.videoHeight || video.clientHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, width, height);

    // 이미지 추출
    const image = canvas.toDataURL("image/jpeg", 0.9);
    console.log("4. 추출된 이미지 문자열 길이:", image.length);
    console.log("5. 이미지 데이터 앞부분:", image.substring(0, 50));

    // 길이가 너무 짧으면 (예: 100글자 미만) 빈 이미지임
    if (image.length < 500) {
        console.warn("⚠️ 이미지가 비어있거나 정상 캡처되지 않았습니다.");
    }

    // 세션 백업 저장
    try {
        sessionStorage.setItem("temp_captured_photo", image);
        console.log("6. 세션 스토리지 백업 저장 완료");
    } catch (e) {
        console.error("세션 스토리지 용량 초과 등 오류:", e);
    }

    console.log("7. /camera/confirm 페이지로 이동 시도");
    console.groupEnd();

    // 확인 페이지로 이동
    navigate("/camera/confirm", {
        state: { photo: image },
    });
};

    const handleRetake = () => {
        setPhoto(null);
    };

    const handleUsePhoto = () => {
        navigate("/lookbookloading", {
            state: {
                photo,
            },
        });
    };

    return (
        <MobileLayout
  header={<Header showActions={false} />}
>
            <S.PageContainer>
                <S.CameraArea>
                    {photo ? (
                        <S.Photo
                            src={photo}
                            alt="촬영된 사진"
                        />
                    ) : (
                        <S.Video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                        />
                    )}

                    {!photo && (
                        <>
                            <S.GuideText>
                                화보에 들어갈 사진을 찍어주세요!
                                <br />
                                전신이 모두 보이도록 거리를 두고 촬영해 주세요.
                            </S.GuideText>

                            <S.PersonGuide />
                        </>
                    )}

                    {cameraError && !photo && (
                        <S.ErrorMessage>
                            카메라를 사용할 수 없습니다.
                            <br />
                            브라우저의 카메라 권한을 확인해 주세요.
                        </S.ErrorMessage>
                    )}

                    <canvas
                        ref={canvasRef}
                        style={{ display: "none" }}
                    />

                    {!photo ? (
                        <S.CaptureButton
                            type="button"
                            onClick={takePhoto}
                            aria-label="사진 촬영"
                        >
                            <S.CameraIcon>
                                <S.CameraLens />
                            </S.CameraIcon>
                        </S.CaptureButton>
                    ) : (
                        <S.ActionButtons>
                            <S.RetakeButton
                                type="button"
                                onClick={handleRetake}
                            >
                                다시 찍기
                            </S.RetakeButton>

                            <S.UseButton
                                type="button"
                                onClick={handleUsePhoto}
                            >
                                이 사진 사용하기
                            </S.UseButton>
                        </S.ActionButtons>
                    )}
                </S.CameraArea>
            </S.PageContainer>
        </MobileLayout>
    );
}

export default CameraPage;
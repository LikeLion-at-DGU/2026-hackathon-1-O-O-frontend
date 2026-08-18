import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./CameraPage.styled";
import MobileLayout from "../components/MobileLayout/MobileLayout";
import Header from "../components/Header/Header";

function CameraPage() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const navigate = useNavigate();

    const [photo, setPhoto] = useState(null);
    const [cameraError, setCameraError] = useState(false);

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
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) return;

        if (!video.videoWidth || !video.videoHeight) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");

        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );

        const image = canvas.toDataURL(
            "image/jpeg",
            0.95
        );

        setPhoto(image);
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
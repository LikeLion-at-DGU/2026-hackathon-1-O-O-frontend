// src/hooks/useCamera.js
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";

export default function useCamera() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    const [cameraError, setCameraError] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);

    // 1. 카메라 스트림 초기화 및 권한 요청
    useEffect(() => {
        let stream = null;
        let isMounted = true;
        const videoElement = videoRef.current;

        const startCamera = async () => {
        try {
            setCameraError(false);

            if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia
            ) {
            throw new Error("이 브라우저는 카메라 촬영을 지원하지 않습니다.");
            }

            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

            try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: isMobile
                ? {
                    facingMode: { ideal: "environment" },
                    width: { ideal: 1080 },
                    height: { ideal: 1920 },
                    }
                : {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    },
                audio: false,
            });
            } catch (firstError) {
            console.warn(
                "선호 카메라 요청에 실패하여 기본 카메라로 다시 시도합니다.",
                firstError
            );

            stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false,
            });
            }

            if (isMounted && videoElement) {
            videoElement.srcObject = stream;
            await videoElement.play();
            }
        } catch (error) {
            console.error("카메라 실행 실패:", error);
            if (isMounted) {
            setCameraError(true);
            }
        }
        };

        startCamera();

        return () => {
        isMounted = false;

        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }

        if (videoElement) {
            videoElement.srcObject = null;
        }
        };
    }, []);

    // 2. 캔버스 프레임 캡처 및 이미지 데이터 생성
    const takePhoto = () => {
        if (isCapturing) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) {
        showToast("카메라 화면을 불러오지 못했습니다.");
        return;
        }

        if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        showToast("카메라를 준비하고 있습니다. 잠시 후 다시 촬영해 주세요.");
        return;
        }

        const width = video.videoWidth || video.clientWidth || 640;
        const height = video.videoHeight || video.clientHeight || 480;

        if (!width || !height) {
        showToast("카메라 해상도를 확인하지 못했습니다.");
        return;
        }

        try {
        setIsCapturing(true);

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        if (!context) {
            throw new Error("Canvas를 사용할 수 없습니다.");
        }

        context.drawImage(video, 0, 0, width, height);

        const image = canvas.toDataURL("image/jpeg", 0.9);
        if (!image || image.length < 500) {
            throw new Error("촬영된 이미지가 올바르지 않습니다.");
        }

        try {
            sessionStorage.setItem("temp_captured_photo", image);
        } catch (storageError) {
            console.warn(
            "촬영 사진을 sessionStorage에 저장하지 못했습니다.",
            storageError
            );
        }

        navigate("/camera/confirm", {
            state: { photo: image },
        });
        } catch (error) {
        console.error("사진 촬영 실패:", error);
        showToast("사진을 촬영하지 못했습니다. 다시 시도해 주세요.");
        setIsCapturing(false);
        }
    };

    return {
        videoRef,
        canvasRef,
        cameraError,
        isCapturing,
        takePhoto,
    };
}
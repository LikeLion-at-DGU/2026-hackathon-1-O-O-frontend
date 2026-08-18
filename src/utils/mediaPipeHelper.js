// src/utils/mediaPipeHelper.js

// 1. CDN 스크립트 동적 로더
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      return resolve();
    }
    const script = document.createElement("script");
    script.src = src;
    script.crossOrigin = "anonymous";
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
};

/**
 * 이미지(DataURL 또는 URL)를 받아
 * 1) 체형 보존용 Mask Blob (투명/흰색 실루엣 PNG)
 * 2) photo_meta (얼굴 비율 및 구도 필터 메타데이터)
 * 를 추출하여 반환합니다.
 */
export const processPhotoWithMediaPipe = async (imageSrc) => {
  try {
    // 2. MediaPipe CDN 스크립트 동적 로드
    await loadScript(
      "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js"
    );
    await loadScript(
      "https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/face_detection.js"
    );

    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageSrc;

      img.onload = async () => {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        // ----------------------------------------------------
        // 1. 체형 보존 마스크 (Selfie Segmentation)
        // ----------------------------------------------------
        const SelfieSegmentation = window.SelfieSegmentation;
        const selfieSegmentation = new SelfieSegmentation({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
        });

        selfieSegmentation.setOptions({
          modelSelection: 1, // 1: 전신/고정밀 모드
        });

        const maskCanvas = document.createElement("canvas");
        maskCanvas.width = width;
        maskCanvas.height = height;
        const maskCtx = maskCanvas.getContext("2d");

        selfieSegmentation.onResults((results) => {
          maskCtx.clearRect(0, 0, width, height);

          // 인물 실루엣 그리기
          maskCtx.drawImage(results.segmentationMask, 0, 0, width, height);

          // 인물 영역을 완전한 불투명 흰색(#FFFFFF)으로 채움
          maskCtx.globalCompositeOperation = "source-in";
          maskCtx.fillStyle = "#FFFFFF";
          maskCtx.fillRect(0, 0, width, height);
        });

        await selfieSegmentation.send({ image: img });

        // ----------------------------------------------------
        // 2. 얼굴 검출 & 메타데이터 (Face Detection)
        // ----------------------------------------------------
        const FaceDetection = window.FaceDetection;
        const faceDetection = new FaceDetection({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
        });

        faceDetection.setOptions({
          model: "short",
          minDetectionConfidence: 0.5,
        });

        let photoMeta = {
          face_count: 0,
          face_ratio: 0.0,
          face_center: [0.5, 0.5],
        };

        faceDetection.onResults((results) => {
          if (results.detections && results.detections.length > 0) {
            const det = results.detections[0];
            const box = det.boundingBox;

            const faceAreaRatio = box.width * box.height;
            const centerX = box.xCenter;
            const centerY = box.yCenter;

            photoMeta = {
              face_count: results.detections.length,
              face_ratio: parseFloat(faceAreaRatio.toFixed(3)),
              face_center: [
                parseFloat(centerX.toFixed(2)),
                parseFloat(centerY.toFixed(2)),
              ],
            };
          }
        });

        await faceDetection.send({ image: img });

        // ----------------------------------------------------
        // 3. 마스크 캔버스를 Blob으로 변환하여 반환
        // ----------------------------------------------------
        maskCanvas.toBlob((blob) => {
          resolve({
            maskBlob: blob,
            photoMeta: photoMeta,
          });
        }, "image/png");
      };

      img.onerror = (err) => reject(err);
    });
  } catch (error) {
    console.error("🚨 [MediaPipe] 처리 중 에러 발생:", error);
    return {
      maskBlob: null,
      photoMeta: {
        face_count: 0,
        face_ratio: 0.0,
        face_center: [0.5, 0.5],
      },
    };
  }
};
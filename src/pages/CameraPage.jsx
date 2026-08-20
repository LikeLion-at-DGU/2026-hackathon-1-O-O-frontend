// src/pages/CameraPage.jsx
import MobileLayout from "../components/MobileLayout/MobileLayout";
import Header from "../components/Header/Header";
import * as S from "./CameraPage.styled";
import useCamera from "../hooks/useCamera";

function CameraPage() {
  const {
    videoRef,
    canvasRef,
    cameraError,
    isCapturing,
    takePhoto,
  } = useCamera();

  return (
    <MobileLayout header={<Header showActions={false} />}>
      <S.PageContainer>
        <S.CameraArea>
          <S.Video
            ref={videoRef}
            autoPlay
            playsInline
            muted
          />

          <S.GuideText>
            화보에 들어갈 사진을 찍어주세요!
            <br />
            전신이 모두 보이도록 거리를 두고 촬영해 주세요.
          </S.GuideText>

          <S.PersonGuide />

          {cameraError && (
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

          <S.CaptureButton
            type="button"
            onClick={takePhoto}
            disabled={cameraError || isCapturing}
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
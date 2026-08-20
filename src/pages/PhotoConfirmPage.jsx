// src/pages/PhotoConfirmPage.jsx
import { useLocation, useNavigate } from "react-router-dom";

import MobileLayout from "../components/MobileLayout/MobileLayout";
import {
  ButtonGroup,
  CenterBox,
  ConfirmButton,
  Container,
  ErrorMessage,
  ImageWrapper,
  PreviewImage,
  RetakeButton,
  SubTitle,
  Title,
  TitleArea,
} from "./PhotoConfirmPage.styled";

import usePhotoLookbook from "../hooks/usePhotoLookbook";

export default function PhotoConfirmPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 촬영 데이터 확보 (Router State 우선, 세션 백업)
  const photo =
    location.state?.photo ||
    sessionStorage.getItem("temp_captured_photo");

  // 분리된 훅에서 비즈니스 로직과 핸들러 호출
  const {
    isSubmitting,
    errorMessage,
    handleRetake,
    handleConfirmAndUpload,
  } = usePhotoLookbook(photo);

  if (!photo) {
    return (
      <MobileLayout hideShoot>
        <CenterBox>
          <p>촬영된 사진이 없습니다.</p>
          <RetakeButton type="button" onClick={() => navigate("/camera")}>
            카메라로 이동
          </RetakeButton>
        </CenterBox>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout hideShoot>
      <Container>
        <TitleArea>
          <Title>사진을 확인해주세요.</Title>
          <SubTitle>이 모습 그대로 화보가 제작됩니다.</SubTitle>
        </TitleArea>

        <ImageWrapper>
          <PreviewImage src={photo} alt="촬영된 사진" />
        </ImageWrapper>

        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

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
            onClick={handleConfirmAndUpload}
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
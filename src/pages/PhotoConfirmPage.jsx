import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { uploadPhotoAndMask } from "../api/photoUpload";
import { createLookbook } from "../api/analytics";
import MobileLayout from "../components/MobileLayout/MobileLayout";
import styled from "styled-components";

// base64 DataURL을 스토리지 업로드용 Blob으로 변환하는 함수
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

    export default function PhotoConfirmPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // 1. 촬영된 사진 데이터 가져오기 (state 우선, 새로고침 시 sessionStorage 백업)
    const photo =
        location.state?.photo || sessionStorage.getItem("temp_captured_photo");

    const maskBlob = location.state?.maskBlob || null;
    const photoMeta = location.state?.photoMeta || {};

    const [isSubmitting, setIsSubmitting] = useState(false);

    // 2. 다시 찍기 클릭 시
    const handleRetake = () => {
        navigate("/camera", { replace: true });
    };

    // 3. ⭐️ 이 사진으로 화보 만들기 (스토리지 업로드 + 백엔드 생성 요청)
    const handleConfirmAndUpload = async () => {
        if (!photo || isSubmitting) return;

        try {
        setIsSubmitting(true);
        console.group("🚀 [화보 생성 프로세스 시작]");

        // (1) Base64 이미지를 Blob 파일로 변환
        const photoBlob = dataURLtoBlob(photo);
        console.log("1. 사진 Blob 변환 완료:", {
            size: `${(photoBlob.size / 1024).toFixed(2)} KB`,
            type: photoBlob.type,
        });

        // (2) Presigned URL 발급 및 스토리지(S3) 직접 업로드 (PUT)
        console.log("2. Presigned URL 발급 및 스토리지 업로드 진행 중...");
        const { photo_key, mask_key } = await uploadPhotoAndMask(
            photoBlob,
            maskBlob
        );
        console.log("👉 스토리지 업로드 성공 키:", { photo_key, mask_key });

        // (3) 이전에 선택한 상품 ID 및 visit_id 가져오기
        const savedProducts = sessionStorage.getItem("selected_products");
        const selectedProductIds = savedProducts ? JSON.parse(savedProducts) : [];
        const visitId = sessionStorage.getItem("visit_id");

        console.log("3. 요청 파라미터 확인:", {
            visitId,
            selectedProductIds,
        });

        // (4) 백엔드에 화보 생성 큐 등록 요청 (POST /reports/{slug}/lookbook)
        console.log("4. 백엔드로 화보 생성 요청 전송 중...");
        const result = await createLookbook(visitId, {
            product_ids: selectedProductIds,
            photo_key: photo_key,
            mask_key: mask_key,
            photo_meta: photoMeta,
        });

        console.log("✅ 5. 화보 생성 작업 등록 완료 (백엔드 응답):", result);
        console.groupEnd();

        // (5) 작업 식별 키 저장
        if (result?.job_id) {
            sessionStorage.setItem("current_job_id", result.job_id);
        }
        if (result?.share_slug) {
            sessionStorage.setItem("share_slug", result.share_slug);
        }

        // (6) 로딩/생성 대기 화면으로 이동
        navigate("/lookbookloading", {
            state: {
            job_id: result?.job_id,
            share_slug: result?.share_slug,
            },
        });
        } catch (error) {
        console.groupEnd();
        console.error("🚨 화보 생성 요청 실패:", error);
        alert(
            error.response?.data?.error?.message ||
            error.message ||
            "화보 생성 요청 중 오류가 발생했습니다."
        );
        } finally {
        setIsSubmitting(false);
        }
    };

    // 사진이 없을 때의 Fallback
    if (!photo) {
        return (
        <MobileLayout>
            <CenterBox>
            <p>촬영된 사진이 없습니다.</p>
            <RetakeButton onClick={() => navigate("/camera")}>
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
            <Title>사진을 확인해 주세요</Title>
            <SubTitle>이 모습 그대로 룩북 화보가 제작됩니다.</SubTitle>
            </TitleArea>

            {/* 촬영된 사진 미리보기 */}
            <ImageWrapper>
            <PreviewImage src={photo} alt="촬영된 사진" />
            </ImageWrapper>

            {/* 하단 액션 버튼 */}
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
                {isSubmitting ? "화보 생성 요청 중..." : "이 사진으로 화보 만들기"}
            </ConfirmButton>
            </ButtonGroup>
        </Container>
        </MobileLayout>
    );
}
// 스타일 정의
const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 24px 20px;
    box-sizing: border-box;
`;

// ⭐️ 누락되었던 TitleArea 정의
const TitleArea = styled.div`
    margin-bottom: 16px;
`;

const Title = styled.h2`
    font-size: 20px;
    font-weight: 700;
    color: #111;
    margin: 0 0 6px 0;
`;

const SubTitle = styled.p`
    font-size: 14px;
    color: #777;
    margin: 0;
`;

const ImageWrapper = styled.div`
    flex: 1;
    width: 100%;
    max-height: 480px;
    border-radius: 16px;
    overflow: hidden;
    background-color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const PreviewImage = styled.img`
    width: 100%; 
    height: 100%;
    object-fit: cover;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 20px;
`;

const RetakeButton = styled.button`
    flex: 1;
    height: 52px;
    border-radius: 12px;
    border: 1px solid #ddd;
    background-color: #fff;
    color: #333;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const ConfirmButton = styled.button`
    flex: 2;
    height: 52px;
    border-radius: 12px;
    border: none;
    background-color: #111;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
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
    height: 100%;
    gap: 16px;
`;
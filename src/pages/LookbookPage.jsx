import { useLocation, useNavigate } from "react-router-dom";
import MobileLayout from "../components/MobileLayout/MobileLayout";
import * as S from "./LookbookPage.styled";

// API 연결 전 사용할 임시 이미지
import sampleLookbookImage from "../assets/paddy-cheer.png";

function LookbookPage() {
    const navigate = useNavigate();
    const location = useLocation();

    /*
     * API 연결 후에는 로딩 페이지에서 아래처럼 이동하면 돼.
     *
     * navigate("/lookbook", {
     *   state: {
     *     imageUrl: response.data.imageUrl,
     *   },
     * });
     *
     * 아직 API가 없으므로 전달받은 이미지가 없다면 임시 이미지를 보여줌
     */
    const lookbookImage =
        location.state?.imageUrl || sampleLookbookImage;

    // 이미지 저장
    const handleDownload = async () => {
        try {
            const response = await fetch(lookbookImage);
            const imageBlob = await response.blob();

            const downloadUrl = URL.createObjectURL(imageBlob);
            const link = document.createElement("a");

            link.href = downloadUrl;
            link.download = "OandO-lookbook.png";

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error("이미지 저장에 실패했습니다.", error);
        }
    };

    // 이미지 공유
    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: "O&O Lookbook",
                    text: "O&O에서 만든 나만의 화보를 확인해보세요.",
                    url: window.location.href,
                });

                return;
            }

            await navigator.clipboard.writeText(window.location.href);
            alert("공유 링크가 복사되었습니다.");
        } catch (error) {
            // 사용자가 공유창을 직접 닫은 경우에도 발생할 수 있음
            console.error("공유가 취소되었거나 실패했습니다.", error);
        }
    };

    // 화보 다시 만들기
    const handleRetry = () => {
        navigate("/lookbookloading");
    };

    return (
        <MobileLayout showHeader={false}>
            <S.LookbookContainer>
                <S.TopSection>
                    <S.Logo
                        type="button"
                        onClick={() => navigate("/home")}
                        aria-label="홈으로 이동"
                    >
                        <S.LogoMain>O</S.LogoMain>
                        <S.Ampersand>&</S.Ampersand>
                        <S.LogoMain>O</S.LogoMain>
                    </S.Logo>

                    <S.Message>
                        저희의 뮤즈가 되어 주셔서 감사합니다.
                    </S.Message>
                </S.TopSection>

                <S.ImageSection>
                    <S.LookbookImage
                        src={lookbookImage}
                        alt="AI로 생성된 나의 O&O 룩북"
                    />
                </S.ImageSection>

                <S.BottomSection>
                    <S.ActionRow>
                        <S.DownloadButton
                            type="button"
                            onClick={handleDownload}
                        >
                            이미지 저장
                        </S.DownloadButton>

                        <S.ShareButton
                            type="button"
                            onClick={handleShare}
                            aria-label="룩북 공유하기"
                        >
                            <svg
                                width="25"
                                height="25"
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden="true"
                            >
                                <circle cx="18" cy="5" r="2.4" fill="currentColor" />
                                <circle cx="6" cy="12" r="2.4" fill="currentColor" />
                                <circle cx="18" cy="19" r="2.4" fill="currentColor" />

                                <path
                                    d="M8.1 10.85L15.8 6.2M8.1 13.15L15.8 17.8"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </S.ShareButton>
                    </S.ActionRow>

                    <S.RetryDescription>
                        혹시 화보가 마음에 안 든다면, 다시 만들어보세요.
                    </S.RetryDescription>

                    <S.RetryButton
                        type="button"
                        onClick={handleRetry}
                    >
                        화보 다시 만들기
                    </S.RetryButton>
                </S.BottomSection>
            </S.LookbookContainer>
        </MobileLayout>
    );
}

export default LookbookPage;
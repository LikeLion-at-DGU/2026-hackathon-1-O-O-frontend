import styled, {
    keyframes,
} from "styled-components";

import MobileLayout from "../components/MobileLayout/MobileLayout";
import paddyThink from "../assets/paddy-think.png";

const LookbookLoadingPage = ({
    progress = 0,
    stage = "",
    step = "",
    errorMessage = "",
    onRetry,
}) => {
    const normalizedProgress = Math.min(
        100,
        Math.max(0, Number(progress) || 0)
    );

    if (errorMessage) {
        return (
            <MobileLayout showHeader={false}>
                <Container>
                    <Logo>
                        <LogoMain>O</LogoMain>
                        <Ampersand>&</Ampersand>
                        <LogoMain>O</LogoMain>
                    </Logo>

                    <Content>
                        <Title>
                            화보를 만들지 못했어요
                        </Title>

                        <Description>
                            {errorMessage}
                        </Description>

                        {onRetry && (
                            <RetryButton
                                type="button"
                                onClick={onRetry}
                            >
                                다시 확인하기
                            </RetryButton>
                        )}
                    </Content>
                </Container>
            </MobileLayout>
        );
    }

    return (
        <MobileLayout showHeader={false}>
            <Container>
                <Logo>
                    <LogoMain>O</LogoMain>
                    <Ampersand>&</Ampersand>
                    <LogoMain>O</LogoMain>
                </Logo>

                <Content>
                    <Character
                        src={paddyThink}
                        alt=""
                    />

                    <Title>
                        패디가 뮤즈님의 화보를
                        <br />
                        만들고 있어요.
                    </Title>

                    <Description>
                        화면을 닫아도 같은 링크로 다시 들어오면
                        <br />
                        진행 상태를 확인할 수 있어요.
                    </Description>

                    <ProgressArea>
                        <ProgressHeader>
                            <ProgressLabel>
                                {step ||
                                    stage ||
                                    "화보 생성 중"}
                            </ProgressLabel>

                            <ProgressNumber>
                                {normalizedProgress}%
                            </ProgressNumber>
                        </ProgressHeader>

                        <ProgressTrack>
                            <ProgressBar
                                $progress={
                                    normalizedProgress
                                }
                            />
                        </ProgressTrack>
                    </ProgressArea>
                </Content>
            </Container>
        </MobileLayout>
    );
};

export default LookbookLoadingPage;

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  min-height: 100dvh;
  padding: 42px 24px;

  box-sizing: border-box;

  color: #f3eee3;
  background:
    linear-gradient(
      180deg,
      #202020 0%,
      #292827 62%,
      #4a4845 100%
    );
`;

const Logo = styled.div`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
`;

const LogoMain = styled.span`
  font-family: Georgia, "Times New Roman",
    serif;
  font-size: 31px;
  font-weight: 700;
  line-height: 1;
`;

const Ampersand = styled.span`
  margin: 0 2px;
  padding-top: 10px;

  color: #8c6239;
  font-family: Georgia, "Times New Roman",
    serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
`;

const Character = styled.img`
  width: 150px;
  height: 150px;
  margin-bottom: 22px;

  object-fit: contain;

  animation: ${floatAnimation} 2.3s
    ease-in-out infinite;
`;

const Title = styled.h1`
  margin: 0;

  color: #e5e3e0;
  font-family: Pretendard, sans-serif;
  font-size: 22px;
  font-weight: 600;
  line-height: 145%;
  text-align: center;
`;

const Description = styled.p`
  margin: 14px 0 0;

  color: #a8a29d;
  font-family: Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 155%;
  text-align: center;
`;

const ProgressArea = styled.div`
  width: 100%;
  max-width: 320px;
  margin-top: 42px;
`;

const ProgressHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 10px;
`;

const ProgressLabel = styled.span`
  color: #e5e3e0;
  font-size: 12px;
`;

const ProgressNumber = styled.span`
  color: #a8a29d;
  font-size: 12px;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 7px;

  overflow: hidden;

  background-color: rgb(255 255 255 / 14%);
  border-radius: 999px;
`;

const ProgressBar = styled.div`
  width: ${({ $progress }) =>
        `${$progress}%`};
  height: 100%;

  background:
    linear-gradient(
      90deg,
      #8c6239,
      #d6a96f
    );
  border-radius: inherit;

  transition: width 0.45s ease;
`;

const RetryButton = styled.button`
  width: 220px;
  height: 48px;
  margin-top: 28px;

  color: #222;
  font-size: 15px;
  font-weight: 600;

  background-color: #f3eee3;
  border: none;
  border-radius: 14px;
  cursor: pointer;
`;
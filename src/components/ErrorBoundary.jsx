import { Component } from "react";
import styled from "styled-components";

const FallbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;

  min-height: 100vh;
  min-height: 100dvh;
  padding: 24px;
  box-sizing: border-box;

  background-color: #222222;
  color: #f3eee3;
  font-family: Pretendard, sans-serif;
  text-align: center;
`;

const Title = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 140%;
`;

const Description = styled.p`
  margin: 0;
  font-size: 13px;
  font-weight: 300;
  line-height: 150%;
  color: #b9b6b1;
  white-space: pre-line;
`;

const RetryButton = styled.button`
  margin-top: 8px;
  padding: 10px 20px;

  color: #e5e3e0;
  font-family: Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 600;

  background: #8c6239;
  border: none;
  border-radius: 10px;
  cursor: pointer;
`;

/**
 * 전역 렌더링 에러 경계.
 *
 * 하위 트리에서 렌더 중 예외가 나면 흰 화면 대신 안내 화면을 보여주고,
 * 새로고침으로 복구할 수 있게 한다. (Error Boundary는 클래스 컴포넌트로만
 * 구현할 수 있어 이 파일만 클래스 문법을 쓴다.)
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // 프로덕션 수집기가 없으므로 개발 콘솔에만 남긴다.
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error, info?.componentStack);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <FallbackContainer role="alert">
        <Title>화면을 그리는 중 문제가 생겼어요.</Title>
        <Description>
          {"일시적인 오류일 수 있어요.\n아래 버튼으로 다시 시도해 주세요."}
        </Description>
        <RetryButton type="button" onClick={this.handleReload}>
          새로고침
        </RetryButton>
      </FallbackContainer>
    );
  }
}

export default ErrorBoundary;

import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  min-height: 100vh;
  min-height: 100dvh;

  background-color: #222222;
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  margin: 0 4px;

  background-color: #8c6239;
  border-radius: 50%;

  animation: routeFallbackPulse 1s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay}s;

  @keyframes routeFallbackPulse {
    0%,
    100% {
      opacity: 0.25;
      transform: translateY(0);
    }
    50% {
      opacity: 1;
      transform: translateY(-4px);
    }
  }
`;

/**
 * 라우트 lazy 로딩 대기 화면.
 * fallback={null}이면 청크를 받는 동안 흰 화면만 보이므로,
 * 랜딩과 같은 톤의 배경 위에 가벼운 점 애니메이션을 보여준다.
 */
function RouteFallback() {
  return (
    <Container aria-label="화면을 불러오는 중">
      <Dot $delay={0} />
      <Dot $delay={0.15} />
      <Dot $delay={0.3} />
    </Container>
  );
}

export default RouteFallback;

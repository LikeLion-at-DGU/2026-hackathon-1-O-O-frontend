import styled, { css } from "styled-components";

const absoluteFill = css`
  position: absolute;
  inset: 0;
`;

const invitationNightBackground = css`
  background:
    radial-gradient(
      circle at 15% 18%,
      rgba(243, 238, 227, 0.06),
      transparent 19%
    ),
    radial-gradient(
      circle at 82% 16%,
      rgba(140, 98, 57, 0.16),
      transparent 25%
    ),
    linear-gradient(
      180deg,
      #222222,
      #292623 67%,
      #302820
    );
`;

/* =========================================================
   전체 모바일 컨테이너
========================================================= */

export const MobileContainer = styled.div`
  --font-pretendard: "Pretendard", sans-serif;
  --font-logo: "Pretendard", sans-serif;
  --night: #222222;
  --gallery-cream: #F3EEE3;
  --surface: #FFFFFF;
  --ink: #222222;
  --brown: #8C6239;
  --neutral: #E5E3E0;
  --shelve: #D1CCC7;
  --heart: #E07A5F;
  --line: #D1CCC7;

  position: relative;

  width: 402px;

  min-height: 100vh;
  min-height: 100dvh;
  margin: 0 auto;

  font-family: var(--font-pretendard);

  background-color: var(--surface);
  color: var(--surface);

  overflow-x: clip;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

/* =========================================================
   공통 효과
========================================================= */

export const Noise = styled.div`
  position: fixed;
  inset: 0;

  z-index: 180;

  pointer-events: none;

  opacity: 0.025;

  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
`;

export const Progress = styled.div`
  position: fixed;

  top: 0;
  left: 50%;

  z-index: 210;

  width: 402px;
  height: 2px;

  transform: translateX(-50%);

  background: linear-gradient(
    to right,
    var(--surface) 0%,
    var(--surface) ${({ $progress }) => `${$progress * 100}%`},
    transparent ${({ $progress }) => `${$progress * 100}%`},
    transparent 100%
  );

  mix-blend-mode: difference;

  pointer-events: none;

  @media (max-width: 600px) {
    width: 100%;
  }

`;

export const Index = styled.div`
  position: fixed;

  top: 50%;

  /*
    브라우저 중앙에 있는 402px 모바일 컨테이너의
    오른쪽 끝을 기준으로 위치하도록 설정
  */
  right: calc((100vw - 402px) / 2 + 10px);

  z-index: 130;

  transform: translateY(-50%);

  writing-mode: vertical-rl;

  font-size: 8px;
  letter-spacing: 0.2em;

  opacity: 0.52;

  mix-blend-mode: difference;

  pointer-events: none;

  @media (max-width: 600px) {
    right: 10px;
  }
`;

export const StickyBase = styled.div`
  position: sticky;

  top: 0;

  width: 100%;

  height: 100vh;
   height: 100lvh;

  overflow: hidden;
`;

export const Eyebrow = styled.div`
  color: var(--brown);

  font-family: var(--font-pretendard);
  font-size: 9px;
  font-weight: 600;

  letter-spacing: 0.22em;

  text-transform: uppercase;

  opacity: 0.72;
`;

/* =========================================================
   01 / INVITATION
========================================================= */

export const HeroChapter = styled.section`
  position: relative;

  width: 100%;
  height: 330svh;

  ${invitationNightBackground}
`;

export const StickyNight = styled(StickyBase)`
  ${invitationNightBackground}
`;

export const Stars = styled.div`
  ${absoluteFill}
`;

export const Star = styled.span`
  position: absolute;

  width: 2px;
  height: 2px;

  border-radius: 50%;

  background: var(--surface);

  box-shadow: 0 0 7px rgba(243, 238, 227, 0.45);
`;

/* =========================
   날아오는 봉투
========================= */

export const EnvelopeFlight = styled.div`
  position: absolute;

  left: 50%;
  top: 50%;

  z-index: 14;

  width: 78%;
  max-width: 314px;

  transform:
    translate(-50%, -50%)
    translate(58vw, -60vh)
    rotate(28deg)
    scale(0.14);

  filter:
    drop-shadow(
      0 20px 28px rgba(0, 0, 0, 0.28)
    );

  will-change: transform, opacity;
`;

// 봉투 
export const Envelope = styled.div`
  position: relative;

  width: 100%;
  aspect-ratio: 3 / 2;

  /* hidden에서 변경 */
  overflow: visible;

  border-radius: 20px;
  border: 2px dashed var(--shelve, #d1ccc7);

  background: var(--gallery-cream);
  box-sizing: border-box;

  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.2);

  perspective: 900px;
  transform-style: preserve-3d;

  /* 아래쪽 접힘선 코드는 그대로 */


  /*
    아래쪽 접힘선
  */
  &::before {
    content: "";

    position: absolute;
    left: 50%;
    top: 56%;

    z-index: 5;

    width: 56%;
    height: 1px;

    transform: rotate(32deg);
    transform-origin: left center;

    background: repeating-linear-gradient(
      to right,
      #d1ccc7 0,
      #d1ccc7 6px,
      transparent 6px,
      transparent 11px
    );
  }

  /* 중앙에서 왼쪽 아래로 내려가는 선 */
  &::after {
    content: "";

    position: absolute;
    left: 50%;
    top: 56%;

    z-index: 5;

    width: 56%;
    height: 1px;

    transform: rotate(148deg);
    transform-origin: left center;

    background: repeating-linear-gradient(
      to right,
      #d1ccc7 0,
      #d1ccc7 6px,
      transparent 6px,
      transparent 11px
    );
  }
`;

// 봉투 뚜껑
export const Flap = styled.div`
  position: absolute;

  left: 3%;
  top: 0;

  z-index: 7;

  width: 94%;
  height: 47%;

  border-radius: 0 0 28px 28px;

  transform: rotateX(0deg);
  transform-origin: top center;
  transform-style: preserve-3d;

  backface-visibility: visible;

  will-change: transform;

  svg {
    display: block;

    width: 100%;
    height: 100%;

    overflow: visible;
  }

  path {
    fill: var(--neutral);
    stroke: var(--shelve);

    stroke-width: 3;
    stroke-dasharray: 10 10;

    /* SVG 선이 만나는 부분을 둥글게 */
    stroke-linejoin: round;
    stroke-linecap: round;

    filter:
      drop-shadow(
        0 5px 5px rgba(140, 98, 57, 0.12)
      );
  }
`;

export const Seal = styled.div`
  position: absolute;

  left: 50%;
  top: 56%;

  z-index: 10;

  text-shadow:
  0 1px 0 rgba(255, 255, 255, 0.35),
  0 2px 4px rgba(34, 34, 34, 0.38);
  
  display: flex;
  align-items: center;
  justify-content: center;

  width: 54px;
  height: 54px;

  transform: translate(-50%, -50%);

  border-radius: 50%;

  color: var(--surface);
  background: var(--heart);

  font-family: var(--font-pretendard);
  font-size: 14px;
  font-weight: 700;

  box-shadow:
    0 3px 8px rgba(80, 40, 30, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.35);

  will-change: opacity;
`;


/* =========================
   초대장 종이 (편지지)
========================= */

/* =========================
   초대장 종이
========================= */

export const InvitationPaper = styled.div`
  position: absolute;

  left: 50%;
  top: 50%;

  z-index: 16;

  width: 74%;
  max-width: 296px;
  height: 420px;

  opacity: 0;
  overflow: hidden;

  transform:
    translate(-50%, -5%)
    scale(0.88);

  transform-origin: center;

  border: 1px solid var(--shelve);
  border-radius: 18px;

  color: var(--ink);

  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.55),
      transparent 10%
    ),
    var(--gallery-cream);

  box-shadow:
    0 14px 38px rgba(140, 98, 57, 0.12);

  will-change: transform, opacity;

  &::after {
    content: "";

    position: absolute;
    inset: 0;

    pointer-events: none;

    opacity: 0.11;

    background:
      repeating-linear-gradient(
        0deg,
        rgba(140, 98, 57, 0.035) 0 1px,
        transparent 1px 4px
      ),
      repeating-linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.12) 0 1px,
        transparent 1px 7px
      );
  }
`;

export const PaperContent = styled.div`
  position: relative;

  z-index: 2;

  width: 100%;
  height: 100%;

  padding: 58px 24px 44px;

  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  text-align: center;

  &::before,
  &::after {
    content: "";

    position: absolute;

    left: -24px;
    right: -24px;

    height: 1px;

    background: repeating-linear-gradient(
      to right,
      var(--shelve) 0 10px,
      transparent 10px 18px
    );
  }

  &::before {
    top: 27px;
  }

  &::after {
    bottom: 27px;
  }

  h1 {
    margin: 18px 0 12px;

    color: var(--night);

    font-family: var(--font-pretendard);
    font-size: 26px;
    font-weight: 600;

    line-height: normal;
    letter-spacing: -0.04em;
  }
`;

export const InvitationLabel = styled.div`
  color: var(--brown);

  font-family: "Unkempt", cursive;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.02em;
`;

export const InvitationPaddy = styled.img`
  width: 52%;
  max-height: 170px;

  margin: 6px auto 8px;

  object-fit: contain;

  filter: drop-shadow(
    0 15px 8px rgba(34, 34, 34, 0.25)
  );
`;

export const InvitationCopy = styled.p`
  margin: 0;

  color: var(--night);

  font-size: 12px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  white-space: nowrap;
`;

export const PaddySignature = styled.div`
  position: absolute;

  right: 16px;
  bottom: 35px;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 5px;

  color: var(--brown);

  svg {
    display: block;

    width: 26px;
    height: 25px;

    overflow: visible;
  }

  span {
    color: var(--night);

    font-family: "Unkempt", cursive;
    font-size: 11px;
    font-weight: 400;

    line-height: 1;
    white-space: nowrap;
  }
`;

export const PaperWhiteout = styled.div`
  ${absoluteFill}

  z-index: 10;

  opacity: 0;

  pointer-events: none;

  background: var(--gallery-cream);
`;

export const ScrollArrow = styled.div`
  position: absolute;

  left: 20px;
  top: 50%;

  z-index: 20;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  color: var(--surface);

  transform: translateY(-50%);
  pointer-events: none;

  animation: arrowFloat 1.5s ease-in-out infinite;

  span {
    width: 1px;
    height: 55px;

    background: linear-gradient(
      to bottom,
      transparent,
      rgba(255, 255, 255, 0.95)
    );
  }

  i {
    margin-top: -8px;

    font-family: Arial, sans-serif;
    font-size: 20px;
    font-style: normal;
    font-weight: 300;
    line-height: 1;
  }

  @keyframes arrowFloat {
    0%,
    100% {
      transform: translateY(-50%);
      opacity: 0.45;
    }

    50% {
      transform: translateY(calc(-50% + 9px));
      opacity: 1;
    }
  }
`;


/* =========================================================
   02 / 1976 → 2026
========================================================= */

export const ErasChapter = styled.section`
  position: relative;

  width: 100%;
  height: 520svh;

  color: var(--ink);

  background: var(--gallery-cream);
`;

export const EraSticky = styled(StickyBase)`
  background: var(--gallery-cream);
`;

export const PaperFiber = styled.div`
  ${absoluteFill}

  z-index: 1;

  opacity: 0.2;

  pointer-events: none;

  background:
    repeating-linear-gradient(
      0deg,
      rgba(84, 57, 36, 0.045) 0 1px,
      transparent 1px 4px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.15) 0 1px,
      transparent 1px 8px
    );
`;

export const FilmGrain = styled.div`
  ${absoluteFill}

  z-index: 2;

  opacity: 0.2;

  pointer-events: none;

  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 170 170' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.55' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='.7'/%3E%3C/svg%3E");
`;

export const CognacWash = styled.div`
  ${absoluteFill}

  z-index: 0;

  opacity: 0;

  background:
    linear-gradient(
      135deg,
      rgba(140, 98, 57, 0.34),
      rgba(140, 98, 57, 0.06)
    );
`;

export const SilverSweep = styled.div`
  position: absolute;

  inset: -15%;

  z-index: 3;

  opacity: 0;

  pointer-events: none;

  background:
    linear-gradient(
      110deg,
      transparent 20%,
      rgba(255, 255, 255, 0) 34%,
      rgba(229, 227, 224, 0.62) 48%,
      rgba(255, 255, 255, 0) 61%,
      transparent 76%
    );
`;

export const EraRail = styled.div`
  position: absolute;

  left: 0;
  right: 0;
  top: 22vh;

  z-index: 4;

  opacity: 0;

  white-space: nowrap;

  color: rgba(140, 98, 57, 0.1);

  font:
    500 clamp(27px, 9vw, 36px) / 1
    Pretendard,
    "Times New Roman",
    serif;
`;

/* =========================
   연도
========================= */

export const EraYear = styled.div`
  position: absolute;

  left: 7%;
  top: 8vh;

  z-index: 8;

  color: var(--deep-slate);

  font-family: var(--font-logo);
  font-size: clamp(118px, 38vw, 153px);

  font-weight: 400;

  line-height: 0.8;
  letter-spacing: -0.06em;
`;

export const EraIntro = styled.div`
  position: absolute;

  left: 7%;
  right: 7%;

  top: 31vh;

  z-index: 9;

  h2 {
    margin: 0 0 12px;

    font-family: var(--font-logo);
    font-size: 25px;
    font-weight: 300;
    line-height: 1.2;
  }

  p {
    margin: 0;

    color: var(--brown);

    font-family: var(--font-pretendard);
    font-size: 14px;
    font-weight: 300;
    line-height: 1.7;
  }
`;

/* =========================
   뮌헨 사진
========================= */

export const EraPhotos = styled.div`
  ${absoluteFill}

  z-index: 5;
`;

export const EraPhoto = styled.figure`
  position: absolute;

  margin: 0;

  overflow: hidden;

  border:
    11px solid rgba(255, 255, 255, 0.96);

  box-shadow:
    0 18px 44px rgba(68, 46, 31, 0.18);

  transform-origin: center;

  will-change: transform;

  img {
    width: 100%;
    height: 100%;

    object-fit: cover;
  }

  ${({ $variant }) =>
    $variant === "one" &&
    css`
      left: 5%;
      top: 49vh;

      width: 58%;
      height: 30vh;

      border-radius: 10px;

      transform: rotate(-3deg);
    `}

  ${({ $variant }) =>
    $variant === "two" &&
    css`
      right: -6%;
      top: 59vh;

      width: 48%;
      height: 25vh;

    border-radius: 10px;
      transform: rotate(5deg);
    `}

  ${({ $variant }) =>
    $variant === "three" &&
    css`
      left: 19%;
      bottom: 4vh;

      width: 48%;
      height: 22vh;

      border-radius: 10px;

      transform: rotate(2deg);
    `}
`;

export const EraCode = styled.div`
  position: absolute;

  left: 7%;
  bottom: 6vh;

  z-index: 9;

    color: var(--brown);

  font-size: 9px;
  letter-spacing: 0.18em;
`;

/* =========================
   2026 최종 장면
========================= */

export const FinalMoment = styled.div`
  ${absoluteFill}

  z-index: 15;

  opacity: 0;

  pointer-events: none;

  display: grid;
  place-items: center;

  padding: 24px;

  text-align: center;

  strong {
    display: block;

    color: var(--brown);

    font-family: "Times New Roman", sans-serif;
    font-size: clamp(135px, 44vw, 177px);
    font-weight: 600;

    line-height: 0.78;
    letter-spacing: -0.08em;
  }

  span {
    display: block;

    margin-top: 18px;

    font-family: "Pretendard", sans-serif;
    font-size: 28px;
    font-weight: 600;

    line-height: 1.1;
    letter-spacing: -0.04em;
  }

  b {
    display: block;

    margin-top: 10px;

    font-family: "Pretendard", sans-serif;
    font-size: 24px;
    font-weight: 300;

    line-height: 1.25;
    letter-spacing: -0.04em;
  }
`;
/* =========================================================
   03 / 2026 FALL WINTER
========================================================= */

export const CollectionChapter = styled.section`
  position: relative;

  width: 100%;
  height: 230svh;

  background: #161616;
`;

export const CollectionSticky = styled(StickyBase)`
  isolation: isolate;

  color: var(--surface);
  background: var(--paper);
`;

export const CollectionGlow = styled.div`
  position: absolute;
  inset: 0;

  z-index: -1;

  background:
    radial-gradient(
      circle at 16% 25%,
      rgba(140, 98, 57, 0.42),
      transparent 34%
    ),
    radial-gradient(
      circle at 82% 72%,
      rgba(210, 214, 219, 0.16),
      transparent 31%
    ),
    linear-gradient(
      145deg,
      transparent 35%,
      rgba(255, 255, 255, 0.04)
    );
`;

export const CollectionVisual = styled.div`
  position: absolute;
  inset: 0;

  z-index: 1;

  opacity: 0;

  will-change: transform, opacity;
`;

export const CollectionImage = styled.figure`
  position: absolute;

  overflow: hidden;

  margin: 0;

  border: 1px solid rgba(255, 255, 255, 0.16);

  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.42);

  ${({ $position }) =>
    $position === "left" &&
    css`
      left: -8%;
      top: 15%;

      width: 48%;
      height: 43%;

      transform: rotate(-7deg);
    `}

  ${({ $position }) =>
    $position === "center" &&
    css`
      left: 27%;
      top: 6%;

      z-index: 2;

      width: 56%;
      height: 54%;

      transform: rotate(2deg);
    `}

  ${({ $position }) =>
    $position === "right" &&
    css`
      right: -10%;
      top: 29%;

      width: 44%;
      height: 38%;

      transform: rotate(8deg);
    `}

  img {
    width: 100%;
    height: 100%;

    object-fit: cover;

    filter:
      grayscale(0.72)
      sepia(0.22)
      saturate(0.8)
      contrast(1.16)
      brightness(0.7);
  }

  &::after {
    content: "";

    position: absolute;
    inset: 0;

    background: linear-gradient(
      150deg,
      transparent 30%,
      rgba(210, 214, 219, 0.22)
    );

    mix-blend-mode: screen;
  }
`;

export const CollectionYear = styled.span`
  position: absolute;

  right: -4%;
  top: 5%;

  z-index: 3;

  color: transparent;

  font-family: "Times New Roman", serif;
  font-size: clamp(190px, 62vw, 250px);
  font-weight: 600;

  line-height: 0.8;
  letter-spacing: -0.11em;

  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.18);
`;

export const CollectionCopy = styled.div`
  position: absolute;

  left: 7%;
  right: 7%;
  bottom: 7.5vh;

  z-index: 5;

  opacity: 0;

  will-change: transform, opacity;

  h2 {
    margin: 10px 0 13px;

    font-family: "Times New Roman", serif;
    font-size: clamp(65px, 19vw, 77px);
    font-weight: 500;

    line-height: 0.75;
    letter-spacing: -0.075em;
  }

  h2 span {
    display: block;

    margin-top: 16px;

    font-family: var(--font-pretendard);
    font-size: 16px;
    font-weight: 500;

    line-height: 1;
    letter-spacing: 0.18em;
  }

  p {
    max-width: 340px;

    margin: 17px 0 14px;

    color: rgba(255, 255, 255, 0.72);

    font-size: 12px;
    font-weight: 300;

    line-height: 1.72;
    letter-spacing: -0.015em;

    word-break: keep-all;
  }

  > strong {
    color: #d1ccc7;

    font-size: 8px;
    font-weight: 500;

    letter-spacing: 0.24em;
  }
`;

export const CollectionKicker = styled.span`
  color: #c7a47b;

  font-size: 8px;
  font-weight: 600;

  letter-spacing: 0.22em;
`;

export const CollectionLine = styled.i`
  display: block;

  width: 100%;
  height: 1px;

  transform: scaleX(0);
  transform-origin: left center;

  background: linear-gradient(
    90deg,
    #8c6239,
    rgba(209, 204, 199, 0.22)
  );
`;

export const CollectionSideText = styled.div`
  position: absolute;

  right: 10px;
  top: 50%;

  z-index: 6;

  transform: translateY(-50%);

  writing-mode: vertical-rl;

  color: rgba(255, 255, 255, 0.38);

  font-size: 7px;
  letter-spacing: 0.22em;
`;

/* =========================================================
   03 / PADDY
========================================================= */

export const PaddyChapter = styled.section`
  position: relative;

  width: 100%;
  height: 260svh;

  color: var(--ink);

  background:
    linear-gradient(
      180deg,
      #E5E3E0 0%,
      #F4F2EE 34%,
      #F3EEE3 100%
    );
`;

export const PaddyMeta = styled.div`
  position: absolute;

  left: 7%;
  top: 10vh;

  z-index: 5;

  color: var(--brown);

  font-size: 9px;
  letter-spacing: 0.2em;
`;

export const SpeechHint = styled.div`
  position: absolute;

  left: 7%;
  right: 7%;

  top: 15vh;

  z-index: 5;

  opacity: 0;

color: var(--night);

  font-family: "Pretendard", sans-serif;
  font-size: clamp(34px, 10vw, 42px);
  font-weight: 600;

  line-height: 1.15;
  letter-spacing: -0.045em;
`;

export const PaddySmall = styled.img`
  position: absolute;

  right: 5%;
  bottom: 24vh;

  z-index: 5;

  width: 34%;
  max-width: 137px;
  height: auto;

  object-fit: contain;

  filter: drop-shadow(
    0 12px 16px rgba(74, 49, 31, 0.16)
  );

  transform:
    translateY(20px)
    rotate(-3deg)
    scale(0.92);
`;

/* =========================
   패디 말풍선
========================= */

export const Speech = styled.div`
  position: absolute;

  left: 6%;
  right: 6%;

  bottom: 7vh;

  z-index: 8;

  min-height: 126px;

  padding: 19px 20px;

  border:
    1px solid var(--line);

  border-radius: 26px;

  background:
    rgba(255, 255, 255, 0.95);

  box-shadow:
    0 14px 34px rgba(75, 50, 33, 0.09);

  &::after {
    content: "";

    position: absolute;

    right: 18%;
    top: -13px;

    width: 26px;
    height: 26px;

    transform: rotate(45deg);

    border-left:
      1px solid var(--line);

    border-top:
      1px solid var(--line);

    background: var(--surface);
  }

  strong {
    position: relative;

    z-index: 2;

    display: block;

    margin-bottom: 10px;

    font-size: 10px;
    letter-spacing: 0.15em;
      font-family: "Unkempt", cursive;

  }

  p {
    position: relative;

    z-index: 2;

    margin: 0;

    font-size: 17px;
    line-height: 1.55;

    letter-spacing: -0.02em;
  }
`;

/* =========================================================
   04 / MUSE NUMBER
========================================================= */

export const RegisterChapter = styled.section`
  position: relative;

  width: 100%;
  height: 205svh;

  color: var(--surface);

  background:
    radial-gradient(
      circle at 82% 24%,
      rgba(244, 242, 238, 0.1),
      transparent 34%
    ),
    radial-gradient(
  circle at 12% 72%,
  rgba(244, 242, 238, 0.1),
  transparent 30%
),
    linear-gradient(
      180deg,
      #332A23 0%,
      #222222 38%,
      #1B1B1B 72%,
      #2B211A 100%
    );
`;

export const RegisterHead = styled.div`
  position: absolute;

  left: 7%;
  right: 7%;

  top: 9vh;

  z-index: 5;

  h2 {
    margin: 12px 0 8px;

    font-family: "Pretendard", sans-serif;
    font-size: 34px;
    font-weight: 600;

    line-height: 1.2;
    letter-spacing: -0.045em;

    color: var(--surface);
  }

  p {
    margin: 0;

    color: var(--neutral);

    font-family: "Pretendard", sans-serif;
    font-size: 13px;
    font-weight: 300;

    line-height: 1.7;
  }
`;

/* =========================
   번호 슬롯
========================= */

export const Slot = styled.div`
  position: absolute;

  left: 7%;
  right: 7%;

  top: 33vh;

  z-index: 5;

  padding: 24px 0 26px;

  border-top:
    1px solid rgba(209, 204, 199, 0.58);

  border-bottom:
    1px solid rgba(209, 204, 199, 0.58);

  text-align: center;

  span {
    display: block;

    color: var(--shelve);

    font-size: 9px;
    letter-spacing: 0.18em;
  }

  strong {
  display: block;

  margin: 12px 0 6px;

  font-family: var(--font-pretendard);
  font-size: clamp(64px, 21vw, 84px);
  font-weight: 600;

  line-height: 0.9;
  letter-spacing: -0.05em;

  color: var(--surface);

  text-shadow:
    0 8px 28px rgba(0, 0, 0, 0.28);
}
  b {
    color: var(--heart);

    font-size: 11px;

    font-weight: 400;

    letter-spacing: 0.14em;
  }
`;

export const RegisterPaddy = styled.img`
  position: absolute;

  right: 5%;
  bottom: 16vh;

  z-index: 6;

  width: 27%;
  max-width: 108px;
  height: auto;

  object-fit: contain;

  filter: drop-shadow(
    0 12px 16px rgba(0, 0, 0, 0.25)
  );
`;

/* =========================
   Become The Muse 버튼
========================= */

export const EnterButton = styled.button`
  position: absolute;

  left: 7%;
  right: 7%;

  bottom: 7vh;

  z-index: 8;

  display: flex;

  justify-content: space-between;
  align-items: center;

  padding: 17px 20px;

  border: 1px solid rgba(255, 255, 255, 0.2);

  border-radius: 999px;

  background: var(--gallery-cream);

  color: var(--night);

  text-align: left;

  cursor: pointer;

  box-shadow:
    0 14px 32px rgba(0, 0, 0, 0.24);

  transition:
    background-color 180ms ease,
    transform 180ms ease;

  &:active {
    transform: scale(0.985);
    background: var(--neutral);
  }

  &:disabled {
    cursor: default;
    opacity: 0.72;
  }

  strong {
    display: block;

    font-size: 14px;
    font-family: "Pretendard";
  }

  span {
    display: block;
    font-family: "Pretendard";
    margin-top: 4px;

    font-size: 9px;

    letter-spacing: 0.1em;

    opacity: 0.8;
  }

  i {
    font-style: normal;

    font-size: 25px;
  }
`;

/* =========================================================
   마지막 문 닫히는 효과
========================================================= */

export const Door = styled.div`
  ${absoluteFill}

  z-index: 20;

  display: flex;

  pointer-events: none;

  i {
    display: block;

    width: 50%;
    height: 100%;

    background:
      linear-gradient(
        180deg,
        #222222,
        #8C6239
      );

    transform:
      scaleX(
        ${({ $closing }) =>
    $closing ? 1 : 0}
      );

    transition:
      transform
      1s
      cubic-bezier(
        0.7,
        0,
        0.2,
        1
      );

    &:first-child {
      transform-origin: left;
    }

    &:last-child {
      transform-origin: right;
    }
  }
`;

import styled, { css } from "styled-components";

/* =========================================================
   전체 모바일 컨테이너
========================================================= */

export const MobileContainer = styled.div`
// 색상 팔레트
  --night: #06070b;
  --paper: #f6f0e7;
  --ink: #30241b;
  --muted: #776456;
  --brown: #302217;
  --line: #d7c8b7;

  position: relative;

  width: 100%;
  max-width: 402px;
  min-height: 100dvh;

  margin: 0 auto;

  background-color: #ffffff;
  color: #ffffff;

  overflow-x: clip;
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

  width: min(100vw, 402px);
  height: 2px;

  transform: translateX(-50%);

  background: linear-gradient(
    to right,
    #ffffff 0%,
    #ffffff ${({ $progress }) => `${$progress * 100}%`},
    transparent ${({ $progress }) => `${$progress * 100}%`},
    transparent 100%
  );

  mix-blend-mode: difference;

  pointer-events: none;
`;

export const Index = styled.div`
  position: fixed;

  top: 50%;

  /*
    브라우저 중앙에 있는 402px 모바일 컨테이너의
    오른쪽 끝을 기준으로 위치하도록 설정
  */
  right: max(
    10px,
    calc((100vw - 402px) / 2 + 10px)
  );

  z-index: 130;

  transform: translateY(-50%);

  writing-mode: vertical-rl;

  font-size: 8px;
  letter-spacing: 0.2em;

  opacity: 0.52;

  mix-blend-mode: difference;

  pointer-events: none;
`;

export const StickyBase = styled.div`
  position: sticky;

  top: 0;

  width: 100%;
  height: 100svh;

  overflow: hidden;
`;

export const Eyebrow = styled.div`
  color: #816a57;

  font-size: 9px;
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
`;

export const StickyNight = styled(StickyBase)`
  background:
    radial-gradient(
      circle at 15% 18%,
      rgba(255, 255, 255, 0.045),
      transparent 19%
    ),
    radial-gradient(
      circle at 82% 16%,
      rgba(78, 99, 164, 0.13),
      transparent 25%
    ),
    linear-gradient(
      180deg,
      #05060a,
      #090c14 67%,
      #111119
    );
`;

export const Stars = styled.div`
  position: absolute;

  inset: 0;
`;

export const Star = styled.span`
  position: absolute;

  width: 2px;
  height: 2px;

  border-radius: 50%;

  background: #ffffff;

  box-shadow: 0 0 7px rgba(255, 255, 255, 0.45);
`;

/* =========================
   날아오는 봉투
========================= */

export const EnvelopeFlight = styled.div`
  position: absolute;

  left: 50%;
  top: 50%;

  z-index: 14;

  width: 76%;
  max-width: 305px;

  transform:
    translate(-50%, -50%)
    translate(58px, -60vh)
    rotate(28deg)
    scale(0.14);

  filter: drop-shadow(
    0 24px 30px rgba(0, 0, 0, 0.38)
  );

  will-change: transform, opacity;
`;

// 봉투 
export const Envelope = styled.div`
  position: relative;

  width: 100%;

  aspect-ratio: 1.5;

  background: #e9d8c4;

  box-shadow:
    0 20px 52px rgba(0, 0, 0, 0.34);

  &::before {
    content: "";

    position: absolute;

    inset: 0;

    z-index: 3;

    background:
      linear-gradient(
          150deg,
          transparent 49.5%,
          #d4bda4 50%
        )
        left / 50% 100%
        no-repeat,
      linear-gradient(
          210deg,
          transparent 49.5%,
          #ddc8b2 50%
        )
        right / 50% 100%
        no-repeat;
  }

  &::after {
    content: "";

    position: absolute;

    inset: 0;

    z-index: 8;

    border:
      1px solid rgba(78, 53, 35, 0.14);
  }
`;

// 봉투 뚜껑
export const Flap = styled.div`
  position: absolute;

  left: 0;
  right: 0;
  top: 0;

  z-index: 7;

  height: 68%;

  clip-path:
    polygon(
      0 0,
      100% 0,
      50% 100%
    );

  background: #f1e1cd;

  transform-origin: top;
`;

export const Seal = styled.div`
  position: absolute;

  left: 50%;
  top: 53%;

  z-index: 9;

  width: 58px;
  height: 58px;

  transform: translate(-50%, -50%);

  display: grid;
  place-items: center;

  border:
    1px solid rgba(255, 255, 255, 0.2);

  border-radius: 50%;

  background:
    radial-gradient(
      circle at 35% 30%,
      #b87b51,
      #60351f 72%
    );

  color: #ecd8c4;

  box-shadow:
    0 7px 14px rgba(0, 0, 0, 0.25);

  font:
    11px/1.05 Pretendard,
    Pretendard;

  text-align: center;
`;

/* =========================
   초대장 종이 (편지지)
========================= */

export const InvitationPaper = styled.div`
  position: absolute;

  left: 50%;
  top: 50%;

  z-index: 16;

  width: 66%;
  max-width: 265px;

  height: 345px;

  opacity: 0;

  overflow: hidden;

  transform:
    translate(-50%, -5%)
    scale(0.88);

  transform-origin: center;

  border:
    1px solid #dbcdbd;

  color: var(--ink);

  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.5),
      transparent 10%
    ),
    #f8f1e7;

  box-shadow:
    0 14px 38px rgba(66, 44, 29, 0.12);

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
        rgba(80, 55, 35, 0.035) 0 1px,
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

  height: 100%;

  padding: 9% 8%;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  text-align: center;

  h1 {
    margin: 14px 0;

    font:
      500 clamp(28px, 8vw, 34px) /
      1.18 Pretendard,
      "Times New Roman",
      serif;

    letter-spacing: -0.035em;
  }

  p {
    margin: 0;

    color: #705c4d;

    font-size: 12px;
    line-height: 1.75;
  }
`;

export const PaperRule = styled.div`
  width: 42px;
  height: 1px;

  margin: 15px auto;

  background: #9b8068;
`;

export const PaperStamp = styled.div`
  margin-top: 19px;

  padding: 7px 9px;

  border:
    1px solid #bca58e;

  color: #8d745f;

  font-size: 8px;
  letter-spacing: 0.17em;
`;

export const PaperWhiteout = styled.div`
  position: absolute;

  inset: 0;

  z-index: 10;

  opacity: 0;

  pointer-events: none;

  background: #f6f0e7;
`;

export const SkyCue = styled.div`
  position: absolute;

  left: 50%;
  bottom: 6vh;

  transform: translateX(-50%);

  white-space: nowrap;

  font-size: 9px;
  letter-spacing: 0.16em;

  opacity: 0.48;
`;

/* =========================================================
   02 / 1976 → 2026
========================================================= */

export const ErasChapter = styled.section`
  position: relative;

  width: 100%;
  height: 520svh;

  color: var(--ink);
`;

export const EraSticky = styled(StickyBase)`
  background: #f6f0e7;
`;

export const PaperFiber = styled.div`
  position: absolute;

  inset: 0;

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
  position: absolute;

  inset: 0;

  z-index: 2;

  opacity: 0.2;

  pointer-events: none;

  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 170 170' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.55' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='.7'/%3E%3C/svg%3E");
`;

export const CognacWash = styled.div`
  position: absolute;

  inset: 0;

  z-index: 0;

  opacity: 0;

  background:
    linear-gradient(
      135deg,
      rgba(154, 98, 56, 0.34),
      rgba(111, 63, 38, 0.06)
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
      rgba(226, 232, 241, 0.6) 48%,
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

  color: rgba(65, 45, 31, 0.1);

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

  color: #3b2a1e;

  font-size: clamp(118px, 38vw, 153px);

  line-height: 0.8;

  letter-spacing: -0.08em;

  font-weight: 800;
`;

export const EraIntro = styled.div`
  position: absolute;

  left: 7%;
  right: 7%;

  top: 31vh;

  z-index: 9;

  max-width: 520px;

  h2 {
    margin: 0 0 10px;

    font:
      500 31px/1.18 Pretendard,
      "Times New Roman",
      serif;
  }

  p {
    margin: 0;

    color: #715e50;

    font-size: 14px;
    line-height: 1.7;
  }
`;

/* =========================
   뮌헨 사진
========================= */

export const EraPhotos = styled.div`
  position: absolute;

  inset: 0;

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

      transform: rotate(-3deg);
    `}

  ${({ $variant }) =>
    $variant === "two" &&
    css`
      right: -6%;
      top: 59vh;

      width: 48%;
      height: 25vh;

      transform: rotate(5deg);
    `}

  ${({ $variant }) =>
    $variant === "three" &&
    css`
      left: 19%;
      bottom: 4vh;

      width: 48%;
      height: 22vh;

      transform: rotate(2deg);
    `}
`;

export const EraCode = styled.div`
  position: absolute;

  left: 7%;
  bottom: 6vh;

  z-index: 9;

  color: #755f4f;

  font-size: 9px;
  letter-spacing: 0.18em;
`;

/* =========================
   2026 최종 장면
========================= */

export const FinalMoment = styled.div`
  position: absolute;

  inset: 0;

  z-index: 15;

  opacity: 0;

  pointer-events: none;

  display: grid;

  place-items: center;

  padding: 24px;

  text-align: center;

  strong {
    display: block;

    color: #bdc5d0;

    font-size: clamp(135px, 44vw, 177px);

    font-weight: 800;

    line-height: 0.78;

    letter-spacing: -0.095em;
  }

  span {
    display: block;

    margin-top: 15px;

    font:
      500 38px/1.1 Pretendard,
      "Times New Roman",
      serif;
  }

  b {
    display: block;

    margin-top: 8px;

    font:
      500 clamp(34px, 9vw, 42px) /
      1.13 Pretendard,
      "Times New Roman",
      serif;
  }
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
      #eef0f1 0%,
      #f4eee7 22%,
      #eee0d0 100%
    );
`;

export const PaddyMeta = styled.div`
  position: absolute;

  left: 7%;
  top: 10vh;

  z-index: 5;

  color: #806a58;

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

  color: #3a2b20;

  font:
    500 clamp(36px, 11vw, 44px) /
    1.05 Pretendard,
    "Times New Roman",
    serif;
`;

export const PaddySmall = styled.img`
  position: absolute;

  right: 4%;
  bottom: 18vh;

  z-index: 5;

  width: 42%;
  max-width: 170px;

  filter:
    drop-shadow(
      0 16px 18px rgba(74, 49, 31, 0.16)
    );

  transform:
    translateY(30px)
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

    background: #ffffff;
  }

  strong {
    position: relative;

    z-index: 2;

    display: block;

    margin-bottom: 10px;

    font-size: 10px;
    letter-spacing: 0.15em;
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

  color: var(--ink);

  background:
    linear-gradient(
      180deg,
      #eee0d0 0%,
      #f6f0e8 42%,
      #34251b 100%
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

    font:
      500 34px/1.18 Pretendard,
      "Times New Roman",
      serif;
  }

  p {
    margin: 0;

    color: #725e50;

    font-size: 13px;
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

  z-index: 6;

  padding: 24px 0 26px;

  border-top:
    1px solid #aa9079;

  border-bottom:
    1px solid #aa9079;

  text-align: center;

  span {
    display: block;

    color: #886e59;

    font-size: 9px;
    letter-spacing: 0.18em;
  }

  strong {
    display: block;

    margin: 12px 0 6px;

    font:
      500 clamp(64px, 21vw, 84px) /
      0.9 Pretendard,
      "Times New Roman",
      serif;
  }

  b {
    color: #826957;

    font-size: 11px;

    font-weight: 400;

    letter-spacing: 0.14em;
  }
`;

export const RegisterPaddy = styled.img`
  position: absolute;

  right: -3%;
  bottom: 15vh;

  z-index: 5;

  width: 37%;
  max-width: 150px;

  filter:
    drop-shadow(
      0 14px 15px rgba(0, 0, 0, 0.12)
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

  border: 0;

  border-radius: 999px;

  background: #302217;

  color: #ffffff;

  text-align: left;

  cursor: pointer;

  strong {
    display: block;

    font-size: 14px;
  }

  span {
    display: block;

    margin-top: 4px;

    font-size: 9px;

    letter-spacing: 0.1em;

    opacity: 0.67;
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
  position: absolute;

  inset: 0;

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
        #281a13,
        #3b281d
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

    &:disabled {
  cursor: default;
}

    &:last-child {
      transform-origin: right;
    }
  }
`;
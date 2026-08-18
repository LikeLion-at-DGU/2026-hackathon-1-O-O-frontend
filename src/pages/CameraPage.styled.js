import styled from "styled-components";


export const PageContainer = styled.div`
  position: relative;

  width: 100%;
  height: 100%;

  background: #000;

  overflow: hidden;
`;

export const CameraArea = styled.div`
  position: relative;

  width: 100%;
  height: calc(100dvh - 103px);

  background: #000;

  overflow: hidden;
`;

/* =========================
   실제 카메라 화면
========================= */

export const Video = styled.video`
  position: absolute;

  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;

  background: #000;
`;

/* =========================
   촬영한 사진
========================= */

export const Photo = styled.img`
  position: absolute;

  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;
`;

/* =========================
   상단 안내문
========================= */

export const GuideText = styled.div`
  position: absolute;

  top: 26px;
  left: 50%;

  transform: translateX(-50%);

  width: calc(100% - 32px);

  color: var(--Neutral-N30, #a8a29d);

  text-align: center;

  font-family: Pretendard;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;

  line-height: 150%;

  z-index: 5;

  pointer-events: none;
`;

/* =========================
   사람 실루엣 SVG

   SVG 파일을 따로 불러오지 않고
   CSS background-image 안에 직접 넣음

   <svg xmlns="http://www.w3.org/2000/svg" width="262" height="481" viewBox="0 0 262 481" fill="none">
  <g opacity="0.5">
    <path d="M132.736 97.941C126.314 97.4957 120.044 95.7745 114.293 92.8778C102.938 87.1583 94.2811 77.2038 90.1871 65.1579C86.093 53.1121 86.8892 39.9387 92.4041 28.4747C97.919 17.0107 107.711 8.17333 119.672 3.86569C131.634 -0.44194 144.806 0.124827 156.354 5.44394C162.203 8.13788 167.456 11.9708 171.809 16.719C176.162 21.4672 179.526 27.0356 181.706 33.0992C183.885 39.1628 184.837 45.6002 184.504 52.0358C184.171 58.4713 182.561 64.7761 179.768 70.5823C176.975 76.3884 173.055 81.5795 168.236 85.8527C163.417 90.126 157.796 93.3957 151.701 95.4712C145.606 97.5467 139.159 98.3862 132.736 97.941Z" stroke="#A8A29D" stroke-width="2" stroke-linecap="round" stroke-dasharray="10 10"/>
    <path d="M161.161 110.614C144.027 104.017 125.216 103.167 107.558 108.192C87.2805 113.977 69.8937 127.127 58.8062 145.078L46.134 165.581L5.41809 238.005C0.803335 246.301 -0.340689 256.089 2.23632 265.227C4.81333 274.366 10.9016 282.11 19.1689 286.766C27.4363 291.423 37.2096 292.612 46.3506 290.073C55.4916 287.535 63.2559 281.475 67.9448 273.221L81.5228 249.074V286.399L38.1343 434.04C35.4747 443.169 36.5413 452.981 41.1002 461.324C45.6591 469.667 53.338 475.859 62.4522 478.541C71.5663 481.224 81.3715 480.179 89.7166 475.634C98.0616 471.09 104.265 463.418 106.966 454.301L130.848 373.043L154.722 454.301C157.423 463.418 163.626 471.09 171.971 475.634C180.316 480.179 190.121 481.224 199.235 478.541C208.35 475.859 216.028 469.667 220.587 461.324C225.146 452.981 226.213 443.169 223.553 434.04L180.174 286.399V249.074L193.743 273.23C196.053 277.34 199.149 280.955 202.855 283.867C206.56 286.779 210.803 288.932 215.34 290.204C219.877 291.475 224.619 291.839 229.297 291.276C233.975 290.712 238.496 289.232 242.602 286.92C246.708 284.608 250.319 281.508 253.228 277.799C256.138 274.09 258.289 269.844 259.559 265.302C260.829 260.761 261.193 256.014 260.63 251.332C260.067 246.65 258.589 242.124 256.278 238.014L215.509 165.482L202.568 144.773C192.826 129.198 178.295 117.211 161.161 110.614Z" stroke="#A8A29D" stroke-width="2" stroke-linecap="round" stroke-dasharray="10 10"/>
  </g>
</svg>
========================= */

export const PersonGuide = styled.div`
  position: absolute;

  top: 88px;
  left: 50%;

  transform: translateX(-50%);

  width: 260px;
  height: 479px;

  aspect-ratio: 19 / 35;

  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='262' height='481' viewBox='0 0 262 481' fill='none'%3E%3Cg opacity='0.5'%3E%3Cpath d='M132.736 97.941C126.314 97.4957 120.044 95.7745 114.293 92.8778C102.938 87.1583 94.2811 77.2038 90.1871 65.1579C86.093 53.1121 86.8892 39.9387 92.4041 28.4747C97.919 17.0107 107.711 8.17333 119.672 3.86569C131.634 -0.44194 144.806 0.124827 156.354 5.44394C162.203 8.13788 167.456 11.9708 171.809 16.719C176.162 21.4672 179.526 27.0356 181.706 33.0992C183.885 39.1628 184.837 45.6002 184.504 52.0358C184.171 58.4713 182.561 64.7761 179.768 70.5823C176.975 76.3884 173.055 81.5795 168.236 85.8527C163.417 90.126 157.796 93.3957 151.701 95.4712C145.606 97.5467 139.159 98.3862 132.736 97.941Z' stroke='%23A8A29D' stroke-width='2' stroke-linecap='round' stroke-dasharray='10 10'/%3E%3Cpath d='M161.161 110.614C144.027 104.017 125.216 103.167 107.558 108.192C87.2805 113.977 69.8937 127.127 58.8062 145.078L46.134 165.581L5.41809 238.005C0.803335 246.301 -0.340689 256.089 2.23632 265.227C4.81333 274.366 10.9016 282.11 19.1689 286.766C27.4363 291.423 37.2096 292.612 46.3506 290.073C55.4916 287.535 63.2559 281.475 67.9448 273.221L81.5228 249.074V286.399L38.1343 434.04C35.4747 443.169 36.5413 452.981 41.1002 461.324C45.6591 469.667 53.338 475.859 62.4522 478.541C71.5663 481.224 81.3715 480.179 89.7166 475.634C98.0616 471.09 104.265 463.418 106.966 454.301L130.848 373.043L154.722 454.301C157.423 463.418 163.626 471.09 171.971 475.634C180.316 480.179 190.121 481.224 199.235 478.541C208.35 475.859 216.028 469.667 220.587 461.324C225.146 452.981 226.213 443.169 223.553 434.04L180.174 286.399V249.074L193.743 273.23C196.053 277.34 199.149 280.955 202.855 283.867C206.56 286.779 210.803 288.932 215.34 290.204C219.877 291.475 224.619 291.839 229.297 291.276C233.975 290.712 238.496 289.232 242.602 286.92C246.708 284.608 250.319 281.508 253.228 277.799C256.138 274.09 258.289 269.844 259.559 265.302C260.829 260.761 261.193 256.014 260.63 251.332C260.067 246.65 258.589 242.124 256.278 238.014L215.509 165.482L202.568 144.773C192.826 129.198 178.295 117.211 161.161 110.614Z' stroke='%23A8A29D' stroke-width='2' stroke-linecap='round' stroke-dasharray='10 10'/%3E%3C/g%3E%3C/svg%3E");

  pointer-events: none;

  z-index: 5;
`;

/* =========================
   촬영 버튼
========================= */

export const CaptureButton = styled.button`
  position: absolute;

  left: 50%;
  bottom: 48px;

  transform: translateX(-50%);

  width: 62px;
  height: 62px;

  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 50%;

  background: #3d3d3d;

  cursor: pointer;

  z-index: 10;

  &:active {
    transform: translateX(-50%) scale(0.95);
  }
`;

/* =========================
   카메라 아이콘
========================= */

export const CameraIcon = styled.div`
  position: relative;

  width: 34px;
  height: 25px;

  background: #f3f1ee;

  border-radius: 4px;

  &::before {
    content: "";

    position: absolute;

    top: -5px;
    left: 8px;

    width: 15px;
    height: 7px;

    background: #f3f1ee;

    border-radius: 3px 3px 0 0;
  }
`;

export const CameraLens = styled.div`
  position: absolute;

  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);

  width: 11px;
  height: 11px;

  border-radius: 50%;

  background: #3d3d3d;
`;

/* =========================
   촬영 완료 후 버튼
========================= */

export const ActionButtons = styled.div`
  position: absolute;

  left: 20px;
  right: 20px;
  bottom: 30px;

  display: flex;

  gap: 10px;

  z-index: 10;
`;

export const RetakeButton = styled.button`
  flex: 1;

  height: 48px;

  border: 1px solid #e5e3e0;
  border-radius: 10px;

  background: rgba(34, 34, 34, 0.7);

  color: #e5e3e0;

  font-family: Pretendard;
  font-size: 14px;
  font-weight: 600;

  cursor: pointer;
`;

export const UseButton = styled.button`
  flex: 1;

  height: 48px;

  border: none;
  border-radius: 10px;

  background: #8c6239;

  color: #e5e3e0;

  font-family: Pretendard;
  font-size: 14px;
  font-weight: 600;

  cursor: pointer;
`;

/* =========================
   카메라 오류
========================= */

export const ErrorMessage = styled.div`
  position: absolute;

  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);

  width: 80%;

  color: #e5e3e0;

  text-align: center;

  font-family: Pretendard;
  font-size: 13px;

  line-height: 160%;

  z-index: 6;
`;
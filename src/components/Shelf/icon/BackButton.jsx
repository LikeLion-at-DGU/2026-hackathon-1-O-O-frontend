// src/components/Shelf/icon/BackButton.jsx
import React from "react";

export default function BackButton({ onClick, style }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      onClick={onClick}
      style={{
        cursor: "pointer",
        display: "block",
        ...style,
      }}
      aria-label="지도로 돌아가기"
    >
      <g filter="url(#filter0_d_332_283)">
        <rect x="4" y="3" width="24" height="24" rx="12" fill="white" />
        <path
          d="M21 14.2C21.4418 14.2 21.8 14.5582 21.8 15C21.8 15.4418 21.4418 15.8 21 15.8V15V14.2ZM10.4343 15.5657C10.1219 15.2533 10.1219 14.7467 10.4343 14.4343L15.5255 9.34315C15.8379 9.03073 16.3444 9.03073 16.6569 9.34315C16.9693 9.65557 16.9693 10.1621 16.6569 10.4745L12.1314 15L16.6569 19.5255C16.9693 19.8379 16.9693 20.3444 16.6569 20.6569C16.3444 20.9693 15.8379 20.9693 15.5255 20.6569L10.4343 15.5657ZM21 15V15.8H11V15V14.2H21V15Z"
          fill="#222222"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_332_283"
          x="0"
          y="0"
          width="32"
          height="32"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_332_283"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_332_283"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
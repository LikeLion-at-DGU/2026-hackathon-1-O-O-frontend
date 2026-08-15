import React, { useState, useEffect } from "react";
import SoundOnIcon from "../assets/soundon.svg";
import SoundOffIcon from "../assets/soundoff.svg";

// 🚀 전역 오디오 객체 생성 (화면에 SoundButton이 없어도 접근 가능)

export class BgmManager {
    static audio = new Audio("/bgm.mp3");
    static isInitialized = false;

    static init() {
        if (!this.isInitialized) {
            this.audio.loop = true;
            this.isInitialized = true;
        }
    }

    static play() {
        this.init();
        return this.audio.play();
    }

    static pause() {
        this.audio.pause();
    }
}

export default function SoundButton({ isLight = false }) {
    const [isMuted, setIsMuted] = useState(BgmManager.audio.paused);

    useEffect(() => {
        // 음악 상태 변경 감지
        const updateState = () => {
            setIsMuted(BgmManager.audio.paused);
        };

        const audio = BgmManager.audio;
        audio.addEventListener("play", updateState);
        audio.addEventListener("pause", updateState);

        return () => {
            audio.removeEventListener("play", updateState);
            audio.removeEventListener("pause", updateState);
        };
    }, []);

    const toggleSound = (e) => {
        e.stopPropagation();

        if (BgmManager.audio.paused) {
            BgmManager.play().catch((err) => console.log("재생 실패:", err));
        } else {
            BgmManager.pause();
        }
    };

    const currentIcon = isMuted ? SoundOffIcon : SoundOnIcon;
    const iconColor = isLight ? "#222222" :"#F3EEE3";

    return (
        <div style={{ display: "inline-block" }}>
            <button
                type="button"
                onClick={toggleSound}
                style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <>
                {isMuted ? (
                /* 🔇 음소거 아이콘 */
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <mask
                        id="mask0_47_599"
                        style={{ maskType: "alpha" }}
                        maskUnits="userSpaceOnUse"
                        x="15"
                        y="9"
                        width="7"
                        height="7"
                        >
                        <path d="M15 9H21.5V15.5H15V9Z" fill="white" />
                        </mask>
                        <g mask="url(#mask0_47_599)">
                        <path
                            d="M20.3675 10.143L16.1245 14.3855M16.125 10.143L20.3675 14.3855"
                            stroke={iconColor}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        </g>
                        <path
                        d="M12 3V21C8.5 21 5.8995 16.42 5.8995 16.42H3C2.73478 16.42 2.48043 16.3146 2.29289 16.1271C2.10536 15.9396 2 15.6852 2 15.42V8.505C2 8.23978 2.10536 7.98543 2.29289 7.79789C2.48043 7.61036 2.73478 7.505 3 7.505H5.8995C5.8995 7.505 8.5 3 12 3Z"
                        fill={iconColor}
                        stroke={iconColor}
                        strokeWidth="2"
                        strokeLinejoin="round"
                        />
                    </svg>
                    ) : (
                    /* 🔊 사운드 On 아이콘 */
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                        d="M12 3V21C8.5 21 5.8995 16.42 5.8995 16.42H3C2.73478 16.42 2.48043 16.3146 2.29289 16.1271C2.10536 15.9396 2 15.6852 2 15.42V8.505C2 8.23978 2.10536 7.98543 2.29289 7.79789C2.48043 7.61036 2.73478 7.505 3 7.505H5.8995C5.8995 7.505 8.5 3 12 3Z"
                        fill={iconColor}
                        stroke={iconColor}
                        strokeWidth="2"
                        strokeLinejoin="round"
                        />
                        <path
                        d="M15 9C16.5092 9.95027 18.6222 12.4807 15 15"
                        stroke={iconColor}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        />
                        <path
                        d="M17.5 7C19.7639 8.58379 22.9333 12.8011 17.5 17"
                        stroke={iconColor}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        />
                    </svg>
                    )}
                </>
            </button>
        </div>
    );
}
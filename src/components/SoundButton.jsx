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

export default function SoundButton() {
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
                <img
                    src={isMuted ? SoundOffIcon : SoundOnIcon}
                    alt={isMuted ? "음소거" : "소리 켜짐"}
                    style={{ width: "24px", height: "24px" }}
                />
            </button>
        </div>
    );
}
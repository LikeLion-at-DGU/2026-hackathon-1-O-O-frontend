import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { enterStore } from "../../../api/visits";
import { shelfData } from "../../../components/Shelf/ShelfData";
import { BgmManager } from "../../../utils/bgmManager";
import { clamp, INITIAL_MUSE_NO, lerp, MAP_ROUTE, mixColor } from "../constants";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function useLandingPage() {
    const navigate = useNavigate();

    const heroRef = useRef(null);
    const eraRef = useRef(null);
    const collectionRef = useRef(null);
    const paddyRef = useRef(null);
    const registerRef = useRef(null);
    const envelopeRef = useRef(null);
    const flapRef = useRef(null);
    const sealRef = useRef(null);
    const paperRef = useRef(null);
    const paperContentRef = useRef(null);
    const whiteoutRef = useRef(null);
    const eraStickyRef = useRef(null);
    const yearRef = useRef(null);
    const introRef = useRef(null);
    const photosRef = useRef(null);
    const railRef = useRef(null);
    const fiberRef = useRef(null);
    const grainRef = useRef(null);
    const cognacRef = useRef(null);
    const silverRef = useRef(null);
    const finalMomentRef = useRef(null);
    const collectionStickyRef = useRef(null);
    const collectionVisualRef = useRef(null);
    const collectionCopyRef = useRef(null);
    const collectionLineRef = useRef(null);
    const photoRef1 = useRef(null);
    const photoRef2 = useRef(null);
    const photoRef3 = useRef(null);
    const imageRef1 = useRef(null);
    const imageRef2 = useRef(null);
    const imageRef3 = useRef(null);
    const paddyImgRef = useRef(null);
    const speechHintRef = useRef(null);
    const slotNumberRef = useRef(null);
    const slotStateRef = useRef(null);
    const slotRef = useRef(null);

    const photoRefs = [photoRef1, photoRef2, photoRef3];
    const imageRefs = [imageRef1, imageRef2, imageRef3];

    const refs = {
        heroRef,
        eraRef,
        collectionRef,
        paddyRef,
        registerRef,
        envelopeRef,
        flapRef,
        sealRef,
        paperRef,
        paperContentRef,
        whiteoutRef,
        eraStickyRef,
        yearRef,
        introRef,
        photosRef,
        railRef,
        fiberRef,
        grainRef,
        cognacRef,
        silverRef,
        finalMomentRef,
        collectionStickyRef,
        collectionVisualRef,
        collectionCopyRef,
        collectionLineRef,
        photoRefs,
        imageRefs,
        paddyImgRef,
        speechHintRef,
        slotNumberRef,
        slotStateRef,
        slotRef,
    };

    const [pageProgress, setPageProgress] = useState(0);
    const [speechPhase, setSpeechPhase] = useState(0);
    const [registerDone, setRegisterDone] = useState(false);
    const [doorClosing, setDoorClosing] = useState(false);
    const [isEntering, setIsEntering] = useState(false);

    const finalMuse = `N.${INITIAL_MUSE_NO}`;

    useEffect(() => {
        const activeZones = [1, 2, 3, 4, 5, 6, 7];
        const imageUrls = [
            ...new Set(
                activeZones
                    .flatMap((zone) => shelfData[zone] ?? [])
                    .map((product) => product.imageUrl)
                    .filter(Boolean)
            ),
        ];

        imageUrls.forEach((src) => {
            const image = new Image();
            image.fetchPriority = "low";
            image.decoding = "async";
            image.src = src;
        });
    }, []);

    useEffect(() => {
        let animationFrame = null;

        const sectionProgress = (ref) => {
            if (!ref.current) return 0;
            const rect = ref.current.getBoundingClientRect();
            const length = ref.current.offsetHeight - window.innerHeight;
            return length > 0 ? clamp(-rect.top / length) : 0;
        };

        const updateHero = () => {
            const progress = sectionProgress(heroRef);
            const fly = clamp(progress / 0.32);
            const open = clamp((progress - 0.34) / 0.14);
            const paperReveal = clamp((progress - 0.45) / 0.1);
            const present = clamp((progress - 0.48) / 0.16);
            const expand = clamp((progress - 0.68) / 0.28);

            if (envelopeRef.current) {
                envelopeRef.current.style.transform = `
                    translate(-50%, -50%)
                    translate(${58 * (1 - fly)}vw, ${-60 * (1 - fly)}vh)
                    rotate(${28 * (1 - fly)}deg)
                    scale(${0.14 + 0.86 * fly})
                `;
                envelopeRef.current.style.opacity = `${1 - clamp((progress - 0.67) / 0.09)}`;
            }

            if (flapRef.current) {
                flapRef.current.style.transform = `rotateX(${180 * open}deg)`;
            }

            if (paperRef.current) {
                const translateY = lerp(-5, -50, present);
                const scale =
                    lerp(0.88, 1, present) *
                    lerp(0.88, 1, present) *
                    lerp(1, 4.25, expand);

                paperRef.current.style.opacity = `${paperReveal}`;
                paperRef.current.style.transform = `translate(-50%, ${translateY}%) scale(${scale})`;
                paperRef.current.style.zIndex = present > 0.12 ? "16" : "11";
            }

            if (paperContentRef.current) {
                paperContentRef.current.style.opacity = `${1 - clamp((expand - 0.25) / 0.42)}`;
            }

            if (whiteoutRef.current) {
                whiteoutRef.current.style.opacity = `${clamp((expand - 0.78) / 0.22)}`;
            }
        };

        const updateEra = () => {
            const progress = sectionProgress(eraRef);
            if (!eraStickyRef.current) return;

            eraStickyRef.current.style.backgroundColor =
                progress < 0.62
                    ? mixColor("#F3EEE3", "#D1CCC7", progress / 0.62)
                    : mixColor("#D1CCC7", "#F4F2EE", (progress - 0.62) / 0.38);

            if (fiberRef.current) fiberRef.current.style.opacity = `${0.2 - 0.18 * progress}`;
            if (grainRef.current) grainRef.current.style.opacity = `${0.2 - 0.17 * progress}`;

            if (cognacRef.current) {
                const strength =
                    progress < 0.66
                        ? clamp((progress - 0.22) / 0.3) * 0.38
                        : 0.38 * (1 - clamp((progress - 0.66) / 0.25));
                cognacRef.current.style.opacity = `${strength}`;
            }

            if (silverRef.current) {
                silverRef.current.style.opacity = `${clamp((progress - 0.72) / 0.18)}`;
                silverRef.current.style.transform =
                    `translateX(${lerp(-55, 45, clamp((progress - 0.72) / 0.22))}%)`;
            }

            if (railRef.current) {
                railRef.current.style.opacity = `${
                    clamp((progress - 0.13) / 0.14) *
                    (1 - clamp((progress - 0.84) / 0.1))
                }`;
                railRef.current.style.transform = `translateX(${-64 * progress}vw)`;
            }

            const sepia = lerp(0.78, 0, progress);
            const saturation = lerp(0.48, 1.08, progress);
            const contrast = lerp(0.9, 1.08, progress);
            const brightness = lerp(0.94, 1.03, progress);
            const blur = lerp(1.2, 0, progress);

            imageRefs.forEach((ref) => {
                if (!ref.current) return;
                ref.current.style.filter = `
                    sepia(${sepia}) saturate(${saturation})
                    contrast(${contrast}) brightness(${brightness}) blur(${blur}px)
                `;
            });

            const transforms = [
                [-3, -0.2, -20, -23, 1.08],
                [5, 0.2, -26, 9, 1.05],
                [2, 0, 20, -20, 1.07],
            ];

            photoRefs.forEach((ref, index) => {
                if (!ref.current) return;
                const [startRotation, endRotation, x, y, scale] = transforms[index];
                ref.current.style.borderWidth = `${lerp(11, 2, progress)}px`;
                ref.current.style.transform = `
                    translate(${lerp(0, x, progress)}px, ${lerp(0, y, progress)}px)
                    rotate(${lerp(startRotation, endRotation, progress)}deg)
                    scale(${lerp(1, scale, progress)})
                `;
            });

            if (introRef.current) {
                introRef.current.style.opacity = `${1 - clamp((progress - 0.12) / 0.1)}`;
            }

            let year = "1976";
            if (progress >= 0.8) year = "2026";
            else if (progress >= 0.66) year = "2016";
            else if (progress >= 0.5) year = "2006";
            else if (progress >= 0.34) year = "1996";
            else if (progress >= 0.18) year = "1986";

            if (yearRef.current) {
                yearRef.current.textContent = year;
                yearRef.current.style.fontFamily = '"Times New Roman", serif';
                yearRef.current.style.fontWeight = "600";
                yearRef.current.style.letterSpacing = progress < 0.5 ? "-0.065em" : "-0.085em";
                yearRef.current.style.color =
                    progress < 0.75
                        ? mixColor("#222222", "#8C6239", progress / 0.75)
                        : mixColor("#8C6239", "#D1CCC7", (progress - 0.75) / 0.25);
            }

            const finale = clamp((progress - 0.82) / 0.16);
            if (yearRef.current) {
                yearRef.current.style.transform = `scale(${1 + 1.1 * finale})`;
                yearRef.current.style.transformOrigin = "left top";
                yearRef.current.style.opacity = `${1 - finale}`;
            }
            if (photosRef.current) photosRef.current.style.opacity = `${1 - 0.82 * finale}`;
            if (finalMomentRef.current) {
                finalMomentRef.current.style.opacity = `${finale}`;
                finalMomentRef.current.style.transform = `scale(${0.9 + 0.1 * finale})`;
            }
        };

        const updateCollection = () => {
            const progress = sectionProgress(collectionRef);

            if (collectionStickyRef.current) {
                collectionStickyRef.current.style.backgroundColor =
                    mixColor("#F4F2EE", "#161616", clamp(progress / 0.34));
            }

            if (collectionVisualRef.current) {
                const reveal = clamp((progress - 0.08) / 0.34);
                const leave = clamp((progress - 0.78) / 0.18);
                collectionVisualRef.current.style.opacity = `${reveal * (1 - leave)}`;
                collectionVisualRef.current.style.transform = `
                    translateY(${lerp(48, -18, reveal)}px)
                    scale(${lerp(0.88, 1.08, reveal)})
                `;
            }

            if (collectionCopyRef.current) {
                const reveal = clamp((progress - 0.32) / 0.24);
                const leave = clamp((progress - 0.86) / 0.12);
                collectionCopyRef.current.style.opacity = `${reveal * (1 - leave)}`;
                collectionCopyRef.current.style.transform = `translateY(${lerp(34, 0, reveal)}px)`;
            }

            if (collectionLineRef.current) {
                collectionLineRef.current.style.transform = `scaleX(${clamp((progress - 0.42) / 0.28)})`;
            }
        };

        const updatePaddy = () => {
            const progress = sectionProgress(paddyRef);

            if (paddyImgRef.current) {
                paddyImgRef.current.style.transform = `
                    translateY(${lerp(30, 0, clamp((progress - 0.05) / 0.32))}px)
                    rotate(${lerp(-3, 1, clamp(progress / 0.55))}deg)
                    scale(${lerp(0.92, 1, clamp(progress / 0.4))})
                `;
            }

            if (speechHintRef.current) {
                speechHintRef.current.style.opacity = `${
                    clamp((progress - 0.18) / 0.18) *
                    (1 - clamp((progress - 0.48) / 0.16))
                }`;
            }

            setSpeechPhase(progress < 0.34 ? 0 : progress < 0.67 ? 1 : 2);
        };

        const updateRegister = () => {
            const progress = sectionProgress(registerRef);

            if (slotRef.current) {
                const lineColor =
                    progress < 0.5
                        ? mixColor("#D1CCC7", "#8C6239", progress / 0.5)
                        : mixColor("#8C6239", "#E5E3E0", (progress - 0.5) / 0.5);
                slotRef.current.style.borderTopColor = lineColor;
                slotRef.current.style.borderBottomColor = lineColor;
            }

            const done = progress >= 0.44;
            setRegisterDone(done);

            if (!done && slotNumberRef.current) {
                const spin = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
                slotNumberRef.current.textContent = `N.${spin}`;
            }
        };

        const update = () => {
            animationFrame = null;
            const total = document.documentElement.scrollHeight - window.innerHeight;
            setPageProgress(total > 0 ? window.scrollY / total : 0);
            updateHero();
            updateEra();
            updateCollection();
            updatePaddy();
            updateRegister();
        };

        const schedule = () => {
            if (!animationFrame) animationFrame = requestAnimationFrame(update);
        };

        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        schedule();

        return () => {
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
            if (animationFrame) cancelAnimationFrame(animationFrame);
        };
    }, []);

    useEffect(() => {
        if (!registerDone) return;
        if (slotNumberRef.current) slotNumberRef.current.textContent = finalMuse;
        if (slotStateRef.current) slotStateRef.current.textContent = "REGISTRATION COMPLETE";
    }, [registerDone, finalMuse]);

    const handleEnter = async () => {
        if (isEntering) return;

        setIsEntering(true);
        setDoorClosing(true);
        BgmManager.play().catch((error) => console.log("음악 재생 실패:", error));

        try {
            await Promise.all([enterStore(), delay(950)]);
        } catch (error) {
            console.error("백엔드 미연결 - 강제 통과합니다:", error);
            await delay(950);
        }

        navigate(MAP_ROUTE, { state: { museNumber: finalMuse } });
    };

    return {
        refs,
        pageProgress,
        speechPhase,
        registerDone,
        doorClosing,
        isEntering,
        handleEnter,
    };
}

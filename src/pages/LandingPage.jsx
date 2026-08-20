import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./LandingPage.styled";

import { BgmManager } from "../utils/bgmManager";
import { shelfData } from "../components/Shelf/ShelfData";
import { enterStore } from "../api/visits";

import paddyhead from "../assets/paddy-head.png";
import paddyChoice from "../assets/paddy-choice.png";
import paddyThink from "../assets/paddy-think.png";
import paddyCheer from "../assets//paddy-cheer.png";
import munich1 from "../assets/munich-1.png";
import munich2 from "../assets/munich-2.png";
import munich3 from "../assets/munich-3.png";

const MAP_ROUTE = "/map";

const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));
const lerp = (a, b, t) => a + (b - a) * t;

const mixColor = (from, to, t) => {
    const parse = (hex) =>
        hex.replace("#", "").match(/\w\w/g).map((v) => parseInt(v, 16));

    const a = parse(from);
    const b = parse(to);
    const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
    return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
};

// 렌더 밖(모듈 로드 시점)에서 한 번만 만든다. 렌더 중 Math.random은 순수성
// 규칙 위반이고, 별 배치와 뮤즈 번호는 세션 동안 고정이면 충분하다.
const STARS = Array.from({ length: 62 }, (_, id) => ({
    id,
    left: Math.random() * 100,
    top: Math.random() * 100,
    opacity: 0.2 + Math.random() * 0.7,
    scale: 0.55 + Math.random() * 1.8,
}));

const getOrCreateMuseNo = () => {
    const saved = sessionStorage.getItem("mcmMuseNo");
    if (saved) return saved;
    const created = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
    sessionStorage.setItem("mcmMuseNo", created);
    return created;
};

const INITIAL_MUSE_NO = getOrCreateMuseNo();

export default function LandingPage() {
    const navigate = useNavigate();

    const heroRef = useRef(null);
    const eraRef = useRef(null);
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
    const codeRef = useRef(null);
    const photosRef = useRef(null);
    const railRef = useRef(null);
    const fiberRef = useRef(null);
    const grainRef = useRef(null);
    const cognacRef = useRef(null);
    const silverRef = useRef(null);
    const finalMomentRef = useRef(null);

    // 배열에 담아 인덱스로 접근하면 refs 린트 규칙에 걸린다. 개별 ref로 두고
    // effect 안에서만 배열로 묶어 순회한다.
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

    const [pageProgress, setPageProgress] = useState(0);
    const [speechPhase, setSpeechPhase] = useState(0);
    const [registerDone, setRegisterDone] = useState(false);
    const [doorClosing, setDoorClosing] = useState(false);
    const [isEntering, setIsEntering] = useState(false);


    // 이미지 preload 부분/ 콘솔 확인 필요
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
            const img = new Image();
            img.fetchPriority = "low";
            img.decoding = "async";
            img.src = src;
        });

        console.log(`${imageUrls.length}개 상품 이미지 preload 시작`);
    }, []);



    const stars = STARS;
    const museNo = INITIAL_MUSE_NO;

    const finalMuse = `N.${museNo}`;

    useEffect(() => {
        let raf = null;

        const sectionProgress = (ref) => {
            if (!ref.current) return 0;
            const rect = ref.current.getBoundingClientRect();
            const length = ref.current.offsetHeight - window.innerHeight;
            return length > 0 ? clamp(-rect.top / length) : 0;
        };

        const updateHero = () => {
            const p = sectionProgress(heroRef);
            const fly = clamp(p / 0.32);

            // 봉투가 거의 다 도착한 뒤 열리기 시작해야하고
            const open = clamp((p - 0.34) / 0.14);

            // 봉투가 열린 다음에야 편지지 등장해야하고...
            const paperReveal = clamp((p - 0.45) / 0.1);

            // 편지지가 봉투 위로 올라오는 구간하는데...
            const present = clamp((p - 0.48) / 0.16);

            // 마지막 확대 
            const expand = clamp((p - 0.68) / 0.28);

            if (envelopeRef.current) {
                envelopeRef.current.style.transform = `
            translate(-50%, -50%)
            translate(${58 * (1 - fly)}vw, ${-60 * (1 - fly)}vh)
            rotate(${28 * (1 - fly)}deg)
            scale(${0.14 + 0.86 * fly})
        `;
                envelopeRef.current.style.opacity = `${1 - clamp((p - 0.67) / 0.09)}`;
            }

            if (flapRef.current) {
                flapRef.current.style.transform = `rotateX(${180 * open}deg)`;
            }

            if (paperRef.current) {
                const y = lerp(-5, -50, present);

                const scale =
                    lerp(0.88, 1, present) *
                    lerp(1, 4.25, expand);

                paperRef.current.style.opacity = `${paperReveal}`;

                paperRef.current.style.transform = `
                translate(-50%, ${y}%)
                scale(${scale})
                `;

                // 편지가 봉투에서 올라오기 시작하면
                // 봉투보다 앞으로 나오게
                paperRef.current.style.zIndex =
                    present > 0.12 ? "16" : "11";
            }

            if (paperContentRef.current) {
                paperContentRef.current.style.opacity =
                    `${1 - clamp((expand - 0.25) / 0.42)}`;
            }

            if (whiteoutRef.current) {
                whiteoutRef.current.style.opacity = `${clamp((expand - 0.78) / 0.22)}`;
            }
        };

        const updateEra = () => {
            const p = sectionProgress(eraRef);
            if (!eraStickyRef.current) return;

            eraStickyRef.current.style.backgroundColor =
                p < 0.62
                    ? mixColor("#F3EEE3", "#D1CCC7", p / 0.62)
                    : mixColor("#D1CCC7", "#F4F2EE", (p - 0.62) / 0.38);

            if (fiberRef.current) fiberRef.current.style.opacity = `${0.2 - 0.18 * p}`;
            if (grainRef.current) grainRef.current.style.opacity = `${0.2 - 0.17 * p}`;

            if (cognacRef.current) {
                const strength =
                    p < 0.66
                        ? clamp((p - 0.22) / 0.3) * 0.38
                        : 0.38 * (1 - clamp((p - 0.66) / 0.25));
                cognacRef.current.style.opacity = `${strength}`;
            }

            if (silverRef.current) {
                silverRef.current.style.opacity = `${clamp((p - 0.72) / 0.18)}`;
                silverRef.current.style.transform =
                    `translateX(${lerp(-55, 45, clamp((p - 0.72) / 0.22))}%)`;
            }

            if (railRef.current) {
                railRef.current.style.opacity = `${clamp((p - 0.13) / 0.14) * (1 - clamp((p - 0.84) / 0.1))
                    }`;
                railRef.current.style.transform = `translateX(${-64 * p}vw)`;
            }

            const sepia = lerp(0.78, 0, p);
            const saturation = lerp(0.48, 1.08, p);
            const contrast = lerp(0.9, 1.08, p);
            const brightness = lerp(0.94, 1.03, p);
            const blur = lerp(1.2, 0, p);

            [imageRef1, imageRef2, imageRef3].forEach((ref) => {
                if (!ref.current) return;
                ref.current.style.filter = `
          sepia(${sepia})
          saturate(${saturation})
          contrast(${contrast})
          brightness(${brightness})
          blur(${blur}px)
        `;
            });

            const transforms = [
                [-3, -0.2, -20, -23, 1.08],
                [5, 0.2, -26, 9, 1.05],
                [2, 0, 20, -20, 1.07],
            ];

            [photoRef1, photoRef2, photoRef3].forEach((ref, i) => {
                if (!ref.current) return;
                const [r1, r2, x, y, scale] = transforms[i];
                ref.current.style.borderWidth = `${lerp(11, 2, p)}px`;
                ref.current.style.transform = `
            translate(${lerp(0, x, p)}px, ${lerp(0, y, p)}px)
            rotate(${lerp(r1, r2, p)}deg)
            scale(${lerp(1, scale, p)})
        `;
            });

            if (introRef.current) {
                introRef.current.style.opacity = `${1 - clamp((p - 0.12) / 0.1)}`;
            }

            let year;
            let code = "MÜNCHEN / ARCHITECTURE / MUSIC / MOVEMENT";

            if (p < 0.18) {
                year = "1976";
            } else if (p < 0.34) {
                year = "1986";
                code = "CULTURE / MOVEMENT / NEW HORIZONS";
            } else if (p < 0.5) {
                year = "1996";
                code = "COGNAC / TRAVEL / GLOBAL IDENTITY";
            } else if (p < 0.66) {
                year = "2006";
                code = "ARCHIVE / MODERN SURFACE / CITY";
            } else if (p < 0.8) {
                year = "2016";
                code = "HERITAGE / DIGITAL / NEW MATERIALS";
            } else {
                year = "2026";
                code = "ARCHIVE × FUTURE";
            }

            if (yearRef.current) {
                yearRef.current.textContent = year;

                if (p < 0.5) {
                    yearRef.current.style.fontFamily = 'Times New Roman', "Times New Roman", "Times New Roman";
                    yearRef.current.style.letterSpacing = "-0.065em";
                    yearRef.current.style.fontWeight = "600";
                } else {
                    yearRef.current.style.fontFamily = 'Times New Roman', "Times New Roman", 'Times New Roman';
                    yearRef.current.style.fontWeight = "600";
                    yearRef.current.style.letterSpacing = "-0.085em";
                }

                yearRef.current.style.color =
                    p < 0.75
                        ? mixColor("#222222", "#8C6239", p / 0.75)
                        : mixColor("#8C6239", "#D1CCC7", (p - 0.75) / 0.25);
            }

            if (codeRef.current) codeRef.current.textContent = code;

            const finale = clamp((p - 0.82) / 0.16);

            if (yearRef.current) {
                yearRef.current.style.transform = `scale(${1 + 1.1 * finale})`;
                yearRef.current.style.transformOrigin = "left top";
                yearRef.current.style.opacity = `${1 - finale}`;
            }

            if (photosRef.current) photosRef.current.style.opacity = `${1 - 0.82 * finale}`;
            if (codeRef.current) codeRef.current.style.opacity = `${1 - finale}`;

            if (finalMomentRef.current) {
                finalMomentRef.current.style.opacity = `${finale}`;
                finalMomentRef.current.style.transform = `scale(${0.9 + 0.1 * finale})`;
            }
        };

        const updatePaddy = () => {
            const p = sectionProgress(paddyRef);

            if (paddyImgRef.current) {
                paddyImgRef.current.style.transform = `
          translateY(${lerp(30, 0, clamp((p - 0.05) / 0.32))}px)
          rotate(${lerp(-3, 1, clamp(p / 0.55))}deg)
          scale(${lerp(0.92, 1, clamp(p / 0.4))})
        `;
            }

            if (speechHintRef.current) {
                speechHintRef.current.style.opacity = `${clamp((p - 0.18) / 0.18) * (1 - clamp((p - 0.48) / 0.16))
                    }`;
            }

            setSpeechPhase(p < 0.34 ? 0 : p < 0.67 ? 1 : 2);
        };

        const updateRegister = () => {
            const p = sectionProgress(registerRef);
            if (slotRef.current) {
                const lineColor =
                    p < 0.5
                        ? mixColor(
                            "#D1CCC7",
                            "#8C6239",
                            p / 0.5
                        )
                        : mixColor(
                            "#8C6239",
                            "#E5E3E0",
                            (p - 0.5) / 0.5
                        );

                slotRef.current.style.borderTopColor = lineColor;
                slotRef.current.style.borderBottomColor = lineColor;
            }

            const done = p >= 0.44;
            setRegisterDone(done);

            if (!done && slotNumberRef.current) {
                const spin = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
                slotNumberRef.current.textContent = `N.${spin}`;
            }
        };

        const update = () => {
            raf = null;
            const total = document.documentElement.scrollHeight - window.innerHeight;
            setPageProgress(total > 0 ? window.scrollY / total : 0);

            updateHero();
            updateEra();
            updatePaddy();
            updateRegister();
        };

        const schedule = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };

        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        schedule();

        return () => {
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    useEffect(() => {
        if (!registerDone) return;
        if (slotNumberRef.current) slotNumberRef.current.textContent = finalMuse;
        if (slotStateRef.current) {
            slotStateRef.current.textContent = "REGISTRATION COMPLETE";
        }
    }, [registerDone, finalMuse]);

    const speech = [
        <>
            안녕하세요.
            <br />
            <b>저는 패디예요.</b>
        </>,
        <>
            저희에게 <b>영감을 줄 사람</b>을 찾고 있어요.
            <br />
            MCM을 둘러보는 동안 <b>계속 함께할게요.</b>
        </>,

        <>
            먼저, 당신의 <b>뮤즈 번호를 등록해볼게요.</b>
        </>,
    ][speechPhase];

    const delay = (ms) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    const handleEnter = async () => {
        if (isEntering) return;

        setIsEntering(true);
        setDoorClosing(true);

        BgmManager.play().catch((err) => {
            console.log("음악 재생 실패:", err);
        });

        try {
            // API와 950ms 문 애니메이션을 동시에 실행
            await Promise.all([
                enterStore(),
                delay(950),
            ]);

            console.log("매장 입장 API 성공");
        } catch (error) {
            console.error(
                "백엔드 미연결 - 강제 통과합니다:",
                error
            );

            // 실패하더라도 문 애니메이션 최소 시간은 확보
            await delay(950);
        }

        navigate(MAP_ROUTE, {
            state: {
                museNumber: finalMuse,
            },
        });
    };

    return (
        <S.MobileContainer>
            <S.Noise />
            <S.Progress $progress={pageProgress} />

            {/* 오른쪽 챕터  */}
            {/* <S.Index>{sceneLabel}</S.Index> */}

            <S.HeroChapter ref={heroRef}>
                <S.StickyNight>
                    <S.Stars>
                        {stars.map((star) => (
                            <S.Star
                                key={star.id}
                                style={{
                                    left: `${star.left}%`,
                                    top: `${star.top}%`,
                                    opacity: star.opacity,
                                    transform: `scale(${star.scale})`,
                                }}
                            />
                        ))}
                    </S.Stars>

                    <S.InvitationPaper ref={paperRef}>
                        <S.PaperContent ref={paperContentRef}>
                            <S.InvitationLabel>
                                INVITATION
                            </S.InvitationLabel>

                            <h1>
                                MCM의 새로운
                                <br />
                                뮤즈가 되어볼까요?
                            </h1>

                            <S.InvitationPaddy
                                src={paddyhead}
                                alt="패디"
                            />

                            <S.InvitationCopy>
                                저희의 브랜드에 영감을 줄 사람을 찾습니다!
                            </S.InvitationCopy>

                            <S.PaddySignature>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 23"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <g filter="url(#paw-blur)">
                                        <ellipse
                                            cx="11.5742"
                                            cy="14.9728"
                                            rx="7.55274"
                                            ry="6.42002"
                                            fill="currentColor"
                                        />

                                        <ellipse
                                            cx="11.5738"
                                            cy="4.02118"
                                            rx="3.0211"
                                            ry="3.02119"
                                            fill="currentColor"
                                        />

                                        <ellipse
                                            cx="19.1271"
                                            cy="7.04267"
                                            rx="3.0211"
                                            ry="3.02119"
                                            fill="currentColor"
                                        />

                                        <ellipse
                                            cx="4.0211"
                                            cy="7.04267"
                                            rx="3.0211"
                                            ry="3.02119"
                                            fill="currentColor"
                                        />
                                    </g>

                                    <defs>
                                        <filter
                                            id="paw-blur"
                                            x="-1"
                                            y="-1"
                                            width="26"
                                            height="25"
                                            filterUnits="userSpaceOnUse"
                                            colorInterpolationFilters="sRGB"
                                        >
                                            <feGaussianBlur stdDeviation="0.35" />
                                        </filter>
                                    </defs>
                                </svg>

                                <span>from. PADDY</span>
                            </S.PaddySignature>
                        </S.PaperContent>
                    </S.InvitationPaper>

                    <S.EnvelopeFlight ref={envelopeRef}>
                        <S.Envelope>
                            <S.Flap ref={flapRef}>
                                <svg
                                    viewBox="0 0 850 300"
                                    preserveAspectRatio="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="
                                            M 18 2
                                            H 832

                                            Q 844 2 836 14

                                            L 454 270

                                            Q 425 292 396 270

                                            L 14 14

                                            Q 6 2 18 2

                                            Z
                                        "
                                    />
                                </svg>
                            </S.Flap>
                            <S.Seal ref={sealRef}>
                                MCM
                            </S.Seal>
                        </S.Envelope>
                    </S.EnvelopeFlight>

                    <S.PaperWhiteout ref={whiteoutRef} />

                    <S.ScrollArrow aria-hidden="true">
                        <span />
                        <i>↓</i>
                    </S.ScrollArrow>

                </S.StickyNight>
            </S.HeroChapter>

            <S.ErasChapter ref={eraRef}>
                <S.EraSticky ref={eraStickyRef}>
                    <S.CognacWash ref={cognacRef} />
                    <S.PaperFiber ref={fiberRef} />
                    <S.FilmGrain ref={grainRef} />
                    <S.SilverSweep ref={silverRef} />

                    <S.EraRail ref={railRef}>
                        1976 · 1986 · 1996 · 2006 · 2016 · 2026 · 1976 · 1986 · 1996 · 2006 · 2016 · 2026
                    </S.EraRail>

                    <S.EraYear ref={yearRef}>1976</S.EraYear>

                    <S.EraIntro ref={introRef}>
                        <h2>뮌헨에서 시작된 50년.</h2>
                        <p>
                            도시의 건축, 음악, 이동과 문화는 MCM이 세상을 바라보는 방식이 되었습니다.
                        </p>
                    </S.EraIntro>

                    <S.EraPhotos ref={photosRef}>
                        <S.EraPhoto ref={photoRef1} $variant="one">
                            <img ref={imageRef1} src={munich1} alt="뮌헨 아카이브" />
                        </S.EraPhoto>
                        <S.EraPhoto ref={photoRef2} $variant="two">
                            <img ref={imageRef2} src={munich2} alt="뮌헨 아카이브" />
                        </S.EraPhoto>
                        <S.EraPhoto ref={photoRef3} $variant="three">
                            <img ref={imageRef3} src={munich3} alt="뮌헨 아카이브" />
                        </S.EraPhoto>
                    </S.EraPhotos>

                    {/* <S.EraCode ref={codeRef}>
                        MÜNCHEN / ARCHITECTURE / MUSIC / MOVEMENT
                    </S.EraCode> */}

                    <S.FinalMoment ref={finalMomentRef}>
                        <div>
                            <strong>2026</strong>
                            <span>50 YEARS.</span>
                            <b>이제, 당신의 차례입니다.</b>
                        </div>
                    </S.FinalMoment>
                </S.EraSticky>
            </S.ErasChapter>

            <S.PaddyChapter ref={paddyRef}>
                <S.StickyBase>
                    {/* <S.PaddyMeta>PADDY / MCM</S.PaddyMeta> */}
                    <S.SpeechHint ref={speechHintRef}>
                        패디와 함께
                        <br />
                        뮤즈가 되어 보세요.
                    </S.SpeechHint>

                    <S.PaddySmall
                        ref={paddyImgRef}
                        src={speechPhase === 2 ? paddyThink : paddyChoice}
                        alt="패디"
                    />

                    <S.Speech>
                        <strong>PADDY</strong>
                        <p>{speech}</p>
                    </S.Speech>
                </S.StickyBase>
            </S.PaddyChapter>

            <S.RegisterChapter ref={registerRef}>
                <S.StickyBase>
                    <S.RegisterHead>
                        {/* <S.Eyebrow>MUSE REGISTRATION</S.Eyebrow> */}
                        <h2>
                            당신의 번호를
                            <br />
                            등록할게요.
                        </h2>
                        <p>오늘의 MCM 여정을 함께 기록할 고유 번호예요.</p>
                    </S.RegisterHead>

                    <S.Slot ref={slotRef}>
                        <span>MCM 50TH ANNIVERSARY / MUSE CANDIDATE</span>
                        <strong ref={slotNumberRef}>N.---</strong>
                        <b ref={slotStateRef}>REGISTERING...</b>
                    </S.Slot>

                    <S.RegisterPaddy
                        src={registerDone ? paddyCheer : paddyThink}
                        alt="패디"
                    />

                    <S.EnterButton type="button" onClick={handleEnter} disabled={isEntering}>
                        <div>
                            <strong>
                                {isEntering
                                    ? "ENTERING MCM HAUS..."
                                    : "BECOME THE MUSE"}
                            </strong>

                            <span>
                                패디와 함께 MCM 롯데백화점 잠실점 입장하기
                            </span>
                        </div>

                        <i>↗</i>
                    </S.EnterButton>

                    <S.Door $closing={doorClosing}>
                        <i />
                        <i />
                    </S.Door>
                </S.StickyBase>
            </S.RegisterChapter>
        </S.MobileContainer>
    );
}
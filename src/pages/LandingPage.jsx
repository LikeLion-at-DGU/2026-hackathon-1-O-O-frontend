import * as S from "./LandingPage.styled";
import { STARS } from "./LandingPage/constants";
import useLandingPage from "../hooks/useLandingPage";

import HeroSection from "./sections/HeroSection";
import ErasSection from "./sections/ErasSection";
import CollectionSection from "./sections/CollectionSection";
import PaddySection from "./sections/PaddySection";
import RegisterSection from "./sections/RegisterSection";

export default function LandingPage() {
    const {
        refs,
        pageProgress,
        speechPhase,
        registerDone,
        doorClosing,
        isEntering,
        handleEnter,
    } = useLandingPage();

    return (
        <S.MobileContainer>
            <S.Noise />
            <S.Progress $progress={pageProgress} />
            <HeroSection refs={refs} stars={STARS} />
            <ErasSection refs={refs} />
            <CollectionSection refs={refs} />
            <PaddySection refs={refs} speechPhase={speechPhase} />
            <RegisterSection
                refs={refs}
                registerDone={registerDone}
                doorClosing={doorClosing}
                isEntering={isEntering}
                onEnter={handleEnter}
            />
        </S.MobileContainer>
    );
}

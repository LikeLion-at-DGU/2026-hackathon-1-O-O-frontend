import { useEffect, useState } from "react";

const FILL_RANGES = [
    [72, 138],
    [92, 158],
    [42, 112],
    ];

    const getRandomFillHeight = ([minimum, maximum]) =>
    Math.round(minimum + Math.random() * (maximum - minimum));

    export default function useCardFillAnimation(initialLevels = [102, 124, 56], intervalMs = 1400) {
    const [fillLevels, setFillLevels] = useState(initialLevels);

    useEffect(() => {
        const updateFillLevels = () => {
        setFillLevels(FILL_RANGES.map(getRandomFillHeight));
        };

        const timer = window.setInterval(updateFillLevels, intervalMs);

        return () => window.clearInterval(timer);
    }, [intervalMs]);

    return fillLevels;
}
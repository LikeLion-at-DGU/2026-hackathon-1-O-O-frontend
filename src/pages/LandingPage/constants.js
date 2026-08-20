export const MAP_ROUTE = "/map";

export const clamp = (value, min = 0, max = 1) =>
    Math.max(min, Math.min(max, value));

export const lerp = (from, to, progress) =>
    from + (to - from) * progress;

export const mixColor = (from, to, progress) => {
    const parse = (hex) =>
        hex.replace("#", "").match(/\w\w/g).map((value) => parseInt(value, 16));

    const start = parse(from);
    const end = parse(to);
    const mixed = start.map((value, index) =>
        Math.round(value + (end[index] - value) * progress)
    );

    return `rgb(${mixed[0]}, ${mixed[1]}, ${mixed[2]})`;
};

export const STARS = Array.from({ length: 62 }, (_, id) => ({
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

export const INITIAL_MUSE_NO = getOrCreateMuseNo();

// 브라우저 alert 대체. 시스템 다이얼로그는 O&O 화면 톤을 깨고 스크린리더
// 흐름도 끊는다. aria-live 영역에 넣어 보조기기에도 안내되게 하고,
// 같은 문구가 연달아 뜨는 것은 한 번만 보여준다.
let container = null;
const activeMessages = new Set();

const ensureContainer = () => {
  if (container) return container;

  container = document.createElement("div");
  container.setAttribute("role", "status");
  container.setAttribute("aria-live", "polite");
  Object.assign(container.style, {
    position: "fixed",
    left: "50%",
    bottom: "32px",
    transform: "translateX(-50%)",
    zIndex: "9999",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    alignItems: "center",
    pointerEvents: "none",
  });
  document.body.appendChild(container);
  return container;
};

export const showToast = (message, { duration = 2600 } = {}) => {
  if (!message || activeMessages.has(message)) return;
  activeMessages.add(message);

  const toast = document.createElement("div");
  toast.textContent = message;
  Object.assign(toast.style, {
    maxWidth: "320px",
    padding: "10px 16px",
    borderRadius: "12px",
    background: "rgba(34, 34, 34, 0.92)",
    color: "#f5f4f0",
    fontFamily: "Pretendard, sans-serif",
    fontSize: "13px",
    lineHeight: "1.4",
    textAlign: "center",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.25)",
  });

  ensureContainer().appendChild(toast);
  window.setTimeout(() => {
    toast.remove();
    activeMessages.delete(message);
  }, duration);
};

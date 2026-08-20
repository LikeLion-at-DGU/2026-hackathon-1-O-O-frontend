import { api } from "./api";
import { resetProductInteraction } from "./events";
import { getAnonymousUuid, saveVisitAuth, STORAGE_KEYS } from "../utils/storage";

// 진행 중인 입장 요청. StrictMode의 이중 effect나 빠른 중복 호출이
// /enter를 두 번 때리지 않도록 같은 Promise를 공유한다.
let enterInFlight = null;

// 입장 API 호출 함수
export const enterStore = async (ageBand, gender) => {
  if (enterInFlight) {
    return enterInFlight;
  }

  enterInFlight = requestEnter(ageBand, gender).finally(() => {
    enterInFlight = null;
  });

  return enterInFlight;
};

const requestEnter = async (ageBand, gender) => {
  try {
    // 재방문 식별용 UUID가 있으면 헤더로 보낸다
    const existingUuid = getAnonymousUuid();
    const headers = {
      "Content-Type": "application/json",
    };
    if (existingUuid) {
      headers["X-Anonymous-UUID"] = existingUuid;
    }

    // enterStore("20s", "female") / enterStore({ age_band, gender }) 모두 지원.
    // 값이 없으면 명세에 맞춰 필드를 생략한다 — 지어내지 않는다.
    const payload =
      typeof ageBand === "object" && ageBand !== null
        ? ageBand
        : {
            ...(ageBand && { age_band: ageBand }),
            ...(gender && { gender }),
          };

    const response = await api.post("/enter", payload, { headers });
    const data = response.data;

    // 새로운 방문이 시작되면 이전 방문의 상품 행동 기록을 초기화
    resetProductInteraction();

    saveVisitAuth(data);
    sessionStorage.setItem(STORAGE_KEYS.SCENES, JSON.stringify(data.scenes ?? []));

    console.log("🎉 매장 입장 성공:", data.visit_id, data.is_resumed ? "(이어하기)" : "(신규)");

    return data;
  } catch (error) {
    console.error("🚨 매장 입장 중 오류 발생:", error.response?.data || error);

    throw error;
  }
};

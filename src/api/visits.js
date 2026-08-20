import { api } from './api';
import {
  resetProductInteraction,
} from "./events";

// 입장 API 호출 함수
export const enterStore = async (ageBand, gender) => {
  try {
    // 1. 로컬 스토리지에서 기존 UUID 확인
    const existingUuid = localStorage.getItem('anonymous_uuid');
    
    // 2. 헤더 설정 (UUID가 있으면 헤더에 추가)
    const headers = {
      'Content-Type': 'application/json',
    };
    if (existingUuid) {
      headers['X-Anonymous-UUID'] = existingUuid;
    }

   // 3. 요청 데이터 설정
    // enterStore("20s", "F")
    // enterStore({ age_band: "20s", gender: "F" })
    // 두 방식 모두 지원
    const payload =
      typeof ageBand === "object" && ageBand !== null
        ? ageBand
        : {
            ...(ageBand && { age_band: ageBand }),
            ...(gender && { gender }),
          };
          
    // 4. 입장 API 요청
    const response = await api.post("/enter", payload, { headers });
    const data = response.data;

    // 새로운 방문이 시작되면 이전 방문의 상품 행동 기록을 초기화
    resetProductInteraction();

    // 5. UUID 저장
    if (data.anonymous_uuid) {
      localStorage.setItem("anonymous_uuid", data.anonymous_uuid);
      localStorage.setItem("anonymousUuid", data.anonymous_uuid);
    }

    // 6. 방문 토큰 저장
    if (data.visit_token) {
      sessionStorage.setItem("visit_token", data.visit_token);
      localStorage.setItem("visitToken", data.visit_token);
    }

    // 7. 방문 ID 저장
    if (data.visit_id) {
      sessionStorage.setItem("visit_id", String(data.visit_id));
      localStorage.setItem("visitId", String(data.visit_id));
    }

    // 8. 장면 데이터 저장
    sessionStorage.setItem(
      "scenes",
      JSON.stringify(data.scenes ?? [])
    );

    console.log("🎉 매장 입장 성공! 응답 데이터:", data);

    return data;
  } catch (error) {
    console.error(
      "🚨 매장 입장 중 오류 발생:",
      error.response?.data || error
    );

    throw error;
  }
};

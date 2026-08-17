import axios from 'axios';
import { api } from './api';
// 입장 API 호출 함수
export const enterStore = async (ageBand, gender) => {
  try {
    // 1. 로컬 스토리지에서 기존 UUID를 확인
    const existingUuid = localStorage.getItem('anonymous_uuid');
    
    // 2. 헤더 설정 (UUID가 있으면 넣고, 없으면 안 넣음)
    const headers = {
      'Content-Type': 'application/json',
    };
    if (existingUuid) {
      headers['X-Anonymous-UUID'] = existingUuid;
    }

    // 3. API 요청 (Body에는 선택된 성별/연령대만 포함)
    const payload = {};
    if (ageBand) payload.age_band = ageBand;
    if (gender) payload.gender = gender;

    const response = await axios.post('/api/v1/enter', payload, { headers });
    const data = response.data;

    // 4. 응답 처리 로직
    // 새로 발급된 UUID가 있다면 로컬 스토리지에 저장
    if (data.anonymous_uuid) {
      localStorage.setItem('anonymous_uuid', data.anonymous_uuid);
    }
    
    // 이후 요청을 위해 visit_token 저장 (메모리, 상태관리, 또는 세션 스토리지 등)
    sessionStorage.setItem('visit_token', data.visit_token);

    // 🚀 성공 콘솔 출력 (데이터 확인용)
    console.log("🎉 매장 입장 성공! 응답 데이터:", data);

    // 5. 컴포넌트에서 렌더링할 맵/상품 데이터 반환
    return data;

  } catch (error) {
    console.error("🚨 매장 입장 중 오류 발생:", error);
    throw error;
  }
};
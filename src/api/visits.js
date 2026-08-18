import { api } from './api';

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

    // 3. API Request Body 설정
    const payload = {};
    if (ageBand) payload.age_band = ageBand;
    if (gender) payload.gender = gender;

    // 🚀 4. axios 대신 api 인스턴스 사용 (baseURL 자동 적용)
    const response = await api.post('/enter', payload, { headers });
    const data = response.data;

    // 5. 응답 처리 및 스토리지 저장
    if (data.anonymous_uuid) {
      localStorage.setItem('anonymous_uuid', data.anonymous_uuid);
    }
    if (data.visit_token) {
      sessionStorage.setItem('visit_token', data.visit_token);
    }
    if (data.visit_id) {
      sessionStorage.setItem('visit_id', data.visit_id);
    } // 👈 닫는 중괄호 추가됨

    // 🚀 성공 콘솔 출력
    console.log("🎉 매장 입장 성공! 응답 데이터:", data);

    // 6. 컴포넌트에서 사용할 데이터 반환
    return data;

  } catch (error) {
    console.error("🚨 매장 입장 중 오류 발생:", error.response?.data || error);
    throw error;
  }
};
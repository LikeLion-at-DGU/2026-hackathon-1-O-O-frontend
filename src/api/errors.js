export const getApiError = (error) => {
  const apiError = error?.response?.data?.error;

  return {
    status: error?.response?.status,
    code: apiError?.code ?? "",
    message:
      apiError?.message ??
      error?.message ??
      "요청을 처리하지 못했습니다.",
    detail: apiError?.detail,
  };
};

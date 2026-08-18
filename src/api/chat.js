import { api } from "./api";

const visitId = () =>
  localStorage.getItem("visitId") ??
  sessionStorage.getItem("visit_id");

const visitToken = () =>
  localStorage.getItem("visitToken") ??
  sessionStorage.getItem("visit_token") ??
  "";

export const getChatMessages = () =>
  api.get("/chat/messages", {
    params: {
      visit_id: visitId(),
    },
  });

export const createChatMessage = (payload) =>
  api.post("/chat/messages", {
    visit_id: visitId(),
    ...payload,
  });

export const streamChat = async ({
  message,
  context,
  onDelta,
}) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/chat`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        "X-Visit-Token": visitToken(),
      },

      body: JSON.stringify({
        visit_id: visitId(),
        message,
        ...(context && { context }),
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `채팅 요청 실패: ${response.status}`,
    );
  }

  if (!response.body) {
    throw new Error("채팅 응답 본문이 없습니다.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";
  let complete;

  const handleLine = (line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine.startsWith("data:")) {
      return;
    }

    const rawData = trimmedLine
      .slice(5)
      .trim();

    if (!rawData) {
      return;
    }

    const data = JSON.parse(rawData);

    console.log(
      "SSE 채팅 응답:",
      JSON.stringify(data, null, 2),
    );

    if (data.error) {
      const errorMessage =
        data.message ??
        data.error?.message ??
        data.error?.detail ??
        data.error?.code ??
        (typeof data.error === "string"
          ? data.error
          : JSON.stringify(data.error));

      throw new Error(errorMessage);
    }

    if (data.delta) {
      onDelta(data.delta);
    }

    if (data.done) {
      complete = data;
    }
  };

  while (true) {
    const { done, value } =
      await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, {
      stream: true,
    });

    const lines = buffer.split(/\r?\n/);

    buffer = lines.pop() ?? "";

    lines.forEach(handleLine);
  }

  // 마지막 데이터 뒤에 줄바꿈이 없어도 처리
  buffer += decoder.decode();

  if (buffer.trim()) {
    handleLine(buffer);
  }

  if (!complete) {
    throw new Error(
      "AI 응답 스트림이 완료되지 않았습니다.",
    );
  }

  return complete;
};
import { api } from "./api";
import { getVisitId, getVisitToken } from "../utils/storage";

const visitId = () => getVisitId();

const visitToken = () => getVisitToken();

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

// pending_action의 선택지를 서버에 응답하는 함수
export const answerPendingAction = ({
  pendingAction,
  option,
}) => {
  if (!pendingAction?.reply_to) {
    throw new Error(
      "답변할 트리거의 reply_to가 없습니다.",
    );
  }

  if (!option?.type) {
    throw new Error("선택지의 type이 없습니다.");
  }

  return createChatMessage({
    type: option.type,
    reply_to: pendingAction.reply_to,

    // contrast 상품 선택
    ...(option.product_id && {
      product_id: option.product_id,
    }),

    // quick_browse 선택
    ...(option.option && {
      option: option.option,
    }),
  });
};

export const streamChat = async ({
  message,
  context,
  onDelta,
  signal,
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
      // 화면을 떠나면 스트림을 끊는다. 없으면 언마운트 뒤에도 연결이 남는다.
      ...(signal && { signal }),
    },
  );

  if (!response.ok) {
    // 스트림이 열리기 전의 실패는 JSON {"error":{code,message}}로 온다.
    // 상태코드만 던지면 429(분당 한도)와 403(종료된 관람)이 전부
    // "답변을 불러오지 못했어요"로 뭉개진다.
    let serverMessage = "";
    try {
      const body = await response.json();
      serverMessage = body?.error?.message ?? "";
    } catch {
      // body가 JSON이 아니면 상태코드로만 안내한다
    }

    if (response.status === 429) {
      throw new Error(
        serverMessage ||
          "질문이 잠시 몰렸어요. 조금 뒤에 다시 물어봐 주세요.",
      );
    }

    throw new Error(
      serverMessage || `채팅 요청 실패: ${response.status}`,
    );
  }

  if (!response.body) {
    throw new Error(
      "채팅 응답 본문이 없습니다.",
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let readerReleased = false;

  const releaseReader = () => {
    if (readerReleased) return;
    readerReleased = true;
    reader.cancel().catch(() => {});
  };

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

    let data;
    try {
      data = JSON.parse(rawData);
    } catch {
      // 조각난 프레임 하나 때문에 스트림 전체를 끊지 않는다
      return;
    }

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

  try {
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
  } finally {
    // 정상 종료·에러·abort 어느 경로든 리더를 정리한다
    releaseReader();
  }

  if (!complete) {
    throw new Error(
      "AI 응답 스트림이 완료되지 않았습니다.",
    );
  }

  return complete;
};

// 채팅 동기화 훅. Layout과 ChatPage가 각각 들고 있던 3초 폴링·트리거 응답
// 코드를 한 곳으로 모은다 — 두 화면이 동시에 폴링하며 서로 상태를 덮던
// 문제와, 늦게 도착한 폴링 응답이 최신 메시지를 덮는 문제를 함께 막는다.
import { useCallback, useEffect, useRef, useState } from "react";

import { answerPendingAction, getChatMessages } from "../api/chat";
import useChatStore from "../stores/useChatStore";
import { getVisitId } from "../utils/storage";

const POLL_INTERVAL_MS = 3000;

export function useChatSync({ paused = false, onAnswered } = {}) {
  const syncChatState = useChatStore((state) => state.syncChatState);
  const applyActionResponse = useChatStore((state) => state.applyActionResponse);

  const [isActionLoading, setIsActionLoading] = useState(false);

  // 요청 순번. 응답이 도착했을 때 순번이 이미 지나갔으면 버린다.
  const requestSeqRef = useRef(0);

  const refresh = useCallback(async () => {
    if (!getVisitId()) return;

    const seq = ++requestSeqRef.current;
    try {
      const response = await getChatMessages();
      if (seq === requestSeqRef.current) {
        syncChatState(response.data);
      }
    } catch {
      // 다음 폴링 주기에 다시 동기화한다.
    }
  }, [syncChatState]);

  useEffect(() => {
    if (paused) return undefined;

    refresh();
    const pollingId = window.setInterval(refresh, POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(pollingId);
      // 화면을 떠난 뒤 도착하는 응답이 무시되도록 순번을 올려 둔다
      requestSeqRef.current += 1;
    };
  }, [paused, refresh]);

  const handleAction = useCallback(
    async (action, option) => {
      if (isActionLoading) return;

      try {
        setIsActionLoading(true);

        const response = await answerPendingAction({
          pendingAction: action,
          option,
        });

        // 응답 반영이 진행 중인 폴링보다 최신이다
        requestSeqRef.current += 1;
        applyActionResponse(response.data.messages ?? []);
        onAnswered?.(option);
      } catch {
        // 중복 클릭이나 만료된 가설이면 서버 상태로 다시 맞춘다
        await refresh();
      } finally {
        setIsActionLoading(false);
      }
    },
    [applyActionResponse, isActionLoading, onAnswered, refresh],
  );

  return { handleAction, isActionLoading, refresh };
}

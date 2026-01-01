import { useSyncExternalStore } from "react";

import { getGreeting } from "./greeting";

/** 1분마다 업데이트를 트리거하는 구독 함수 */
function subscribe(callback: () => void) {
  const interval = setInterval(callback, 60 * 1000);
  return () => clearInterval(interval);
}

/**
 * 시간대별 인사말을 제공하는 훅
 */
export function useGreeting() {
  return useSyncExternalStore(subscribe, getGreeting, getGreeting);
}

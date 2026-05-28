"use client";

import { useCallback, useRef, useState } from "react";

import { copyText } from "@/lib/copy-text";

type LongPressState = "idle" | "copying" | "copied" | "error";

export function useLongPressCopy({
  text,
  pressMs = 420,
  resetMs = 900,
}: {
  text: string;
  pressMs?: number;
  resetMs?: number;
}) {
  const timerRef = useRef<number | null>(null);
  const resetRef = useRef<number | null>(null);
  const [state, setState] = useState<LongPressState>("idle");

  const clearTimers = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (resetRef.current) window.clearTimeout(resetRef.current);
    timerRef.current = null;
    resetRef.current = null;
  }, []);

  const doCopy = useCallback(async () => {
    setState("copying");
    const ok = await copyText(text);
    setState(ok ? "copied" : "error");
    if (navigator.vibrate && ok) navigator.vibrate(8);
    resetRef.current = window.setTimeout(() => setState("idle"), resetMs);
  }, [resetMs, text]);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      // Prevent accidental text selection / scroll-jank during long press
      // but don't block normal scrolling for short taps.
      clearTimers();
      timerRef.current = window.setTimeout(() => {
        void doCopy();
        // Stop the synthetic click after a successful long-press copy.
        e.preventDefault();
      }, pressMs);
    },
    [clearTimers, doCopy, pressMs],
  );

  const onTouchEnd = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const onTouchMove = useCallback(() => {
    // Cancel if the user starts scrolling.
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  return {
    state,
    bind: {
      onTouchStart,
      onTouchEnd,
      onTouchCancel: onTouchEnd,
      onTouchMove,
    } as const,
  };
}


"use client";

import { useCallback, useRef, useState } from "react";

import { copyTextFromUserGesture } from "@/lib/copy-text";

type LongPressState = "idle" | "copying" | "copied" | "error";

export function useLongPressCopy({
  text,
  pressMs = 450,
  resetMs = 900,
  moveCancelPx = 18,
  onCopied,
}: {
  text: string;
  pressMs?: number;
  resetMs?: number;
  moveCancelPx?: number;
  onCopied?: () => void;
}) {
  const touchStartAtRef = useRef<number | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const cancelledRef = useRef(false);
  const resetRef = useRef<number | null>(null);
  const [state, setState] = useState<LongPressState>("idle");

  const clearResetTimer = useCallback(() => {
    if (resetRef.current) window.clearTimeout(resetRef.current);
    resetRef.current = null;
  }, []);

  const finishCopy = useCallback(
    (ok: boolean) => {
      setState(ok ? "copied" : "error");
      if (ok && navigator.vibrate) navigator.vibrate(8);
      clearResetTimer();
      resetRef.current = window.setTimeout(() => setState("idle"), resetMs);
    },
    [clearResetTimer, resetMs],
  );

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;

    touchStartAtRef.current = Date.now();
    cancelledRef.current = false;
    startPosRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartAtRef.current == null || !startPosRef.current) return;

    const touch = e.touches[0];
    if (!touch) return;

    const dx = Math.abs(touch.clientX - startPosRef.current.x);
    const dy = Math.abs(touch.clientY - startPosRef.current.y);
    if (dx > moveCancelPx || dy > moveCancelPx) {
      cancelledRef.current = true;
    }
  }, [moveCancelPx]);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const startedAt = touchStartAtRef.current;
      touchStartAtRef.current = null;
      startPosRef.current = null;

      if (startedAt == null || cancelledRef.current) return;

      const elapsed = Date.now() - startedAt;
      if (elapsed < pressMs) return;

      e.preventDefault();
      e.stopPropagation();

      setState("copying");
      onCopied?.();
      void copyTextFromUserGesture(text).then(finishCopy);
    },
    [finishCopy, onCopied, pressMs, text],
  );

  const onTouchCancel = useCallback(() => {
    touchStartAtRef.current = null;
    startPosRef.current = null;
    cancelledRef.current = true;
  }, []);

  return {
    state,
    bind: {
      onTouchStart,
      onTouchEnd,
      onTouchCancel,
      onTouchMove,
    } as const,
  };
}

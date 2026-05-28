"use client";

import { useCallback, useRef, useState } from "react";

import { copyTextFromUserGesture } from "@/lib/copy-text";

type LongPressState = "idle" | "copying" | "copied" | "error";

const MOVE_CANCEL_PX = 12;

export function useLongPressCopy({
  text,
  pressMs = 450,
  resetMs = 900,
}: {
  text: string;
  pressMs?: number;
  resetMs?: number;
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
    if (dx > MOVE_CANCEL_PX || dy > MOVE_CANCEL_PX) {
      cancelledRef.current = true;
    }
  }, []);

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
      void copyTextFromUserGesture(text).then(finishCopy);
    },
    [finishCopy, pressMs, text],
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

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { copyTextSync } from "@/lib/copy-text";

type LongPressState = "idle" | "holding" | "copying" | "copied" | "error";

export function useLongPressCopy({
  text,
  pressMs = 500,
  resetMs = 900,
  moveCancelPx = 24,
  onCopied,
}: {
  text: string;
  pressMs?: number;
  resetMs?: number;
  moveCancelPx?: number;
  onCopied?: () => void;
}) {
  const textRef = useRef(text);
  const onCopiedRef = useRef(onCopied);
  const [targetEl, setTargetEl] = useState<HTMLElement | null>(null);
  const [state, setState] = useState<LongPressState>("idle");

  const resetTimerRef = useRef<number | null>(null);
  const longPressFiredRef = useRef(false);

  textRef.current = text;
  onCopiedRef.current = onCopied;

  const clearResetTimer = useCallback(() => {
    if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    resetTimerRef.current = null;
  }, []);

  const finishCopy = useCallback(
    (ok: boolean) => {
      setState(ok ? "copied" : "error");
      if (ok && navigator.vibrate) navigator.vibrate(8);
      clearResetTimer();
      resetTimerRef.current = window.setTimeout(() => setState("idle"), resetMs);
    },
    [clearResetTimer, resetMs],
  );

  const targetRef = useCallback((node: HTMLElement | null) => {
    setTargetEl(node);
  }, []);

  useEffect(() => {
    const el = targetEl;
    if (!el) return;

    let holdTimer: number | null = null;
    let holdCommitted = false;
    let cancelled = false;
    let startX = 0;
    let startY = 0;
    let startAt = 0;
    let activePointer = -1;

    const clearHoldTimer = () => {
      if (holdTimer) window.clearTimeout(holdTimer);
      holdTimer = null;
    };

    const resetSession = () => {
      clearHoldTimer();
      holdCommitted = false;
      cancelled = false;
      activePointer = -1;
      startAt = 0;
      setState((s) => (s === "holding" ? "idle" : s));
    };

    const runCopy = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();

      longPressFiredRef.current = true;
      window.setTimeout(() => {
        longPressFiredRef.current = false;
      }, 450);

      onCopiedRef.current?.();
      setState("copying");
      const ok = copyTextSync(textRef.current);
      finishCopy(ok);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!e.isPrimary) return;
      if (activePointer !== -1) return;

      activePointer = e.pointerId;
      cancelled = false;
      holdCommitted = false;
      startAt = Date.now();
      startX = e.clientX;
      startY = e.clientY;

      clearHoldTimer();
      holdTimer = window.setTimeout(() => {
        holdCommitted = true;
        setState("holding");
        if (navigator.vibrate) navigator.vibrate(6);
      }, pressMs);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerId !== activePointer) return;
      // 홀드가 확정된 뒤에는 손떨림/스크롤로 취소하지 않음
      if (holdCommitted) return;

      const dx = Math.abs(e.clientX - startX);
      const dy = Math.abs(e.clientY - startY);
      if (dx > moveCancelPx || dy > moveCancelPx) {
        cancelled = true;
        resetSession();
      }
    };

    const endPointer = (e: PointerEvent) => {
      if (e.pointerId !== activePointer) return;

      const elapsed = startAt ? Date.now() - startAt : 0;
      const shouldCopy =
        holdCommitted && !cancelled && elapsed >= pressMs - 40;

      clearHoldTimer();
      holdCommitted = false;
      activePointer = -1;
      startAt = 0;

      if (shouldCopy) {
        runCopy(e);
      } else {
        resetSession();
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      endPointer(e);
    };

    const onPointerCancel = (e: PointerEvent) => {
      endPointer(e);
    };

    const onContextMenu = (e: Event) => {
      e.preventDefault();
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerCancel);
    el.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerCancel);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerCancel);
      el.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      resetSession();
    };
  }, [finishCopy, moveCancelPx, pressMs, targetEl]);

  const consumedClick = useCallback(() => longPressFiredRef.current, []);

  return {
    state,
    targetRef,
    consumedClick,
  };
}

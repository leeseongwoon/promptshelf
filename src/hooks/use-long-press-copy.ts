"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { copyTextSync } from "@/lib/copy-text";

type LongPressState = "idle" | "holding" | "copying" | "copied" | "error";

export function useLongPressCopy({
  text,
  pressMs = 480,
  resetMs = 900,
  moveCancelPx = 14,
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
    let holdReady = false;
    let cancelled = false;
    let startX = 0;
    let startY = 0;
    let activePointer = -1;

    const clearHoldTimer = () => {
      if (holdTimer) window.clearTimeout(holdTimer);
      holdTimer = null;
    };

    const resetSession = () => {
      clearHoldTimer();
      holdReady = false;
      cancelled = false;
      activePointer = -1;
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

    const scheduleHold = () => {
      clearHoldTimer();
      holdReady = false;
      holdTimer = window.setTimeout(() => {
        holdReady = true;
        setState("holding");
        if (navigator.vibrate) navigator.vibrate(6);
      }, pressMs);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!e.isPrimary) return;
      if (activePointer !== -1) return;

      activePointer = e.pointerId;
      cancelled = false;
      startX = e.clientX;
      startY = e.clientY;
      scheduleHold();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerId !== activePointer) return;

      const dx = Math.abs(e.clientX - startX);
      const dy = Math.abs(e.clientY - startY);
      if (dx > moveCancelPx || dy > moveCancelPx) {
        cancelled = true;
        resetSession();
      }
    };

    const onWindowPointerMove = (e: PointerEvent) => {
      onPointerMove(e);
    };

    const endPointer = (e: PointerEvent, run: boolean) => {
      if (e.pointerId !== activePointer) return;

      const shouldCopy = run && holdReady && !cancelled;
      clearHoldTimer();
      holdReady = false;
      activePointer = -1;

      if (shouldCopy) runCopy(e);
      else resetSession();
    };

    const onPointerUp = (e: PointerEvent) => {
      endPointer(e, true);
    };

    const onPointerCancel = (e: PointerEvent) => {
      endPointer(e, true);
    };

    const onContextMenu = (e: Event) => {
      e.preventDefault();
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerCancel);
    el.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("pointermove", onWindowPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerCancel);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerCancel);
      el.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("pointermove", onWindowPointerMove);
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

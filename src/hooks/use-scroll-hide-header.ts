"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  /** Minimum scroll delta (px) before toggling on scroll up */
  threshold?: number;
  /** Always show header while scrollY is below this */
  minScroll?: number;
  /** Scroll down this many px (accumulated) before hiding */
  hideAfter?: number;
};

/**
 * Returns true when the header should be hidden (user scrolling down).
 * Shows again when scrolling up or near the top of the page.
 */
export function useScrollHideHeader(options: Options = {}) {
  const { threshold = 8, minScroll = 72, hideAfter = 56 } = options;
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);
  const hiddenRef = useRef(false);
  const downAccumRef = useRef(0);

  useEffect(() => {
    lastYRef.current = window.scrollY;

    let frame = 0;

    function setHiddenState(next: boolean) {
      if (hiddenRef.current === next) return;
      hiddenRef.current = next;
      setHidden(next);
    }

    function onScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - lastYRef.current;

        if (y <= minScroll) {
          downAccumRef.current = 0;
          setHiddenState(false);
        } else if (delta > 0) {
          downAccumRef.current += delta;
          if (downAccumRef.current >= hideAfter) {
            setHiddenState(true);
          }
        } else if (delta < -threshold) {
          downAccumRef.current = 0;
          setHiddenState(false);
        }

        lastYRef.current = y;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [hideAfter, minScroll, threshold]);

  return hidden;
}

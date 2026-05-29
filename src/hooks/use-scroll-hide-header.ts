"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  /** Minimum scroll delta (px) before toggling visibility */
  threshold?: number;
  /** Always show header while scrollY is below this */
  minScroll?: number;
};

/**
 * Returns true when the header should be hidden (user scrolling down).
 * Shows again when scrolling up or near the top of the page.
 */
export function useScrollHideHeader(options: Options = {}) {
  const { threshold = 10, minScroll = 64 } = options;
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);
  const hiddenRef = useRef(false);

  useEffect(() => {
    lastYRef.current = window.scrollY;

    let frame = 0;

    function onScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - lastYRef.current;

        if (y <= minScroll) {
          if (hiddenRef.current) {
            hiddenRef.current = false;
            setHidden(false);
          }
        } else if (delta > threshold && y > minScroll) {
          if (!hiddenRef.current) {
            hiddenRef.current = true;
            setHidden(true);
          }
        } else if (delta < -threshold) {
          if (hiddenRef.current) {
            hiddenRef.current = false;
            setHidden(false);
          }
        }

        lastYRef.current = y;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [minScroll, threshold]);

  return hidden;
}

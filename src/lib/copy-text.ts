"use client";

/** iOS Safari: must run synchronously inside touchend/click handler. */
export function copyTextSync(text: string): boolean {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "true");
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "0";
    ta.style.width = "2px";
    ta.style.height = "2px";
    ta.style.opacity = "0";
    ta.style.fontSize = "16px";
    ta.style.pointerEvents = "none";
    document.body.appendChild(ta);

    ta.focus({ preventScroll: true });
    ta.select();
    ta.setSelectionRange(0, text.length);

    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Copy while a user gesture is still active (e.g. touchend).
 * Starts Clipboard API in the same synchronous call stack when possible.
 */
export function copyTextFromUserGesture(text: string): Promise<boolean> {
  if (copyTextSync(text)) return Promise.resolve(true);

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(
      () => true,
      () => false,
    );
  }

  return Promise.resolve(false);
}

export async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through
    }
  }

  return copyTextSync(text);
}

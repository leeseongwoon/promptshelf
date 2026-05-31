"use client";

function selectTextarea(ta: HTMLTextAreaElement, text: string) {
  ta.focus({ preventScroll: true });

  if (typeof ta.setSelectionRange === "function") {
    ta.setSelectionRange(0, text.length);
  }

  ta.select();
}

/** Must run synchronously inside touchend/click (iOS Safari). */
export function copyTextSync(text: string): boolean {
  if (!text?.trim()) return false;

  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("aria-hidden", "true");
  ta.style.cssText =
    "position:fixed;top:0;left:0;width:1px;height:1px;padding:12px;border:0;outline:0;opacity:0;font-size:16px;z-index:-1;";

  document.body.appendChild(ta);
  selectTextarea(ta, text);

  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }

  document.body.removeChild(ta);

  if (ok) return true;

  // iOS fallback: contentEditable div
  const div = document.createElement("div");
  div.contentEditable = "true";
  div.textContent = text;
  div.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px;z-index:-1;";
  document.body.appendChild(div);

  const range = document.createRange();
  range.selectNodeContents(div);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);

  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }

  sel?.removeAllRanges();
  document.body.removeChild(div);
  return ok;
}

export function copyTextFromUserGesture(text: string): boolean {
  return copyTextSync(text);
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

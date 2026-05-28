export const theme = {
  color: {
    bg: "#0B0D12",
    panel: "rgba(255, 255, 255, 0.06)",
    panel2: "rgba(255, 255, 255, 0.10)",
    text: "#EEF1F7",
    text2: "rgba(238, 241, 247, 0.72)",
    border: "rgba(255, 255, 255, 0.10)",
    brand: "#7C5CFF",
    brand2: "#35D0FF",
    danger: "#FF5C7A",
    success: "#42E599",
  },
  radius: {
    sm: "10px",
    md: "14px",
    lg: "18px",
  },
  shadow: {
    sm: "0 10px 30px rgba(0, 0, 0, 0.35)",
  },
  space: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
  },
  font: {
    sans:
      "var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
    mono:
      "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
} as const;


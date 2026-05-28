"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";

import { Button } from "@/components/ui";
import { copyText } from "@/lib/copy-text";

const CopyHint = styled.span`
  color: ${({ theme }) => theme?.color?.text2 ?? "rgba(238, 241, 247, 0.72)"};
  font-size: 12px;
  margin-left: 10px;
`;

export function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  const label = useMemo(() => {
    if (state === "copied") return "복사됨";
    if (state === "error") return "복사 실패";
    return "복사";
  }, [state]);

  async function onCopy() {
    try {
      const ok = await copyText(text);
      if (!ok) throw new Error("copy failed");
      setState("copied");
      window.setTimeout(() => setState("idle"), 1200);
    } catch {
      setState("error");
      window.setTimeout(() => setState("idle"), 1200);
    }
  }

  return (
    <div>
      <Button type="button" $variant="primary" onClick={onCopy} aria-live="polite">
        {label}
      </Button>
      <CopyHint>모바일은 길게 눌러도 복사할 수 있어요.</CopyHint>
    </div>
  );
}


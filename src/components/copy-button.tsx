"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";

import { Button } from "@/components/ui";
import { copyText } from "@/lib/copy-text";

const Row = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const CopyHint = styled.span`
  color: ${({ theme }) => theme.color.text2};
  font-size: 12px;
  font-weight: 600;
`;

export function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  const label = useMemo(() => {
    if (state === "copied") return "복사됐어요 💕";
    if (state === "error") return "다시 눌러주세요";
    return "복사하기";
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
    <Row>
      <Button type="button" $variant="primary" onClick={onCopy} aria-live="polite">
        {label}
      </Button>
      <CopyHint>길게 눌러도 OK</CopyHint>
    </Row>
  );
}

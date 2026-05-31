"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";

import { Button } from "@/components/ui";
import { copyText } from "@/lib/copy-text";

export type CopyUiState = "idle" | "holding" | "copying" | "copied" | "error";

const Row = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const CopyHint = styled.span<{ $tone?: "muted" | "success" | "danger" }>`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme, $tone }) =>
    $tone === "success"
      ? theme.color.success
      : $tone === "danger"
        ? theme.color.danger
        : theme.color.text2};
`;

function mergeState(click: CopyUiState, longPress?: CopyUiState): CopyUiState {
  if (click === "copied" || click === "error") return click;
  if (
    longPress === "copied" ||
    longPress === "error" ||
    longPress === "copying" ||
    longPress === "holding"
  ) {
    return longPress;
  }
  return click;
}

export function CopyButton({
  text,
  longPressState,
}: {
  text: string;
  longPressState?: CopyUiState;
}) {
  const [clickState, setClickState] = useState<CopyUiState>("idle");

  const uiState = mergeState(clickState, longPressState);

  const buttonLabel = useMemo(() => {
    if (clickState === "copied") return "복사됐어요 💕";
    if (clickState === "error") return "다시 눌러주세요";
    return "복사하기";
  }, [clickState]);

  const hint = useMemo(() => {
    if (uiState === "copied") return { text: "복사됐어요, 잘 써보세요 💕", tone: "success" as const };
    if (uiState === "error") return { text: "앗, 한 번 더 꾹 눌러볼까요?", tone: "danger" as const };
    if (uiState === "holding") return { text: "놓으면 복사돼요…", tone: "muted" as const };
    if (uiState === "copying") return { text: "잠깐만…", tone: "muted" as const };
    return { text: "프롬프트 꾹 눌러도 복사돼요", tone: "muted" as const };
  }, [uiState]);

  async function onCopy() {
    try {
      const ok = await copyText(text);
      if (!ok) throw new Error("copy failed");
      setClickState("copied");
      window.setTimeout(() => setClickState("idle"), 1200);
    } catch {
      setClickState("error");
      window.setTimeout(() => setClickState("idle"), 1200);
    }
  }

  return (
    <Row>
      <Button type="button" $variant="primary" onClick={onCopy} aria-live="polite">
        {buttonLabel}
      </Button>
      <CopyHint $tone={hint.tone} aria-live="polite">
        {hint.text}
      </CopyHint>
    </Row>
  );
}

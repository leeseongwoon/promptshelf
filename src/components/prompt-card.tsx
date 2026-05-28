"use client";

import styled from "styled-components";
import { useMemo } from "react";

import type { Prompt } from "@/types/prompt";
import { Card, GhostButton, Pill } from "@/components/ui";
import { useLongPressCopy } from "@/hooks/use-long-press-copy";
import { CopyButton } from "@/components/copy-button";

const Wrap = styled(Card)`
  padding: ${({ theme }) => theme?.space?.[6] ?? "24px"};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme?.space?.[4] ?? "16px"};
  cursor: pointer;

  &:hover {
    border-color: rgba(255, 255, 255, 0.18);
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme?.space?.[4] ?? "16px"};
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  letter-spacing: -0.2px;
`;

const Desc = styled.p`
  margin: 0;
  color: ${({ theme }) => theme?.color?.text2 ?? "rgba(238, 241, 247, 0.72)"};
  line-height: 1.5;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

const CopyZone = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-radius: 12px;
  padding: 6px;
  margin: -6px;
  -webkit-touch-callout: none;
`;

const CopyToast = styled.div<{ $state: "idle" | "copying" | "copied" | "error" }>`
  height: 18px;
  font-size: 12px;
  color: ${({ theme, $state }) =>
    $state === "copied"
      ? theme.color.success
      : $state === "error"
        ? theme.color.danger
        : theme.color.text2};
`;

const Accordion = styled.div<{ $open: boolean }>`
  overflow: hidden;
  max-height: ${({ $open }) => ($open ? "720px" : "0px")};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition: max-height 240ms ease, opacity 180ms ease;
`;

const PromptPreview = styled.pre`
  margin: 0;
  padding: 12px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.12);
  white-space: pre-wrap;
  word-break: break-word;
  font-family: ${({ theme }) => theme?.font?.mono ?? "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"};
  line-height: 1.55;
`;

export function PromptCard({
  prompt,
  onUpvote,
  isOpen,
  onToggle,
}: {
  prompt: Prompt;
  onUpvote?: () => void;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { state, bind } = useLongPressCopy({ text: prompt.prompt });
  const toast = useMemo(() => {
    if (state === "copied") return "복사됨";
    if (state === "error") return "복사 실패";
    if (state === "copying") return "복사 중…";
    return "모바일: 카드 본문 꾹 눌러 복사";
  }, [state]);

  return (
    <Wrap
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      aria-controls={`prompt-${prompt.id}`}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onToggle();
      }}
    >
      <TitleRow>
        <div>
          <Title>
            {prompt.title}
          </Title>
        </div>
        <GhostButton
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onUpvote?.();
          }}
          aria-label="업보트"
        >
          ▲ {prompt.upvotes}
        </GhostButton>
      </TitleRow>

      <CopyZone
        {...bind}
        aria-label="카드 본문(꾹 눌러 복사)"
        role="region"
        onClick={(e) => e.stopPropagation()}
      >
        <Desc>{prompt.description}</Desc>

        <Meta>
          <Pill>{prompt.kind}</Pill>
          <Pill>{prompt.model}</Pill>
          {prompt.tags.slice(0, 6).map((t) => (
            <Pill key={t}>#{t}</Pill>
          ))}
          <Pill>by {prompt.authorName}</Pill>
        </Meta>

        <Accordion id={`prompt-${prompt.id}`} $open={isOpen}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 8 }}>
            <PromptPreview>{prompt.prompt}</PromptPreview>
            <div onClick={(e) => e.stopPropagation()}>
              <CopyButton text={prompt.prompt} />
            </div>
          </div>
        </Accordion>

        <CopyToast $state={state} aria-live="polite">
          {toast}
        </CopyToast>
      </CopyZone>
    </Wrap>
  );
}


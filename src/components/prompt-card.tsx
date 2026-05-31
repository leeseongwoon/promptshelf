"use client";

import styled from "styled-components";
import { useMemo, useRef } from "react";

import type { Prompt } from "@/types/prompt";
import { Card, GhostButton, Pill } from "@/components/ui";
import { useLongPressCopy } from "@/hooks/use-long-press-copy";
import { CopyButton } from "@/components/copy-button";
import { formatKind, formatModel } from "@/lib/prompt-labels";

const Wrap = styled(Card)<{ $open: boolean }>`
  padding: ${({ theme }) => theme.space[5]} ${({ theme }) => theme.space[5]}
    ${({ theme }) => theme.space[6]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  cursor: pointer;
  transform: ${({ $open }) => ($open ? "scale(1.01)" : "none")};
  background: ${({ $open, theme }) =>
    $open
      ? `linear-gradient(160deg, ${theme.color.panel} 0%, ${theme.color.brandSoft} 100%)`
      : theme.color.panel};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.cardHover};
    transform: translateY(-3px) scale(1.005);
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
`;

const Title = styled.h3`
  margin: 0;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.4px;
  line-height: 1.4;
  color: ${({ theme }) => theme.color.text};
`;

const Desc = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.text2};
  line-height: 1.65;
  font-size: 14px;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CopyToast = styled.div<{ $state: "idle" | "holding" | "copying" | "copied" | "error" }>`
  margin: 0;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.panel2};
  min-height: 18px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
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
  transition: max-height 280ms cubic-bezier(0.34, 1.2, 0.64, 1), opacity 200ms ease;
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
`;

const copyZoneBase = `
  touch-action: pan-y;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
`;

const PromptCopySurface = styled.div<{ $holding?: boolean }>`
  position: relative;
  ${copyZoneBase}

  ${({ $holding, theme }) =>
    $holding
      ? `
    outline: 2px dashed ${theme.color.brand};
    outline-offset: 4px;
    border-radius: ${theme.radius.md};
  `
      : ""}
`;

const PromptPreview = styled.div`
  margin: 0;
  padding: 16px 18px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.noteBg};
  border: 2px solid rgba(255, 220, 180, 0.5);
  color: ${({ theme }) => theme.color.text};
  white-space: pre-wrap;
  word-break: break-word;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 14px;
  line-height: 1.75;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
`;

const ClosedPressZone = styled.div<{ $holding?: boolean }>`
  ${copyZoneBase}
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0 -4px;
  padding: 4px;
  border-radius: ${({ theme }) => theme.radius.md};

  ${({ $holding, theme }) =>
    $holding
      ? `
    outline: 2px dashed ${theme.color.brand};
    outline-offset: 2px;
    background: ${theme.color.brandSoft}22;
  `
      : ""}
`;

const LikeButton = styled(GhostButton)`
  flex-shrink: 0;
  min-width: 72px;
  padding: 8px 14px;
  font-size: 13px;
`;

function stopPressPropagation(e: React.SyntheticEvent) {
  e.stopPropagation();
}

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
  const suppressToggleRef = useRef(false);

  const { state, targetRef, consumedClick } = useLongPressCopy({
    text: prompt.prompt,
    moveCancelPx: 28,
    onCopied: () => {
      suppressToggleRef.current = true;
    },
  });

  const closedToast = useMemo(() => {
    if (isOpen) return "";
    if (state === "copied") return "복사됐어요 💕";
    if (state === "error") return "앗, 한 번 더 꾹 눌러볼까요?";
    if (state === "copying" || state === "holding") return "놓으면 복사돼요…";
    return "카드 꾹 눌러도 복사돼요";
  }, [isOpen, state]);

  function handleCardClick() {
    if (suppressToggleRef.current || consumedClick()) {
      suppressToggleRef.current = false;
      return;
    }
    onToggle();
  }

  return (
    <Wrap
      $open={isOpen}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      aria-controls={`prompt-${prompt.id}`}
      aria-label={`${prompt.title} 카드`}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleCardClick();
      }}
    >
      {!isOpen ? (
        <ClosedPressZone
          key="copy-closed"
          ref={targetRef}
          $holding={state === "holding"}
          aria-label="카드 꾹 눌러 복사"
        >
          <TitleRow>
            <Title>{prompt.title}</Title>
            <LikeButton
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpvote?.();
              }}
              onPointerDown={stopPressPropagation}
              onPointerUp={stopPressPropagation}
              onPointerCancel={stopPressPropagation}
              aria-label="도움 됐어요"
            >
              ♡ {prompt.upvotes}
            </LikeButton>
          </TitleRow>

          <Desc>{prompt.description}</Desc>

          <Meta>
            <Pill $tone="pink">{formatKind(prompt.kind)}</Pill>
            <Pill $tone="lavender">{formatModel(prompt.model)}</Pill>
            {prompt.tags.slice(0, 4).map((t) => (
              <Pill key={t} $tone="plain">
                #{t}
              </Pill>
            ))}
          </Meta>

          <CopyToast $state={state} aria-live="polite">
            {closedToast}
          </CopyToast>
        </ClosedPressZone>
      ) : (
        <>
          <TitleRow>
            <Title>{prompt.title}</Title>
            <LikeButton
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUpvote?.();
              }}
              onPointerDown={stopPressPropagation}
              onPointerUp={stopPressPropagation}
              onPointerCancel={stopPressPropagation}
              aria-label="도움 됐어요"
            >
              ♡ {prompt.upvotes}
            </LikeButton>
          </TitleRow>

          <Desc>{prompt.description}</Desc>

          <Meta>
            <Pill $tone="pink">{formatKind(prompt.kind)}</Pill>
            <Pill $tone="lavender">{formatModel(prompt.model)}</Pill>
            {prompt.tags.slice(0, 4).map((t) => (
              <Pill key={t} $tone="plain">
                #{t}
              </Pill>
            ))}
          </Meta>
        </>
      )}

      <Accordion id={`prompt-${prompt.id}`} $open={isOpen}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 10 }}>
          <PromptCopySurface
            key="copy-open"
            ref={isOpen ? targetRef : undefined}
            $holding={isOpen && state === "holding"}
            aria-label="프롬프트 본문(꾹 눌러 복사)"
          >
            <PromptPreview>
              {prompt.prompt?.trim()
                ? prompt.prompt
                : "아직 내용이 비어 있어요. 잠시 후 다시 봐주세요."}
            </PromptPreview>
          </PromptCopySurface>

          <div
            onClick={(e) => e.stopPropagation()}
            onPointerDown={stopPressPropagation}
            onPointerUp={stopPressPropagation}
            onPointerCancel={stopPressPropagation}
          >
            <CopyButton text={prompt.prompt} longPressState={state} />
          </div>
        </div>
      </Accordion>
    </Wrap>
  );
}

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

const CopyToast = styled.div<{ $state: "idle" | "copying" | "copied" | "error" }>`
  min-height: 18px;
  font-size: 12px;
  font-weight: 600;
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

const PromptCopySurface = styled.div`
  -webkit-touch-callout: none;
  touch-action: manipulation;
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
  position: relative;

  &::before {
    content: "📝";
    position: absolute;
    top: -10px;
    right: 14px;
    font-size: 20px;
  }
`;

const LikeButton = styled(GhostButton)`
  flex-shrink: 0;
  min-width: 72px;
  padding: 8px 14px;
  font-size: 13px;
`;

function stopTouchPropagation(e: React.SyntheticEvent) {
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

  const { state, bind } = useLongPressCopy({
    text: prompt.prompt,
    moveCancelPx: 24,
    onCopied: () => {
      suppressToggleRef.current = true;
    },
  });

  const toast = useMemo(() => {
    if (state === "copied") return "복사됐어요 💕";
    if (state === "error") return "앗, 다시 한번 눌러볼까요?";
    if (state === "copying") return "잠깐만…";
    return isOpen ? "꾹 누르면 복사돼요" : "카드 꾹 눌러도 복사돼요";
  }, [isOpen, state]);

  function handleCardClick() {
    if (suppressToggleRef.current) {
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
      <TitleRow>
        <Title>{prompt.title}</Title>
        <LikeButton
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onUpvote?.();
          }}
          onTouchStart={stopTouchPropagation}
          aria-label="도움 됐어요"
        >
          ♡ {prompt.upvotes}
        </LikeButton>
      </TitleRow>

      <Body {...(!isOpen ? bind : {})}>
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
          {toast}
        </CopyToast>
      </Body>

      <Accordion id={`prompt-${prompt.id}`} $open={isOpen}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 10 }}>
          <PromptCopySurface {...(isOpen ? bind : {})} aria-label="프롬프트 본문(꾹 눌러 복사)">
            <PromptPreview>
              {prompt.prompt?.trim()
                ? prompt.prompt
                : "아직 내용이 비어 있어요. 잠시 후 다시 봐주세요."}
            </PromptPreview>
          </PromptCopySurface>

          <div
            onClick={(e) => e.stopPropagation()}
            onTouchStart={stopTouchPropagation}
            onTouchEnd={stopTouchPropagation}
            onTouchCancel={stopTouchPropagation}
          >
            <CopyButton text={prompt.prompt} />
          </div>
        </div>
      </Accordion>
    </Wrap>
  );
}

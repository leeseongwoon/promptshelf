"use client";

import Link from "next/link";
import styled from "styled-components";
import { useMemo } from "react";

import type { Prompt } from "@/types/prompt";
import { Card, GhostButton, Pill } from "@/components/ui";
import { useLongPressCopy } from "@/hooks/use-long-press-copy";

const Wrap = styled(Card)`
  padding: ${({ theme }) => theme?.space?.[6] ?? "24px"};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme?.space?.[4] ?? "16px"};
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

const TagLink = styled(Link)`
  &:hover {
    text-decoration: underline;
  }
`;

export function PromptCard({
  prompt,
  onUpvote,
}: {
  prompt: Prompt;
  onUpvote?: () => void;
}) {
  const { state, bind } = useLongPressCopy({ text: prompt.prompt });
  const toast = useMemo(() => {
    if (state === "copied") return "복사됨";
    if (state === "error") return "복사 실패";
    if (state === "copying") return "복사 중…";
    return "모바일: 카드 본문 꾹 눌러 복사";
  }, [state]);

  return (
    <Wrap>
      <TitleRow>
        <div>
          <Title>
            <Link href={`/p/${prompt.id}`}>{prompt.title}</Link>
          </Title>
        </div>
        <GhostButton type="button" onClick={onUpvote} aria-label="업보트">
          ▲ {prompt.upvotes}
        </GhostButton>
      </TitleRow>

      <CopyZone {...bind} aria-label="카드 본문(꾹 눌러 복사)" role="region">
        <Desc>{prompt.description}</Desc>

        <Meta>
          <Pill>{prompt.category}</Pill>
          {prompt.tags.slice(0, 6).map((t) => (
            <TagLink key={t} href={`/?tag=${encodeURIComponent(t)}`}>
              <Pill>#{t}</Pill>
            </TagLink>
          ))}
          <Pill>by {prompt.authorName}</Pill>
        </Meta>

        <CopyToast $state={state} aria-live="polite">
          {toast}
        </CopyToast>
      </CopyZone>
    </Wrap>
  );
}


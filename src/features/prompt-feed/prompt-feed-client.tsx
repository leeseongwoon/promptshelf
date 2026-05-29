"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import styled from "styled-components";

import type { Prompt } from "@/types/prompt";
import { PromptCard } from "@/components/prompt-card";
import { GhostButton, Input } from "@/components/ui";

const FeedTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
  margin-bottom: ${({ theme }) => theme.space[5]};
  flex-wrap: wrap;
`;

const CountLine = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.text2};
`;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[5]};
`;

const MobileSearch = styled.form`
  display: none;
  gap: ${({ theme }) => theme.space[3]};
  width: 100%;
  margin-top: ${({ theme }) => theme.space[3]};

  @media (max-width: 720px) {
    display: flex;
    flex-direction: column;
  }
`;

export function PromptFeedClient({ initialPrompts }: { initialPrompts: Prompt[] }) {
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);
  const [isPending, startTransition] = useTransition();
  const [mobileQ, setMobileQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const count = useMemo(() => prompts.length, [prompts]);

  useEffect(() => {
    setPrompts(initialPrompts);
    setOpenId(null);
  }, [initialPrompts]);

  function refreshWithQuery(q: string) {
    startTransition(async () => {
      const res = await fetch(`/api/prompts?q=${encodeURIComponent(q)}&sort=trending`, {
        method: "GET",
      });
      const json = (await res.json()) as { prompts: Prompt[] };
      setPrompts(json.prompts);
    });
  }

  async function upvote(id: string) {
    const prev = prompts;
    setPrompts((p) => p.map((x) => (x.id === id ? { ...x, upvotes: x.upvotes + 1 } : x)));
    const res = await fetch(`/api/prompts/${id}/upvote`, { method: "POST" });
    if (!res.ok) setPrompts(prev);
  }

  return (
    <>
      <FeedTop>
        <CountLine>
          지금 {count}개 모여 있어요 {isPending ? "· 불러오는 중…" : ""}
        </CountLine>
        <GhostButton type="button" disabled={isPending} onClick={() => refreshWithQuery("")}>
          처음부터 보기
        </GhostButton>
      </FeedTop>

      <MobileSearch
        onSubmit={(e) => {
          e.preventDefault();
          refreshWithQuery(mobileQ);
        }}
        role="search"
        aria-label="모바일 검색"
      >
        <Input
          value={mobileQ}
          onChange={(e) => setMobileQ(e.target.value)}
          placeholder="🔍 여기서도 찾아볼 수 있어요"
          aria-label="검색어"
        />
        <GhostButton type="submit" disabled={isPending}>
          찾아보기
        </GhostButton>
      </MobileSearch>

      <Grid>
        {prompts.map((p) => (
          <PromptCard
            key={p.id}
            prompt={p}
            isOpen={openId === p.id}
            onToggle={() => setOpenId((prev) => (prev === p.id ? null : p.id))}
            onUpvote={() => upvote(p.id)}
          />
        ))}
      </Grid>
    </>
  );
}

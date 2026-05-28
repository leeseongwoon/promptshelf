"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import styled from "styled-components";

import type { Prompt } from "@/types/prompt";
import { PromptCard } from "@/components/prompt-card";
import { Card, GhostButton, Input, Pill } from "@/components/ui";

const Controls = styled(Card)`
  padding: ${({ theme }) => theme?.space?.[5] ?? "20px"};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme?.space?.[4] ?? "16px"};
  margin-bottom: ${({ theme }) => theme?.space?.[6] ?? "24px"};

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Right = styled.div`
  display: flex;
  gap: ${({ theme }) => theme?.space?.[3] ?? "12px"};
  align-items: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme?.space?.[5] ?? "20px"};
`;

const MobileSearch = styled.form`
  display: none;
  gap: ${({ theme }) => theme?.space?.[3] ?? "12px"};

  @media (max-width: 720px) {
    display: flex;
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
      <Controls>
        <Left>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <Pill>총 {count}개</Pill>
            {isPending ? <Pill>불러오는 중…</Pill> : null}
          </div>
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
              placeholder="검색어…"
              aria-label="검색어"
            />
            <GhostButton type="submit" disabled={isPending}>
              검색
            </GhostButton>
          </MobileSearch>
        </Left>

        <Right>
          <GhostButton type="button" disabled={isPending} onClick={() => refreshWithQuery("")}>
            전체보기
          </GhostButton>
        </Right>
      </Controls>

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


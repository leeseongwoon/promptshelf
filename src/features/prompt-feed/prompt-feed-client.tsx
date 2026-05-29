"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import styled from "styled-components";

import type { Prompt } from "@/types/prompt";
import { PromptCard } from "@/components/prompt-card";
import { GhostButton } from "@/components/ui";
import { PromptFeedPager } from "@/features/prompt-feed/prompt-feed-pager";

const PAGE_SIZE = 5;

const FeedSection = styled.section`
  margin-top: ${({ theme }) => theme.space[4]};
  padding-top: ${({ theme }) => theme.space[5]};
  border-top: 2px dashed ${({ theme }) => theme.color.border};

  @media (max-width: 720px) {
    margin-top: ${({ theme }) => theme.space[6]};
    padding-top: ${({ theme }) => theme.space[6]};
  }
`;

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

function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = page * pageSize;
  return items.slice(start, start + pageSize);
}

export function PromptFeedClient({ initialPrompts }: { initialPrompts: Prompt[] }) {
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);
  const [isPending, startTransition] = useTransition();
  const [openId, setOpenId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const feedRef = useRef<HTMLElement>(null);

  const count = useMemo(() => prompts.length, [prompts]);
  const pageCount = useMemo(() => Math.max(1, Math.ceil(count / PAGE_SIZE)), [count]);
  const pagePrompts = useMemo(() => paginate(prompts, page, PAGE_SIZE), [prompts, page]);

  useEffect(() => {
    setPrompts(initialPrompts);
    setOpenId(null);
    setPage(0);
  }, [initialPrompts]);

  useEffect(() => {
    if (page > pageCount - 1) setPage(Math.max(0, pageCount - 1));
  }, [page, pageCount]);

  function goToPage(next: number) {
    const clamped = Math.min(Math.max(0, next), pageCount - 1);
    setPage(clamped);
    setOpenId(null);
    feedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function refreshWithQuery(q: string) {
    startTransition(async () => {
      const res = await fetch(`/api/prompts?q=${encodeURIComponent(q)}&sort=trending`, {
        method: "GET",
      });
      const json = (await res.json()) as { prompts: Prompt[] };
      setPrompts(json.prompts);
      setPage(0);
      setOpenId(null);
    });
  }

  async function upvote(id: string) {
    const prev = prompts;
    setPrompts((p) => p.map((x) => (x.id === id ? { ...x, upvotes: x.upvotes + 1 } : x)));
    const res = await fetch(`/api/prompts/${id}/upvote`, { method: "POST" });
    if (!res.ok) setPrompts(prev);
  }

  return (
    <FeedSection ref={feedRef} aria-label="프롬프트 목록">
      <FeedTop>
        <CountLine>
          지금 {count}개 · {page + 1}페이지 {isPending ? "· 불러오는 중…" : ""}
        </CountLine>
        <GhostButton type="button" disabled={isPending} onClick={() => refreshWithQuery("")}>
          처음부터 보기
        </GhostButton>
      </FeedTop>

      <Grid>
        {pagePrompts.map((p) => (
          <PromptCard
            key={p.id}
            prompt={p}
            isOpen={openId === p.id}
            onToggle={() => setOpenId((prev) => (prev === p.id ? null : p.id))}
            onUpvote={() => upvote(p.id)}
          />
        ))}
      </Grid>

      {pagePrompts.length === 0 ? (
        <CountLine style={{ textAlign: "center", marginTop: 24 }}>아직 프롬프트가 없어요.</CountLine>
      ) : null}

      <PromptFeedPager page={page} pageCount={pageCount} onPageChange={goToPage} />
    </FeedSection>
  );
}

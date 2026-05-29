"use client";

import styled from "styled-components";

import { GhostButton } from "@/components/ui";

const Wrap = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[6]};
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radius.pill};
  background: rgba(255, 255, 255, 0.75);
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const PageInfo = styled.span`
  min-width: 88px;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.text};
`;

const Dots = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const Dot = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? "22px" : "8px")};
  height: 8px;
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.radius.pill};
  cursor: pointer;
  background: ${({ theme, $active }) => ($active ? theme.color.brand : theme.color.border)};
  transition:
    width 0.2s ease,
    background 0.2s ease;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.brand};
    outline-offset: 2px;
  }
`;

export function PromptFeedPager({
  page,
  pageCount,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;

  return (
    <Wrap aria-label="프롬프트 페이지">
      <GhostButton type="button" disabled={page <= 0} onClick={() => onPageChange(page - 1)}>
        ← 이전
      </GhostButton>

      <PageInfo>
        {page + 1} / {pageCount}
      </PageInfo>

      <Dots aria-hidden>
        {Array.from({ length: pageCount }, (_, i) => (
          <Dot
            key={i}
            type="button"
            $active={i === page}
            aria-label={`${i + 1}페이지`}
            aria-current={i === page ? "page" : undefined}
            onClick={() => onPageChange(i)}
          />
        ))}
      </Dots>

      <GhostButton
        type="button"
        disabled={page >= pageCount - 1}
        onClick={() => onPageChange(page + 1)}
      >
        다음 →
      </GhostButton>
    </Wrap>
  );
}

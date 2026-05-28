"use client";

import Link from "next/link";
import styled from "styled-components";

import { Button, Container, Input, Pill } from "@/components/ui";

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(12px);
  background: rgba(11, 13, 18, 0.72);
  border-bottom: 1px solid ${({ theme }) => theme?.color?.border ?? "rgba(255, 255, 255, 0.10)"};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme?.space?.[4] ?? "16px"};
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  letter-spacing: -0.4px;
`;

const SearchForm = styled.form`
  flex: 1;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.space?.[3] ?? "12px"};
  max-width: 560px;

  @media (max-width: 720px) {
    display: none;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.space?.[3] ?? "12px"};
`;

export function SiteHeader({
  defaultQuery,
  tag,
}: {
  defaultQuery?: string;
  tag?: string;
}) {
  return (
    <Bar>
      <Container>
        <Row>
          <Link href="/" aria-label="PromptShelf 홈">
            <Brand>
              PromptShelf {tag ? <Pill>#{tag}</Pill> : null}
            </Brand>
          </Link>

          <SearchForm action="/" method="get" role="search" aria-label="프롬프트 검색">
            <Input
              name="q"
              defaultValue={defaultQuery}
              placeholder="검색: 제목, 태그, 설명, 프롬프트…"
              aria-label="검색어"
            />
            <Button type="submit" $variant="primary">
              검색
            </Button>
          </SearchForm>

          <Actions>
            <Link href="/new">
              <Button type="button" $variant="primary">
                프롬프트 공유
              </Button>
            </Link>
          </Actions>
        </Row>
      </Container>
    </Bar>
  );
}


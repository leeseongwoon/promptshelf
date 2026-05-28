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
  flex-wrap: wrap;
`;

const BrandLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
  z-index: 2;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  letter-spacing: -0.4px;
`;

const SearchForm = styled.form`
  flex: 1 1 520px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.space?.[3] ?? "12px"};
  max-width: 760px;
  min-width: 260px;

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: stretch;
    max-width: none;
  }
`;

const Select = styled.select`
  background: ${({ theme }) => theme?.color?.panel ?? "rgba(255, 255, 255, 0.06)"};
  border: 1px solid ${({ theme }) => theme?.color?.border ?? "rgba(255, 255, 255, 0.10)"};
  color: ${({ theme }) => theme?.color?.text ?? "#EEF1F7"};
  border-radius: ${({ theme }) => theme?.radius?.md ?? "14px"};
  padding: 10px 12px;
  height: 40px;
  min-width: 140px;
`;

const SearchRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme?.space?.[3] ?? "12px"};
  width: 100%;
  align-items: center;

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: stretch;
  }
`;


export function SiteHeader({
  defaultQuery,
  tag,
  defaultKind,
  defaultModel,
}: {
  defaultQuery?: string;
  tag?: string;
  defaultKind?: string;
  defaultModel?: string;
}) {
  return (
    <Bar>
      <Container>
        <Row>
          <BrandLink href="/" aria-label="PromptShelf 홈">
            <Brand>
              PromptShelf {tag ? <Pill>#{tag}</Pill> : null}
            </Brand>
          </BrandLink>

          <SearchForm action="/" method="get" role="search" aria-label="프롬프트 검색">
            {tag ? <input type="hidden" name="tag" value={tag} /> : null}
            <SearchRow>
              <Input
                name="q"
                defaultValue={defaultQuery}
                placeholder="검색: 제목, 태그, 설명, 프롬프트…"
                aria-label="검색어"
              />
              <Select name="kind" defaultValue={defaultKind ?? ""} aria-label="종류 카테고리">
                <option value="">종류: 전체</option>
                <option value="Code">코드</option>
                <option value="Image">그림</option>
                <option value="Writing">글</option>
                <option value="Video">영상</option>
                <option value="Data">데이터</option>
                <option value="Productivity">생산성</option>
                <option value="Other">기타</option>
              </Select>
              <Select name="model" defaultValue={defaultModel ?? ""} aria-label="AI 종류">
                <option value="">AI: 전체</option>
                <option value="GPT">GPT</option>
                <option value="Claude">Claude</option>
                <option value="Gemini">Gemini</option>
                <option value="Other">Other</option>
              </Select>
              <Button type="submit" $variant="primary">
                검색
              </Button>
            </SearchRow>
          </SearchForm>
        </Row>
      </Container>
    </Bar>
  );
}


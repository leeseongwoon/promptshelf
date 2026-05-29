"use client";

import Link from "next/link";
import styled from "styled-components";

import { Button, Container, Input, Pill } from "@/components/ui";

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  padding: ${({ theme }) => theme.space[4]} 0 ${({ theme }) => theme.space[3]};
  backdrop-filter: blur(16px);
  background: ${({ theme }) => theme.color.headerBg};
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
`;

const BrandLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  text-decoration: none;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 22px;
  letter-spacing: -0.6px;
  color: ${({ theme }) => theme.color.text};
`;

const BrandEmoji = styled.span`
  font-size: 26px;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(255, 143, 171, 0.35));
`;

const BrandName = styled.span`
  background: linear-gradient(135deg, ${({ theme }) => theme.color.brand}, ${({ theme }) => theme.color.brand2});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SearchForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
`;

const SearchShell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 6px 6px 16px;
  background: rgba(255, 255, 255, 0.88);
  border-radius: ${({ theme }) => theme.radius.pill};
  box-shadow: ${({ theme }) => theme.shadow.sm};

  input {
    box-shadow: none;
    border: none;
    padding: 10px 4px;
    background: transparent;

    &:focus {
      box-shadow: none;
      border-color: transparent;
    }
  }
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};
  align-items: center;
`;

const Select = styled.select`
  flex: 1 1 120px;
  min-width: 0;
  background: rgba(255, 255, 255, 0.92);
  border: none;
  color: ${({ theme }) => theme.color.text};
  border-radius: ${({ theme }) => theme.radius.pill};
  padding: 11px 16px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(255, 143, 171, 0.12);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%239A8494' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px ${({ theme }) => theme.color.brandSoft};
  }
`;

const SearchIcon = styled.span`
  font-size: 18px;
  flex-shrink: 0;
  opacity: 0.85;
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
          <TopRow>
            <BrandLink href="/" aria-label="프롬프트 선반 홈">
              <Brand>
                <BrandEmoji aria-hidden>🎀</BrandEmoji>
                <BrandName>프롬프트 선반</BrandName>
                {tag ? <Pill $tone="lavender">#{tag}</Pill> : null}
              </Brand>
            </BrandLink>
          </TopRow>

          <SearchForm action="/" method="get" role="search" aria-label="프롬프트 검색">
            {tag ? <input type="hidden" name="tag" value={tag} /> : null}
            <SearchShell>
              <SearchIcon aria-hidden>🔍</SearchIcon>
              <Input
                name="q"
                defaultValue={defaultQuery}
                placeholder="뭐 찾아요? 과제, 셀카, 자소서…"
                aria-label="검색어"
              />
            </SearchShell>
            <FilterRow>
              <Select name="kind" defaultValue={defaultKind ?? ""} aria-label="종류">
                <option value="">📎 전체</option>
                <option value="Code">💻 코딩</option>
                <option value="Image">🎨 그림</option>
                <option value="Writing">✍️ 글</option>
                <option value="Video">🎬 영상</option>
                <option value="Data">📊 데이터</option>
                <option value="Productivity">✨ 생산성</option>
                <option value="Other">🌷 기타</option>
              </Select>
              <Select name="model" defaultValue={defaultModel ?? ""} aria-label="도구">
                <option value="">🫧 전체</option>
                <option value="GPT">🤖 GPT</option>
                <option value="Claude">🐱 Claude</option>
                <option value="Gemini">💎 Gemini</option>
                <option value="Other">✨ 기타</option>
              </Select>
              <Button type="submit" $variant="primary">
                찾아보기
              </Button>
            </FilterRow>
          </SearchForm>
        </Row>
      </Container>
    </Bar>
  );
}

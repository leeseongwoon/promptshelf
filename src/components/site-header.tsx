"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import {
  FilterSelect,
  KIND_FILTER_OPTIONS,
  MODEL_FILTER_OPTIONS,
} from "@/components/filter-select";
import { Button, Container, Input, Pill } from "@/components/ui";
import { useScrollHideHeader } from "@/hooks/use-scroll-hide-header";

const Bar = styled.header<{ $hidden: boolean; $reduceMotion: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  padding: ${({ theme }) => theme.space[4]} 0 ${({ theme }) => theme.space[5]};
  backdrop-filter: blur(16px);
  background: ${({ theme }) => theme.color.headerBg};
  border-bottom: 2px dashed ${({ theme }) => theme.color.border};
  overflow: visible;

  @media (max-width: 720px) {
    padding-bottom: ${({ theme }) => theme.space[6]};
  }

  transform: translateY(${({ $hidden }) => ($hidden ? "-110%" : "0")});
  transition: ${({ $reduceMotion }) =>
    $reduceMotion ? "none" : "transform 0.32s cubic-bezier(0.32, 0.72, 0, 1)"};
  will-change: transform;
`;

const Spacer = styled.div`
  flex-shrink: 0;

  @media (max-width: 720px) {
    margin-bottom: ${({ theme }) => theme.space[3]};
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
  overflow: visible;
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
  overflow: visible;
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
  overflow: visible;

  @media (max-width: 720px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    align-items: start;

    button[type="submit"] {
      grid-column: 1 / -1;
      width: 100%;
      margin-top: 2px;
      padding: 10px 16px;
    }
  }
`;

const SearchIcon = styled.span`
  font-size: 18px;
  flex-shrink: 0;
  opacity: 0.85;
`;

type OpenFilter = "kind" | "model" | null;

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
  const hidden = useScrollHideHeader();
  const barRef = useRef<HTMLElement>(null);
  const [barHeight, setBarHeight] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [openFilter, setOpenFilter] = useState<OpenFilter>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;

    function measure() {
      const node = barRef.current;
      if (!node) return;
      setBarHeight(node.getBoundingClientRect().height);
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [openFilter]);

  return (
    <>
      <Bar ref={barRef} $hidden={reduceMotion ? false : hidden} $reduceMotion={reduceMotion}>
        <Container style={{ overflow: "visible" }}>
          <Row>
            <TopRow>
              <BrandLink href="/" aria-label="프롬프트 선반 홈">
                <Brand>
                  <BrandEmoji aria-hidden>🎀</BrandEmoji>
                  <BrandName>PromptShelf</BrandName>
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
                <FilterSelect
                  name="kind"
                  defaultValue={defaultKind ?? ""}
                  options={KIND_FILTER_OPTIONS}
                  aria-label="종류"
                  open={openFilter === "kind"}
                  onOpenChange={(next) => setOpenFilter(next ? "kind" : null)}
                />
                <FilterSelect
                  name="model"
                  defaultValue={defaultModel ?? ""}
                  options={MODEL_FILTER_OPTIONS}
                  aria-label="도구"
                  open={openFilter === "model"}
                  onOpenChange={(next) => setOpenFilter(next ? "model" : null)}
                />
                <Button type="submit" $variant="primary" onClick={() => setOpenFilter(null)}>
                  찾아보기
                </Button>
              </FilterRow>
            </SearchForm>
          </Row>
        </Container>
      </Bar>
      <Spacer style={{ height: barHeight }} aria-hidden />
    </>
  );
}

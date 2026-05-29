"use client";

import styled from "styled-components";
import Link from "next/link";
import { useMemo } from "react";

import type { Prompt } from "@/types/prompt";
import { SiteHeader } from "@/components/site-header";
import { Card, Container, GhostButton, Pill } from "@/components/ui";
import { CopyButton } from "@/components/copy-button";
import { useLongPressCopy } from "@/hooks/use-long-press-copy";

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: ${({ theme }) => theme.space[6]};

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const MainCard = styled(Card)`
  padding: ${({ theme }) => theme.space[8]};
`;

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  letter-spacing: -0.8px;
`;

const Desc = styled.p`
  margin: ${({ theme }) => theme.space[4]} 0 0 0;
  color: ${({ theme }) => theme.color.text2};
  line-height: 1.6;
`;

const PromptBox = styled.pre`
  margin: ${({ theme }) => theme.space[6]} 0 0 0;
  padding: ${({ theme }) => theme.space[6]};
  background: ${({ theme }) => theme.color.promptBg};
  border: 1px dashed ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  color: ${({ theme }) => theme.color.text};
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: ${({ theme }) => theme.font.mono};
  line-height: 1.6;
  user-select: text;
  -webkit-user-select: text;
  -webkit-touch-callout: none;
`;

const SideCard = styled(Card)`
  padding: ${({ theme }) => theme.space[6]};
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const Toast = styled.div<{ $state: "idle" | "copying" | "copied" | "error" }>`
  height: 20px;
  font-size: 12px;
  color: ${({ theme, $state }) =>
    $state === "copied"
      ? theme.color.success
      : $state === "error"
        ? theme.color.danger
        : theme.color.text2};
`;

export function PromptDetailView({ prompt }: { prompt: Prompt }) {
  const { state, bind } = useLongPressCopy({ text: prompt.prompt });
  const toast = useMemo(() => {
    if (state === "copied") return "복사됨";
    if (state === "error") return "복사 실패";
    if (state === "copying") return "복사 중…";
    return "모바일: 프롬프트를 꾹 눌러 복사";
  }, [state]);

  return (
    <>
      <SiteHeader />
      <main>
        <Container>
          <div style={{ marginBottom: 16 }}>
            <Link href="/">
              <GhostButton type="button">← 목록</GhostButton>
            </Link>
          </div>

          <Layout>
            <MainCard>
              <Title>{prompt.title}</Title>
              <Desc>{prompt.description}</Desc>
              <PromptBox
                {...bind}
                aria-label="프롬프트(꾹 눌러 복사)"
                role="region"
                tabIndex={0}
              >
                {prompt.prompt}
              </PromptBox>
            </MainCard>

            <SideCard aria-label="프롬프트 정보">
              <CopyButton text={prompt.prompt} />
              <Toast $state={state} aria-live="polite">
                {toast}
              </Toast>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <Pill>{prompt.kind}</Pill>
                <Pill>{prompt.model}</Pill>
                <Pill>▲ {prompt.upvotes}</Pill>
                <Pill>by {prompt.authorName}</Pill>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {prompt.tags.map((t) => (
                  <Link key={t} href={`/?tag=${encodeURIComponent(t)}`}>
                    <Pill>#{t}</Pill>
                  </Link>
                ))}
              </div>
            </SideCard>
          </Layout>
        </Container>
      </main>
    </>
  );
}

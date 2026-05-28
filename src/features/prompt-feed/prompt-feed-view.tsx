"use client";

import styled from "styled-components";

import type { Prompt } from "@/types/prompt";
import { PromptFeedClient } from "@/features/prompt-feed/prompt-feed-client";
import { Card } from "@/components/ui";

const Hero = styled(Card)`
  padding: ${({ theme }) => theme.space[10]};
  margin-bottom: ${({ theme }) => theme.space[8]};

  @media (max-width: 720px) {
    padding: ${({ theme }) => theme.space[6]};
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 34px;
  letter-spacing: -1px;
  line-height: 1.05;
`;

const Sub = styled.p`
  margin: ${({ theme }) => theme.space[4]} 0 0 0;
  color: ${({ theme }) => theme.color.text2};
  max-width: 64ch;
  line-height: 1.6;
`;

export function PromptFeedView({ prompts }: { prompts: Prompt[] }) {
  return (
    <>
      <Hero>
        <Title>좋은 프롬프트는, 저장하고 공유될수록 강해져요.</Title>
        <Sub>
          PromptShelf는 빠르고 미니멀한 프롬프트 라이브러리입니다. 원탭 복사, 태그/카테고리
          탐색, 업보트로 “쓸만한 것”이 위로 올라오게 만듭니다.
        </Sub>
      </Hero>

      <PromptFeedClient initialPrompts={prompts} />
    </>
  );
}

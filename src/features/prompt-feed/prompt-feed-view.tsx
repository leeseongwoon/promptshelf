"use client";

import styled from "styled-components";

import type { Prompt } from "@/types/prompt";
import { PromptFeedClient } from "@/features/prompt-feed/prompt-feed-client";

const Hero = styled.section`
  position: relative;
  text-align: center;
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[4]}
    ${({ theme }) => theme.space[6]};
  margin-bottom: ${({ theme }) => theme.space[2]};

  &::before,
  &::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    z-index: -1;
  }

  &::before {
    width: 120px;
    height: 120px;
    top: -20px;
    left: -10px;
    background: ${({ theme }) => theme.color.brandSoft};
    opacity: 0.7;
  }

  &::after {
    width: 80px;
    height: 80px;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => theme.color.panel3};
    opacity: 0.65;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.6px;
  line-height: 1.35;
  color: ${({ theme }) => theme.color.text};
`;

const Sub = styled.p`
  margin: ${({ theme }) => theme.space[4]} auto 0;
  color: ${({ theme }) => theme.color.text2};
  max-width: 42ch;
  line-height: 1.75;
  font-size: 15px;
`;

const Hint = styled.p`
  margin: ${({ theme }) => theme.space[4]} 0 0;
  font-size: 13px;
  color: ${({ theme }) => theme.color.brand};
  font-weight: 600;
`;

export function PromptFeedView({ prompts }: { prompts: Prompt[] }) {
  return (
    <>
      <Hero>
        <Title>
          오늘 쓸 말,
          <br />
          여기서 골라가요 🌸
        </Title>
        <Sub>카드를 눌러 펼치고, 꾹 누르면 바로 복사돼요. 과제·일기·취미 다 OK.</Sub>
        <Hint>♡ 도움 됐으면 하트 눌러주세요</Hint>
      </Hero>

      <PromptFeedClient initialPrompts={prompts} />
    </>
  );
}

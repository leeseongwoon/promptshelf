"use client";

import Link from "next/link";
import styled from "styled-components";

import { SiteHeader } from "@/components/site-header";
import { Card, Container, Button } from "@/components/ui";

const Box = styled(Card)`
  padding: ${({ theme }) => theme.space[10]};
  text-align: center;
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

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main>
        <Container>
          <Box>
            <Title>페이지를 찾을 수 없어요.</Title>
            <Desc>링크가 잘못됐거나, 프롬프트가 삭제됐을 수 있어요.</Desc>
            <div style={{ marginTop: 24 }}>
              <Link href="/">
                <Button type="button" $variant="primary">
                  홈으로
                </Button>
              </Link>
            </div>
          </Box>
        </Container>
      </main>
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";

import type { CreatePromptInput, PromptCategory } from "@/types/prompt";
import { Button, Card, Input, Pill, Textarea } from "@/components/ui";

const Wrap = styled(Card)`
  padding: ${({ theme }) => theme?.space?.[8] ?? "32px"};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme?.space?.[5] ?? "20px"};
`;

const Title = styled.h1`
  margin: 0;
  font-size: 26px;
  letter-spacing: -0.8px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme?.space?.[4] ?? "16px"};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: ${({ theme }) => theme?.color?.text2 ?? "rgba(238, 241, 247, 0.72)"};
  font-size: 13px;
`;

const Select = styled.select`
  width: 100%;
  background: ${({ theme }) => theme?.color?.panel ?? "rgba(255, 255, 255, 0.06)"};
  border: 1px solid ${({ theme }) => theme?.color?.border ?? "rgba(255, 255, 255, 0.10)"};
  color: ${({ theme }) => theme?.color?.text ?? "#EEF1F7"};
  border-radius: ${({ theme }) => theme?.radius?.md ?? "14px"};
  padding: 10px 12px;
`;

const Help = styled.p`
  margin: 0;
  color: ${({ theme }) => theme?.color?.text2 ?? "rgba(238, 241, 247, 0.72)"};
  line-height: 1.6;
`;

const ErrorText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme?.color?.danger ?? "#FF5C7A"};
`;

const categories: PromptCategory[] = [
  "Writing",
  "Coding",
  "Marketing",
  "Product",
  "Design",
  "Career",
  "Other",
];

export function NewPromptForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [tags, setTags] = useState("productivity, template");
  const [category, setCategory] = useState<PromptCategory>("Writing");
  const [authorName, setAuthorName] = useState("");

  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const tagList = useMemo(
    () =>
      tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 12),
    [tags],
  );

  const canSubmit = title.trim() && description.trim() && prompt.trim() && category;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError(null);

    const payload: CreatePromptInput = {
      title,
      description,
      prompt,
      tags: tagList,
      category,
      authorName: authorName.trim() || "Anonymous",
    };

    const res = await fetch("/api/prompts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const json = (await res.json().catch(() => null)) as { error?: string } | null;
      setStatus("error");
      setError(json?.error ?? "저장에 실패했어요. 입력값을 확인해주세요.");
      return;
    }

    const json = (await res.json()) as { prompt: { id: string } };
    setStatus("saved");
    window.location.href = `/p/${json.prompt.id}`;
  }

  return (
    <Wrap>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <Title>프롬프트 공유</Title>
        <Pill>빠르게</Pill>
        <Pill>미니멀하게</Pill>
      </div>

      <Help>
        재사용 가능한 형태로 작성해주세요. 설명은 “언제 쓰면 좋은지”, 프롬프트 본문은 “바로
        복사해서 쓸 수 있게” 적는 게 좋아요.
      </Help>

      <form onSubmit={onSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Row>
            <Label>
              제목
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </Label>
            <Label>
              작성자(선택)
              <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
            </Label>
          </Row>

          <Label>
            한 줄 설명
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Label>

          <Row>
            <Label>
              카테고리
              <Select value={category} onChange={(e) => setCategory(e.target.value as PromptCategory)}>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Label>
            <Label>
              태그(쉼표로 구분)
              <Input value={tags} onChange={(e) => setTags(e.target.value)} />
            </Label>
          </Row>

          <Label>
            프롬프트 본문
            <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} required />
          </Label>

          {status === "error" ? <ErrorText role="alert">{error}</ErrorText> : null}

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <Button type="submit" $variant="primary" disabled={!canSubmit || status === "saving"}>
              {status === "saving" ? "저장 중…" : "게시하기"}
            </Button>
            <Pill>최대 12 태그</Pill>
          </div>
        </div>
      </form>
    </Wrap>
  );
}


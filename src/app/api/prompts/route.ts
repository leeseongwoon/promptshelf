import { NextResponse } from "next/server";

import type { CreatePromptInput } from "@/types/prompt";
import { createPrompt, listPrompts } from "@/server/prompt-store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const sort = (searchParams.get("sort") as "trending" | "new" | null) ?? undefined;

  const prompts = await listPrompts({ q, tag, category, sort });
  return NextResponse.json({ prompts });
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<CreatePromptInput>;

  if (!body.title || !body.description || !body.prompt || !body.category) {
    return NextResponse.json(
      { error: "Missing required fields: title, description, prompt, category" },
      { status: 400 },
    );
  }

  const created = await createPrompt({
    title: body.title,
    description: body.description,
    prompt: body.prompt,
    category: body.category,
    tags: Array.isArray(body.tags) ? body.tags : [],
    authorName: body.authorName ?? "Anonymous",
  });

  return NextResponse.json({ prompt: created }, { status: 201 });
}


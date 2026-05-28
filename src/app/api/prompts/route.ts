import { NextResponse } from "next/server";

import { listPrompts } from "@/server/prompt-store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;
  const kind = searchParams.get("kind") ?? undefined;
  const model = searchParams.get("model") ?? undefined;
  const sort = (searchParams.get("sort") as "trending" | "new" | null) ?? undefined;

  const prompts = await listPrompts({ q, tag, kind, model, sort });
  return NextResponse.json({ prompts });
}

export async function POST(req: Request) {
  void req;
  return NextResponse.json({ error: "Prompt creation is disabled" }, { status: 405 });
}


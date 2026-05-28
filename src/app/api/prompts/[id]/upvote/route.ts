import { NextResponse } from "next/server";

import { upvotePrompt } from "@/server/prompt-store";

export async function POST(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const prompt = await upvotePrompt(id);
  if (!prompt) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ prompt });
}


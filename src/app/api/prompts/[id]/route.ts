import { NextResponse } from "next/server";

import type { UpdatePromptInput } from "@/types/prompt";
import { getPrompt, updatePrompt } from "@/server/prompt-store";

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const prompt = await getPrompt(id);
  if (!prompt) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ prompt });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = (await req.json()) as UpdatePromptInput;
  const updated = await updatePrompt(id, body);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ prompt: updated });
}


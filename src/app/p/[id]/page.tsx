import { notFound } from "next/navigation";

import { getPrompt } from "@/server/prompt-store";
import { PromptDetailView } from "@/features/prompt-detail/prompt-detail-view";

export default async function PromptDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prompt = await getPrompt(id);
  if (!prompt) notFound();

  return <PromptDetailView prompt={prompt} />;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prompt = await getPrompt(id);
  if (!prompt) return {};
  return {
    title: `${prompt.title} · PromptShelf`,
    description: prompt.description,
  };
}

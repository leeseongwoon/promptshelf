import type { Prompt } from "@/types/prompt";
import { listPrompts } from "@/server/prompt-store";
import { PromptFeedView } from "@/features/prompt-feed/prompt-feed-view";

export async function PromptFeed({
  q,
  tag,
  category,
  sort,
}: {
  q?: string;
  tag?: string;
  category?: string;
  sort?: string;
}) {
  const prompts: Prompt[] = await listPrompts({
    q,
    tag,
    category,
    sort: sort === "new" ? "new" : "trending",
  });

  return <PromptFeedView prompts={prompts} />;
}

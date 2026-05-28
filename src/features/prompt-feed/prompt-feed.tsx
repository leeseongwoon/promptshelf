import type { Prompt } from "@/types/prompt";
import { listPrompts } from "@/server/prompt-store";
import { PromptFeedView } from "@/features/prompt-feed/prompt-feed-view";

export async function PromptFeed({
  q,
  tag,
  kind,
  model,
  sort,
}: {
  q?: string;
  tag?: string;
  kind?: string;
  model?: string;
  sort?: string;
}) {
  const prompts: Prompt[] = await listPrompts({
    q,
    tag,
    kind,
    model,
    sort: sort === "new" ? "new" : "trending",
  });

  return <PromptFeedView prompts={prompts} />;
}

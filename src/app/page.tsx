import { SiteHeader } from "@/components/site-header";
import { Container } from "@/components/ui";
import { PromptFeed } from "@/features/prompt-feed/prompt-feed";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const tag = typeof sp.tag === "string" ? sp.tag : undefined;
  const kind = typeof sp.kind === "string" ? sp.kind : undefined;
  const model = typeof sp.model === "string" ? sp.model : undefined;
  const sort = typeof sp.sort === "string" ? sp.sort : undefined;

  return (
    <>
      <SiteHeader defaultQuery={q} tag={tag} defaultKind={kind} defaultModel={model} />
      <main>
        <Container>
          <PromptFeed q={q} tag={tag} kind={kind} model={model} sort={sort} />
        </Container>
      </main>
    </>
  );
}

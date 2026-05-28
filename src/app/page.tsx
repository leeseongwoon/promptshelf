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
  const category = typeof sp.category === "string" ? sp.category : undefined;
  const sort = typeof sp.sort === "string" ? sp.sort : undefined;

  return (
    <>
      <SiteHeader defaultQuery={q} tag={tag} />
      <main>
        <Container>
          <PromptFeed q={q} tag={tag} category={category} sort={sort} />
        </Container>
      </main>
    </>
  );
}

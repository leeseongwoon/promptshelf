import { SiteHeader } from "@/components/site-header";
import { Container } from "@/components/ui";
import { NewPromptForm } from "@/features/new-prompt/new-prompt-form";

export default function NewPromptPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Container>
          <NewPromptForm />
        </Container>
      </main>
    </>
  );
}


export type PromptCategory =
  | "Writing"
  | "Coding"
  | "Marketing"
  | "Product"
  | "Design"
  | "Career"
  | "Other";

export type Prompt = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  tags: string[];
  category: PromptCategory;
  authorName: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  upvotes: number;
};

export type CreatePromptInput = {
  title: string;
  description: string;
  prompt: string;
  tags: string[];
  category: PromptCategory;
  authorName: string;
};

export type UpdatePromptInput = Partial<
  Pick<CreatePromptInput, "title" | "description" | "prompt" | "tags" | "category">
>;


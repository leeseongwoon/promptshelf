export type PromptKindCategory =
  | "Code"
  | "Image"
  | "Writing"
  | "Video"
  | "Data"
  | "Productivity"
  | "Other";

export type AiModelCategory = "GPT" | "Claude" | "Gemini" | "Other";

export type Prompt = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  tags: string[];
  kind: PromptKindCategory;
  model: AiModelCategory;
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
  kind: PromptKindCategory;
  model: AiModelCategory;
  authorName: string;
};

export type UpdatePromptInput = Partial<
  Pick<CreatePromptInput, "title" | "description" | "prompt" | "tags" | "kind" | "model">
>;


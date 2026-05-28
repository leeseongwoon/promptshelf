import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

import type { AiModelCategory, CreatePromptInput, Prompt, PromptKindCategory, UpdatePromptInput } from "@/types/prompt";
import { resolvePromptBody } from "@/server/prompt-backfill";
import { createSeedPrompts } from "@/server/seed-prompts";

type PromptDbShape = {
  prompts: Prompt[];
};

const DB_PATH = path.join(process.cwd(), "data", "prompts.json");

async function ensureDbFile(): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  try {
    await fs.access(DB_PATH);
  } catch {
    const seed: PromptDbShape = { prompts: createSeedPrompts() };
    await fs.writeFile(DB_PATH, JSON.stringify(seed, null, 2), "utf8");
  }
}

async function readDb(): Promise<PromptDbShape> {
  await ensureDbFile();
  const raw = await fs.readFile(DB_PATH, "utf8");
  const parsed = JSON.parse(raw) as PromptDbShape;
  const prompts = Array.isArray(parsed.prompts) ? parsed.prompts : [];
  const normalized = prompts.map(normalizePrompt).filter(Boolean) as Prompt[];

  const needsPersist = prompts.some((p, i) => {
    const next = normalized[i];
    if (!p || !next) return false;
    const prevBody = typeof p.prompt === "string" ? p.prompt.trim() : "";
    return !prevBody && next.prompt.trim().length > 0;
  });

  if (needsPersist) {
    await writeDb({ prompts: normalized });
  }

  return { prompts: normalized };
}

function isKind(x: unknown): x is PromptKindCategory {
  return (
    x === "Code" ||
    x === "Image" ||
    x === "Writing" ||
    x === "Video" ||
    x === "Data" ||
    x === "Productivity" ||
    x === "Other"
  );
}

function isModel(x: unknown): x is AiModelCategory {
  return x === "GPT" || x === "Claude" || x === "Gemini" || x === "Other";
}

function mapLegacyCategoryToKind(category: unknown): PromptKindCategory {
  switch (category) {
    case "Coding":
      return "Code";
    case "Design":
      return "Image";
    case "Writing":
    case "Marketing":
    case "Career":
      return "Writing";
    case "Product":
      return "Productivity";
    default:
      return "Other";
  }
}

function normalizePrompt(p: any): Prompt | null {
  if (!p || typeof p !== "object") return null;
  const kind = isKind(p.kind) ? p.kind : mapLegacyCategoryToKind(p.category);
  const model = isModel(p.model) ? p.model : "GPT";
  const prompt = resolvePromptBody(p);
  return { ...p, kind, model, prompt } as Prompt;
}

async function writeDb(next: PromptDbShape): Promise<void> {
  await ensureDbFile();
  await fs.writeFile(DB_PATH, JSON.stringify(next, null, 2), "utf8");
}

export type ListPromptsQuery = {
  q?: string;
  tag?: string;
  kind?: string;
  model?: string;
  sort?: "trending" | "new";
};

export async function listPrompts(query: ListPromptsQuery = {}): Promise<Prompt[]> {
  const { prompts } = await readDb();
  const q = query.q?.trim().toLowerCase();
  const tag = query.tag?.trim().toLowerCase();
  const kind = query.kind?.trim();
  const model = query.model?.trim();

  const filtered = prompts.filter((p) => {
    const matchesQ =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.prompt.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q));
    const matchesTag = !tag || p.tags.some((t) => t.toLowerCase() === tag);
    const matchesKind = !kind || p.kind === kind;
    const matchesModel = !model || p.model === model;
    return matchesQ && matchesTag && matchesKind && matchesModel;
  });

  const sort = query.sort ?? "trending";
  if (sort === "new") {
    return filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  return filtered.sort((a, b) => b.upvotes - a.upvotes);
}

export async function getPrompt(id: string): Promise<Prompt | null> {
  const { prompts } = await readDb();
  return prompts.find((p) => p.id === id) ?? null;
}

export async function createPrompt(input: CreatePromptInput): Promise<Prompt> {
  const now = new Date().toISOString();
  const next: Prompt = {
    id: randomUUID(),
    title: input.title.trim(),
    description: input.description.trim(),
    prompt: input.prompt.trim(),
    tags: input.tags.map((t) => t.trim()).filter(Boolean).slice(0, 12),
    kind: input.kind,
    model: input.model,
    authorName: input.authorName.trim() || "Anonymous",
    createdAt: now,
    updatedAt: now,
    upvotes: 0,
  };

  const db = await readDb();
  db.prompts.unshift(next);
  await writeDb(db);
  return next;
}

export async function updatePrompt(id: string, patch: UpdatePromptInput): Promise<Prompt | null> {
  const db = await readDb();
  const idx = db.prompts.findIndex((p) => p.id === id);
  if (idx < 0) return null;

  const prev = db.prompts[idx];
  const next: Prompt = {
    ...prev,
    ...(patch.title !== undefined ? { title: patch.title.trim() } : null),
    ...(patch.description !== undefined ? { description: patch.description.trim() } : null),
    ...(patch.prompt !== undefined ? { prompt: patch.prompt.trim() } : null),
    ...(patch.tags !== undefined
      ? { tags: patch.tags.map((t) => t.trim()).filter(Boolean).slice(0, 12) }
      : null),
    ...(patch.kind !== undefined ? { kind: patch.kind } : null),
    ...(patch.model !== undefined ? { model: patch.model } : null),
    updatedAt: new Date().toISOString(),
  };

  db.prompts[idx] = next;
  await writeDb(db);
  return next;
}

export async function upvotePrompt(id: string): Promise<Prompt | null> {
  const db = await readDb();
  const idx = db.prompts.findIndex((p) => p.id === id);
  if (idx < 0) return null;
  db.prompts[idx] = { ...db.prompts[idx], upvotes: db.prompts[idx].upvotes + 1 };
  await writeDb(db);
  return db.prompts[idx];
}


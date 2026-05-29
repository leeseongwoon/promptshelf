const kindMap: Record<string, { emoji: string; label: string }> = {
  Code: { emoji: "💻", label: "코딩" },
  Image: { emoji: "🎨", label: "그림" },
  Writing: { emoji: "✍️", label: "글쓰기" },
  Video: { emoji: "🎬", label: "영상" },
  Data: { emoji: "📊", label: "데이터" },
  Productivity: { emoji: "✨", label: "생산성" },
  Other: { emoji: "🌷", label: "기타" },
};

const modelMap: Record<string, { emoji: string; label: string }> = {
  GPT: { emoji: "🤖", label: "GPT" },
  Claude: { emoji: "🐱", label: "Claude" },
  Gemini: { emoji: "💎", label: "Gemini" },
  Other: { emoji: "🫧", label: "기타" },
};

export function formatKind(kind: string) {
  const item = kindMap[kind] ?? { emoji: "🌷", label: kind };
  return `${item.emoji} ${item.label}`;
}

export function formatModel(model: string) {
  const item = modelMap[model] ?? { emoji: "🫧", label: model };
  return `${item.emoji} ${item.label}`;
}

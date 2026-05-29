"use client";

import { useEffect, useId, useRef, useState } from "react";
import styled from "styled-components";

export type FilterSelectOption = {
  value: string;
  label: string;
};

const Wrap = styled.div`
  position: relative;
  flex: 1 1 120px;
  min-width: 0;
`;

const Trigger = styled.button<{ $open: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 40px;
  padding: 10px 14px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: rgba(255, 255, 255, 0.92);
  color: ${({ theme }) => theme.color.text};
  font-weight: 600;
  font-size: 14px;
  line-height: 1.2;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(255, 143, 171, 0.12);
  text-align: left;
  transition:
    box-shadow 0.15s ease,
    background 0.15s ease;

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 4px ${({ theme }) => theme.color.brandSoft};
  }

  ${({ $open, theme }) =>
    $open &&
    `
    box-shadow: 0 0 0 3px ${theme.color.brandSoft};
  `}

  @media (max-width: 720px) {
    min-height: 34px;
    padding: 6px 10px;
    font-size: 12px;
    font-weight: 550;
    border-radius: ${({ theme }) => theme.radius.sm};
    box-shadow: 0 3px 10px rgba(255, 143, 171, 0.1);
  }
`;

const Label = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Chevron = styled.span<{ $open: boolean }>`
  flex-shrink: 0;
  font-size: 10px;
  color: ${({ theme }) => theme.color.text2};
  transform: rotate(${({ $open }) => ($open ? "180deg" : "0")});
  transition: transform 0.2s ease;
`;

const Menu = styled.ul`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 60;
  margin: 0;
  padding: 6px;
  list-style: none;
  background: ${({ theme }) => theme.color.panel};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.md};
  max-height: min(280px, 50vh);
  overflow-y: auto;
  overscroll-behavior: contain;
  animation: menuIn 0.18s ease;

  @keyframes menuIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const MenuItem = styled.li<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 13px;
  font-weight: ${({ $selected }) => ($selected ? 700 : 550)};
  color: ${({ theme }) => theme.color.text};
  cursor: pointer;
  background: ${({ theme, $selected }) => ($selected ? theme.color.brandSoft : "transparent")};
  transition: background 0.12s ease;

  &:hover {
    background: ${({ theme, $selected }) =>
      $selected ? theme.color.brandSoft : theme.color.panel2};
  }

  @media (max-width: 720px) {
    padding: 9px 10px;
    font-size: 12px;
  }
`;

const Check = styled.span`
  margin-left: auto;
  font-size: 12px;
  color: ${({ theme }) => theme.color.brand};
`;

export function FilterSelect({
  name,
  defaultValue = "",
  options,
  "aria-label": ariaLabel,
  open,
  onOpenChange,
}: {
  name: string;
  defaultValue?: string;
  options: FilterSelectOption[];
  "aria-label"?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(defaultValue);
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  function setOpen(next: boolean) {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (!isOpen) return;

    function onPointerDown(e: PointerEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const selected =
    options.find((o) => o.value === value) ?? options[0] ?? { value: "", label: "선택" };

  return (
    <Wrap ref={wrapRef}>
      <input type="hidden" name={name} value={value} />
      <Trigger
        type="button"
        $open={isOpen}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => setOpen(!isOpen)}
      >
        <Label>{selected.label}</Label>
        <Chevron $open={isOpen} aria-hidden>
          ▾
        </Chevron>
      </Trigger>

      {isOpen ? (
        <Menu id={listId} role="listbox" aria-label={ariaLabel}>
          {options.map((opt) => {
            const selectedItem = opt.value === value;
            return (
              <MenuItem
                key={opt.value || "__all__"}
                role="option"
                aria-selected={selectedItem}
                $selected={selectedItem}
                onClick={() => {
                  setValue(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
                {selectedItem ? <Check aria-hidden>✓</Check> : null}
              </MenuItem>
            );
          })}
        </Menu>
      ) : null}
    </Wrap>
  );
}

export const KIND_FILTER_OPTIONS: FilterSelectOption[] = [
  { value: "", label: "📎 전체" },
  { value: "Code", label: "💻 코딩" },
  { value: "Image", label: "🎨 그림" },
  { value: "Writing", label: "✍️ 글" },
  { value: "Video", label: "🎬 영상" },
  { value: "Data", label: "📊 데이터" },
  { value: "Productivity", label: "✨ 생산성" },
  { value: "Other", label: "🌷 기타" },
];

export const MODEL_FILTER_OPTIONS: FilterSelectOption[] = [
  { value: "", label: "🫧 전체" },
  { value: "GPT", label: "🤖 GPT" },
  { value: "Claude", label: "🐱 Claude" },
  { value: "Gemini", label: "💎 Gemini" },
  { value: "Other", label: "✨ 기타" },
];

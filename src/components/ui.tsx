"use client";

import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space[6]} ${({ theme }) => theme.space[5]};

  @media (max-width: 720px) {
    padding: ${({ theme }) => theme.space[5]} ${({ theme }) => theme.space[4]};
  }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.color.panel};
  border: none;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm}, ${({ theme }) => theme.shadow.inset};
  transition:
    box-shadow 0.25s ease,
    transform 0.25s ease;
`;

export const Button = styled.button<{ $variant?: "primary" | "ghost" | "danger" }>`
  border: none;
  border-radius: ${({ theme }) => theme.radius.pill};
  padding: 11px 20px;
  cursor: pointer;
  font-weight: 700;
  letter-spacing: -0.2px;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    opacity 0.18s ease;

  background: ${({ theme, $variant }) =>
    $variant === "primary"
      ? `linear-gradient(135deg, ${theme.color.brand} 0%, ${theme.color.brand2} 100%)`
      : $variant === "danger"
        ? theme.color.danger
        : theme.color.panel2};
  color: ${({ theme, $variant }) =>
    $variant === "ghost" ? theme.color.text : theme.color.onPrimary};
  box-shadow: ${({ $variant }) =>
    $variant === "primary" ? "0 8px 20px rgba(255, 143, 171, 0.32)" : "none"};

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const GhostButton = styled(Button).attrs({ $variant: "ghost" })`
  color: ${({ theme }) => theme.color.text};
  background: ${({ theme }) => theme.color.panel2};
  box-shadow: none;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.color.brandSoft};
  }
`;

export const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.92);
  border: 2px solid transparent;
  color: ${({ theme }) => theme.color.text};
  border-radius: ${({ theme }) => theme.radius.pill};
  padding: 12px 18px;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.brand};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.color.brandSoft};
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  background: ${({ theme }) => theme.color.panel};
  border: 2px solid transparent;
  color: ${({ theme }) => theme.color.text};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 14px 16px;
  min-height: 140px;
  resize: vertical;
  box-shadow: ${({ theme }) => theme.shadow.sm};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.brand};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.color.brandSoft};
  }
`;

export const Pill = styled.span<{ $tone?: "pink" | "lavender" | "mint" | "plain" }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 7px 14px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: none;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.1px;
  background: ${({ theme, $tone }) =>
    $tone === "lavender"
      ? theme.color.panel3
      : $tone === "mint"
        ? "#E8F8F0"
        : $tone === "plain"
          ? "rgba(255, 255, 255, 0.75)"
          : theme.color.panel2};
  color: ${({ theme }) => theme.color.text};
  box-shadow: 0 4px 12px rgba(255, 143, 171, 0.1);
`;

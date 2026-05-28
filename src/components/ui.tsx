"use client";

import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: ${({ theme }) => theme?.space?.[8] ?? "32px"};

  @media (max-width: 720px) {
    padding: ${({ theme }) => theme?.space?.[5] ?? "20px"};
  }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme?.color?.panel ?? "rgba(255, 255, 255, 0.06)"};
  border: 1px solid ${({ theme }) => theme?.color?.border ?? "rgba(255, 255, 255, 0.10)"};
  border-radius: ${({ theme }) => theme?.radius?.lg ?? "18px"};
  box-shadow: ${({ theme }) => theme?.shadow?.sm ?? "0 10px 30px rgba(0, 0, 0, 0.35)"};
`;

export const Button = styled.button<{ $variant?: "primary" | "ghost" | "danger" }>`
  border: 1px solid ${({ theme }) => theme?.color?.border ?? "rgba(255, 255, 255, 0.10)"};
  border-radius: ${({ theme }) => theme?.radius?.md ?? "14px"};
  padding: 10px 12px;
  cursor: pointer;
  background: ${({ theme, $variant }) =>
    $variant === "primary"
      ? `linear-gradient(135deg, ${theme?.color?.brand ?? "#7C5CFF"}, ${theme?.color?.brand2 ?? "#35D0FF"})`
      : $variant === "danger"
        ? theme?.color?.danger ?? "#FF5C7A"
        : theme?.color?.panel ?? "rgba(255, 255, 255, 0.06)"};
  color: ${({ theme, $variant }) =>
    $variant === "ghost" ? theme?.color?.text ?? "#EEF1F7" : "#0B0D12"};
  font-weight: 650;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const GhostButton = styled(Button).attrs({ $variant: "ghost" })`
  color: ${({ theme }) => theme?.color?.text ?? "#EEF1F7"};
  background: transparent;
`;

export const Input = styled.input`
  width: 100%;
  background: ${({ theme }) => theme?.color?.panel ?? "rgba(255, 255, 255, 0.06)"};
  border: 1px solid ${({ theme }) => theme?.color?.border ?? "rgba(255, 255, 255, 0.10)"};
  color: ${({ theme }) => theme?.color?.text ?? "#EEF1F7"};
  border-radius: ${({ theme }) => theme?.radius?.md ?? "14px"};
  padding: 10px 12px;
`;

export const Textarea = styled.textarea`
  width: 100%;
  background: ${({ theme }) => theme?.color?.panel ?? "rgba(255, 255, 255, 0.06)"};
  border: 1px solid ${({ theme }) => theme?.color?.border ?? "rgba(255, 255, 255, 0.10)"};
  color: ${({ theme }) => theme?.color?.text ?? "#EEF1F7"};
  border-radius: ${({ theme }) => theme?.radius?.md ?? "14px"};
  padding: 10px 12px;
  min-height: 140px;
  resize: vertical;
`;

export const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme?.color?.panel2 ?? "rgba(255, 255, 255, 0.10)"};
  border: 1px solid ${({ theme }) => theme?.color?.border ?? "rgba(255, 255, 255, 0.10)"};
  color: ${({ theme }) => theme?.color?.text2 ?? "rgba(238, 241, 247, 0.72)"};
  font-size: 13px;
`;


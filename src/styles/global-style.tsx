/**
 * GlobalStyle is intentionally minimal: typography, layout defaults,
 * and a11y-friendly focus styles. Component-specific styling lives with components.
 */
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: light;
  }

  html, body {
    height: 100%;
  }

  body {
    margin: 0;
    background: ${({ theme }) => theme.color.bg};
    background-image:
      radial-gradient(ellipse 90% 60% at 10% 0%, ${({ theme }) => theme.color.bgAccent}66 0%, transparent 55%),
      radial-gradient(ellipse 80% 50% at 95% 8%, ${({ theme }) => theme.color.brandSoft}99 0%, transparent 48%),
      radial-gradient(circle at 50% 100%, ${({ theme }) => theme.color.panel3}44 0%, transparent 40%);
    color: ${({ theme }) => theme.color.text};
    font-family: ${({ theme }) => theme.font.sans};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button, input, textarea, select {
    font: inherit;
  }

  ::placeholder {
    color: ${({ theme }) => theme?.color?.text2 ?? "#8A7382"};
    opacity: 0.85;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme?.color?.brand ?? "#FF8FAB"};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

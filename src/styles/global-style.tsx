/**
 * GlobalStyle is intentionally minimal: typography, layout defaults,
 * and a11y-friendly focus styles. Component-specific styling lives with components.
 */
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: dark;
  }

  html, body {
    height: 100%;
  }

  body {
    margin: 0;
    background: ${({ theme }) => theme?.color?.bg ?? "#0B0D12"};
    color: ${({ theme }) => theme?.color?.text ?? "#EEF1F7"};
    font-family: ${({ theme }) =>
      theme?.font?.sans ??
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"};
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

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme?.color?.brand2 ?? "#35D0FF"};
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


"use client";

import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";
import { ServerStyleSheet, StyleSheetManager, ThemeProvider } from "styled-components";

import { GlobalStyle } from "@/styles/global-style";
import { theme } from "@/styles/theme";

export function StyledComponentsProvider({ children }: { children: React.ReactNode }) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  const tree = (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );

  if (typeof window !== "undefined") return tree;

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>{tree}</StyleSheetManager>
  );
}

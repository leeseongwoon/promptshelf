import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { StyledComponentsProvider } from "@/lib/styled-components-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PromptShelf",
  description:
    "Discover, share, and reuse high-quality AI prompts — fast, minimal, and community-driven.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `body{margin:0;background:#0B0D12;color:#EEF1F7;font-family:var(--font-geist-sans),system-ui,sans-serif;}`,
          }}
        />
      </head>
      <body>
        <StyledComponentsProvider>{children}</StyledComponentsProvider>
      </body>
    </html>
  );
}

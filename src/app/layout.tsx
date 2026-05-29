import type { Metadata } from "next";
import { Gowun_Dodum } from "next/font/google";

import { StyledComponentsProvider } from "@/lib/styled-components-provider";

const gowun = Gowun_Dodum({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gowun",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PromptShelf",
  description: "과제·일기·취미까지, 바로 복사해서 쓰는 프롬프트 모음집",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={gowun.variable}>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `body{margin:0;background:#FFF7FA;color:#4A3D47;font-family:var(--font-gowun),"Apple SD Gothic Neo","Malgun Gothic",sans-serif;}`,
          }}
        />
      </head>
      <body>
        <StyledComponentsProvider>{children}</StyledComponentsProvider>
      </body>
    </html>
  );
}

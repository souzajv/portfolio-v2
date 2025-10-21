import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import Squares from "@/components/Squares";
import "./globals.css";

export const metadata: Metadata = {
  title: "João [Portfólio]",
  description: "Frontend Developer e UX/UI Designer",
};

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${jetbrainsMono.variable} antialiased bg-background text-foreground`}>
        <div className="relative min-h-screen">
          <div className="pointer-events-none fixed inset-0 -z-10">
            <Squares
              direction="diagonal"
              speed={0.5}
              borderColor="rgba(241, 244, 248, 0.4)"
              hoverFillColor={null}
              squareSize={60}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(12,14,18,0.55)_0%,rgba(12,14,18,0.7)_45%,rgba(12,14,18,0.85)_100%)]" />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}

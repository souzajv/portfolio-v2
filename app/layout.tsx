import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import Squares from "@/components/Squares";
import BlobCursor from '@/components/BlobCursor';
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
        <style>{`html, body { cursor: none; }`}</style>
        <div className="relative min-h-screen">
          <div className="pointer-events-none fixed inset-0 z-50">
            <BlobCursor
              blobType="square"
              fillColor="#4b5563"
              trailCount={3}
              sizes={[28, 48, 30]}
              innerSizes={[8, 14, 10]}
              innerColor="rgba(255,255,255,0.06)"
              opacities={[0.95, 0.8, 0.65]}
              shadowColor="rgba(0,0,0,0.45)"
              shadowBlur={3}
              shadowOffsetX={3}
              shadowOffsetY={3}
              useFilter={false}
              fastDuration={0.03}
              slowDuration={0.55}
              zIndex={9999}
            />
          </div>
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

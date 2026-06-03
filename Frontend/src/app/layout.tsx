import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";

export const metadata: Metadata = {
  title: {
    default: "LumiBooks - Where books become experiences",
    template: "%s | LumiBooks"
  },
  description: "A cinematic online book store and AI reading platform with intelligent discovery, immersive reading, and community features."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="noise antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

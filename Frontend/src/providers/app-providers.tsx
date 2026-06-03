"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ReactNode, useState } from "react";
import Lenis from "lenis";
import { useEffect } from "react";

function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08 });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ClerkProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <QueryClientProvider client={queryClient}>
          <SmoothScroll />
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}

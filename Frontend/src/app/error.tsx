"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <p className="font-bold text-[#FF4ECD]">500</p>
        <h1 className="mt-4 text-5xl font-black">This page lost its place.</h1>
        <p className="mt-4 text-[#1E1E1E]/68">Give the library a second to gather itself.</p>
        <Button className="mt-8" variant="glow" onClick={reset}>
          Try the Chapter Again
        </Button>
      </div>
    </main>
  );
}

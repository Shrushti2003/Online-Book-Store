import { ReaderLayout } from "@/components/reader-layout";
import { SiteHeader } from "@/components/site-header";
import { Suspense } from "react";

export const metadata = { title: "Reader" };

export default function ReaderPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell pt-28 pb-20">
        <p className="font-bold text-[#7B61FF]">Preparing immersive reading mode...</p>
        <h1 className="mb-8 text-5xl font-black">Read without the world getting loud.</h1>
        <Suspense fallback={<div className="h-96 animate-pulse rounded-[8px] bg-white/60" />}>
          <ReaderLayout />
        </Suspense>
      </main>
    </>
  );
}

import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell pt-28 pb-20">
        <h1 className="max-w-4xl text-6xl font-black">A premium AI-powered digital universe for readers.</h1>
        <p className="mt-6 max-w-3xl text-xl leading-9 text-[#1E1E1E]/70">LumiBooks is designed for people who want more than a catalog. It brings discovery, reading, notes, voice, OCR, translation, summaries, and community into one emotionally intelligent platform.</p>
      </main>
    </>
  );
}

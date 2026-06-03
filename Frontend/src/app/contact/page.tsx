import { Mail } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell pt-28 pb-20">
        <Mail className="mb-4 text-[#FF4ECD]" />
        <h1 className="max-w-3xl text-5xl font-black">Tell us what your library needs next.</h1>
        <form className="mt-8 max-w-2xl space-y-4">
          <input className="h-13 w-full rounded-[8px] border border-black/10 bg-white/62 px-4 outline-none" placeholder="reader@lumibooks.app" />
          <textarea className="min-h-40 w-full rounded-[8px] border border-black/10 bg-white/62 p-4 outline-none" placeholder="Share the chapter we should help with..." />
          <Button variant="glow">Send Message</Button>
        </form>
      </main>
    </>
  );
}

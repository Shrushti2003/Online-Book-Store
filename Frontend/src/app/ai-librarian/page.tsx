import { Bot, Send } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { aiMessages } from "@/lib/content";

export const metadata = { title: "AI Librarian" };

export default function AiLibrarianPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell grid gap-6 pt-28 pb-20 lg:grid-cols-[.85fr_1.15fr]">
        <section>
          <p className="font-bold text-[#7B61FF]">Calm, insightful, emotionally aware</p>
          <h1 className="mt-3 text-5xl font-black">Talk to a librarian that reads between the lines.</h1>
          <p className="mt-5 text-lg leading-8 text-[#1E1E1E]/70">Ask for summaries, character conversations, paragraph explanations, translations, or a reading path shaped around how you want to feel.</p>
        </section>
        <Card className="p-5">
          <div className="space-y-4">
            {aiMessages.map((message) => (
              <div key={message} className="rounded-[8px] bg-white/58 p-4">
                <Bot className="mb-2 text-[#FF4ECD]" size={18} />
                <p className="leading-7">{message}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <input className="h-12 flex-1 rounded-[8px] border border-black/10 bg-white/68 px-4 outline-none focus:border-[#7B61FF]" placeholder="Ask Lumi for a book that feels like midnight rain..." />
            <Button variant="glow" aria-label="Send message">
              <Send size={18} />
            </Button>
          </div>
        </Card>
      </main>
    </>
  );
}

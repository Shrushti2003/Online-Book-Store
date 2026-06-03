"use client";

import { useMemo, useState } from "react";
import { Bot, Sparkles } from "lucide-react";
import { aiMessages, featuredBooks } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const moods = ["Wonder", "Tender", "Haunted", "Focused", "Restless"];

export function RecommendationPanel() {
  const [mood, setMood] = useState("Wonder");
  const suggestion = useMemo(
    () => featuredBooks.find((book) => book.mood === mood) ?? featuredBooks[moods.indexOf(mood) % featuredBooks.length],
    [mood]
  );

  return (
    <Card className="grid gap-6 p-5 lg:grid-cols-[.9fr_1.1fr]">
      <div>
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#7B61FF]">
          <Bot size={18} /> AI Mood Recommendation Engine
        </div>
        <h2 className="text-3xl font-black">Your next obsession is waiting.</h2>
        <p className="mt-3 text-[#1E1E1E]/68">
          Tell Lumi what kind of emotional weather you want. The library adjusts the lights.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {moods.map((item) => (
            <Button key={item} variant={item === mood ? "glow" : "glass"} size="sm" onClick={() => setMood(item)}>
              {item}
            </Button>
          ))}
        </div>
      </div>
      <div className="rounded-[8px] border border-black/10 bg-white/54 p-5">
        <p className="mb-4 text-sm font-bold text-[#FF4ECD]">Lumi says</p>
        <p className="text-lg leading-8">{aiMessages[moods.indexOf(mood) % aiMessages.length]}</p>
        <div className="mt-5 flex items-center gap-4">
          <div className="h-24 w-16 rounded-[8px] shadow-xl" style={{ background: suggestion.cover }} />
          <div>
            <h3 className="text-xl font-black">{suggestion.title}</h3>
            <p className="text-sm text-[#766f6a]">{suggestion.author}</p>
            <Button className="mt-3" size="sm" variant="glass">
              <Sparkles size={16} /> Read Preview
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

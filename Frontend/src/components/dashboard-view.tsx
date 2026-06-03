"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Award, Bookmark, Flame, Goal, Sparkles } from "lucide-react";
import { dashboardInsights } from "@/lib/content";
import { BookCarousel } from "@/components/book-carousel";
import { Card } from "@/components/ui/card";
import type { Book } from "@/types/book";

const chartData = [
  { day: "Mon", pages: 42 },
  { day: "Tue", pages: 64 },
  { day: "Wed", pages: 38 },
  { day: "Thu", pages: 92 },
  { day: "Fri", pages: 84 },
  { day: "Sat", pages: 121 },
  { day: "Sun", pages: 77 }
];

export function DashboardView({ books }: { books: Book[] }) {
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setChartReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Reading streak", "7 days", Flame],
          ["Goal progress", "82%", Goal],
          ["Bookmarks", "36 saved", Bookmark],
          ["Rewards", "Nova Reader", Award]
        ].map(([label, value, Icon]) => (
          <Card key={label as string} className="magnetic p-5">
            <Icon className="mb-5 text-[#FF4ECD]" size={24} />
            <p className="text-sm text-[#766f6a]">{label as string}</p>
            <p className="text-2xl font-black">{value as string}</p>
          </Card>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <Card className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#7B61FF]">Reading Analytics</p>
              <h2 className="text-2xl font-black">Your focus peaks at night reading sessions.</h2>
            </div>
            <Sparkles className="text-[#3AEFFF]" />
          </div>
          <div className="h-64 min-h-64">
            {chartReady ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={240}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="pages" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#FF4ECD" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3AEFFF" stopOpacity={0.08} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="pages" stroke="#7B61FF" fill="url(#pages)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full rounded-[8px] bg-gradient-to-r from-[#FF4ECD]/15 via-[#7B61FF]/15 to-[#3AEFFF]/15" />
            )}
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-bold text-[#FF7B54]">AI Reading Notes</p>
          <div className="mt-4 space-y-3">
            {dashboardInsights.map((insight) => (
              <div key={insight} className="rounded-[8px] border border-black/10 bg-white/50 p-4 text-sm font-semibold">
                {insight}
              </div>
            ))}
          </div>
        </Card>
      </section>
      <section>
        <BookCarousel title="Continue Reading" books={books} />
      </section>
    </div>
  );
}

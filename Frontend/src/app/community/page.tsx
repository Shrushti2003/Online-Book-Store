import { Users } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Community" };

export default function CommunityPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell pt-28 pb-20">
        <Users className="mb-5 text-[#FF4ECD]" size={34} />
        <h1 className="max-w-4xl text-5xl font-black">Readers discovering worlds together.</h1>
        <div className="mt-8">
          <div className="grid gap-4 md:grid-cols-3">
            {["Join conversations beyond the final page.", "See what night readers are highlighting.", "Build clubs around moods, genres, and obsessions."].map((copy) => (
              <Card key={copy} className="magnetic p-6 text-lg font-bold leading-8">{copy}</Card>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

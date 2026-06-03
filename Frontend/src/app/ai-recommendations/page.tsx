import { RecommendationPanel } from "@/components/recommendation-panel";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "AI Recommendations" };

export default function AiRecommendationsPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell pt-28 pb-20">
        <p className="font-bold text-[#FF4ECD]">Curating your next obsession...</p>
        <h1 className="mb-8 max-w-4xl text-5xl font-black">Recommendations that understand mood, momentum, and the books that stayed with you.</h1>
        <RecommendationPanel />
      </main>
    </>
  );
}

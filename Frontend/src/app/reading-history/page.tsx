import { History } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SavedBooksGrid } from "@/components/saved-books-grid";

export const metadata = { title: "Reading History" };

export default function ReadingHistoryPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell pt-28 pb-20">
        <History className="mb-4 text-[#7B61FF]" />
        <p className="font-bold text-[#3AEFFF]">Recently opened books and reading activity.</p>
        <h1 className="mb-8 text-5xl font-black">Reading History</h1>
        <SavedBooksGrid storageKey="lumibooks:history" emptyText="Open a book detail page and Lumi will remember it here." />
      </main>
    </>
  );
}

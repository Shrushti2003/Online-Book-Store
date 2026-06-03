import { SiteHeader } from "@/components/site-header";
import { DashboardView } from "@/components/dashboard-view";
import { getTrendingBooks } from "@/lib/books";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const books = await getTrendingBooks();

  return (
    <>
      <SiteHeader />
      <main className="page-shell pt-28 pb-20">
        <p className="font-bold text-[#FF4ECD]">Good evening, reader</p>
        <h1 className="mb-8 text-5xl font-black">Your library is warming up.</h1>
        <DashboardView books={books.slice(0, 4)} />
      </main>
    </>
  );
}

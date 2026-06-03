import { User } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { DashboardView } from "@/components/dashboard-view";
import { getTrendingBooks } from "@/lib/books";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const books = await getTrendingBooks();

  return (
    <>
      <SiteHeader />
      <main className="page-shell pt-28 pb-20">
        <User className="mb-4 text-[#7B61FF]" />
        <h1 className="mb-8 text-5xl font-black">A profile shaped by every page you keep.</h1>
        <DashboardView books={books.slice(0, 4)} />
      </main>
    </>
  );
}

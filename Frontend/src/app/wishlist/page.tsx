import { SiteHeader } from "@/components/site-header";
import { SavedBooksGrid } from "@/components/saved-books-grid";

export const metadata = { title: "Wishlist" };

export default function WishlistPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell pt-28 pb-20">
        <p className="font-bold text-[#FF4ECD]">Your shelf is waiting for its first story.</p>
        <h1 className="mb-8 text-5xl font-black">Wishlist</h1>
        <SavedBooksGrid storageKey="lumibooks:wishlist" emptyText="Save a book from any detail page and it will appear here." />
      </main>
    </>
  );
}

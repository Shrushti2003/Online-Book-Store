import { SiteHeader } from "@/components/site-header";
import { DocumentReader } from "@/components/document-reader";

export const metadata = { title: "Document Reader" };

export default async function DocumentReaderPage({ searchParams }: { searchParams: Promise<{ type?: string; url?: string }> }) {
  const params = await searchParams;
  const type = params.type === "pdf" ? "pdf" : "epub";
  const url = params.url ?? "";

  return (
    <>
      <SiteHeader />
      <main className="page-shell pt-28 pb-20">
        <h1 className="mb-8 text-5xl font-black">Read without the world getting loud.</h1>
        {url ? <DocumentReader type={type} url={url} /> : <p className="font-bold text-red-700">No document URL was provided.</p>}
      </main>
    </>
  );
}

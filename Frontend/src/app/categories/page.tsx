import Link from "next/link";
import { Tags } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Card } from "@/components/ui/card";
import { genres } from "@/lib/content";

export const metadata = { title: "Categories" };

export default function CategoriesPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell pt-28 pb-20">
        <Tags className="mb-5 text-[#FF4ECD]" size={34} />
        <h1 className="max-w-4xl text-5xl font-black">Every genre portal in one place.</h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {genres.map((genre) => (
            <Link href={`/genres/${genre.slug}`} key={genre.slug}>
              <Card className="h-full p-5 transition hover:-translate-y-1">
                <p className="text-sm font-bold" style={{ color: genre.accent }}>{genre.tone}</p>
                <h2 className="mt-3 text-2xl font-black">{genre.name}</h2>
                <p className="mt-3 text-sm leading-6 text-[#1E1E1E]/68">{genre.copy}</p>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

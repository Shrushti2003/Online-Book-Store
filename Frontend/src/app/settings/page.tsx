import { Settings } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell pt-28 pb-20">
        <Settings className="mb-4 text-[#FF7B54]" />
        <h1 className="mb-8 text-5xl font-black">Tune the way Lumi reads with you.</h1>
        <div className="grid gap-4 md:grid-cols-2">
          {["Reading preferences", "AI assistant tone", "Privacy and sessions", "Storage and downloads"].map((item) => (
            <Card key={item} className="p-6 text-xl font-black">{item}</Card>
          ))}
        </div>
      </main>
    </>
  );
}

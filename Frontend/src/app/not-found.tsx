import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <p className="text-8xl font-black text-gradient">404</p>
        <h1 className="mt-4 text-5xl font-black">Looks like this chapter does not exist.</h1>
        <p className="mt-4 text-[#1E1E1E]/68">The story you are looking for vanished between worlds.</p>
        <Button asChild className="mt-8" variant="glow">
          <Link href="/">Return to LumiBooks</Link>
        </Button>
      </div>
    </main>
  );
}

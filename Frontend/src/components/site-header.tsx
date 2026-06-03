"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, ChevronDown, Heart, History, LogOut, Menu, Moon, Search, Settings, Sparkles, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { theme, setTheme } = useTheme();
  const { isSignedIn, user } = useUser();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-black/5 bg-[#FFF7ED]/72 backdrop-blur-2xl">
      <div className="page-shell flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-black tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#1E1E1E] text-[#FFF7ED]">
            <BookOpen size={18} />
          </span>
          LumiBooks
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-[#1E1E1E]/72 md:flex">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[#7B61FF]">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button aria-label="Search LumiBooks" asChild variant="glass" size="icon">
            <Link href="/search">
              <Search size={18} />
            </Link>
          </Button>
          <Button
            aria-label="Toggle theme"
            variant="glass"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          {isSignedIn ? (
            <div className="group relative hidden sm:block">
              <Button variant="glow">
                {user.imageUrl ? <Image alt="" className="rounded-full" height={24} src={user.imageUrl} width={24} /> : <User size={17} />}
                <span className="max-w-[160px] truncate">{greeting}, {user.firstName ?? "reader"}</span>
                <ChevronDown size={16} />
              </Button>
              <div className="invisible absolute right-0 top-12 w-56 translate-y-2 rounded-[8px] border border-black/10 bg-white/90 p-2 opacity-0 shadow-2xl backdrop-blur-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {[
                  ["/profile", "Profile", User],
                  ["/wishlist", "Wishlist", Heart],
                  ["/reading-history", "Reading History", History],
                  ["/settings", "Settings", Settings]
                ].map(([href, label, Icon]) => (
                  <Link key={href as string} className="flex items-center gap-2 rounded-[8px] px-3 py-2 text-sm font-bold hover:bg-black/5" href={href as string}>
                    <Icon size={16} /> {label as string}
                  </Link>
                ))}
                <SignOutButton>
                  <button className="flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-left text-sm font-bold text-red-600 hover:bg-red-500/10">
                    <LogOut size={16} /> Logout
                  </button>
                </SignOutButton>
              </div>
            </div>
          ) : (
            <Button asChild variant="glow" className="hidden sm:inline-flex">
              <Link href="/sign-up">
                <Sparkles size={17} />
                Enter Library
              </Link>
            </Button>
          )}
          <Button aria-label="Open navigation" variant="glass" size="icon" className="md:hidden">
            <Menu size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
}

 "use client";

import Link from "next/link";
import { Eye, EyeOff, Home, LayoutDashboard, Mail, Sparkles } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn, useSignUp, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const authCopy: Record<string, { title: string; body: string; action: string; aside: string }> = {
  "sign-in": {
    title: "Welcome back to your library.",
    body: "Continue where your imagination paused.",
    action: "Enter Library",
    aside: "Your shelves, notes, streaks, and AI companion are exactly where you left them."
  },
  "sign-up": {
    title: "Start building your reading universe.",
    body: "One account. Infinite stories.",
    action: "Create My Library",
    aside: "Personal shelves, immersive reading, character chats, and mood-aware recommendations unlock from the first session."
  },
  "forgot-password": {
    title: "Let us reopen the door.",
    body: "A reset link will help you return without losing your place.",
    action: "Send Reset Link",
    aside: "Your library is safe. We will only send the recovery chapter to your email."
  },
  "verify-email": {
    title: "Confirm your reading signal.",
    body: "One small step before the shelves light up.",
    action: "Verify Email",
    aside: "Verification protects your notes, bookmarks, rewards, and private reading history."
  },
  "reset-password": {
    title: "Create a stronger key.",
    body: "Choose a password worthy of an infinite library.",
    action: "Update Password",
    aside: "After this, Lumi will bring you straight back to your reading universe."
  }
};

export function AuthPanel({ mode }: { mode: keyof typeof authCopy }) {
  const copy = authCopy[mode];
  const router = useRouter();
  const { signIn, setActive: setSignInActive, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: signUpLoaded } = useSignUp();
  const { isSignedIn } = useUser();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [oauthLoading, setOauthLoading] = useState(false);

  const passwordScore = useMemo(() => {
    return [password.length >= 8, /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
  }, [password]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");

    if (isSignedIn) {
      router.push("/dashboard");
      return;
    }

    try {
      if (mode === "sign-up") {
        if (!signUpLoaded) return;
        if (!fullName.trim()) throw new Error("Add your full name.");
        if (passwordScore < 3) throw new Error("Use at least 8 characters with a number and mixed characters.");
        const created = await signUp.create({ emailAddress: email, password, unsafeMetadata: { fullName } });
        if (created.status === "complete") {
          await setSignUpActive({ session: created.createdSessionId });
          if (remember) window.localStorage.setItem("lumibooks:remember", email);
          router.push("/dashboard");
        } else {
          await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
          setStatus("Check your email for the verification code.");
          router.push("/verify-email");
        }
        return;
      }

      if (mode === "sign-in") {
        if (!signInLoaded) return;
        const result = await signIn.create({ identifier: email, password });
        if (result.status !== "complete") {
          setStatus("Additional verification is required.");
          return;
        }
        await setSignInActive({ session: result.createdSessionId });
        if (remember) window.localStorage.setItem("lumibooks:remember", email);
        router.push("/dashboard");
        return;
      }

      setStatus("This flow is ready for Clerk-hosted verification.");
    } catch (caught) {
      const clerkError = caught as { errors?: { longMessage?: string; message?: string }[]; message?: string };
      setError(clerkError.errors?.[0]?.longMessage ?? clerkError.errors?.[0]?.message ?? clerkError.message ?? "Authentication failed.");
    }
  }

  async function handleOAuth() {
    setError("");
    setStatus("");

    if (isSignedIn) {
      router.push("/dashboard");
      return;
    }

    setOauthLoading(true);
    setStatus("Opening Google authentication...");

    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      if (mode === "sign-up") {
        if (!signUpLoaded) throw new Error("Authentication is still loading.");
        await signUp.authenticateWithRedirect({ strategy: "oauth_google", redirectUrl, redirectUrlComplete: redirectUrl });
        return;
      }
      if (!signInLoaded) throw new Error("Authentication is still loading.");
      await signIn.authenticateWithRedirect({ strategy: "oauth_google", redirectUrl, redirectUrlComplete: redirectUrl });
    } catch (caught) {
      const clerkError = caught as { errors?: { longMessage?: string; message?: string }[]; message?: string };
      setError(clerkError.errors?.[0]?.longMessage ?? clerkError.errors?.[0]?.message ?? clerkError.message ?? "Google authentication failed.");
      setStatus("");
      setOauthLoading(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-24">
      <div className="absolute inset-0 -z-10 mesh" />
      {mode === "sign-in" || mode === "sign-up" ? (
        <div className="absolute left-4 right-4 top-4 z-10 grid gap-3 sm:left-8 sm:right-8 sm:top-8 sm:grid-cols-[auto_auto] sm:justify-between">
          <Button asChild variant="glass">
            <Link href="/">
              <Home size={17} /> Back to Home
            </Link>
          </Button>
          <Button asChild variant="glass">
            <Link href="/dashboard">
              <LayoutDashboard size={17} /> Back to Dashboard
            </Link>
          </Button>
        </div>
      ) : null}
      <Card className="grid w-full max-w-5xl overflow-hidden lg:grid-cols-[1fr_.85fr]">
        <section className="p-8 md:p-12">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/55 px-4 py-2 text-sm font-bold text-[#7B61FF]">
            <Sparkles size={16} /> LumiBooks secure access
          </p>
          <h1 className="text-4xl font-black md:text-6xl">{copy.title}</h1>
          <p className="mt-4 text-lg text-[#1E1E1E]/68">{copy.body}</p>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {mode === "sign-up" ? (
              <input
                className="h-13 w-full rounded-[8px] border border-black/10 bg-white/62 px-4 outline-none transition focus:border-[#FF4ECD] focus:shadow-[0_0_0_4px_rgba(255,78,205,.12)]"
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Full name"
                required
                value={fullName}
              />
            ) : null}
            <input
              className="h-13 w-full rounded-[8px] border border-black/10 bg-white/62 px-4 outline-none transition focus:border-[#FF4ECD] focus:shadow-[0_0_0_4px_rgba(255,78,205,.12)]"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="reader@lumibooks.app"
              required
              type="email"
              value={email}
            />
            {mode !== "forgot-password" && mode !== "verify-email" ? (
              <div className="relative">
                <input
                  className="h-13 w-full rounded-[8px] border border-black/10 bg-white/62 px-4 pr-12 outline-none transition focus:border-[#7B61FF] focus:shadow-[0_0_0_4px_rgba(123,97,255,.12)]"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Your private library key"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#766f6a] transition hover:bg-black/5"
                  onClick={() => setShowPassword((value) => !value)}
                  type="button"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            ) : null}
            {mode === "sign-up" ? (
              <div className="h-2 overflow-hidden rounded-full bg-black/10">
                <div className="h-full rounded-full bg-[#7B61FF] transition-all" style={{ width: `${passwordScore * 25}%` }} />
              </div>
            ) : null}
            {mode === "sign-up" ? <div id="clerk-captcha" /> : null}
            {mode === "sign-in" || mode === "sign-up" ? (
              <div className="flex items-center justify-between text-sm font-semibold text-[#766f6a]">
                <label className="flex items-center gap-2">
                  <input checked={remember} onChange={(event) => setRemember(event.target.checked)} type="checkbox" />
                  Remember me
                </label>
                {mode === "sign-in" ? <Link className="text-[#7B61FF]" href="/forgot-password">Forgot password?</Link> : null}
              </div>
            ) : null}
            {error ? <p className="rounded-[8px] bg-red-500/10 p-3 text-sm font-bold text-red-700">{error}</p> : null}
            {status ? <p className="rounded-[8px] bg-[#3AEFFF]/15 p-3 text-sm font-bold text-[#1E1E1E]">{status}</p> : null}
            <Button className="w-full" size="lg" variant="glow">
              {copy.action}
            </Button>
          </form>
          <div className="mt-4 grid gap-3">
            <Button disabled={oauthLoading} onClick={handleOAuth} type="button" variant="glass">
              <Mail size={17} /> {oauthLoading ? "Opening Google..." : "Continue with Google"}
            </Button>
            {mode === "sign-in" ? (
              <Button asChild variant="glass">
                <Link href="/sign-up">Create Account</Link>
              </Button>
            ) : null}
          </div>
        </section>
        <aside className="flex min-h-[420px] flex-col justify-end bg-[#1E1E1E] p-8 text-[#FFF7ED] md:p-12">
          <div className="mb-8 h-44 rounded-[8px] bg-[radial-gradient(circle_at_30%_20%,#3AEFFF,transparent_28%),radial-gradient(circle_at_70%_20%,#FF4ECD,transparent_30%),linear-gradient(135deg,#7B61FF,#1E1E1E)] shadow-2xl" />
          <p className="text-2xl font-black">{copy.aside}</p>
          <Link className="mt-6 text-sm font-bold text-[#3AEFFF]" href={mode === "sign-in" ? "/sign-up" : "/sign-in"}>
            {mode === "sign-in" ? "New here? Build your library" : "Already have a library? Sign in"}
          </Link>
        </aside>
      </Card>
    </main>
  );
}

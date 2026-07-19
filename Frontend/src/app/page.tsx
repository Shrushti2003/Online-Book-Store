import { getApiBaseUrl } from "@/lib/api";

export default function HomePage() {
  const landingApiBase = encodeURIComponent(getApiBaseUrl());

  return (
    <iframe
      className="block h-dvh w-full border-0 bg-[#fff7ed]"
      src={`/landing.html?v=clean&apiBase=${landingApiBase}`}
      title="LumiBooks landing page"
    />
  );
}

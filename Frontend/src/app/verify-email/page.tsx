import { redirect } from "next/navigation";

export const metadata = { title: "Verify Email" };

export default function VerifyEmailPage() {
  redirect("/sign-in");
}

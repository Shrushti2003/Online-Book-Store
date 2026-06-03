import { AuthPanel } from "@/components/auth-panel";

export const metadata = { title: "Verify Email" };

export default function VerifyEmailPage() {
  return <AuthPanel mode="verify-email" />;
}

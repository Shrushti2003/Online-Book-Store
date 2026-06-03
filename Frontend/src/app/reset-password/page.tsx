import { AuthPanel } from "@/components/auth-panel";

export const metadata = { title: "Reset Password" };

export default function ResetPasswordPage() {
  return <AuthPanel mode="reset-password" />;
}

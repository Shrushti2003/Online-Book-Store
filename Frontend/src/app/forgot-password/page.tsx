import { AuthPanel } from "@/components/auth-panel";

export const metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return <AuthPanel mode="forgot-password" />;
}

import { AuthPanel } from "@/components/auth-panel";

export const metadata = { title: "Sign In" };

export default function SignInPage() {
  return <AuthPanel mode="sign-in" />;
}

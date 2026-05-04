import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/AuthLayout";
import { AuthForm, AuthGate } from "@/components/AuthShell";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account — Horizon" },
      { name: "description", content: "Create your Horizon personal finance account." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  return (
    <AuthGate>
      <AuthLayout
        title="Create your account"
        subtitle="Set a username and password. Everything stays on this device."
        footer={
          <span>
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">
              Sign in
            </Link>
          </span>
        }
      >
        <AuthForm mode="signup" />
      </AuthLayout>
    </AuthGate>
  );
}

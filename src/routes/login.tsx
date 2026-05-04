import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/AuthLayout";
import { AuthForm, AuthGate } from "@/components/AuthShell";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Horizon" },
      { name: "description", content: "Sign in to your Horizon personal finance dashboard." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <AuthGate>
      <AuthLayout
        title="Welcome back"
        subtitle="Sign in to continue to your dashboard."
        footer={
          <span>
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">
              Create one
            </Link>
          </span>
        }
      >
        <AuthForm mode="login" />
      </AuthLayout>
    </AuthGate>
  );
}

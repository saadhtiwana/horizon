import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui-kit/Button";
import { AuthProvider } from "@/lib/auth";

function NotFoundComponent() {
  return (
    <AppShell>
      <div className="flex min-h-[80vh] items-center justify-center px-8">
        <div className="max-w-md text-center">
          <div
            className="text-[72px] font-semibold leading-none tracking-tight text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            404
          </div>
          <h2 className="mt-4 text-[18px] font-semibold text-foreground">Page not found</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
            The page you're looking for doesn't exist.
          </p>
          <div className="mt-6">
            <Link to="/">
              <Button>Back to Overview</Button>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Horizon — Personal Finance Dashboard" },
      {
        name: "description",
        content:
          "Horizon is a refined personal finance dashboard for tracking expenses, budgets, and savings.",
      },
      { name: "theme-color", content: "#fafaf7" },
      { name: "author", content: "Horizon" },
      { property: "og:title", content: "Horizon — Personal Finance" },
      {
        property: "og:description",
        content: "Track expenses, budgets, and savings with refined clarity.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=DM+Serif+Display&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

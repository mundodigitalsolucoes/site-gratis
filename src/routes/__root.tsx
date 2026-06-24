import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

const GTM_ID = import.meta.env.VITE_GTM_ID as string | undefined;
const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined;
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID as string | undefined;

type MetaFbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  push?: MetaFbq;
  loaded?: boolean;
  version?: string;
};

function addExternalScript(id: string, src: string, onload?: () => void) {
  if (typeof document === "undefined") return;

  const existing = document.getElementById(id) as HTMLScriptElement | null;
  if (existing) {
    onload?.();
    return;
  }

  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  if (onload) script.onload = onload;
  document.head.appendChild(script);
}

function installMetaPixel(pixelId: string) {
  const win = window as Window & { fbq?: MetaFbq; _fbq?: MetaFbq };

  if (!win.fbq) {
    const fbq: MetaFbq = (...args: unknown[]) => {
      if (fbq.callMethod) {
        fbq.callMethod(...args);
        return;
      }
      fbq.queue?.push(args);
    };
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    win.fbq = fbq;
    win._fbq = fbq;
  }

  addExternalScript("mds-meta-pixel", "https://connect.facebook.net/en_US/fbevents.js");
  win.fbq("init", pixelId);
  win.fbq("track", "PageView");
}

function installClarity(clarityId: string) {
  window.clarity = window.clarity || ((...args: unknown[]) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "clarity_call", args });
  });
  addExternalScript("mds-clarity", `https://www.clarity.ms/tag/${clarityId}`);
}

function TrackingScripts() {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];

    if (GTM_ID) {
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      addExternalScript("mds-gtm", `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`);
    }

    if (GA4_MEASUREMENT_ID) {
      window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer?.push(args as unknown as Record<string, unknown>));
      addExternalScript("mds-ga4", `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`, () => {
        window.gtag?.("js", new Date());
        window.gtag?.("config", GA4_MEASUREMENT_ID, { send_page_view: true });
      });
    }

    if (META_PIXEL_ID) installMetaPixel(META_PIXEL_ID);
    if (CLARITY_ID) installClarity(CLARITY_ID);
  }, []);

  return null;
}

function GtmNoscript() {
  if (!GTM_ID) return null;

  return (
    <noscript>
      <iframe
        title="Google Tag Manager"
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#2F3453" },
      { property: "og:site_name", content: "Mundo Digital Soluções" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        <GtmNoscript />
        {children}
        <TrackingScripts />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}

import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router"
import { ThemeProvider } from "@/components/ThemeProvider"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import SectionContainer from "@/components/SectionContainer"
import SearchProvider from "@/components/SearchProvider"
import Analytics from "@/components/Analytics"
import Link from "@/components/Link"

import appCss from "../styles.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Anto Subash - Blog" },
      {
        name: "description",
        content:
          "Full-stack developer passionate about web technologies, microservices, and modern software development.",
      },
      { name: "theme-color", content: "#1e2433" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "RSS Feed",
        href: "/feed.xml",
      },
      {
        rel: "icon",
        href: "/static/favicons/favicon.ico",
      },
      {
        rel: "apple-touch-icon",
        sizes: "76x76",
        href: "/static/favicons/apple-touch-icon.png",
      },
    ],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
  notFoundComponent: NotFoundComponent,
})

// Static theme detection script - no user input, safe to inline
const THEME_SCRIPT = `
try {
  const theme = localStorage.getItem('theme') || 'dark';
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
} catch (e) {}
`

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
        />
      </head>
      <body className="bg-background text-foreground antialiased">
        {children}
        <Analytics />
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  return (
    <ThemeProvider>
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main className="mb-auto flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <SearchProvider />
    </ThemeProvider>
  )
}

function NotFoundComponent() {
  return (
    <SectionContainer>
      <div className="flex flex-col items-start justify-start md:mt-24 md:flex-row md:items-center md:justify-center md:gap-6">
        <div className="pb-8 pt-6">
          <h1 className="text-6xl font-extrabold tracking-tight text-foreground md:border-r-2 md:border-border md:pr-6 md:text-8xl">
            404
          </h1>
        </div>
        <div className="max-w-md">
          <p className="mb-4 text-xl font-bold text-foreground md:text-2xl">
            Sorry we couldn&apos;t find this page.
          </p>
          <p className="mb-8 text-muted-foreground">
            But don&apos;t worry, you can find plenty of other things on our homepage.
          </p>
          <Link
            href="/"
            className="inline rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </SectionContainer>
  )
}

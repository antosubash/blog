import 'css/tailwind.css'
import 'pliny/search/algolia.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics, type AnalyticsConfig } from 'pliny/analytics'
import { type SearchConfig, SearchProvider } from 'pliny/search'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from './theme-providers'

const space_grotesk = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={siteMetadata.language}
      className={`${space_grotesk.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <link rel="icon" type="image/svg+xml" href="/static/favicons/favicon.svg" />
      <link rel="icon" type="image/x-icon" href="/static/favicons/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/static/favicons/apple-touch-icon.svg" />
      <link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/favicon-16x16.png" />
      <link rel="manifest" href="/static/favicons/site.webmanifest" />
      <link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#06b6d4" />
      <meta name="msapplication-TileColor" content="#06b6d4" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#06b6d4" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#06b6d4" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      {process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT && (
        <>
          <meta
            name="google-adsense-account"
            content={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT}
          />
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT}`}
            crossOrigin="anonymous"
          />
        </>
      )}
      <body className="bg-white text-gray-900 antialiased dark:bg-gray-900 dark:text-gray-100">
        <ThemeProviders>
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          <div className="flex min-h-screen flex-col">
            <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
              <Header />
              <main className="flex-1">{children}</main>
            </SearchProvider>
            <Footer />
          </div>
        </ThemeProviders>
      </body>
    </html>
  )
}

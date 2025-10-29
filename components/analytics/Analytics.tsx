'use client'

import Script from 'next/script'

interface GoogleAnalyticsConfig {
  googleAnalyticsId?: string
}

interface UmamiAnalyticsConfig {
  umamiWebsiteId?: string
  src?: string
}

interface AnalyticsConfig {
  googleAnalytics?: GoogleAnalyticsConfig
  umamiAnalytics?: UmamiAnalyticsConfig
}

interface AnalyticsProps {
  analyticsConfig?: AnalyticsConfig
}

export default function Analytics({ analyticsConfig }: AnalyticsProps) {
  if (!analyticsConfig) {
    return null
  }

  return (
    <>
      {analyticsConfig.googleAnalytics?.googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.googleAnalytics.googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${analyticsConfig.googleAnalytics.googleAnalyticsId}');
            `}
          </Script>
        </>
      )}

      {analyticsConfig.umamiAnalytics?.umamiWebsiteId && analyticsConfig.umamiAnalytics?.src && (
        <Script
          src={analyticsConfig.umamiAnalytics.src}
          data-website-id={analyticsConfig.umamiAnalytics.umamiWebsiteId}
          strategy="afterInteractive"
        />
      )}
    </>
  )
}

import siteMetadata from "@/config/siteMetadata"

// Analytics script component - only uses hardcoded/env-var values, no user input
export default function Analytics() {
  const gaId = siteMetadata.analytics?.googleAnalytics?.googleAnalyticsId
  const umamiId = siteMetadata.analytics?.umamiAnalytics?.umamiWebsiteId
  const umamiSrc = siteMetadata.analytics?.umamiAnalytics?.src
  const googleAnalyticsScript = gaId
    ? `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}');
      `
    : null

  return (
    <>
      {gaId && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          />
          {googleAnalyticsScript && <script>{googleAnalyticsScript}</script>}
        </>
      )}
      {umamiId && umamiSrc && (
        <script async defer data-website-id={umamiId} src={umamiSrc} />
      )}
    </>
  )
}

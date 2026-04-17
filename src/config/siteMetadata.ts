export const siteMetadata = {
  title: "Anto Subash",
  author: "Anto Subash",
  headerTitle: "Anto Subash",
  description:
    "Full-stack developer passionate about web technologies, microservices, and modern software development. Sharing insights on .NET, React, Docker, Kubernetes, and cloud-native solutions.",
  language: "en-us",
  theme: "system" as const,
  siteUrl: "https://blog.antosubash.com",
  siteRepo: "https://github.com/antosubash/blog",
  siteLogo: "/static/images/logo.png",
  socialBanner: "/static/images/logo.png",
  mastodon: "https://mastodon.social/@antosubash",
  email: "antosubash@live.com",
  github: "https://github.com/antosubash",
  twitter: "https://twitter.com/antosubash",
  facebook: "https://facebook.com/antosubash",
  youtube: "https://youtube.com/antosubash",
  linkedin: "https://www.linkedin.com/in/antosubash",
  threads: "https://www.threads.net/antosubash",
  instagram: "https://www.instagram.com/antosubash",
  locale: "en-US",
  analytics: {
    googleAnalytics: {
      googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
    },
    umamiAnalytics: {
      umamiWebsiteId: import.meta.env.VITE_UMAMI_ANALYTICS_ID,
      src: import.meta.env.VITE_UMAMI_ANALYTICS_URL,
    },
  },
  comments: {
    provider: "utterances" as const,
    utterancesConfig: {
      repo: "antosubash/blog-comments",
      issueTerm: "pathname" as const,
      label: "Comment 💬",
      theme: "github-light",
      darkTheme: "github-dark",
    },
  },
  search: {
    provider: "cmdk" as const,
    searchDocumentsPath: "search.json",
  },
}

export default siteMetadata

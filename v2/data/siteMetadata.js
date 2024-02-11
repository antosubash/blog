/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Anto Subash',
  author: 'Anto Subash',
  headerTitle: 'Anto Subash',
  description: 'Learn about web development, programming, and more.',
  language: 'en-us',
  theme: 'system', // system, dark or light
  siteUrl: 'https://blog.antosubash.com',
  siteRepo: 'https://github.com/antosubash/blog',
  siteLogo: '/static/images/logo.png',
  socialBanner: '/static/images/twitter-card.png',
  mastodon: 'https://mastodon.social/@antosubash',
  email: 'antosubash@live.com',
  github: 'https://github.com/antosubash',
  twitter: 'https://twitter.com/antosubash',
  facebook: 'https://facebook.com/antosubash',
  youtube: 'https://youtube.com/antosubash',
  linkedin: 'https://www.linkedin.com/in/antosubash',
  threads: 'https://www.threads.net/antosubash',
  instagram: 'https://www.instagram.com/antosubash',
  locale: 'en-US',
  analytics: {
    // If you want to use an analytics provider you have to add it to the
    // content security policy in the `next.config.js` file.
    // supports Plausible, Simple Analytics, Umami, Posthog or Google Analytics.
    umamiAnalytics: {
      // We use an env variable for this site to avoid other users cloning our analytics ID
      umamiWebsiteId: process.env.NEXT_UMAMI_ID, // e.g. 123e4567-e89b-12d3-a456-426614174000
      // You may also need to overwrite the script if you're storing data in the US - ex:
      // src: 'https://us.umami.is/script.js'
      // Remember to add 'us.umami.is' in `next.config.js` as a permitted domain for the CSP
    },
    // plausibleAnalytics: {
    //   plausibleDataDomain: '', // e.g. blog.antosubash.com
    // },
    // simpleAnalytics: {},
    // posthogAnalytics: {
    //   posthogProjectApiKey: '', // e.g. 123e4567-e89b-12d3-a456-426614174000
    // },
    googleAnalytics: {
      googleAnalyticsId: process.env.NEXT_GOOGLE_ANALYTICS_ID, // e.g. G-XXXXXXX
    },
  },
  comments: {
    provider: 'utterances', // supported providers: giscus, utterances, disqus
    utterancesConfig: {
      repo: 'antosubash/blog-comments',
      issueTerm: 'pathname', // supported options: pathname, url, title
      label: 'Comment 💬', // label (optional): Comment 💬
      theme: 'github-light',
      darkTheme: 'github-dark',
    }
  },
  search: {
    provider: 'kbar', // kbar or algolia
    kbarConfig: {
      searchDocumentsPath: 'search.json', // path to load documents to search
    },
  },
}

module.exports = siteMetadata

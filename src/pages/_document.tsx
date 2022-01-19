import Document, { Html, Head, Main, NextScript } from "next/document";
const GA_TRACKING_ID = "UA-28730591-2";
export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
          <meta name="msapplication-TileColor" content="#000000" />
          <meta name="theme-color" content="#000000" />
        </Head>
        <body className="bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

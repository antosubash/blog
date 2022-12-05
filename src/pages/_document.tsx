import Document, { Html, Head, Main, NextScript } from "next/document";
const GA_TRACKING_ID = "G-9EG6TJYHZ7";
export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
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
        </Head>
        <body className="bg-gradient-to-l from-gray-100 via-gray-300 to-gray-100 text-gray-800 dark:text-gray-200  dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 ">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

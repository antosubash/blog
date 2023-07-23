import { Metadata } from "next";
import Head from "next/head";
import "../styles/index.css";
export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Next.js",
};
const GA_TRACKING_ID = "G-9EG6TJYHZ7";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <script
          async
          defer
          data-website-id="32d87e93-77c1-48cb-b029-6b296ddc7827"
          src="https://umami.antosubash.com/umami.js"
        ></script>
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
      <body>{children}</body>
    </html>
  );
}

import "../styles/index.css";
import "../node_modules/highlight.js/styles/dark.css";
import { ThemeProvider } from "next-themes";
import LayoutWrapper from "@components/layout-wrapper";
import "remixicon/fonts/remixicon.css";
import Layout from "@components/layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head />
      <body>
        <LayoutWrapper>
          <Layout>{children}</Layout>
        </LayoutWrapper>
      </body>
    </html>
  );
}
